document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const botao = document.getElementById("btnEntrar");
  const mensagem = document.getElementById("mensagem");

  botao.addEventListener("click", async () => {
    mensagem.innerText = "";

    if (!email.value.trim() || !senha.value.trim()) {
      mensagem.innerText = "Informe email e senha.";
      return;
    }

    try {
      const resultado = await window.api.autenticarUsuario({
        email: email.value.trim(),
        senha: senha.value
      });

      mensagem.innerText = resultado.mensagem;

      if (resultado.sucesso) {
        window.location.href = "dashboard.html";
      }
    } catch (error) {
      console.error("Erro ao autenticar usuario:", error);
      mensagem.innerText = "Erro interno ao realizar login.";
    }
  });
});
