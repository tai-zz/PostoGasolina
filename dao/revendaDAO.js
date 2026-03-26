const pool = require("../database/conexao");

async function salvar(r) {
  try {
    const sql = `
      INSERT INTO revenda (posto_id, data_revenda, tipo_combustivel, quantidade, valor_total)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(sql, [
      Number(r.postoId),
      r.dataRevenda,
      r.tipoCombustivel,
      Number(r.quantidade),
      Number(r.valorTotal)
    ]);

    return { sucesso: true, mensagem: "Revenda cadastrada com sucesso." };
  } catch (e) {
    console.log(e);
    return { sucesso: false, mensagem: "Erro ao cadastrar revenda." };
  }
}

async function listarPorData(data) {
  const sql = `
    SELECT r.id, r.data_revenda, r.tipo_combustivel, r.quantidade, r.valor_total, p.nome AS posto_nome
    FROM revenda r
    INNER JOIN posto p ON p.id = r.posto_id
    WHERE r.data_revenda = $1
    ORDER BY r.id DESC
  `;

  const resultado = await pool.query(sql, [data]);
  return resultado.rows;
}

module.exports = { salvar, listarPorData };
