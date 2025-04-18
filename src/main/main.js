const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { validarDatos } = require("./validation.js");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    // autoHideMenuBar: true, // Ocultar la barra de menú
    webPreferences: {
      nodeIntegration: false, // Deshabilitar nodeIntegration. Nunca habilites nodeIntegration en las ventanas de Electron. Esto expone APIs de Node.js
      contextIsolation: true, // Habilitar contextIsolation. Esto asegura que el código del frontend no pueda acceder directamente a las APIs de Node.js o Electron.
      preload: path.join(__dirname, "../preload.js"), // Usar preload.js
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/views/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

//  ***   Logica - ida y vuelta entre el back y el front  ***
// ipcMain: Estos manejadores escuchan las solicitudes del frontend y realizan las acciones correspondientes en el backend.
// Maneja la solicitud para abrir el diálogo de selección de archivos
ipcMain.handle("abrir-dialogo-archivo", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Excel Files", extensions: ["xlsx", "xls"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]; // Devuelve la ruta del archivo seleccionado
  }
  return null;
});

// Maneja la solicitud para procesar y guardar datos del formulario
ipcMain.handle("enviar-datos", async (event, data) => {
  try {
    console.log("Datos recibidos en el proceso principal:", data);
    const validacion = validarDatos(data);

    if (!validacion.valido) {
      return { success: false, message: `${validacion.errores}` };
    } else {
      // Guardar el archivo en la carpeta assets
      if (data.rutaArchivo) {
        const nombreArchivo = path.basename(data.rutaArchivo);
        const rutaDestino = path.join(
          __dirname,
          "../renderer/assets",
          nombreArchivo
        );

        fs.copyFileSync(data.rutaArchivo, rutaDestino);

        console.log("Archivo guardado en:", rutaDestino);
      }

      return { success: true, message: "Datos recibidos correctamente" };
    }
  } catch (error) {
    console.error("Error al procesar los datos:", error);
    return { success: false, message: "Error al procesar los datos" };
  }
});

// Maneja la solicitud para cambiar la vista de la aplicación (navegacion).
ipcMain.on("navegar", (event, ruta) => {
  console.info(`Navegacion a ${ruta}.html`);
  if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, `../renderer/views/${ruta}.html`));
  }
});

// Iniciar la aplicación cuando esté lista
app.on("ready", createWindow); //Se ejecuta cuando la aplicación está lista para iniciar. Aquí llamas a createWindow() para crear la ventana principal.

// Cerrar la aplicación cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


// Manejar la reactivación de la aplicación (macOS)
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
