import {
  List,
  FlexboxGrid,
  Button,
  Modal,
  Form,
  Input,
  useToaster,
  Notification,
} from "rsuite";
import { useState, useEffect } from "react";
import { deleteClass, updateClass } from "../../services/class";
import { useClassStore } from "../../stores/class-store";

// Función para obtener el día de la semana a partir de una fecha
function setDay(fecha) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const date = new Date(fecha);
  return days[date.getDay()];
}

export default function ClassList() {
  const { classes, setClasses, reloadClasses } = useClassStore();
  const [showModal, setShowModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  const toaster = useToaster();

  useEffect(() => {
    reloadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (class_) => {
    // console.log("Clase seleccionada para editar:", class_);
    setCurrentClass(class_);
    setShowModal(true); // Cambiar a true para mostrar el modal
    // console.log("showModal:", showModal); // Verifica que el estado se actualiza correctamente
  };

  const handleModalClose = () => {
    // console.log("Cerrando el modal");
    setShowModal(false);
    setCurrentClass(null);
  };

  const handleUpdate = async () => {
    if (currentClass) {
      try {
        // Actualizar clase en el backend
        await updateClass(currentClass.id, {
          calendar: currentClass.fecha,
          startTime: currentClass.hora_inicio,
          endTime: currentClass.hora_fin,
          places: currentClass.cupo,
        });

        // Actualizar el estado localmente sin depender de reloadClasses
        const updatedClasses = classes.map((class_) =>
          class_.id === currentClass.id ? currentClass : class_
        );

        setClasses(updatedClasses); // Actualiza el estado de clases
        setShowModal(false);
        setCurrentClass(null);
      } catch (error) {
        console.error("Error al actualizar la clase:", error);
      }
    }
  };

  return (
    <>
      <List
        hover
        bordered
        style={{ maxHeight: "400px", overflow: "auto", width: "100%" }}
      >
        <List.Item
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#f7f7f7",
          }}
        >
          <div style={{ flex: 1 }}>Día</div>
          <div style={{ flex: 2 }}>Fecha</div>
          <div style={{ flex: 2 }}>Hora</div>
          <div style={{ flex: 1 }}>Cupo</div>
          <div style={{ flex: 2 }}>Acciones</div>
        </List.Item>

        {classes.map((class_) => (
          <List.Item
            key={class_.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <div style={{ flex: 1 }}>{setDay(class_.fecha)}</div>
            <div
              style={{ flex: 2, cursor: "pointer" }}
              title="Haga clic para copiar el ID"
              onClick={() =>
                navigator.clipboard
                  .writeText(class_.id)
                  .then(() => {
                    toaster.push(
                      <Notification
                        type="success"
                        header="ID copiado al portapapeles"
                      />,
                      { placement: "topEnd" }
                    );
                  })
                  .catch((err) => console.error("Error al copiar el ID: ", err))
              }
            >
              {class_.fecha}
            </div>
            <div style={{ flex: 2 }}>
              {class_.hora_inicio} - {class_.hora_fin}
            </div>
            <div style={{ flex: 1 }}>Cupo: {class_.cupo}</div>
            <div
              style={{
                flex: 2,
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Button
                onClick={() => handleEdit(class_)}
                appearance="primary"
                size="sm"
              >
                Editar
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const updatedClasses = await deleteClass(class_.id);
                    if (updatedClasses) setClasses(updatedClasses);
                    else
                      console.log(
                        "No se pudieron obtener las clases actualizadas."
                      );
                  } catch (error) {
                    console.error("Error al eliminar clase:", error);
                  }
                }}
                size="sm"
                style={{
                  backgroundColor: "red",
                  borderColor: "red",
                  color: "white",
                }}
              >
                Eliminar
              </Button>
            </div>
          </List.Item>
        ))}
      </List>

      {/* Modal para editar clase */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            {currentClass ? "Editar Clase" : "Crear Clase"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentClass && (
            <Form fluid>
              <Form.Group>
                <Form.ControlLabel>Fecha</Form.ControlLabel>
                <Form.Control
                  name="fecha"
                  type="date"
                  value={currentClass.fecha}
                  onChange={(value) =>
                    setCurrentClass({ ...currentClass, fecha: value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Hora de inicio</Form.ControlLabel>
                <Form.Control
                  name="hora_inicio"
                  type="time"
                  value={currentClass.hora_inicio}
                  onChange={(value) =>
                    setCurrentClass({ ...currentClass, hora_inicio: value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Hora de fin</Form.ControlLabel>
                <Form.Control
                  name="hora_fin"
                  type="time"
                  value={currentClass.hora_fin}
                  onChange={(value) =>
                    setCurrentClass({ ...currentClass, hora_fin: value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Cupo</Form.ControlLabel>
                <Form.Control
                  name="cupo"
                  value={currentClass.cupo}
                  onChange={(value) =>
                    setCurrentClass({ ...currentClass, cupo: value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModalClose} appearance="subtle">
            Cancelar
          </Button>
          <Button onClick={handleUpdate} appearance="primary">
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
