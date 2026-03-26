const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  database: process.env.DB_NAME || "postogasolina",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number(process.env.DB_PORT || 5432)
});

pool.query("SELECT NOW()")
  .then((res) => {
    console.log("Conexao com o banco bem-sucedida:", res.rows[0]);
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco:", err.message);
  });

module.exports = pool;
