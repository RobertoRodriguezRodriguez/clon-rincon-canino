import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import Navbar from "../components/navbar";
import NavbarAdmin from "../components/navbar-admin";
import Footer from "../components/footer";

import { getClasses } from "../services/class";
import { getStay } from "../services/stay";
import { getPetById } from "../services/pet";
import { getClient } from "../services/client";

import { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";

moment.locale("es", {
  week: {
    dow: 1,
    doy: 1,
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

function formatDate(date, hora) {
  const dateParts = date.split("-");
  const timeParts = hora.split(":");
  return new Date(
    dateParts[0],
    dateParts[1] - 1,
    dateParts[2],
    timeParts[0],
    timeParts[1]
  );
}

function formatStayDate(date) {
  const dateParts = date.split("-");
  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
}

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
        let nombreMascota = { nombre: "Desconocido" };
        if (stayItem.id_mascota) {
          nombreMascota = (await getPetById(stayItem.id_mascota)) || nombreMascota;
        }
        return {
          title: `Estancia (${nombreMascota.nombre || "Desconocido"})`,
          start: formatStayDate(stayItem.fecha_inicio),
          end: formatStayDate(stayItem.fecha_fin),
        };
      })
    );
    setStay(formated);
  }
  return { stay };
}

function useClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    getClasses().then(({ clasesGrupales, clasesIndividuales }) => {
      const formattedClasses = [
        ...clasesIndividuales.map((classItem) => ({
          title: `Individual: ${classItem.nombre || "S/N"}`,
          start: formatDate(classItem.fecha, classItem.hora_inicio),
          end: formatDate(classItem.fecha, classItem.hora_fin),
        })),
        ...Object.values(clasesGrupales).map((classItem) => ({
          title: `Grupal: ${classItem.clientes.length} mascotas`,
          start: formatDate(classItem.fecha, classItem.hora_inicio),
          end: formatDate(classItem.fecha, classItem.hora_fin),
        })),
      ];
      setClasses(formattedClasses);
    });
  }, []);

  return { classes };
}

export default function CalendarPage() {
  const { stay } = useStay();
  const { classes } = useClasses();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getClient().then((u) => setUser(u));
  }, []);

  return (
    <CustomProvider theme="dark">
      <div className="min-h-screen bg-[#101010] text-zinc-400 font-sans selection:bg-brand-cyan/30 selection:text-white overflow-x-hidden">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-cyan/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-violet/5 blur-[120px] rounded-full animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {user && user.id === "1" ? <NavbarAdmin /> : <Navbar />}

        <main className="relative z-10 m-auto max-w-screen-xl w-full px-6 py-28 space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-violet">Logística Operativa</h2>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
              Agenda <span className="text-zinc-600">Rinconera</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-violet to-brand-cyan mx-auto rounded-full" />
          </div>

          <div className="bg-[#161616] border border-white/5 rounded-[2.5rem] p-4 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <style>
              {`
                .rbc-calendar { color: #d4d4d8 !important; }
                .rbc-header { padding: 15px !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; }
                .rbc-month-view { border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 1.5rem !important; overflow: hidden !important; background: transparent !important; }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.05) !important; }
                .rbc-month-row + .rbc-month-row { border-top: 1px solid rgba(255,255,255,0.05) !important; }
                .rbc-off-range-bg { background: rgba(255,255,255,0.02) !important; }
                .rbc-today { background: rgba(139, 92, 246, 0.05) !important; }
                .rbc-toolbar button { color: #a1a1aa !important; background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 0.75rem !important; font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; padding: 8px 16px !important; margin: 0 4px !important; transition: all 0.3s !important; }
                .rbc-toolbar button:hover { background: rgba(255,255,255,0.1) !important; color: white !important; }
                .rbc-toolbar button.rbc-active { background: #8b5cf6 !important; color: white !important; border-color: #8b5cf6 !important; }
                .rbc-event { border: none !important; padding: 4px 8px !important; }
                .rbc-show-more { color: #8b5cf6 !important; font-weight: 900 !important; font-size: 10px !important; }
              `}
            </style>

            <Calendar
              localizer={localizer}
              events={[...classes, ...stay]}
              startAccessor="start"
              endAccessor="end"
              messages={messages}
              className="h-[70vh] md:h-[80vh]"
              eventPropGetter={(event) => {
                let backgroundColor = "#3f3f46";
                if (event.title.includes("Individual")) backgroundColor = "#06b6d4";
                if (event.title.includes("Grupal")) backgroundColor = "#8b5cf6";
                if (event.title.includes("Estancia")) backgroundColor = "#ec4899";

                return {
                  style: {
                    backgroundColor,
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }
                };
              }}
            />
          </div>

          <Footer />
        </main>
      </div>
    </CustomProvider>
  );
}
