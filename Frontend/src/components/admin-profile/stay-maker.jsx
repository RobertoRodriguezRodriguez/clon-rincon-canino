import React, { useState } from "react";
import { Input, Notification, useToaster } from "rsuite";
import { createStay } from "../../services/stay.js";

export default function StayMaker() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cupo, setCupo] = useState("");
  const toaster = useToaster();

  const handleCreateStay = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !cupo) {
      toaster.push(
        <Notification type="error" header="Campos Incompletos" closable>
          Por favor, define el rango de fechas y la capacidad.
        </Notification>,
        { placement: "topEnd", duration: 3000 }
      );
      return;
    }

    try {
      await createStay(startDate, endDate, cupo);
      toaster.push(
        <Notification type="success" header="Periodo Configurado" closable>
          La estancia ha sido publicada en el sistema.
        </Notification>,
        { placement: "topEnd", duration: 3000 }
      );
      setStartDate("");
      setEndDate("");
      setCupo("");
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error de Sincronización" closable>
          No se pudo crear el periodo de estancia.
        </Notification>,
        { placement: "topEnd", duration: 3000 }
      );
    }
  };

  return (
    <div className="bg-[#161616] border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/5 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-1">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-violet">Creador de Estancias</h4>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Define nuevos periodos de alojamiento</p>
      </div>

      <form onSubmit={handleCreateStay} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Check-In</label>
          <Input
            type="date"
            value={startDate}
            onChange={setStartDate}
            className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-violet transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Check-Out</label>
          <Input
            type="date"
            value={endDate}
            onChange={setEndDate}
            className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-violet transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Capacidad</label>
          <Input
            type="number"
            placeholder="Ej: 15"
            value={cupo}
            onChange={setCupo}
            className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-violet transition-all"
          />
        </div>

        <div className="md:col-span-3 pt-4">
          <button
            type="submit"
            className="relative w-full py-4 group/btn overflow-hidden rounded-2xl transition-all duration-500 shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-violet to-brand-cyan opacity-90 group-hover/btn:scale-105 transition-transform duration-500" />
            <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-white">Publicar Disponibilidad</span>
          </button>
        </div>
      </form>
    </div>
  );
}
