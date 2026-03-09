import { Notification, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";

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

      // Re-cargar estancias para actualizar el cupo en la UI
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


      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} className="px-4 pt-8 space-y-3 display-table-cell">
        <h2 className="text-xl sm:font-extrabold font-semibold text-black">
          Mis estancias
        </h2>
        <table>
          <thead style={{ color: "#a09999", fontWeight: "normal !important" }}>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Fecha inicio</th>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Fecha fin</th>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Cupo</th>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Estado</th>
          </thead>
          <tbody style={{ borderTop: "0.1px solid #D3D3D3" }}>
            {userStays.map((stay, idx) => {
              return (
                <tr key={idx}>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{formatDate(new Date(stay.fecha_inicio))}</td>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{formatDate(new Date(stay.fecha_fin))}</td>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{stay.cupo}</td>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{!stay.lista_espera ? "Aceptada" : "Pendiente"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} className="px-4 pt-8 space-y-3 display-table-cell">
        <h2 className="text-xl sm:font-extrabold font-semibold text-black">
          Mis clases
        </h2>
        <table>
          <thead style={{ color: "#a09999", fontWeight: "normal !important" }}>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Fecha</th>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Hora inicio</th>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Hora fin</th>
            <th style={{ backgroundColor: "white", padding: "20px" }}>Cupo</th>
          </thead>
          <tbody style={{ borderTop: "0.1px solid #D3D3D3" }}>
            {userClasses.map((clase, idx) => {
              return (
                <tr key={idx}>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{formatDate(new Date(clase.fecha))}</td>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{clase.hora_inicio}</td>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{clase.hora_fin}</td>
                  <td style={{ backgroundColor: "white", padding: "20px" }}>{clase.cupo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


    </div>
  );
}
