import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import emailjs from '@emailjs/browser'
import { renderRota } from '../test/renderApp.jsx'
import Footer from './footer.jsx'
import Sidebar from './sidebar.jsx'
import Header from './header.jsx'
import ProfileSection from './ProfileSection.jsx'
import LadoA from '../pages/lado-a.jsx'

vi.mock('@emailjs/browser', () => ({ default: { sendForm: vi.fn() } }))

describe('Footer', () => {
  it('alterna o idioma', async () => {
    renderRota(<Footer />)
    const botao = screen.getByRole('button', { name: 'English' })
    await userEvent.click(botao)
    expect(botao).toHaveTextContent('Português')
    await userEvent.click(botao)
    expect(botao).toHaveTextContent('English')
  })

  it('links sociais abrem em nova aba com rel seguro', () => {
    renderRota(<Footer />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
    for (const a of links) {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a.getAttribute('rel')).toContain('noopener')
    }
  })
})

describe('Sidebar', () => {
  it('classes open/show refletem isOpen', () => {
    const { container, rerender } = renderRota(<Sidebar isOpen={false} onClose={() => {}} />)
    expect(container.querySelector('.sidebar')).not.toHaveClass('open')
    rerender(<Sidebar isOpen onClose={() => {}} />)
    expect(container.querySelector('.sidebar')).toHaveClass('open')
    expect(container.querySelector('.overlay')).toHaveClass('show')
  })

  it('itens fecham a sidebar', async () => {
    const onClose = vi.fn()
    renderRota(<Sidebar isOpen onClose={onClose} />)
    await userEvent.click(screen.getByText('Voltar'))
    await userEvent.click(screen.getByText('Ajuda'))
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})

describe('Lado A', () => {
  it('botão de menu abre e o overlay fecha a sidebar', async () => {
    const { container } = renderRota(<LadoA />)
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    expect(container.querySelector('.sidebar')).toHaveClass('open')
    await userEvent.click(container.querySelector('.overlay'))
    expect(container.querySelector('.sidebar')).not.toHaveClass('open')
  })
})

describe('Lado A – fundo', () => {
  it('usa a classe de fundo escuro, igual à página de Notícias', () => {
    const { container } = renderRota(<LadoA />)
    expect(container.firstChild).toHaveClass('lado-a-page')
  })
})

describe('Header (Lado A)', () => {
  it('tem os quatro links do menu apontando para rotas existentes', () => {
    renderRota(<Header />)
    const hrefs = Object.fromEntries(
      screen.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])
    )
    expect(hrefs).toMatchObject({
      Notícias: '/conteudos',
      Dashboard: '/lado-b/dashboard',
      Conteúdos: '/sobreConteudos',
      Contato: '/contato',
      'Lado B': '/lado-b',
    })
  })
})

describe('Formulário de contato (EmailJS)', () => {
  const preencher = async () => {
    await userEvent.type(screen.getByPlaceholderText('Seu nome'), 'Maria')
    await userEvent.type(screen.getByPlaceholderText('Seu email'), 'maria@x.com')
    await userEvent.type(screen.getByPlaceholderText('Sua mensagem'), 'Olá!')
  }

  it('envia o formulário e limpa os campos em caso de sucesso', async () => {
    emailjs.sendForm.mockResolvedValue({ status: 200 })
    renderRota(<ProfileSection />)
    await preencher()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    await vi.waitFor(() => expect(window.alert).toHaveBeenCalledWith('Mensagem enviada com sucesso!'))
    expect(emailjs.sendForm).toHaveBeenCalledOnce()
    expect(document.querySelector('form input').value).toBe('')
  })

  it('avisa quando o envio falha', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    emailjs.sendForm.mockRejectedValue(new Error('falhou'))
    renderRota(<ProfileSection />)
    await preencher()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    await vi.waitFor(() => expect(window.alert).toHaveBeenCalledWith('Erro ao enviar a mensagem.'))
  })
})
