import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Notification,
  useToaster,
  SelectPicker,
} from "rsuite";
import { useClassStore } from "../../stores/class-store";
import { editReservation } from "../../services/class_client";
import { getClientsInfo } from "../../services/client";

const { Column, HeaderCell, Cell } = Table;

export default function Reservations() {
  const {
    groupReservations,
    individualReservations,
    loadGroupReservations,
    loadIndividualReservations,
    classes,
    reloadClasses,
  } = useClassStore();

  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [clients, setClients] = useState([]);

  // Filtra solo los clientes activos y luego, si lo deseas, puedes ordenarlos
  const filteredClients = clients.filter((client) => client.activo);

  // console.log("clientes filtrados", filteredClients);

  const [newReservation, setNewReservation] = useState({
    id_clase: "",
    id_cliente: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  });

  const toaster = useToaster();

  useEffect(() => {
    loadGroupReservations();
    loadIndividualReservations();
    reloadClients();
    reloadClasses();
  }, [loadGroupReservations, loadIndividualReservations]);

  const reloadClients = async () => {
    try {
      const clients = await getClientsInfo();
      setClients(clients);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };

  const handleCreate = () => {
    setEditingReservation(null);
    setNewReservation({
      id_clase: "",
      id_cliente: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
    });
    setShowModal(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setNewReservation({ ...reservation });
    setShowModal(true);
  };

  const handleDelete = async (reservation) => {
    console.log("Reserva seleccionada para borrar:", reservation);

    try {
      const response = await fetch("/api/class_client", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_clase: reservation.id_clase,
          id_cliente: reservation.id_cliente,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud DELETE");
      }

      toaster.push(
        <Notification
          type="success"
          header="Reserva eliminada correctamente"
        />,
        { placement: "topEnd" }
      );
      loadGroupReservations();
      loadIndividualReservations();
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      toaster.push(
        <Notification type="error" header="Error al eliminar la reserva" />,
        { placement: "topEnd" }
      );
    }
  };

  const handleSave = async () => {
    if (
      !newReservation.id_clase ||
      !newReservation.id_cliente ||
      !newReservation.fecha ||
      !newReservation.hora_inicio ||
      !newReservation.hora_fin
    ) {
      toaster.push(
        <Notification type="error" header="Faltan datos en la reserva" />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      if (editingReservation) {
        await editReservation(
          newReservation.id_clase,
          newReservation.id_cliente,
          newReservation.fecha,
          newReservation.hora_inicio,
          newReservation.hora_fin
        );

        toaster.push(
          <Notification
            type="success"
            header="Reserva actualizada correctamente"
          />,
          { placement: "topEnd" }
        );
      } else {
        // Nueva reserva
        const response = await fetch("/api/class_client", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReservation),
        });

        if (!response.ok) {
          throw new Error("Error en la solicitud POST");
        }

        toaster.push(
          <Notification type="success" header="Reserva creada correctamente" />,
          { placement: "topEnd" }
        );
      }

      setShowModal(false);
      loadGroupReservations();
      loadIndividualReservations();
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      toaster.push(
        <Notification type="error" header="Error al guardar la reserva" />,
        { placement: "topEnd" }
      );
    }
  };

  // console.log("reservas", groupReservations);
  // console.log("clases en group", classes);
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Reservas de Clases
      </h2>

      <Button
        appearance="primary"
        onClick={handleCreate}
        style={{ marginBottom: "1rem" }}
      >
        Crear Reserva
      </Button>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Reservas Grupales
      </h3>
      <Table data={groupReservations} height={400} hover bordered autoHeight>
        <Column width={250} align="center">
          <HeaderCell>Email del Cliente</HeaderCell>
          <Cell dataKey="email_cliente" />
        </Column>
        <Column width={150} align="center">
          <HeaderCell>Fecha</HeaderCell>
          <Cell dataKey="fecha" />
        </Column>
        <Column width={150} align="center">
          <HeaderCell>Hora de Inicio</HeaderCell>
          <Cell dataKey="hora_inicio" />
        </Column>
        <Column width={150} align="center">
          <HeaderCell>Hora de Fin</HeaderCell>
          <Cell dataKey="hora_fin" />
        </Column>
        <Column width={260} align="center" fixed="right">
          <HeaderCell>Acciones</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex justify-center items-center gap-2 h-full">
                <Button
                  appearance="primary"
                  size="sm"
                  style={{ flex: "0 0 auto", marginRight: "10px" }}
                  onClick={() => handleEdit(rowData)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  style={{
                    flex: "0 0 auto",
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  onClick={() => handleDelete(rowData)}
                >
                  Borrar
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-6">
        Reservas Individuales
      </h3>
      <Table
        data={individualReservations}
        height={400}
        hover
        bordered
        autoHeight
      >
        <Column width={250} align="center">
          <HeaderCell>Email del Cliente</HeaderCell>
          <Cell dataKey="email_cliente" />
        </Column>
        <Column width={150} align="center">
          <HeaderCell>Fecha</HeaderCell>
          <Cell dataKey="fecha" />
        </Column>
        <Column width={150} align="center">
          <HeaderCell>Hora de Inicio</HeaderCell>
          <Cell dataKey="hora_inicio" />
        </Column>
        <Column width={150} align="center">
          <HeaderCell>Hora de Fin</HeaderCell>
          <Cell dataKey="hora_fin" />
        </Column>
        <Column width={260} align="center" fixed="right">
          <HeaderCell>Acciones</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex justify-center items-center gap-2 h-full">
                <Button
                  appearance="primary"
                  size="sm"
                  style={{ flex: "0 0 auto", marginRight: "10px" }}
                  onClick={() => handleEdit(rowData)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  style={{
                    flex: "0 0 auto",
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  onClick={() => handleDelete(rowData)}
                >
                  Borrar
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            {editingReservation ? "Editar Reserva" : "Crear Reserva"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            {/* ID Clase solo visible si no estamos editando */}
            {!editingReservation && (
              <Form.Group>
                <Form.ControlLabel>Clase</Form.ControlLabel>
                <SelectPicker
                  data={classes.map((classItem) => ({
                    label: `${classItem.fecha} ${classItem.hora_inicio}`, // Combinación de la fecha y hora para mostrar
                    value: classItem.id_clase, // ID único de la clase
                  }))}
                  value={newReservation.id_clase} // ID de la clase seleccionada
                  onChange={(value) =>
                    setNewReservation({ ...newReservation, id_clase: value })
                  } // Actualiza el estado con el ID de la clase seleccionada
                  style={{ width: "100%" }}
                />
              </Form.Group>
            )}

            {/* Cliente solo visible si no estamos editando */}
            {!editingReservation && (
              <Form.Group>
                <Form.ControlLabel>Cliente</Form.ControlLabel>
                <SelectPicker
                  data={filteredClients.map((client) => ({
                    label: client.nombre_cliente, // Cambia 'nombre' por 'nombre_cliente' si es el campo que contiene el nombre
                    value: client.id_cliente, // 'id_cliente' es el valor único
                  }))}
                  value={newReservation.id_cliente}
                  onChange={(value) =>
                    setNewReservation({ ...newReservation, id_cliente: value })
                  }
                  style={{ width: "100%" }}
                />
              </Form.Group>
            )}

            {/* Solo mostrar los campos de 'fecha', 'hora_inicio' y 'hora_fin' cuando estamos editando una reserva */}
            {editingReservation && (
              <>
                <Form.Group>
                  <Form.ControlLabel>Fecha</Form.ControlLabel>
                  <Form.Control
                    name="fecha"
                    type="date"
                    value={newReservation.fecha}
                    onChange={(value) =>
                      setNewReservation({ ...newReservation, fecha: value })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Hora Inicio</Form.ControlLabel>
                  <Form.Control
                    name="hora_inicio"
                    type="time"
                    value={newReservation.hora_inicio}
                    onChange={(value) =>
                      setNewReservation({
                        ...newReservation,
                        hora_inicio: value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Hora Fin</Form.ControlLabel>
                  <Form.Control
                    name="hora_fin"
                    type="time"
                    value={newReservation.hora_fin}
                    onChange={(value) =>
                      setNewReservation({ ...newReservation, hora_fin: value })
                    }
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave} appearance="primary">
            Guardar
          </Button>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
