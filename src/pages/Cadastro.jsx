import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [termos, setTermos] = useState(false);

  function criarConta(e) {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!termos) {
      alert("Você precisa aceitar os termos e condições.");
      return;
    }

    const usuariosSalvos =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailJaExiste = usuariosSalvos.some(
      (usuario) => usuario.email === email
    );

    if (emailJaExiste) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    const novoUsuario = {
      nome,
      email,
      senha,
    };

    usuariosSalvos.push(novoUsuario);

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuariosSalvos)
    );

    // Marca o usuário como logado
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(novoUsuario)
    );

    alert("Conta criada com sucesso!");

    // VAI DIRETAMENTE PARA O LADO A
    navigate("/lado-a", { replace: true });
  }

  return (
    <main className="cadastro-page">

      <div className="bolha bolha-1"></div>
      <div className="bolha bolha-2"></div>
      <div className="bolha bolha-3"></div>
      <div className="bolha bolha-4"></div>
      <div className="bolha bolha-5"></div>
      <div className="bolha bolha-6"></div>

      <section className="cadastro-container">
        <div className="cadastro-card">

          <h1>Criar conta</h1>

          <p className="cadastro-subtitulo">
            Entre para o Lado B
          </p>

          <div className="login-social">

            <button type="button">
              <span>G</span>
              Google
            </button>

            <button type="button">
              <span>◉</span>
              GitHub
            </button>

          </div>

          <div className="separador">
            <span>ou</span>
          </div>

          <form onSubmit={criarConta}>

            <label>Nome</label>

            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>E-mail</label>

            <input
              type="email"
              placeholder="seuemail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Senha</label>

            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <label className="termos">

              <input
                type="checkbox"
                checked={termos}
                onChange={(e) => setTermos(e.target.checked)}
              />

              <span>
                Li e concordo com os termos e condições
              </span>

            </label>

            <button
              className="btn-cadastrar"
              type="submit"
            >
              Criar conta
            </button>

          </form>

          <p className="login-link">

            Já possui uma conta?

            <button
              type="button"
              onClick={() => navigate("/entrar")}
            >
              Entrar
            </button>

          </p>

        </div>
      </section>

    </main>
  );
}

export default Cadastro;