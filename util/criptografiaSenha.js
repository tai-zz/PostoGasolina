const crypto = require("crypto");

function gerarHashSenha(senha) {
  if (!senha) {
    return "";
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(senha, salt, 100000, 64, "sha512").toString("hex");

  return `${salt}:${hash}`;
}

function validarSenha(senhaInformada, senhaSalva) {
  if (!senhaInformada || !senhaSalva) {
    return false;
  }

  if (!senhaSalva.includes(":")) {
    return senhaInformada === senhaSalva;
  }

  const [salt, hashSalvo] = senhaSalva.split(":");
  const hashAtual = crypto.pbkdf2Sync(senhaInformada, salt, 100000, 64, "sha512").toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hashAtual, "hex"), Buffer.from(hashSalvo, "hex"));
}

module.exports = {
  gerarHashSenha,
  validarSenha
};
