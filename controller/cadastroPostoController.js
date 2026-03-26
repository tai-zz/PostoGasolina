document.addEventListener("DOMContentLoaded", () => {
  const campos = {
    nome: document.getElementById("nome"),
    cnpj: document.getElementById("cnpj"),
    endereco: document.getElementById("endereco"),
    bairro: document.getElementById("bairro"),
    cidade: document.getElementById("cidade"),
    estado: document.getElementById("estado")
  };
  const botao = document.getElementById("btnCadastrarPosto");
  const mensagem = document.getElementById("mensagem");

  botao.addEventListener("click", async () => {
    const dados = {
      nome: campos.nome.value.trim(),
      cnpj: campos.cnpj.value.trim(),
      endereco: campos.endereco.value.trim(),
      bairro: campos.bairro.value.trim(),
      cidade: campos.cidade.value.trim(),
      estado: campos.estado.value.trim().toUpperCase()
    };

    if (Object.values(dados).some((valor) => !valor)) {
      mensagem.innerText = "Preencha todos os campos.";
      return;
    }

    if (dados.estado.length !== 2) {
      mensagem.innerText = "Informe a UF com 2 letras.";
      return;
    }

    try {
      const resultado = await window.api.cadastrarPosto(dados);
      mensagem.innerText = resultado.mensagem;

      if (!resultado.sucesso) {
        return;
      }

      Object.values(campos).forEach((campo) => {
        campo.value = "";
      });
    } catch (error) {
      console.error("Erro ao cadastrar posto:", error);
      mensagem.innerText = "Erro interno ao cadastrar posto.";
    }
  });
});
