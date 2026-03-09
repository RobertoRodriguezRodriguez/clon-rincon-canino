import { DatePicker, Radio, RadioGroup, Form, Notification, useToaster, CustomProvider } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";

import isBefore from "date-fns/isBefore";

import { getDates, getHours, getReservation, shouldDisableDate, formatDate } from "./utils";

import { useReservClassesStore } from "../../../stores/reservation-store";

import { getAvailableClass } from "../../../services/class";
import { createReservation } from "../../../services/class_client";

GroupClass.propTypes = {
  id_cliente: PropTypes.string.isRequired,
};

export default function GroupClass({ id_cliente }) {
  const [clasesGroup, setClasesGroup] = useState([]);
  const [groupClassDate, setGroupClassDate] = useState("");
  const [showGroupHours, setShowGroupHours] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");

  const { reloadReservClasses } = useReservClassesStore();

  useEffect(() => {
    getAvailableClass().then((clases) => {
      setClasesGroup(clases.clasesDisponiblesGrupal || []);
    });
  }, []);

  const abledDatesGroup = getDates(clasesGroup);
  console.log("Fechas disponibles para selección:", abledDatesGroup);
  const toaster = useToaster();

  const handleSave = async () => {
    if (!groupClassDate || !selectedHour) {
      toaster.push(
        <Notification type="error" header="Por favor, selecciona una fecha y una hora" />,
        { placement: "topEnd" }
      );
      return;
    }

    const reservationId = getReservation(clasesGroup, groupClassDate, selectedHour);
    console.log("Reservation ID:", reservationId);


    try {
      await createReservation(reservationId, id_cliente);

      const updatedClases = await getAvailableClass();
      setClasesGroup(updatedClases.clasesDisponiblesGrupal || []);

      reloadReservClasses(id_cliente);
      toaster.push(
        <Notification type="success" header="Reserva guardada exitosamente." />,
        { placement: "topEnd" }
      );
    } catch (error) {
      const errorMessage = error.message || "Error al guardar la reserva.";
      toaster.push(
        <Notification type="error" header={errorMessage} />,
        { placement: "topEnd" }
      );
      console.error(error);
    }

  };

  return (
    <CustomProvider theme="dark">
      <section className="relative group">
        {/* Decorative Accent Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-violet/10 to-brand-cyan/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />

        <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/5 to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Info & Hours */}
            <div className="space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-violet mb-2">
                    Paso 1: Selecciona horario
                  </h2>
                  <h3 className="text-xl font-bold text-white">
                    Entrena en <span className="text-zinc-500">comunidad</span>
                  </h3>
                </div>

                {showGroupHours ? (
                  <div className="space-y-4 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-left-4 duration-500">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                      Horarios para el {formatDate(groupClassDate)}
                    </label>
                    <div className="bg-[#1e1e1e]/50 rounded-2xl p-6 border border-white/5">
                      <RadioGroup
                        name="radioGroup"
                        inline
                        onChange={(value) => setSelectedHour(value)}
                        className="flex flex-wrap gap-4"
                      >
                        {getHours(clasesGroup, groupClassDate).map((hour) => {
                          const findClase = clasesGroup.find(
                            (c) => c.fecha === formatDate(groupClassDate) && c.hora_inicio === hour
                          );
                          return (
                            <Radio
                              key={hour}
                              value={hour}
                              className="!flex items-center space-x-2 text-sm font-bold text-zinc-300 hover:text-brand-violet transition-colors"
                            >
                              <span className="text-zinc-200">{hour}</span>
                              <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-zinc-500">
                                CUPO: {findClase?.cupo}
                              </span>
                            </Radio>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center">
                    <p className="text-zinc-600 text-sm font-medium">Selecciona un día en el calendario de la derecha</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="relative w-full py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 mt-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-cyan transition-transform duration-500 group-hover/btn:scale-105" />
                <div className="relative text-white font-black text-xs tracking-[0.25em] uppercase text-center">
                  Confirmar Clase
                </div>
              </button>
            </div>

            {/* Right Column: Calendar */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-violet ml-2 text-right">
                Paso 2: Calendario
              </label>
              <div className="bg-[#1e1e1e] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl">
                <DatePicker
                  inline
                  shouldDisableDate={(date) =>
                    shouldDisableDate(date, abledDatesGroup) || isBefore(date, new Date())
                  }
                  onChange={(date) => {
                    setGroupClassDate(date);
                    setShowGroupHours(true);
                  }}
                  className="custom-inline-picker"
                  format="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomProvider>
  );
}
