import { InputPicker, Input, Notification, useToaster } from "rsuite";
import React from "react";

import { createClass } from "../../services/class";
import { useClassStore } from "../../stores/class-store";

const data = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
].map((item) => ({
  label: item,
  value: item,
}));

export default function DateManagement() {
  const { reloadClasses } = useClassStore();
  const toaster = useToaster();
  const [calendar, setCalendar] = React.useState("");
  const [dayPicker, setDayPicker] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [places, setPlaces] = React.useState("");

  const getDayOfWeek = (dateString) => {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  const handleSave = async () => {
    try {
      await createClass(calendar, dayPicker, startTime, endTime, places);
      reloadClasses();
      toaster.push(
        <Notification type="success" header="Clase creada exitosamente." />,
        { placement: "topEnd" }
      );
      // Reset fields
      setCalendar("");
      setStartTime("");
      setEndTime("");
      setPlaces("");
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error al crear la clase." />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <div className="bg-[#161616] border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-8">
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-cyan">Creador de Clases</h4>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Establece los horarios y disponibilidad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Fecha Exacta</label>
            <Input
              type="date"
              value={calendar}
              onChange={(value) => {
                setCalendar(value);
                if (value) setDayPicker(getDayOfWeek(value));
              }}
              className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-cyan transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Día de la Semana</label>
            <InputPicker
              data={data}
              value={dayPicker}
              onChange={setDayPicker}
              placeholder="Seleccionar día"
              block
              className="custom-input-picker"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Inicio</label>
              <Input
                type="time"
                value={startTime}
                onChange={setStartTime}
                className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-cyan transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Fin</label>
              <Input
                type="time"
                value={endTime}
                onChange={setEndTime}
                className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-cyan transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Plazas Disponibles</label>
            <Input
              type="number"
              placeholder="Ej: 10"
              value={places}
              onChange={setPlaces}
              className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-4 !text-white focus:!border-brand-cyan transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleSave}
          className="relative w-full py-4 group/save overflow-hidden rounded-2xl transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet opacity-90 group-hover/save:scale-105 transition-transform duration-500" />
          <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-white">Publicar Sesión</span>
        </button>
      </div>
    </div>
  );
}
