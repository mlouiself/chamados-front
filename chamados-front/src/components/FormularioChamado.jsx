import { useEffect, useState } from "react";
import {
  listarLocais,
  listarPrioridades,
  listarTipos,
} from "../services/chamadoService";
import { textoErro } from "./Mensagem";

function opcoes(lista) {
  if (!Array.isArray(lista)) return [];

  return lista
    .map((item) => {
      if (
        typeof item === "string" ||
        typeof item === "number"
      ) {
        return {
          value: item,
          label: String(item),
        };
      }

      const value =
        item.value ??
        item.nome ??
        item.name ??
        item.tipo ??
        item.local ??
        item.prioridade ??
        item.id;

      const label =
        item.label ??
        item.nome ??
        item.name ??
        item.tipo ??
        item.local ??
        item.prioridade ??
        value;

      return {
        value,
        label: String(label ?? ""),
      };
    })
    .filter(
      (item) =>
        item.value !== undefined &&
        item.value !== null
    );
}

export default function FormularioChamado({
  inicial = {},
  aoSalvar,
  textoBotao = "Salvar chamado",
}) {
  const [form, setForm] = useState({
    titulo: inicial.titulo || "",
    descricao: inicial.descricao || "",
    tipo: inicial.tipo || "",
    local: inicial.local || "",
    prioridade: inicial.prioridade || "",
    data_abertura:
      inicial.data_abertura ||
      new Date().toISOString().slice(0, 10),
  });

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [carregandoOpcoes, setCarregandoOpcoes] =
    useState(true);
  const [erroOpcoes, setErroOpcoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [t, l, p] = await Promise.all([
          listarTipos(),
          listarLocais(),
          listarPrioridades(),
        ]);

        setTipos(opcoes(t));
        setLocais(opcoes(l));
        setPrioridades(opcoes(p));
      } catch (erro) {
        setErroOpcoes(textoErro(erro));
      } finally {
        setCarregandoOpcoes(false);
      }
    }

    carregarOpcoes();
  }, []);

  function alterar(evento) {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value,
    });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setSalvando(true);

    try {
      await aoSalvar(form);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      {erroOpcoes && (
        <p className="texto-erro">
          {erroOpcoes} Você ainda pode tentar preencher
          as opções novamente ao recarregar a página.
        </p>
      )}

      {carregandoOpcoes && (
        <p className="texto-secundario">
          Carregando opções...
        </p>
      )}

      <label>
        Título
        <input
          name="titulo"
          value={form.titulo}
          onChange={alterar}
          required
          maxLength="150"
          placeholder="Ex.: Ar-condicionado pingando"
        />
      </label>

      <label>
        Descrição
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={alterar}
          required
          rows="4"
          placeholder="Descreva o problema e onde ele acontece."
        />
      </label>

      <div className="form-linha">
        <label>
          Tipo
          <select
            name="tipo"
            value={form.tipo}
            onChange={alterar}
            required
          >
            <option value="">Selecione o tipo</option>

            {tipos.map((item, i) => (
              <option
                key={`${item.value}-${i}`}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Local
          <select
            name="local"
            value={form.local}
            onChange={alterar}
            required
          >
            <option value="">Selecione o local</option>

            {locais.map((item, i) => (
              <option
                key={`${item.value}-${i}`}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-linha">
        <label>
          Prioridade
          <select
            name="prioridade"
            value={form.prioridade}
            onChange={alterar}
            required
          >
            <option value="">
              Selecione a prioridade
            </option>

            {prioridades.map((item, i) => (
              <option
                key={`${item.value}-${i}`}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data de abertura
          <input
            type="date"
            name="data_abertura"
            value={form.data_abertura}
            onChange={alterar}
            required
          />
        </label>
      </div>

      <div className="form-acoes">
        <button
          className="botao botao-principal"
          disabled={salvando}
        >
          {salvando ? "Salvando..." : textoBotao}
        </button>
      </div>
    </form>
  );
}