export default function Mensagem({
  tipo = "info",
  children,
}) {
  return (
    <div
      className={`mensagem mensagem-${tipo}`}
      role="status"
    >
      {children}
    </div>
  );
}

export function textoErro(erro) {
  const detalhe = erro?.response?.data?.detail;

  if (Array.isArray(detalhe)) {
    return detalhe
      .map((item) => item.msg || JSON.stringify(item))
      .join(" ");
  }

  if (typeof detalhe === "string") {
    return detalhe;
  }

  if (erro?.response?.status === 401) {
    return "Chave de API inválida. Confira o arquivo .env e reinicie o Vite.";
  }

  if (erro?.response?.status === 404) {
    return "O chamado ou recurso solicitado não foi encontrado.";
  }

  return "Não foi possível concluir a solicitação. Tente novamente.";
}