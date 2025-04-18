const { contextBridge, ipcRenderer } = require("electron");

// Exponer funciones seguras al frontend
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data), // Propósito: Este método permite que el frontend envíe mensajes al backend.
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)), // Propósito: Este método permite que el frontend escuche mensajes enviados desde el backend.
  abrirDialogoArchivo: () => ipcRenderer.invoke("abrir-dialogo-archivo"), // Propósito: Este método permite que el frontend solicite al backend abrir un diálogo de selección de archivos.
  enviarDatos: (data) => ipcRenderer.invoke("enviar-datos", data), // Propósito: Este método permite que el frontend envíe datos del formulario al backend para ser procesados.
});
