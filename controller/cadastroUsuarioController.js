document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnCadastrar");
  const mensagem = document.getElementById("mensagem");
  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    senha: document.getElementById("senha"),
    tipoUsuario: document.getElementById("tipoUsuario")
  };

  async function cadastrarUsuario() {
    const nome = campos.nome.value.trim();
    const email = campos.email.value.trim();
    const senha = campos.senha.value.trim();
    const tipoUsuario = campos.tipoUsuario.value;

    mensagem.innerText = "";

    if (!nome || !email || !senha || tipoUsuario === "") {
      mensagem.innerText = "Preencha todos os campos.";
      return;
    }

    if (!window.api || typeof window.api.cadastrarUsuario !== "function") {
      mensagem.innerText = "A funcao de cadastro nao esta disponivel.";
      return;
    }

    try {
      const resultado = await window.api.cadastrarUsuario({
        nome,
        email,
        senha,
        tipo_usuario: Number(tipoUsuario)
      });

      mensagem.innerText = resultado.mensagem;

      if (!resultado.sucesso) {
        return;
      }

      Object.values(campos).forEach((campo) => {
        campo.value = "";
      });
    } catch (error) {
      console.error("[RENDERER] erro completo:", error);
      mensagem.innerText = "Erro interno ao cadastrar usuario.";
    }
  }

  botao.addEventListener("click", cadastrarUsuario);
});
