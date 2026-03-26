const pool = require("../database/conexao");
const { gerarHashSenha } = require("../util/criptografiaSenha");

async function salvar(dados) {
  const { nome, email, senha, tipo_usuario } = dados;

  const sql = `
    INSERT INTO usuario (nome, email, senha, tipo_usuario)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  try {
    const senhaHash = gerarHashSenha(senha);
    const resultado = await pool.query(sql, [nome, email, senhaHash, tipo_usuario]);

    return {
      sucesso: true,
      mensagem: "Usuario cadastrado com sucesso.",
      dados: resultado.rows[0]
    };
  } catch (error) {
    if (error.code === "23505") {
      return {
        sucesso: false,
        mensagem: "Ja existe um usuario com este email."
      };
    }

    throw error;
  }
}

async function buscarPorEmail(email) {
  const sql = `
    SELECT id, nome, email, senha, tipo_usuario
    FROM usuario
    WHERE email = $1
    LIMIT 1
  `;

  const resultado = await pool.query(sql, [email]);
  return resultado.rows[0] || null;
}

async function listarPorData(data) {
  const sql = `
    SELECT id, nome, email, tipo_usuario, criado_em
    FROM usuario
    WHERE DATE(criado_em) = $1
    ORDER BY criado_em DESC
  `;

  const resultado = await pool.query(sql, [data]);
  return resultado.rows;
}

module.exports = {
  salvar,
  buscarPorEmail,
  listarPorData
};
