const pool = require("../database/conexao");

async function salvar(c) {
  try {
    const sql = `
      INSERT INTO coleta_preco (posto_id, data_coleta, tipo_combustivel, preco)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    await pool.query(sql, [
      Number(c.postoId),
      c.dataColeta,
      c.tipoCombustivel,
      Number(c.preco)
    ]);

    return { sucesso: true, mensagem: "Coleta cadastrada com sucesso." };
  } catch (e) {
    console.log(e);
    return { sucesso: false, mensagem: "Erro ao cadastrar coleta." };
  }
}

async function listarPorData(data) {
  const sql = `
    SELECT c.id, c.data_coleta, c.tipo_combustivel, c.preco, p.nome AS posto_nome
    FROM coleta_preco c
    INNER JOIN posto p ON p.id = c.posto_id
    WHERE c.data_coleta = $1
    ORDER BY c.id DESC
  `;

  const resultado = await pool.query(sql, [data]);
  return resultado.rows;
}

module.exports = { salvar, listarPorData };
