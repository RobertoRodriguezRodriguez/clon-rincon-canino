import { InputPicker, Input } from "rsuite";
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
  const [calendar, setCalendar] = React.useState("");
  const [dayPicker, setDayPicker] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [places, setPlaces] = React.useState("");

  // Función para obtener el nombre del día de la semana a partir de una fecha
  const getDayOfWeek = (dateString) => {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };
  
  return (
    <>
      <div className="px-4 pb-2">
        <Input
          onInput={(info) => {
            const selectedDate = info.target.value;
            setCalendar(selectedDate);
            setDayPicker(getDayOfWeek(selectedDate)); // Actualiza el día automáticamente
          }}
          value={calendar}
          className="px-4 w-full py-2 rounded-lg space-y-3"
          type="date"
        />
      </div>
      <div className="px-4 w-full py-1 rounded-lg space-y-3">
        <div className="flex space-x-3">
          <InputPicker
            onChange={(info) => {
              setDayPicker(info);
              setCalendar(""); // Opcional: Vaciar el calendario si se elige manualmente el día
            }}
            value={dayPicker}
            data={data}
            style={{ width: 350 }}
            placeholder="Día"
          />
          <h4>Inicio</h4>
          <Input
            type="time"
            onChange={(time) => {
              setStartTime(time);
            }}
          />
          <h4>Fin</h4>
          <Input
            type="time"
            onChange={(time) => {
              setEndTime(time);
            }}
          />
        </div>
        <Input
          placeholder="Número de plazas"
          type="number"
          onChange={(info) => {
            setPlaces(info);
          }}
        />

        <div className="py-3 text-center">
          <button
            type="submit"
            onClick={async () => {
              await createClass(calendar, dayPicker, startTime, endTime, places);
              reloadClasses();
            }}
            className="inline-flex items-center text-zinc-600 hover:text-green-700 border border-zinc-600 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-1 text-center"
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}
