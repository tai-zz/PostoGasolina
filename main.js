const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

let win;

function criarJanela() {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  console.log("[MAIN] preload =", path.join(__dirname, "preload.js"));

  win.loadFile(path.join(__dirname, "views", "login.html"));
  win.webContents.openDevTools();
}

app.whenReady().then(criarJanela);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("relatorio:abrir-pdf", async (_event, html) => {
  const janelaPdf = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false
    }
  });

  try {
    await janelaPdf.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    const pdfBuffer = await janelaPdf.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4"
    });

    const caminhoPdf = path.join(os.tmpdir(), `relatorio-posto-${Date.now()}.pdf`);
    fs.writeFileSync(caminhoPdf, pdfBuffer);

    const erro = await shell.openPath(caminhoPdf);

    if (erro) {
      throw new Error(erro);
    }

    return {
      sucesso: true,
      caminho: caminhoPdf
    };
  } finally {
    if (!janelaPdf.isDestroyed()) {
      janelaPdf.close();
    }
  }
});
