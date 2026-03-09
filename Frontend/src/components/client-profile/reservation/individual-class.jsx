import { DatePicker, Radio, RadioGroup, Form, Notification, useToaster, CustomProvider } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";
import { getIndividualClassAvailable } from "../../../services/class"; // ✅ Cambio aquí: Ahora usamos la API correcta
import { createReservation } from "../../../services/class_client";

import isBefore from "date-fns/isBefore";

import { getDates, getHours, getReservation, shouldDisableDate, formatDate } from "./utils";

import { useReservClassesStore } from "../../../stores/reservation-store";

IndividualClass.propTypes = {
  id_cliente: PropTypes.string.isRequired,
};

export default function IndividualClass({ id_cliente }) {
  const [clasesIndividual, setClasesIndividual] = useState([]);
  const [individualClassDate, setIndividualClassDate] = useState("");
  const [showIndividualHours, setShowIndividualHours] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");

  const { reloadReservClasses } = useReservClassesStore();
  const toaster = useToaster();

  // ✅ Cambio aquí: Ahora obtenemos las clases individuales disponibles, no las reservadas
  useEffect(() => {
    getIndividualClassAvailable().then((clases) => {
      setClasesIndividual(clases || []); // ✅ Manejo seguro de datos, evita errores si `clases` es undefined
    });
  }, []);

  const abledDatesIndividual = getDates(clasesIndividual);

  const handleSave = async () => {
    if (!individualClassDate || !selectedHour) {
      toaster.push(
        <Notification type="error" header="Por favor, selecciona una fecha y una hora" />,
        { placement: "topEnd" }
      );
      return;
    }


    const reservationId = getReservation(
      clasesIndividual,
      individualClassDate,
      selectedHour
    );

    try {
      await createReservation(reservationId, id_cliente);

      // Re-cargar clases individuales disponibles
      const updatedClases = await getIndividualClassAvailable();
      setClasesIndividual(updatedClases || []);

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
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/10 to-brand-violet/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />

        <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Info & Hours */}
            <div className="space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-cyan mb-2">
                    Paso 1: Selecciona horario
                  </h2>
                  <h3 className="text-xl font-bold text-white">
                    Entrenamiento <span className="text-zinc-500">personalizado</span>
                  </h3>
                </div>

                {showIndividualHours ? (
                  <div className="space-y-4 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-left-4 duration-500">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                      Horarios para el {formatDate(individualClassDate)}
                    </label>
                    <div className="bg-[#1e1e1e]/50 rounded-2xl p-6 border border-white/5">
                      <RadioGroup
                        name="radioGroup"
                        inline
                        onChange={(value) => setSelectedHour(value)}
                        className="flex flex-wrap gap-4"
                      >
                        {getHours(clasesIndividual, individualClassDate).map((hour) => {
                          const findClase = clasesIndividual.find(
                            (c) => c.fecha === formatDate(individualClassDate) && c.hora_inicio === hour
                          );
                          return (
                            <Radio
                              key={hour}
                              value={hour}
                              className="!flex items-center space-x-2 text-sm font-bold text-zinc-300 hover:text-brand-cyan transition-colors"
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
                className="relative w-full py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 mt-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
                <div className="relative text-white font-black text-xs tracking-[0.25em] uppercase text-center">
                  Reservar Clase
                </div>
              </button>
            </div>

            {/* Right Column: Calendar */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan ml-2 text-right">
                Paso 2: Calendario
              </label>
              <div className="bg-[#1e1e1e] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl">
                <DatePicker
                  inline
                  shouldDisableDate={(date) =>
                    shouldDisableDate(date, abledDatesIndividual) || isBefore(date, new Date())
                  }
                  onChange={(date) => {
                    setIndividualClassDate(date);
                    setShowIndividualHours(true);
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
