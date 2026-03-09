import { DateRangePicker, Notification, useToaster, CustomProvider } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";
import isBefore from "date-fns/isBefore";
import isAfter from "date-fns/isAfter";
import startOfDay from "date-fns/startOfDay";

import { formatDate } from "./utils";
import { useStayPetStore } from "../../../stores/reservation-store";
import { getStayAll, getStayClient } from "../../../services/stay";
import { createStayClient as createStay } from "../../../services/stay_client";
import { getClassesByName } from "../../../services/class";

Stay.propTypes = {
  id_cliente: PropTypes.string.isRequired,
  mascota: PropTypes.shape({
    id: PropTypes.string.isRequired,
    condicion_especial: PropTypes.bool.isRequired,
  }).isRequired,
  userName: PropTypes.string.isRequired
};

export default function Stay({ id_cliente, mascota, userName }) {
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [availableStays, setAvailableStays] = useState([]);
  const [userStays, setUserStays] = useState([])
  const [userClasses, setUserClasses] = useState([])

  const { reloadStays } = useStayPetStore();
  const toaster = useToaster();

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const stays = await getStayAll();
        setAvailableStays(stays);
      } catch (error) {
        toaster.push(
          <Notification type="error" header="Error cargando estancias." />,
          { placement: "topEnd" }
        );
      }
    };

    const fetchClientStays = async () => {
      try {
        const stays = await getStayClient(userName);
        setUserStays(stays);
      } catch (error) {
        toaster.push(
          <Notification type="error" header="Error cargando estancias." />,
          { placement: "topEnd" }
        );
      }

    };

    const fetchClientClasses = async () => {
      try {
        const classes = await getClassesByName(userName);
        setUserClasses(classes);
      } catch (error) {
        toaster.push(
          <Notification type="error" header="Error cargando clases." />,
          { placement: "topEnd" }
        );
      }
    }

    fetchClientClasses();
    fetchStays();
    fetchClientStays();
  }, []);

  const handleReservation = async () => {
    if (!fecha_inicio || !fecha_fin) {
      toaster.push(
        <Notification
          type="error"
          header="Por favor, selecciona un rango de fechas."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    // Buscar la estancia (bloque admin) que contiene el rango seleccionado por el usuario
    const selectedStayBlock = availableStays.find((stay) => {
      const blockStart = new Date(stay.fecha_inicio);
      const blockEnd = new Date(stay.fecha_fin);
      const userStart = new Date(fecha_inicio);
      const userEnd = new Date(fecha_fin);

      return (
        (userStart >= blockStart || formatDate(userStart) === formatDate(blockStart)) &&
        (userEnd <= blockEnd || formatDate(userEnd) === formatDate(blockEnd))
      );
    });

    if (!selectedStayBlock) {
      toaster.push(
        <Notification
          type="error"
          header="El rango seleccionado debe estar dentro de un periodo disponible."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      await createStay(selectedStayBlock.id, id_cliente, fecha_inicio, fecha_fin, true);

      // Re-cargar estancias
      const updatedStays = await getStayAll();
      setAvailableStays(updatedStays);

      const updatedUserStays = await getStayClient(userName);
      setUserStays(updatedUserStays);

      reloadStays(mascota.id);

      toaster.push(
        <Notification
          type="success"
          header="Reserva guardada correctamente."
        />,
        { placement: "topEnd" }
      );
    } catch (error) {
      const errorMessage = error.message || "Error al guardar la reserva.";
      toaster.push(
        <Notification type="error" header={errorMessage} />,
        { placement: "topEnd" }
      );
    }
  };

  if (!mascota?.id) {
    return (
      <div className="p-8 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center">
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Regresa a la pestaña "Información" para registrar una mascota.
        </p>
      </div>
    );
  }

  return (
    <CustomProvider theme="dark">
      <div className="space-y-10">
        {/* Booking Card */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/10 to-brand-violet/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />

          <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-cyan mb-2">
                    Reserva de Estancia
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Elige el rango <span className="text-zinc-500">perfecto</span>
                  </h3>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                    Selecciona Entrada y Salida
                  </label>
                  <DateRangePicker
                    block
                    placeholder="Seleccionar Rango"
                    format="yyyy-MM-dd"
                    onChange={(value) => {
                      if (value) {
                        setFechaInicio(formatDate(value[0]));
                        setFechaFin(formatDate(value[1]));
                      } else {
                        setFechaInicio("");
                        setFechaFin("");
                      }
                    }}
                    shouldDisableDate={(date) => {
                      // Deshabilitar si es antes de hoy
                      if (isBefore(date, startOfDay(new Date()))) return true;

                      // Solo habilitar si cae dentro de algún bloque de availableStays
                      const isAvailable = availableStays.some((stay) => {
                        const start = new Date(stay.fecha_inicio);
                        const end = new Date(stay.fecha_fin);
                        return (
                          (date >= start || formatDate(date) === formatDate(start)) &&
                          (date <= end || formatDate(date) === formatDate(end))
                        );
                      });
                      return !isAvailable;
                    }}
                    className="custom-date-range-picker"
                  />
                  <p className="text-[10px] text-zinc-500 italic ml-2">
                    * Solo puedes seleccionar fechas resaltadas por el administrador.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReservation}
                  className="relative w-full py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
                  <div className="relative text-white font-black text-xs tracking-[0.25em] uppercase text-center">
                    Confirmar Estancia
                  </div>
                </button>
              </div>

              <div className="hidden lg:flex flex-col items-center justify-center p-8 border border-white/5 bg-white/[0.02] rounded-[2.5rem] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold">Flexibilidad Total</h4>
                  <p className="text-zinc-500 text-sm mt-1">Reserva solo los días que necesites dentro de los periodos habilitados.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Management Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 opacity-80 hover:opacity-100 transition-opacity">
          {/* User Stays Table */}
          <div className="bg-[#161616]/50 border border-white/5 rounded-[2.5rem] p-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-violet mr-2" />
              Mis Estancias
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Entrada</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Salida</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center">Cupo</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {userStays.map((stay, idx) => (
                    <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-xs font-bold text-zinc-300">{formatDate(new Date(stay.fecha_inicio))}</td>
                      <td className="py-4 text-xs font-bold text-zinc-300">{formatDate(new Date(stay.fecha_fin))}</td>
                      <td className="py-4 text-xs font-black text-zinc-400 text-center">#{stay.cupo}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${!stay.lista_espera ? "bg-brand-cyan/10 text-brand-cyan" : "bg-zinc-800 text-zinc-500"
                          }`}>
                          {!stay.lista_espera ? "Aceptada" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {userStays.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-zinc-700 font-bold uppercase tracking-widest text-[10px] italic">
                        Sin historial de estancias
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Classes Table */}
          <div className="bg-[#161616]/50 border border-white/5 rounded-[2.5rem] p-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mr-2" />
              Mis Clases
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Fecha</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Horario</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Cupo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {userClasses.map((clase, idx) => (
                    <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-xs font-bold text-zinc-300">{formatDate(new Date(clase.fecha))}</td>
                      <td className="py-4 text-xs font-bold text-zinc-300">
                        {clase.hora_inicio} - {clase.hora_fin}
                      </td>
                      <td className="py-4 text-xs font-black text-zinc-400 text-right">
                        #{clase.cupo}
                      </td>
                    </tr>
                  ))}
                  {userClasses.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-zinc-700 font-bold uppercase tracking-widest text-[10px] italic">
                        Sin historial de clases
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CustomProvider>
  );
}
