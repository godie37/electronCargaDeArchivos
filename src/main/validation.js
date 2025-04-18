const path = require("path");

function validarDatos(data) {
  const errores = [];

  // Validar cuota
  const cuota = parseInt(data.cuota, 10);
  if (isNaN(cuota)) {
    errores.push("La cuota debe ser un número entero.");
  } else if (cuota < 1 || cuota > 6) {
    errores.push("La cuota debe estar entre 1 y 6.");
  }

  // Validar año
  const anio = parseInt(data.anio, 10);
  if (isNaN(anio)) {
    errores.push("El año debe ser un número entero.");
  } else if (anio < 2025 || anio > 2035) {
    errores.push("El año debe estar entre 2025 y 2035.");
  }

  // Validar recurso
  const recursosValidos = ["01", "02", "30", "31"];
  if (!recursosValidos.includes(data.recurso)) {
    errores.push("Recurso no válido.");
  }

  // Validar ruta del archivo
  if (!data.rutaArchivo || typeof data.rutaArchivo !== "string") {
    errores.push("La ruta del archivo no es válida.");
  }

  // Validar que el archivo se llame "inmuebles"
  if (!data.rutaArchivo.toLowerCase().includes("inmuebles")) {
    errores.push("Error, El archivo debe llamarse inmuebles.");
  }

  // Devolver errores (si los hay) y datos sanitizados
  if (errores.length > 0) {
    return { valido: false, errores };
  } else {
    return {
      valido: true,
      datosSanitizados: {
        cuota: cuota,
        anio: anio,
        recurso: data.recurso,
        rutaArchivo: data.rutaArchivo,
      },
    };
  }
}

module.exports = {
  validarDatos,
};
