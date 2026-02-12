import { DatePicker, Radio, RadioGroup, Form, Notification, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./reservation.css";

import isBefore from "date-fns/isBefore";

import { getDates, getHours, getReservation, shouldDisableDate } from "./utils";

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
      await getAvailableClass().then((clases) => {
        setClasesGroup(clases.clasesDisponiblesGrupal || []);
      });
      reloadReservClasses(id_cliente);
      toaster.push(
        <Notification type="success" header="Reserva guardada exitosamente." />,
        { placement: "topEnd" }
      );
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error al guardar la reserva." />,
        { placement: "topEnd" }
      );
      console.error(error);
    }
    
  };

  return (
    <div className="px-4 pt-8 space-y-3">
      <h2 className="text-xl sm:font-extrabold font-semibold text-black">
        Reservar clase grupal
      </h2>
      <DatePicker
        shouldDisableDate={(date) =>
          shouldDisableDate(date, abledDatesGroup) || isBefore(date, new Date())
        }
        onChange={(date) => {
          setGroupClassDate(date);
          setShowGroupHours(true);
        }}
        className="pt-1 w-full mx-auto max-w-screen-lg"
        size="lg"
        placeholder="Selecciona una fecha"
        format="yyyy-MM-dd"
      />
      {showGroupHours && (
        <Form.Group controlId="radioGroup">
          <RadioGroup
            name="radioGroup"
            onChange={(value) => setSelectedHour(value)}
          >
            {getHours(clasesGroup, groupClassDate).map((hour) => (
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
