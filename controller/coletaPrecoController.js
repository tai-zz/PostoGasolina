document.addEventListener("DOMContentLoaded", () => {
  const postoId = document.getElementById("postoId");
  const dataColeta = document.getElementById("dataColeta");
  const tipoCombustivel = document.getElementById("tipoCombustivel");
  const preco = document.getElementById("preco");
  const mensagem = document.getElementById("mensagem");
  const botao = document.getElementById("btnSalvarColeta");

  async function carregar() {
    try {
      const resultado = await window.api.listarPostos();

      if (!resultado.sucesso) {
        mensagem.innerText = "Nao foi possivel carregar os postos.";
        return;
      }

      resultado.postos.forEach((posto) => {
        postoId.innerHTML += `<option value="${posto.id}">${posto.nome}</option>`;
      });
    } catch (error) {
      console.error("Erro ao listar postos:", error);
      mensagem.innerText = "Erro ao carregar os postos.";
    }
  }

  botao.addEventListener("click", async () => {
    if (!postoId.value || !dataColeta.value || !tipoCombustivel.value || !preco.value) {
      mensagem.innerText = "Preencha todos os campos.";
      return;
    }

    try {
      const resultado = await window.api.cadastrarColetaPreco({
        postoId: postoId.value,
        dataColeta: dataColeta.value,
        tipoCombustivel: tipoCombustivel.value,
        preco: preco.value
      });

      mensagem.innerText = resultado.mensagem;

      if (!resultado.sucesso) {
        return;
      }

      postoId.value = "";
      dataColeta.value = "";
      tipoCombustivel.value = "";
      preco.value = "";
    } catch (error) {
      console.error("Erro ao salvar coleta:", error);
      mensagem.innerText = "Erro interno ao cadastrar coleta.";
    }
  });

  carregar();
});
