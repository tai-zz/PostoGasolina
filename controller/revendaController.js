document.addEventListener("DOMContentLoaded", () => {
  const postoId = document.getElementById("postoId");
  const dataRevenda = document.getElementById("dataRevenda");
  const tipoCombustivel = document.getElementById("tipoCombustivel");
  const quantidade = document.getElementById("quantidade");
  const valorTotal = document.getElementById("valorTotal");
  const mensagem = document.getElementById("mensagem");
  const botao = document.getElementById("btnSalvarRevenda");

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
    if (!postoId.value || !dataRevenda.value || !tipoCombustivel.value || !quantidade.value || !valorTotal.value) {
      mensagem.innerText = "Preencha todos os campos.";
      return;
    }

    try {
      const resultado = await window.api.cadastrarRevenda({
        postoId: postoId.value,
        dataRevenda: dataRevenda.value,
        tipoCombustivel: tipoCombustivel.value,
        quantidade: quantidade.value,
        valorTotal: valorTotal.value
      });

      mensagem.innerText = resultado.mensagem;

      if (!resultado.sucesso) {
        return;
      }

      postoId.value = "";
      dataRevenda.value = "";
      tipoCombustivel.value = "";
      quantidade.value = "";
      valorTotal.value = "";
    } catch (error) {
      console.error("Erro ao salvar revenda:", error);
      mensagem.innerText = "Erro interno ao cadastrar revenda.";
    }
  });

  carregar();
});
