// Función para formatear la fecha en formato "YYYY-MM-DD"
export function formatDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  const formattedDate = [year, month, day].join("-");
  console.log("Fecha formateada:", formattedDate); // Depuración: verificar formato
  return formattedDate;
}

// Obtener la clase según la fecha y hora seleccionada
export function getReservation(clases, fecha, hora) {
  console.log("Clases recibidas para búsqueda:", clases); // Depuración: revisar datos
  console.log("Fecha y hora buscadas:", formatDate(fecha), hora);

  for (const clase of clases) {
    console.log(
      "Comparando clase:",
      clase.fecha,
      formatDate(fecha),
      clase.hora_inicio,
      hora
    ); // Depuración: Comparar valores

    if (clase.fecha === formatDate(fecha) && clase.hora_inicio === hora) {
      console.log("Clase encontrada:", clase.id); // Depuración: clase encontrada
      return clase.id;
    }
  }

  console.warn("No se encontró una clase para la fecha y hora proporcionadas.");
  return null; // Retorna null si no encuentra una clase
}

// Función que guarda las fechas de las clases en un array de objetos Date
export function getDates(clases) {
  let dates = [];

  clases.forEach((clase) => {
    const dateObj = new Date(clase.fecha);
    console.log("Fecha procesada:", clase.fecha, dateObj); // Depuración: verificar fechas
    if (!isNaN(dateObj)) {
      dates.push(dateObj);
    } else {
      console.error("Fecha inválida:", clase.fecha); // Depuración: manejar errores de fecha
    }
  });

  console.log("Fechas extraídas:", dates); // Depuración: lista de fechas
  return dates;
}

// Función que guarda las horas a las que se celebra la clase de un día específico
export function getHours(clases, date) {
  let hours = [];

  if (date === null) {
    console.warn("Fecha proporcionada es nula."); // Depuración: manejar fechas nulas
    return hours;
  }

  clases.forEach((clase) => {
    const claseDate = new Date(clase.fecha);

    console.log(
      "Comparando fechas para horas:",
      claseDate.toDateString(),
      date.toDateString()
    ); // Depuración: comparar fechas

    if (claseDate.toDateString() === date.toDateString()) {
      hours.push(clase.hora_inicio);
    }
  });

  console.log("Horas encontradas para la fecha:", date, hours); // Depuración: lista de horas
  return hours;
}

// Función que compara si una fecha coincide con una fecha específica
function isSpecificDate(date, specificDate) {
  const comparisonResult = date.toDateString() === specificDate.toDateString();
  console.log(
    "Comparando fechas específicas:",
    date,
    specificDate,
    comparisonResult
  ); // Depuración: verificar comparación
  return comparisonResult;
}

// Deshabilitar todas las fechas excepto las que están en el array abledDates
export function shouldDisableDate(date, abledDates) {
  console.log("Fecha actual para deshabilitar:", date); // Depuración: fecha actual
  console.log("Fechas habilitadas:", abledDates); // Depuración: fechas permitidas

  const isDisabled = !abledDates.some((abledDate) =>
    isSpecificDate(date, abledDate)
  );

  console.log("¿Fecha deshabilitada?", date, isDisabled); // Depuración: resultado
  return isDisabled;
}
