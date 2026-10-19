import "../assets/css/sidebar.css";

function Sidebar({ isOpen, onClose }) {

  // Criar conta ou entrar
  function handleLogin() {
    onClose();
    alert("Abrindo página de login...");
  }

  // Ajuda
  function handleHelp() {
    onClose();
    alert("Abrindo página de ajuda...");
  }

  // Configurações
  function handleSettings() {
    onClose();
    alert("Abrindo configurações...");
  }

  return (
    <>
      {/* Fundo escuro */}
      <div
        className={`overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* Voltar */}
        <div
          className="sidebar-item"
          onClick={onClose}
        >
          <span className="icone">←</span>
          <span>Voltar</span>
        </div>

        {/* Criar conta ou entrar */}
        <div
          className="sidebar-item"
          onClick={handleLogin}
        >
          <span className="icone">✎</span>
          <span>Criar conta ou entrar</span>
        </div>

        {/* Ajuda */}
        <div
          className="sidebar-item"
          onClick={handleHelp}
        >
          <span className="icone">?</span>
          <span>Ajuda</span>
        </div>

        {/* Configurações */}
        <div
          className="sidebar-item"
          onClick={handleSettings}
        >
          <span className="icone">⚙</span>
          <span>Configurações</span>
        </div>

      </div>
    </>
  );
}

export default Sidebar;