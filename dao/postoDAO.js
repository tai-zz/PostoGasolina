const pool = require("../database/conexao");

async function salvar(posto) {
  try {
    const sql = `
      INSERT INTO posto (nome, cnpj, endereco, bairro, cidade, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nome
    `;

    const result = await pool.query(sql, [
      posto.nome,
      posto.cnpj,
      posto.endereco,
      posto.bairro,
      posto.cidade,
      posto.estado
    ]);

    return { sucesso: true, mensagem: "Posto cadastrado com sucesso.", posto: result.rows[0] };
  } catch (e) {
    console.log(e);

    if (e.code === "23505") {
      return { sucesso: false, mensagem: "CNPJ ja existe." };
    }

    return { sucesso: false, mensagem: "Erro ao cadastrar posto." };
  }
}

async function listarTodos() {
  try {
    const result = await pool.query("SELECT id, nome FROM posto ORDER BY nome");
    return { sucesso: true, postos: result.rows };
  } catch (error) {
    console.log(error);
    return { sucesso: false, postos: [] };
  }
}

async function listarPorData(data) {
  const sql = `
    SELECT id, nome, cnpj, cidade, estado, criado_em
    FROM posto
    WHERE DATE(criado_em) = $1
    ORDER BY criado_em DESC
  `;

  const result = await pool.query(sql, [data]);
  return result.rows;
}

module.exports = { salvar, listarTodos, listarPorData };
