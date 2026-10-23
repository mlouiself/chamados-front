import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import CartaoChamado from "../components/CartaoChamado";
import Mensagem, {
  textoErro,
} from "../components/Mensagem";
import {
  listarChamados,
} from "../services/chamadoService";

export default function PaginaInicial() {
  const [chamados, setChamados] = useState([]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    tipo: "",
    local: "",
    prioridade: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarChamados(filtros);
      setChamados(dados);
    } catch (e) {
      setErro(textoErro(e));
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alterar(evento) {
    setFiltros({
      ...filtros,
      [evento.target.name]: evento.target.value,
    });
  }

  return (
    <main className="pagina">
      <section className="boas-vindas">
        <div>
          <p className="sobretitulo">
            MANUTENÇÃO DO CAMPUS
          </p>

          <h1>Central de chamados</h1>

          <p className="texto-secundario">
            Registre problemas e acompanhe o andamento
            dos atendimentos.
          </p>
        </div>

        <Link
          to="/novo"
          className="botao botao-principal"
        >
          + Abrir chamado
        </Link>
      </section>

      <section className="painel-filtros">
        <label className="campo-busca">
          Buscar chamado
          <input
            name="busca"
            value={filtros.busca}
            onChange={alterar}
            placeholder="Título ou descrição..."
          />
        </label>

        <label>
          Status
          <select
            name="status"
            value={filtros.status}
            onChange={alterar}
          >
            <option value="">Todos</option>
            <option value="aberto">Aberto</option>
            <option value="em andamento">
              Em andamento
            </option>
            <option value="resolvido">Resolvido</option>
          </select>
        </label>

        <label>
          Tipo
          <input
            name="tipo"
            value={filtros.tipo}
            onChange={alterar}
            placeholder="Todos os tipos"
          />
        </label>

        <label>
          Local
          <input
            name="local"
            value={filtros.local}
            onChange={alterar}
            placeholder="Todos os locais"
          />
        </label>

        <label>
          Prioridade
          <input
            name="prioridade"
            value={filtros.prioridade}
            onChange={alterar}
            placeholder="Todas"
          />
        </label>

        <button
          className="botao botao-secundario"
          onClick={() =>
            setFiltros({
              busca: "",
              status: "",
              tipo: "",
              local: "",
              prioridade: "",
            })
          }
        >
          Limpar
        </button>
      </section>

      <div className="lista-titulo">
        <h2>Chamados registrados</h2>

        {!carregando && (
          <span>
            {chamados.length} encontrado(s)
          </span>
        )}
      </div>

      {carregando && (
        <Mensagem>
          Carregando chamados...
        </Mensagem>
      )}

      {erro && (
        <Mensagem tipo="erro">
          {erro}
        </Mensagem>
      )}

      {!carregando &&
        !erro &&
        chamados.length === 0 && (
          <Mensagem>
            Nenhum chamado encontrado. Você pode abrir
            um novo chamado ou alterar os filtros.
          </Mensagem>
        )}

      {!carregando &&
        !erro &&
        chamados.length > 0 && (
          <div className="grade-cartoes">
            {chamados.map((chamado) => (
              <CartaoChamado
                key={chamado.id}
                chamado={chamado}
              />
            ))}
          </div>
        )}

      <div className="atualizar">
        <button
          className="botao botao-secundario"
          onClick={carregar}
        >
          Atualizar lista
        </button>
      </div>
    </main>
  );
}