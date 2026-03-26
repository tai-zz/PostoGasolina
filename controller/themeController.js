document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");

  if (!toggle) {
    return;
  }

  const temaSalvo = localStorage.getItem("theme");
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const temaInicial = temaSalvo || (prefereEscuro ? "dark" : "light");

  function aplicarTema(tema) {
    document.body.classList.toggle("dark", tema === "dark");
    toggle.innerText = tema === "dark" ? "Modo claro" : "Modo escuro";
    localStorage.setItem("theme", tema);
  }

  toggle.addEventListener("click", () => {
    const temaAtual = document.body.classList.contains("dark") ? "dark" : "light";
    aplicarTema(temaAtual === "dark" ? "light" : "dark");
  });

  aplicarTema(temaInicial);
});
