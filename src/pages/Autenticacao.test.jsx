import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '../test/renderApp.jsx'

const usuarios = () => JSON.parse(localStorage.getItem('usuarios') ?? '[]')

async function preencherCadastro({ nome = 'Maria', email = 'maria@x.com', senha = '123456', termos = true } = {}) {
  if (nome) await userEvent.type(screen.getByPlaceholderText('Seu nome'), nome)
  if (email) await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), email)
  if (senha) await userEvent.type(screen.getByPlaceholderText('Sua senha'), senha)
  if (termos) await userEvent.click(screen.getByRole('checkbox'))
}

describe('Cadastro', () => {
  it('cria conta, marca usuário logado e vai para o Lado A', async () => {
    renderApp('/cadastro')
    await preencherCadastro()
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(usuarios()).toEqual([{ nome: 'Maria', email: 'maria@x.com', senha: '123456' }])
    expect(JSON.parse(localStorage.getItem('usuarioLogado')).email).toBe('maria@x.com')
    expect(window.alert).toHaveBeenCalledWith('Conta criada com sucesso!')
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
  })

  it('exige todos os campos', async () => {
    renderApp('/cadastro')
    await preencherCadastro({ senha: '' })
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos.')
    expect(usuarios()).toEqual([])
  })

  it('exige aceitar os termos', async () => {
    renderApp('/cadastro')
    await preencherCadastro({ termos: false })
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(window.alert).toHaveBeenCalledWith('Você precisa aceitar os termos e condições.')
    expect(usuarios()).toEqual([])
  })

  it('recusa e-mail já cadastrado', async () => {
    localStorage.setItem('usuarios', JSON.stringify([{ nome: 'A', email: 'maria@x.com', senha: 'z' }]))
    renderApp('/cadastro')
    await preencherCadastro()
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(window.alert).toHaveBeenCalledWith('Este e-mail já está cadastrado.')
    expect(usuarios()).toHaveLength(1)
  })

  it('link "Entrar" leva para a página de login', async () => {
    renderApp('/cadastro')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
  })
})

describe('Entrar', () => {
  const semear = () =>
    localStorage.setItem('usuarios', JSON.stringify([{ nome: 'Maria', email: 'maria@x.com', senha: '123456' }]))

  it('login válido leva à página de informações e grava usuário logado', async () => {
    semear()
    renderApp('/entrar')
    await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), 'maria@x.com')
    await userEvent.type(screen.getByPlaceholderText('Sua senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(window.alert).toHaveBeenCalledWith('Bem-vinda, Maria!')
    expect(JSON.parse(localStorage.getItem('usuarioLogado')).nome).toBe('Maria')
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Buscar por estilo, categoria..')).not.toBeInTheDocument()
  })

  it('senha errada é rejeitada', async () => {
    semear()
    renderApp('/entrar')
    await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), 'maria@x.com')
    await userEvent.type(screen.getByPlaceholderText('Sua senha'), 'errada')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(window.alert).toHaveBeenCalledWith('E-mail ou senha incorretos.')
    expect(localStorage.getItem('usuarioLogado')).toBeNull()
  })

  it('campos vazios são rejeitados', async () => {
    renderApp('/entrar')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(window.alert).toHaveBeenCalledWith('Preencha o e-mail e a senha.')
  })

  it('alterna mostrar/ocultar senha', async () => {
    renderApp('/entrar')
    const campo = screen.getByPlaceholderText('Sua senha')
    expect(campo).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar' }))
    expect(campo).toHaveAttribute('type', 'text')
  })

  it('troca de senha altera a senha do usuário e permite novo login', async () => {
    semear()
    renderApp('/entrar')
    await userEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }))
    await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), 'maria@x.com')
    await userEvent.type(screen.getByPlaceholderText('Digite sua nova senha'), 'nova123')
    await userEvent.click(screen.getByRole('button', { name: 'Alterar senha' }))

    expect(window.alert).toHaveBeenCalledWith('Senha alterada com sucesso!')
    expect(usuarios()[0].senha).toBe('nova123')
  })

  it('troca de senha para e-mail inexistente falha', async () => {
    semear()
    renderApp('/entrar')
    await userEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }))
    await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), 'ninguem@x.com')
    await userEvent.type(screen.getByPlaceholderText('Digite sua nova senha'), 'nova123')
    await userEvent.click(screen.getByRole('button', { name: 'Alterar senha' }))
    expect(window.alert).toHaveBeenCalledWith('Não encontramos uma conta com esse e-mail.')
    expect(usuarios()[0].senha).toBe('123456')
  })

  it('"Criar conta" leva ao cadastro', async () => {
    renderApp('/entrar')
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('heading', { name: 'Criar conta' })).toBeInTheDocument()
  })
})

describe('Fluxo completo', () => {
  it('cadastro -> (reabre) entrar com a conta criada', async () => {
    const { unmount } = renderApp('/cadastro')
    await preencherCadastro()
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    unmount()
    localStorage.removeItem('usuarioLogado')

    renderApp('/entrar')
    await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), 'maria@x.com')
    await userEvent.type(screen.getByPlaceholderText('Sua senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
  })

  it('catálogo -> "Lado A" -> login -> informações', async () => {
    localStorage.setItem('usuarios', JSON.stringify([{ nome: 'Maria', email: 'maria@x.com', senha: '123456' }]))
    renderApp('/lado-b')
    await userEvent.click(screen.getByRole('link', { name: 'Lado A' }))
    await userEvent.type(screen.getByPlaceholderText('seuemail@email.com'), 'maria@x.com')
    await userEvent.type(screen.getByPlaceholderText('Sua senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
  })
})
