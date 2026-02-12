import { Notification, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";

import { formatDate } from "./utils";
import { useStayPetStore } from "../../../stores/reservation-store";
import { getStayAll } from "../../../services/stay";
import { createStayClient as createStay } from "../../../services/stay_client";

Stay.propTypes = {
  id_cliente: PropTypes.string.isRequired,
  mascota: PropTypes.shape({
    id: PropTypes.string.isRequired,
    condicion_especial: PropTypes.bool.isRequired,
  }).isRequired,
};

export default function Stay({ id_cliente, mascota }) {
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [availableStays, setAvailableStays] = useState([]);

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

    fetchStays();
  }, []);

  const handleReservation = async () => {
    if (!fecha_inicio || !fecha_fin) {
      toaster.push(
        <Notification
          type="error"
          header="Selecciona una estancia disponible."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    // Buscar la estancia correspondiente a las fechas seleccionadas
    const selectedStay = availableStays.find(
      (stay) =>
        formatDate(new Date(stay.fecha_inicio)) === fecha_inicio &&
        formatDate(new Date(stay.fecha_fin)) === fecha_fin
    );

    if (!selectedStay) {
      toaster.push(
        <Notification
          type="error"
          header="No se encontró la estancia seleccionada."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      await createStay(selectedStay.id, id_cliente, true);
      reloadStays(mascota.id);

      toaster.push(
        <Notification
          type="success"
          header="Reserva guardada correctamente."
        />,
        { placement: "topEnd" }
      );
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error al guardar la reserva." />,
        { placement: "topEnd" }
      );
    }
  };

  if (!mascota?.id) {
    return <p>Por favor, registra una mascota para continuar.</p>;
  }

  return (
    <div className="px-4 pt-8 space-y-3">
      <h2 className="text-xl sm:font-extrabold font-semibold text-black">
        Reservar estancia
      </h2>

      <select
        onChange={(e) => {
          const [start, end] = e.target.value.split(" to ");
          setFechaInicio(start);
          setFechaFin(end);
        }}
        className="pt-1 w-full mx-auto max-w-screen-lg border border-zinc-400 rounded-lg p-2 text-sm"
      >
        <option value="">Selecciona una estancia disponible</option>
        {availableStays.map((stay, idx) => {
          // Formateamos las fechas
          const startDate = new Date(stay.fecha_inicio);
          const endDate = new Date(stay.fecha_fin);

          // Formato de fecha con día de la semana y nombre del mes
          const formattedStartDate = startDate.toLocaleDateString("es-ES", {
            weekday: "long", // Día de la semana
            year: "numeric",
            month: "long", // Nombre del mes
            day: "numeric",
          });

          const formattedEndDate = endDate.toLocaleDateString("es-ES", {
            weekday: "long", // Día de la semana
            year: "numeric",
            month: "long", // Nombre del mes
            day: "numeric",
          });

          return (
            <option
              key={idx}
              value={`${formatDate(startDate)} to ${formatDate(endDate)}`}
            >
              {`${formattedStartDate} → ${formattedEndDate}`}
            </option>
          );
        })}
      </select>

      <div className="text-center">
        <button
          type="button"
          onClick={handleReservation}
          className="inline-flex items-center text-zinc-700 hover:text-green-700 border border-zinc-700 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-1 text-center"
        >
          Guardar
        </button>
      </div>

      <h3 className="pt-10 text-sm text-zinc-700">
        Debe de esperar a que el administrador del sistema acepte su reserva.
        Una vez aceptada le saldrá en la tabla de reservas.
      </h3>
    </div>
  );
}
