import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Cabecalho from "./components/Cabecalho";
import Mensagem, { textoErro } from "./components/Mensagem";
import PaginaInicial from "./pages/PaginaInicial";
import PaginaFormulario from "./pages/PaginaFormulario";
import PaginaDetalhe from "./pages/PaginaDetalhe";
import { buscarUsuario } from "./services/chamadoService";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [erroUsuario, setErroUsuario] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        setUsuario(await buscarUsuario());
      } catch (erro) {
        setErroUsuario(textoErro(erro));
      }
    }

    carregarUsuario();
  }, []);

  return (
    <>
      <Cabecalho usuario={usuario} />

      {erroUsuario && (
        <div className="aviso-topo">{erroUsuario}</div>
      )}

      <Routes>
        <Route path="/" element={<PaginaInicial />} />

        <Route
          path="/novo"
          element={<PaginaFormulario modo="novo" />}
        />

        <Route
          path="/editar/:id"
          element={<PaginaFormulario modo="editar" />}
        />

        <Route
          path="/chamado/:id"
          element={<PaginaDetalhe />}
        />

        <Route
          path="*"
          element={
            <main className="pagina">
              <Mensagem tipo="erro">
                Página não encontrada.
              </Mensagem>
            </main>
          }
        />
      </Routes>

      <footer className="rodape">
        Sistema de Chamados de Manutenção · IFRN Campus Pau dos Ferros
      </footer>
    </>
  );
}