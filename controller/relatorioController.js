document.addEventListener("DOMContentLoaded", () => {
  const dataRelatorio = document.getElementById("dataRelatorio");
  const btnGerarRelatorio = document.getElementById("btnGerarRelatorio");
  const btnImprimir = document.getElementById("btnImprimir");
  const mensagem = document.getElementById("mensagem");
  const tituloRelatorio = document.getElementById("tituloRelatorio");
  const dataGeracao = document.getElementById("dataGeracao");

  const referencias = {
    usuarios: {
      total: document.getElementById("totalUsuarios"),
      lista: document.getElementById("listaUsuarios"),
      vazio: "Nenhum usuario cadastrado nessa data."
    },
    postos: {
      total: document.getElementById("totalPostos"),
      lista: document.getElementById("listaPostos"),
      vazio: "Nenhum posto cadastrado nessa data."
    },
    coletas: {
      total: document.getElementById("totalColetas"),
      lista: document.getElementById("listaColetas"),
      vazio: "Nenhuma coleta registrada nessa data."
    },
    revendas: {
      total: document.getElementById("totalRevendas"),
      lista: document.getElementById("listaRevendas"),
      vazio: "Nenhuma revenda registrada nessa data."
    }
  };

  dataRelatorio.value = new Date().toISOString().split("T")[0];

  function formatarData(data) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(`${data}T00:00:00`));
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(Number(valor || 0));
  }

  function escaparHtml(texto) {
    return String(texto ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function criarLinhas(itens, tipo) {
    if (!itens.length) {
      return `<p class="item-vazio">${referencias[tipo].vazio}</p>`;
    }

    return itens.map((item) => {
      if (tipo === "usuarios") {
        return `
          <div class="relatorio-item">
            <strong>${item.nome}</strong>
            <span>${item.email}</span>
            <small>Tipo: ${item.tipo_usuario}</small>
          </div>
        `;
      }

      if (tipo === "postos") {
        return `
          <div class="relatorio-item">
            <strong>${item.nome}</strong>
            <span>${item.cidade || "-"} / ${item.estado || "-"}</span>
            <small>CNPJ: ${item.cnpj}</small>
          </div>
        `;
      }

      if (tipo === "coletas") {
        return `
          <div class="relatorio-item">
            <strong>${item.posto_nome}</strong>
            <span>${item.tipo_combustivel}</span>
            <small>Preco: ${formatarMoeda(item.preco)}</small>
          </div>
        `;
      }

      return `
        <div class="relatorio-item">
          <strong>${item.posto_nome}</strong>
          <span>${item.tipo_combustivel}</span>
          <small>${item.quantidade} L | ${formatarMoeda(item.valor_total)}</small>
        </div>
      `;
    }).join("");
  }

  async function gerarRelatorio() {
    mensagem.innerText = "";

    if (!dataRelatorio.value) {
      mensagem.innerText = "Escolha uma data para gerar o relatorio.";
      return;
    }

    try {
      const resultado = await window.api.gerarRelatorioData(dataRelatorio.value);

      tituloRelatorio.innerText = `Relatorio de ${formatarData(resultado.data)}`;
      dataGeracao.innerText = `Gerado em ${new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date())}`;

      Object.entries(referencias).forEach(([chave, referencia]) => {
        const itens = resultado.secoes[chave];
        referencia.total.innerText = String(itens.length);
        referencia.lista.innerHTML = criarLinhas(itens, chave);
      });

      mensagem.innerText = "Relatorio atualizado com sucesso.";
    } catch (error) {
      console.error("Erro ao gerar relatorio:", error);
      mensagem.innerText = "Erro ao gerar relatorio.";
    }
  }

  function montarHtmlPdf() {
    const titulo = escaparHtml(tituloRelatorio.innerText);
    const geradoEm = escaparHtml(dataGeracao.innerText);
    const secoesHtml = Object.values(referencias).map((referencia) => `
      <section class="pdf-card">
        <div class="pdf-lista">${referencia.lista.innerHTML}</div>
      </section>
    `).join("");

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px;
            font-family: Arial, sans-serif;
            color: #111827;
            background: #ffffff;
          }
          .pdf-wrap {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .pdf-topo {
            padding-bottom: 18px;
            border-bottom: 2px solid #e5e7eb;
          }
          .pdf-topo p {
            margin: 0 0 6px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-size: 12px;
          }
          .pdf-topo h1 {
            margin: 0 0 8px;
            font-size: 28px;
          }
          .pdf-topo span {
            color: #4b5563;
            font-size: 14px;
          }
          .pdf-grade {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .pdf-card {
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 16px;
            background: #f9fafb;
            break-inside: avoid;
          }
          .relatorio-card-topo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .relatorio-card-topo h3 {
            margin: 0;
            font-size: 18px;
          }
          .contador {
            display: inline-flex;
            min-width: 32px;
            height: 32px;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: #dbeafe;
            color: #1d4ed8;
            font-weight: 700;
          }
          .pdf-lista,
          .relatorio-lista {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .relatorio-item,
          .item-vazio {
            display: block;
            padding: 12px 14px;
            border-radius: 14px;
            border: 1px solid #e5e7eb;
            background: #ffffff;
          }
          .relatorio-item strong,
          .relatorio-item span,
          .relatorio-item small {
            display: block;
          }
          .relatorio-item span {
            margin-top: 4px;
          }
          .relatorio-item small,
          .item-vazio {
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <main class="pdf-wrap">
          <header class="pdf-topo">
            <p>Sistema Posto</p>
            <h1>${titulo}</h1>
            <span>${geradoEm}</span>
          </header>
          <section class="pdf-grade">
            ${secoesHtml}
          </section>
        </main>
      </body>
      </html>
    `;
  }

  btnGerarRelatorio.addEventListener("click", gerarRelatorio);
  btnImprimir.addEventListener("click", async () => {
    if (tituloRelatorio.innerText === "Nenhum relatorio gerado") {
      mensagem.innerText = "Gere um relatorio antes de abrir o PDF.";
      return;
    }

    try {
      mensagem.innerText = "Abrindo PDF do relatorio...";
      const html = montarHtmlPdf();
      await window.api.abrirPdfRelatorio(html);
      mensagem.innerText = "PDF aberto com sucesso.";
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
      mensagem.innerText = "Erro ao abrir o PDF do relatorio.";
    }
  });
});
