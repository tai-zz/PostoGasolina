const { contextBridge, ipcRenderer } = require("electron");

const usuarioDAO = require("./dao/usuarioDAO");
const postoDAO = require("./dao/postoDAO");
const coletaPrecoDAO = require("./dao/coletaPrecoDAO");
const revendaDAO = require("./dao/revendaDAO");
const autenticacaoService = require("./service/autenticacaoService");

contextBridge.exposeInMainWorld("api", {
  cadastrarUsuario: async (dados) => {
    try {
      console.log("[PRELOAD] dados recebidos:", dados);
      const resultado = await usuarioDAO.salvar(dados);
      console.log("[PRELOAD] usuario salvo:", resultado);
      return resultado;
    } catch (error) {
      console.error("[PRELOAD] erro ao cadastrar usuario:", error);
      throw error;
    }
  },

  cadastrarPosto: (dados) => postoDAO.salvar(dados),
  listarPostos: () => postoDAO.listarTodos(),
  cadastrarColetaPreco: (dados) => coletaPrecoDAO.salvar(dados),
  cadastrarRevenda: (dados) => revendaDAO.salvar(dados),
  autenticarUsuario: (dados) => autenticacaoService.autenticar(dados.email, dados.senha),
  abrirPdfRelatorio: (html) => ipcRenderer.invoke("relatorio:abrir-pdf", html),
  gerarRelatorioData: async (data) => {
    const [usuarios, postos, coletas, revendas] = await Promise.all([
      usuarioDAO.listarPorData(data),
      postoDAO.listarPorData(data),
      coletaPrecoDAO.listarPorData(data),
      revendaDAO.listarPorData(data)
    ]);

    return {
      sucesso: true,
      data,
      secoes: {
        usuarios,
        postos,
        coletas,
        revendas
      }
    };
  }
});
