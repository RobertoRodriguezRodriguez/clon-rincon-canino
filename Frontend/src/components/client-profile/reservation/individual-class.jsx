import { DatePicker, Radio, RadioGroup, Form, Notification, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";
import { getIndividualClassAvailable } from "../../../services/class"; // ✅ Cambio aquí: Ahora usamos la API correcta
import { createReservation } from "../../../services/class_client";

import isBefore from "date-fns/isBefore";

import { getDates, getHours, getReservation, shouldDisableDate } from "./utils";

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
    <div className="px-4 pt-8 space-y-3">
      <h2 className="text-xl sm:font-extrabold font-semibold text-black">
        Reservar clase individual
      </h2>
      <DatePicker
        shouldDisableDate={(date) =>
          shouldDisableDate(date, abledDatesIndividual) ||
          isBefore(date, new Date())
        }
        onChange={(date) => {
          setIndividualClassDate(date);
          setShowIndividualHours(true);
        }}
        className="pt-1 w-full mx-auto max-w-screen-lg"
        size="lg"
        placeholder="Selecciona una fecha"
        format="yyyy-MM-dd"
      />
      {showIndividualHours && (
        <Form.Group controlId="radioGroup">
          <RadioGroup
            name="radioGroup"
            onChange={(value) => setSelectedHour(value)}
          >
            {getHours(clasesIndividual, individualClassDate).map((hour) => (
              <Radio key={hour} value={hour}>
                {hour}
              </Radio>
            ))}
          </RadioGroup>
        </Form.Group>
      )}
      <div className="text-center">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center text-zinc-700 hover:text-green-700 border border-zinc-700 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-1 text-center"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
