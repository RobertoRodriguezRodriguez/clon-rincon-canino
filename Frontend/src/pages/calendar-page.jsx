import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import Navbar from "../components/navbar";

import { getClasses } from "../services/class";
import { getStay } from "../services/stay";
import { getPetById } from "../services/pet";

import { useEffect, useState } from "react";

// Actualizamos el uso de `moment.lang` a `moment.locale`
moment.locale("es", {
  week: {
    dow: 1, // El primer día de la semana es lunes
    doy: 1, // El primer día del año es el 1 de enero
  },
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
  monthsShort:
    "Ene._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dic.".split("_"),
  weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
  weekdaysShort: "Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),
  weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
});

const localizer = momentLocalizer(moment);

const messages = {
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  allDay: "Todo el día",
  week: "Semana",
  work_week: "Semana laboral",
  day: "Día",
  month: "Mes",
  previous: "Anterior",
  next: "Siguiente",
  yesterday: "Ayer",
  tomorrow: "Mañana",
  today: "Hoy",
  agenda: "Agenda",
  noEventsInRange: "No hay eventos en este rango",
  showMore: (total) => `+${total} más`,
};

// Función para formatear la fecha y hora en formato Date
function formatDate(date, hora) {
  const dateParts = date.split("-");
  const timeParts = hora.split(":");

  return new Date(
    dateParts[0],
    dateParts[1] - 1, // Los meses comienzan desde 0
    dateParts[2],
    timeParts[0],
    timeParts[1]
  );
}

// Función para formatear la fecha de estancias
function formatStayDate(date) {
  const dateParts = date.split("-");
  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
}

// Hook para gestionar estancias
function useStay() {
  const [stay, setStay] = useState([]);

  useEffect(() => {
    getStay().then((stay) => {
      formatStay(stay);
    });
  }, []);

  async function formatStay(stay) {
    const formated = await Promise.all(
      stay.map(async (stayItem) => {
        const nombreMascota = await getPetById(stayItem.id_mascota);
        return {
          title: `Estancia (${nombreMascota.nombre})`,
          start: formatStayDate(stayItem.fecha_inicio),
          end: formatStayDate(stayItem.fecha_fin),
        };
      })
    );
    setStay(formated);
  }
  return { stay };
}

// Hook para gestionar clases
function useClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    getClasses().then(({ clasesGrupales, clasesIndividuales }) => {
      const formattedClasses = [
        ...clasesIndividuales.map((classItem) => ({
          title: `Clase individual (${classItem.nombre})`,
          start: formatDate(classItem.fecha, classItem.hora_inicio),
          end: formatDate(classItem.fecha, classItem.hora_fin),
        })),
        ...Object.values(clasesGrupales).map((classItem) => ({
          title: `Clase grupal (${classItem.clientes.join(", ")})`,
          start: formatDate(classItem.fecha, classItem.hora_inicio),
          end: formatDate(classItem.fecha, classItem.hora_fin),
        })),
      ];

      setClasses(formattedClasses);
    });
  }, []);

  return { classes };
}

// Componente principal
export default function CalendarPage() {
  const { stay } = useStay();
  const { classes } = useClasses();

  return (
    <div>
      <Navbar />
      <Calendar
        className="max-w-screen-xl mx-auto pt-24 sm:px-0 px-1 pb-1"
        localizer={localizer}
        events={[...classes, ...stay]}
        startAccessor="start"
        messages={messages}
        endAccessor="end"
        eventPropGetter={(event) => {
          const newStyle = {
            backgroundColor: "#2f3e55",
            color: "white",
            borderRadius: "5px",
            border: "none",
          };

          if (event.title.includes("individual")) {
            newStyle.backgroundColor = "#00958d";
          }

          if (event.title.includes("grupal")) {
            newStyle.backgroundColor = "#527194";
          }

          return {
            className: "",
            style: newStyle,
          };
        }}
        style={{
          height: "100vh",
        }}
      />
    </div>
  );
}
