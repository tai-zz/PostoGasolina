const usuarioDAO = require("../dao/usuarioDAO");
const { validarSenha } = require("../util/criptografiaSenha");

async function autenticar(email, senha) {
  try {
    const usuario = await usuarioDAO.buscarPorEmail(email);

    if (!usuario) {
      return {
        sucesso: false,
        mensagem: "Usuario nao encontrado."
      };
    }

    const senhaValida = validarSenha(senha, usuario.senha);

    if (!senhaValida) {
      return {
        sucesso: false,
        mensagem: "Senha invalida."
      };
    }

    return {
      sucesso: true,
      mensagem: "Login realizado com sucesso.",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipo_usuario
      }
    };
  } catch (error) {
    console.error("Erro na autenticacao:", error);

    return {
      sucesso: false,
      mensagem: "Nao foi possivel conectar ao banco. Verifique host, porta e credenciais."
    };
  }
}

module.exports = {
  autenticar
};
