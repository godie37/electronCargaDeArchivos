//#region   // Generar opciones para el select de año
const anioSelect = document.getElementById("anio");
const startYear = 2025;
const endYear = 2035;

for (let year = startYear; year <= endYear; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  anioSelect.appendChild(option);
}
//#endregion

//#region   // Obtener referencia al botón   - OK
document
  .getElementById("cargarArchivoBtn").addEventListener("click", async () => {
    const rutaArchivo = await window.api.abrirDialogoArchivo();
    if (rutaArchivo) {
      document.getElementById(
        "rutaArchivoTexto"
      ).innerText = `Archivo seleccionado: ${rutaArchivo}`;
      console.log("Ruta del archivo:", rutaArchivo);
    }
  });

  //#endregion

//#region   // Manejar el envío del formulario   - OK
document
  .getElementById("formGenerarPdf")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      cuota: parseInt(document.getElementById("cuota").value),
      anio: parseInt(document.getElementById("anio").value),
      recurso: document.getElementById("recurso").value,
      rutaArchivo: document
        .getElementById("rutaArchivoTexto")
        .innerText.replace("Archivo seleccionado: ", ""),
    };

    try {
      const respuesta = await window.api.enviarDatos(data);
      console.log("Respuesta del proceso principal:", respuesta);
      alert(respuesta.message);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  });
