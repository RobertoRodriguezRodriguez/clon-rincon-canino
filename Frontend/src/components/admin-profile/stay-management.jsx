import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Notification,
  useToaster,
} from "rsuite";
import { useState, useEffect } from "react";
import { getStayAll, deleteStay, modStay } from "../../services/stay";

const { Column, HeaderCell, Cell } = Table;

export default function StayManagement() {
  const [stay, setStay] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cupo, setCupo] = useState("");

  useEffect(() => {
    reloadStay();
  }, []);

  const reloadStay = () => {
    getStayAll().then((stay) => {
      setStay(stay);
    });
  };

  const toaster = useToaster();

  const handleEdit = (stayToEdit) => {
    setSelectedStay(stayToEdit);
    setFechaInicio(stayToEdit.fecha_inicio);
    setFechaFin(stayToEdit.fecha_fin);
    setCupo(stayToEdit.cupo?.toString() ?? "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!fechaInicio || !fechaFin || cupo === "") {
      toaster.push(
        <Notification
          type="error"
          header="Por favor, completa todos los campos."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      await modStay(selectedStay.id, fechaInicio, fechaFin, parseInt(cupo));
      reloadStay();
      setShowModal(false);
    } catch (error) {
      console.error("Error al modificar la estancia:", error);
    }
  };

  const stays = stay.sort((b, a) => (a.fecha_inicio < b.fecha_inicio ? 1 : -1));

  return (
    <div className="m-auto max-w-screen-lg px-4">
      <div
        style={{
          maxHeight: "400px",
          overflow: "auto",
          width: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            backgroundColor: "#f7f7f7",
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          <div style={{ flex: 1 }}>Fecha Entrada</div>
          <div style={{ flex: 1 }}>Fecha Salida</div>
          <div style={{ flex: 1 }}>Cupo</div>
          <div style={{ flex: 2 }}>Administrar</div>
        </div>

        {stays.map((stay) => (
          <div
            key={stay.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              backgroundColor: "#fff",
              borderBottom: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <div style={{ flex: 1 }}>{stay.fecha_inicio}</div>
            <div style={{ flex: 1 }}>{stay.fecha_fin}</div>
            <div style={{ flex: 1 }}>Cupo: {stay.cupo}</div>
            <div
              style={{
                flex: 2,
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Button
                appearance="primary"
                size="sm"
                onClick={() => handleEdit(stay)}
                title="Editar"
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
                onClick={() => {
                  deleteStay(stay.id);
                  reloadStay();
                }}
                title="Eliminar"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Editar Estancia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="form-group">
              <label>Fecha de Entrada</label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={setFechaInicio}
              />
            </div>
            <div className="form-group">
              <label>Fecha de Salida</label>
              <Input type="date" value={fechaFin} onChange={setFechaFin} />
            </div>
            <div className="form-group">
              <label>Cupo</label>
              <Input
                type="number"
                value={cupo}
                onChange={(value) => setCupo(value)}
                min={1}
              />
            </div>
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
