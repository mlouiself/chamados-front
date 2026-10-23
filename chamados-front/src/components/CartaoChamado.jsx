import { Link } from "react-router-dom";

export default function CartaoChamado({ chamado }) {
  const status = (chamado.status || "aberto")
    .replaceAll("_", " ");

  return (
    <article className="cartao">
      <div className="cartao-topo">
        <span
          className={`status status-${chamado.status || "aberto"}`}
        >
          {status}
        </span>

        <span
          className={`prioridade prioridade-${String(
            chamado.prioridade || ""
          ).toLowerCase()}`}
        >
          {chamado.prioridade || "Sem prioridade"}
        </span>
      </div>

      <h3>{chamado.titulo}</h3>

      <p className="resumo">{chamado.descricao}</p>

      <div className="cartao-info">
        <span>
          📍 {chamado.local || "Local não informado"}
        </span>

        <span>
          🔧 {chamado.tipo || "Tipo não informado"}
        </span>
      </div>

      <div className="cartao-rodape">
        <small>Chamado #{chamado.id}</small>

        <Link
          className="link-detalhe"
          to={`/chamado/${chamado.id}`}
        >
          Ver detalhes →
        </Link>
      </div>
    </article>
  );
}