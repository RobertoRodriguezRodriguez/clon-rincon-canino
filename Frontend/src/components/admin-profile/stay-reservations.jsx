import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Notification,
  useToaster,
  SelectPicker,
  Checkbox,
} from "rsuite";
import { useStayClientStore } from "../../stores/stay-store";
import { getClientsInfo } from "../../services/client";
import { getStayAll } from "../../services/stay";

const { Column, HeaderCell, Cell } = Table;

export default function StayClientsReservations() {
  const {
    stayClients,
    loadStayClients,
    addStayClient,
    removeStayClient,
    updateStayClient, // Ahora está usando updateStayClient desde el store
  } = useStayClientStore();

  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [clients, setClients] = useState([]);
  const [stays, setStays] = useState([]);

  const [newReservation, setNewReservation] = useState({
    id_estancia: "",
    id_cliente: "",
    lista_espera: "",
    nueva_id_estancia: "",
    nueva_id_cliente: "",
  });

  const toaster = useToaster();

  useEffect(() => {
    loadStayClients();
    reloadClients();
    reloadStays();
  }, [loadStayClients]);

  const reloadClients = async () => {
    try {
      const clients = await getClientsInfo();
      setClients(clients);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };

  const reloadStays = async () => {
    try {
      const stayData = await getStayAll();
      setStays(stayData);
    } catch (error) {
      console.error("Error al cargar estancias:", error);
    }
  };

  const handleCreate = () => {
    setEditingReservation(null);
    setNewReservation({
      id_estancia: "", // vacíos inicialmente
      id_cliente: "",
      nueva_id_estancia: "",
      nueva_id_cliente: "",
      lista_espera: false,
    });
    setShowModal(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setNewReservation({
      id_estancia: reservation.id_estancia,
      id_cliente: reservation.id_cliente,
      nueva_id_estancia: reservation.id_estancia, // mismos valores iniciales
      nueva_id_cliente: reservation.id_cliente,
      lista_espera: reservation.lista_espera,
    });
    setShowModal(true);
  };

  const handleDelete = async (reservation) => {
    try {
      await removeStayClient(reservation.id_estancia, reservation.id_cliente);
      toaster.push(
        <Notification
          type="success"
          header="Relación eliminada correctamente"
        />,
        { placement: "topEnd" }
      );
      loadStayClients();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toaster.push(
        <Notification type="error" header="Error al eliminar la relación" />,
        { placement: "topEnd" }
      );
    }
  };

  const handleSave = async () => {
    const {
      id_estancia,
      id_cliente,
      nueva_id_estancia,
      nueva_id_cliente,
      lista_espera,
    } = newReservation;

    if (!nueva_id_estancia || !nueva_id_cliente) {
      toaster.push(<Notification type="error" header="Faltan datos" />, {
        placement: "topEnd",
      });
      return;
    }

    try {
      if (editingReservation) {
        await updateStayClient(
          id_estancia,
          id_cliente,
          nueva_id_estancia,
          nueva_id_cliente,
          lista_espera
        );
        toaster.push(
          <Notification type="success" header="Relación actualizada" />,
          { placement: "topEnd" }
        );
      } else {
        await addStayClient(
          nueva_id_estancia, // en la creación estos son los mismos
          nueva_id_cliente,
          lista_espera
        );
        toaster.push(<Notification type="success" header="Relación creada" />, {
          placement: "topEnd",
        });
      }

      setShowModal(false);
      loadStayClients();
    } catch (error) {
      console.error("Error al guardar:", error);
      toaster.push(<Notification type="error" header="Error al guardar" />, {
        placement: "topEnd",
      });
    }
  };
  const filteredClients = clients.filter((client) => client.activo);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Reservas de las Estancias</h2>

      <Button appearance="primary" onClick={handleCreate} className="mb-4">
        Crear Reserva
      </Button>

      <Table data={stayClients} height={400} hover bordered autoHeight>
        <Column width={250} align="center">
          <HeaderCell>Email del Cliente</HeaderCell>
          <Cell>
            {(rowData) => {
              const client = clients.find(
                (client) => client.id_cliente === rowData.id_cliente
              );
              return client ? client.email : "";
            }}
          </Cell>
        </Column>

        <Column width={150} align="center">
          <HeaderCell>Fecha de inicio</HeaderCell>
          <Cell>
            {(rowData) => {
              const stay = stays.find((s) => s.id === rowData.id_estancia);
              return stay ? stay.fecha_inicio : "No encontrada";
            }}
          </Cell>
        </Column>

        <Column width={150} align="center">
          <HeaderCell>Fecha final</HeaderCell>
          <Cell>
            {(rowData) => {
              const stay = stays.find((s) => s.id === rowData.id_estancia);
              return stay ? stay.fecha_fin : "No encontrada";
            }}
          </Cell>
        </Column>

        <Column width={150} align="center">
          <HeaderCell>Lista de Espera</HeaderCell>
          <Cell>{(rowData) => (rowData.lista_espera ? "Sí" : "No")}</Cell>
        </Column>

        <Column width={260} align="center" fixed="right">
          <HeaderCell>Acciones</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex justify-center gap-2">
                <Button
                  appearance="primary"
                  size="sm"
                  onClick={() => handleEdit(rowData)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  style={{
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                  }}
                  onClick={() => handleDelete(rowData)}
                >
                  Eliminar
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            {editingReservation ? "Editar Relación" : "Crear Relación"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Estancia</Form.ControlLabel>
              <SelectPicker
                data={stays.map((stay) => ({
                  label: `Estancia - ${stay.fecha_inicio} → ${stay.fecha_fin}`,
                  value: stay.id,
                }))}
                value={newReservation.nueva_id_estancia}
                onChange={(value) =>
                  setNewReservation((prev) => ({
                    ...prev,
                    nueva_id_estancia: value,
                    // Si estamos creando, sincronizamos los id originales
                    ...(editingReservation ? {} : { id_estancia: value }),
                  }))
                }
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Cliente</Form.ControlLabel>
              <SelectPicker
                data={filteredClients.map((client) => ({
                  label: client.nombre_cliente,
                  value: client.id_cliente,
                }))}
                value={newReservation.nueva_id_cliente}
                onChange={(value) =>
                  setNewReservation((prev) => ({
                    ...prev,
                    nueva_id_cliente: value,
                    ...(editingReservation ? {} : { id_cliente: value }),
                  }))
                }
                style={{ width: "100%" }}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Lista de Espera</Form.ControlLabel>
              <Checkbox
                checked={newReservation.lista_espera || false}
                onChange={(value, checked) =>
                  setNewReservation({
                    ...newReservation,
                    lista_espera: checked,
                  })
                }
              >
                ¿Está en lista de espera?
              </Checkbox>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            Cancelar
          </Button>
          <Button onClick={handleSave} appearance="primary">
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
