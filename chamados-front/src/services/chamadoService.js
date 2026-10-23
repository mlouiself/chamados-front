import api from "./api";

export async function buscarUsuario() {
  const resposta = await api.get("/eu");
  return resposta.data;
}

export async function listarChamados(filtros = {}) {
  const params = {};

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor) {
      params[chave] = valor;
    }
  });

  const resposta = await api.get("/chamados", { params });

  return Array.isArray(resposta.data)
    ? resposta.data
    : resposta.data?.items || [];
}

export async function buscarChamado(id) {
  const resposta = await api.get(`/chamados/${id}`);
  return resposta.data;
}

export async function listarTipos() {
  const resposta = await api.get("/tipos");
  return resposta.data;
}

export async function listarLocais() {
  const resposta = await api.get("/locais");
  return resposta.data;
}

export async function listarPrioridades() {
  const resposta = await api.get("/prioridades");
  return resposta.data;
}

export async function criarChamado(chamado) {
  const resposta = await api.post("/chamados", chamado);
  return resposta.data;
}

export async function editarChamado(id, chamado) {
  const resposta = await api.put(`/chamados/${id}`, chamado);
  return resposta.data;
}

export async function iniciarChamado(id, responsavel) {
  const resposta = await api.patch(
    `/chamados/${id}/iniciar`,
    { responsavel }
  );

  return resposta.data;
}

export async function resolverChamado(id, solucao) {
  const resposta = await api.patch(
    `/chamados/${id}/resolver`,
    { solucao }
  );

  return resposta.data;
}

export async function excluirChamado(id) {
  await api.delete(`/chamados/${id}`);
}