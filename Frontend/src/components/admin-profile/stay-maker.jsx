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
        <Notification type="error" header="Error" closable>
          Por favor completa todos los campos.
        </Notification>,
        { placement: "topEnd", duration: 2000 }
      );
      return;
    }

    try {
      await createStay(startDate, endDate, cupo);
      toaster.push(
        <Notification type="success" header="Éxito" closable>
          Estancia creada correctamente.
        </Notification>,
        { placement: "topEnd", duration: 2000 }
      );

      // Reiniciar formulario si deseas
      setStartDate("");
      setEndDate("");
      setCupo("");
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error" closable>
          Error al crear la estancia.
        </Notification>,
        { placement: "topEnd", duration: 2000 }
      );
    }
  };

  return (
    <form
      onSubmit={handleCreateStay}
      className="m-auto max-w-screen-lg pt-4 px-4"
    >
      <div className="w-full space-y-1">
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700"
        >
          Fecha de inicio
        </label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={setStartDate}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600 focus:outline-none text-sm"
          style={{ width: "100%" }}
        />
      </div>

      <div className="w-full space-y-1">
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700"
        >
          Fecha de fin
        </label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={setEndDate}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600 focus:outline-none text-sm"
          style={{ width: "100%" }}
        />
      </div>

      <div className="w-full space-y-1">
        <label
          htmlFor="cupo"
          className="block text-sm font-medium text-gray-700"
        >
          Cupo
        </label>
        <Input
          id="cupo"
          type="number"
          value={cupo}
          onChange={setCupo}
          placeholder="Introduce el cupo"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600 focus:outline-none text-sm"
          style={{ width: "100%" }}
        />
      </div>

      <div className="py-3 text-center">
        <button
          type="submit"
          className="inline-flex mt-4 items-center text-zinc-600 hover:text-green-700 border border-zinc-600 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-0.5 text-center"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
