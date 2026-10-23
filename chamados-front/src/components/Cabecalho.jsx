import { Link, NavLink } from "react-router-dom";

export default function Cabecalho({ usuario }) {
  const nome =
    usuario?.nome ||
    usuario?.name ||
    usuario?.aluno ||
    usuario?.usuario ||
    "usuário";

  return (
    <header className="cabecalho">
      <Link className="marca" to="/">
        <span className="marca-icone">IF</span>

        <span>
          <strong>Chamados IFRN</strong>
          <small>Manutenção do campus</small>
        </span>
      </Link>

      <nav>
        <NavLink to="/" end>
          Chamados
        </NavLink>

        <NavLink to="/novo" className="nav-novo">
          + Abrir chamado
        </NavLink>
      </nav>

      <div className="usuario">
        Olá, <strong>{nome}</strong>
      </div>
    </header>
  );
}