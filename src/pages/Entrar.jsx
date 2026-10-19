import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/cadastro.css";

function Entrar() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [trocarSenha, setTrocarSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  function fazerLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha o e-mail e a senha.");
      return;
    }

    const usuariosSalvos =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = usuariosSalvos.find(
      (usuario) =>
        usuario.email === email &&
        usuario.senha === senha
    );

    if (!usuarioEncontrado) {
      alert("E-mail ou senha incorretos.");
      return;
    }

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify(usuarioEncontrado)
    );

    alert(`Bem-vinda, ${usuarioEncontrado.nome}!`);

    // Depois de entrar, vai para a página de informações (Lado A)
    navigate("/lado-a", { replace: true });
  }

  function alterarSenha(e) {
    e.preventDefault();

    if (!email || !novaSenha) {
      alert("Informe o e-mail e a nova senha.");
      return;
    }

    if (novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const usuariosSalvos =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioIndex = usuariosSalvos.findIndex(
      (usuario) => usuario.email === email
    );

    if (usuarioIndex === -1) {
      alert("Não encontramos uma conta com esse e-mail.");
      return;
    }

    usuariosSalvos[usuarioIndex].senha = novaSenha;

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuariosSalvos)
    );

    alert("Senha alterada com sucesso!");

    setNovaSenha("");
    setTrocarSenha(false);
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

          {!trocarSenha ? (
            <>
              <h1>Entrar</h1>

              <p className="cadastro-subtitulo">
                Acesse o Lado B
              </p>

              <form onSubmit={fazerLogin}>

                <label>E-mail</label>

                <input
                  type="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label>Senha</label>

                <div className="senha-container">

                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn-mostrar-senha"
                    onClick={() =>
                      setMostrarSenha(!mostrarSenha)
                    }
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>

                </div>

                <button
                  className="btn-cadastrar"
                  type="submit"
                >
                  Entrar
                </button>

              </form>

              <button
                type="button"
                className="btn-trocar-senha"
                onClick={() => setTrocarSenha(true)}
              >
                Esqueci minha senha
              </button>

              <p className="login-link">
                Ainda não possui uma conta?

                <button
                  type="button"
                  onClick={() => navigate("/cadastro")}
                >
                  Criar conta
                </button>
              </p>
            </>

          ) : (

            <>
              <h1>Trocar senha</h1>

              <p className="cadastro-subtitulo">
                Crie uma nova senha para sua conta
              </p>

              <form onSubmit={alterarSenha}>

                <label>E-mail</label>

                <input
                  type="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label>Nova senha</label>

                <div className="senha-container">

                  <input
                    type={
                      mostrarNovaSenha
                        ? "text"
                        : "password"
                    }
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChange={(e) =>
                      setNovaSenha(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="btn-mostrar-senha"
                    onClick={() =>
                      setMostrarNovaSenha(!mostrarNovaSenha)
                    }
                  >
                    {mostrarNovaSenha
                      ? "Ocultar"
                      : "Mostrar"}
                  </button>

                </div>

                <button
                  className="btn-cadastrar"
                  type="submit"
                >
                  Alterar senha
                </button>

              </form>

              <button
                type="button"
                className="btn-trocar-senha"
                onClick={() => setTrocarSenha(false)}
              >
                Voltar para entrar
              </button>
            </>
          )}

        </div>
      </section>

    </main>
  );
}

export default Entrar;

