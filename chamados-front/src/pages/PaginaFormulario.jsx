import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import FormularioChamado from "../components/FormularioChamado";
import Mensagem, {
  textoErro,
} from "../components/Mensagem";
import {
  buscarChamado,
  criarChamado,
  editarChamado,
} from "../services/chamadoService";

export default function PaginaFormulario({ modo }) {
  const editar = modo === "editar";
  const { id } = useParams();
  const navegar = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(editar);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!editar) return;

    async function carregar() {
      try {
        const dados = await buscarChamado(id);

        if (dados.status === "resolvido") {
          setErro(
            "Chamados resolvidos não podem ser editados."
          );
          return;
        }

        setChamado(dados);
      } catch (e) {
        setErro(textoErro(e));
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [editar, id]);

  async function salvar(dados) {
    setErro("");

    try {
      if (editar) {
        await editarChamado(id, dados);
      } else {
        await criarChamado(dados);
      }

      navegar("/");
    } catch (e) {
      setErro(textoErro(e));
      throw e;
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

  return (
    <main className="pagina pagina-estreita">
      <Link
        className="voltar"
        to={editar ? `/chamado/${id}` : "/"}
      >
        ← Voltar
      </Link>

      <section className="painel-formulario">
        <p className="sobretitulo">
          {editar ? "ATUALIZAÇÃO" : "NOVO REGISTRO"}
        </p>

        <h1>
          {editar ? "Editar chamado" : "Abrir chamado"}
        </h1>

        <p className="texto-secundario">
          Preencha as informações do problema de manutenção.
        </p>

        {erro && (
          <Mensagem tipo="erro">
            {erro}
          </Mensagem>
        )}

        {(!editar || chamado) && (
          <FormularioChamado
            inicial={chamado || {}}
            aoSalvar={salvar}
            textoBotao={
              editar
                ? "Salvar alterações"
                : "Registrar chamado"
            }
          />
        )}
      </section>
    </main>
  );
}