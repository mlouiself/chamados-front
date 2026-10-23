import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import Mensagem, {
  textoErro,
} from "../components/Mensagem";
import {
  buscarChamado,
  excluirChamado,
  iniciarChamado,
  resolverChamado,
} from "../services/chamadoService";

function dataBR(data) {
  if (!data) return "Não informada";

  const partes = String(data)
    .slice(0, 10)
    .split("-");

  return partes.length === 3
    ? `${partes[2]}/${partes[1]}/${partes[0]}`
    : data;
}

export default function PaginaDetalhe() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");
  const [processando, setProcessando] = useState(false);

  async function carregar() {
    setErro("");

    try {
      const dados = await buscarChamado(id);
      setChamado(dados);
    } catch (e) {
      setErro(textoErro(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function executar(acao) {
    setErro("");
    setProcessando(true);

    try {
      if (acao === "iniciar") {
        await iniciarChamado(id, responsavel);
      }

      if (acao === "resolver") {
        await resolverChamado(id, solucao);
      }

      if (acao === "excluir") {
        const confirmado = window.confirm(
          "Tem certeza de que deseja excluir este chamado?"
        );

        if (!confirmado) return;

        await excluirChamado(id);
        navegar("/");
        return;
      }

      await carregar();
    } catch (e) {
      setErro(textoErro(e));
    } finally {
      setProcessando(false);
    }
  }

  if (carregando) {
    return (
      <main className="pagina">
        <Mensagem>
          Carregando chamado...
        </Mensagem>
      </main>
    );
  }

  if (!chamado) {
    return (
      <main className="pagina">
        <Link className="voltar" to="/">
          ← Voltar aos chamados
        </Link>

        {erro && (
          <Mensagem tipo="erro">
            {erro}
          </Mensagem>
        )}
      </main>
    );
  }

  const status = chamado.status || "aberto";

  return (
    <main className="pagina pagina-estreita">
      <Link className="voltar" to="/">
        ← Voltar aos chamados
      </Link>

      <section className="painel-detalhe">
        <div className="detalhe-cabecalho">
          <div>
            <p className="sobretitulo">
              CHAMADO #{chamado.id}
            </p>

            <h1>{chamado.titulo}</h1>
          </div>

          <span className={`status status-${status}`}>
            {status}
          </span>
        </div>

        {erro && (
          <Mensagem tipo="erro">
            {erro}
          </Mensagem>
        )}

        <p className="descricao-detalhe">
          {chamado.descricao}
        </p>

        <div className="dados-detalhe">
          <div>
            <small>Tipo</small>
            <strong>{chamado.tipo || "—"}</strong>
          </div>

          <div>
            <small>Local</small>
            <strong>{chamado.local || "—"}</strong>
          </div>

          <div>
            <small>Prioridade</small>
            <strong>{chamado.prioridade || "—"}</strong>
          </div>

          <div>
            <small>Aberto em</small>
            <strong>
              {dataBR(chamado.data_abertura)}
            </strong>
          </div>

          <div>
            <small>Responsável</small>
            <strong>
              {chamado.responsavel ||
                "Ainda não atribuído"}
            </strong>
          </div>

          <div>
            <small>Data de resolução</small>
            <strong>
              {dataBR(chamado.data_resolucao)}
            </strong>
          </div>
        </div>

        {chamado.solucao && (
          <div className="solucao">
            <small>Solução registrada</small>
            <p>{chamado.solucao}</p>
          </div>
        )}

        <div className="proxima-etapa">
          <h2>Próxima etapa</h2>

          {status === "aberto" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executar("iniciar");
              }}
            >
              <label>
                Responsável pelo atendimento
                <input
                  value={responsavel}
                  onChange={(e) =>
                    setResponsavel(e.target.value)
                  }
                  required
                  placeholder="Nome do responsável"
                />
              </label>

              <button
                className="botao botao-principal"
                disabled={processando}
              >
                {processando
                  ? "Aguarde..."
                  : "Iniciar atendimento"}
              </button>
            </form>
          )}

          {status === "em andamento" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executar("resolver");
              }}
            >
              <label>
                Descrição da solução
                <textarea
                  value={solucao}
                  onChange={(e) =>
                    setSolucao(e.target.value)
                  }
                  required
                  rows="3"
                  placeholder="Descreva como o problema foi solucionado."
                />
              </label>

              <button
                className="botao botao-principal"
                disabled={processando}
              >
                {processando
                  ? "Aguarde..."
                  : "Marcar como resolvido"}
              </button>
            </form>
          )}

          {status === "resolvido" && (
            <Mensagem>
              Este chamado foi resolvido. Não é possível editá-lo.
            </Mensagem>
          )}
        </div>

        <div className="acoes-detalhe">
          {status !== "resolvido" && (
            <Link
              className="botao botao-secundario"
              to={`/editar/${chamado.id}`}
            >
              Editar chamado
            </Link>
          )}

          <button
            className="botao botao-perigo"
            onClick={() => executar("excluir")}
            disabled={processando}
          >
            Excluir chamado
          </button>
        </div>
      </section>
    </main>
  );
}