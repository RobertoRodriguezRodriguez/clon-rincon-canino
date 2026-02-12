import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Notification,
  useToaster,
} from "rsuite";
import { useState, useEffect } from "react";
import { getPetsInfo, deletePet, updatePetInfo } from "../../services/pet";

const { Column, HeaderCell, Cell } = Table;

export default function PetsInfo() {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [castrado, setCastrado] = useState(false);
  const [vacunas, setVacunas] = useState(false);
  const [condicionEspecial, setCondicionEspecial] = useState(false);
  const [sociable, setSociable] = useState(false);

  const toaster = useToaster();

  const filteredPets = pets
    .filter((pet) =>
      pet.nombre_mascota.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.nombre_mascota < b.nombre_mascota ? -1 : 1));

  useEffect(() => {
    getPetsInfo().then((pets) => {
      // console.log(pets); // Verifica los datos de las mascotas
      setPets(pets);
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      try {
        await deletePet(id);
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
      } catch (error) {
        console.error("Error al eliminar la mascota:", error);
      }
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setNombre(pet.nombre_mascota);
    setEdad(pet.edad);
    setCastrado(pet.castrado);
    setVacunas(pet.vacunas);
    setCondicionEspecial(pet.condicion_especial);
    setSociable(pet.sociable); 
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nombre || !edad) {
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
      await updatePetInfo(
        nombre,
        parseInt(edad),
        castrado,
        vacunas,
        condicionEspecial,
        sociable,
        selectedPet.id
      );

      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.id === selectedPet.id
            ? {
                ...pet,
                nombre_mascota: nombre,
                edad: parseInt(edad),
                castrado,
                vacunas,
                condicion_especial: condicionEspecial,
                sociable,
              }
            : pet
        )
      );

      setShowModal(false); // Cerrar modal después de guardar
    } catch (error) {
      console.error("Error al actualizar la mascota:", error);
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toaster.push(
          <Notification type="success" header="ID copiado al portapapeles" />,
          { placement: "topEnd" }
        );
      })
      .catch((error) => {
        console.error("Error al copiar al portapapeles: ", error);
      });
  };

  // console.log(filteredPets[0]);

  return (
    <div className="m-auto pt-3 max-w-screen-lg px-4">
      <h2 className="my-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
        Información de las mascotas
      </h2>
      <Input
        placeholder="Buscar por nombre de la mascota ..."
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
        style={{ marginBottom: "10px" }}
      />
      <Table height={300} data={filteredPets}>
        <Column width={145} fixed>
          <HeaderCell>Nombre</HeaderCell>
          <Cell>
            {(rowData) => (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => copyToClipboard(rowData.id)}
              >
                {rowData.nombre_mascota}
              </div>
            )}
          </Cell>
        </Column>

        <Column width={110}>
          <HeaderCell>Edad</HeaderCell>
          <Cell dataKey="edad" />
        </Column>

        <Column width={120}>
          <HeaderCell>Castrado</HeaderCell>
          <Cell dataKey="castrado">
            {(rowData) => (rowData.castrado ? "Sí" : "No")}
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Vacunas</HeaderCell>
          <Cell dataKey="vacunas">
            {(rowData) => (rowData.vacunas ? "Sí" : "No")}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Condición Especial</HeaderCell>
          <Cell dataKey="condicion_especial">
            {(rowData) => (rowData.condicion_especial ? "Sí" : "No")}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Sociable</HeaderCell>
          <Cell dataKey="sociable">
            {(rowData) => (rowData.sociable ? "Sí" : "No")}
          </Cell>
        </Column>

        <Column width={87}>
          <HeaderCell>Dueño</HeaderCell>
          <Cell dataKey="nombre_cliente" />
        </Column>

        <Column width={260} align="center" fixed="right">
          <HeaderCell>Administrar</HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="flex justify-center items-center gap-2 h-full">
                {/* Botón de Editar */}
                <Button
                  appearance="primary"
                  size="sm"
                  style={{ flex: "0 0 auto", marginRight: "10px" }}
                  onClick={() => handleEdit(rowData)}
                >
                  Editar
                </Button>

                {/* Botón de Eliminar */}
                <Button
                  size="sm"
                  style={{
                    flex: "0 0 auto",
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  onClick={() => handleDelete(rowData.id)}
                >
                  Borrar
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      {/* Modal de Edición */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Editar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="form-group">
              <label>Nombre</label>
              <Input value={nombre} onChange={setNombre} />
            </div>
            <div className="form-group">
              <label>Edad</label>
              <Input value={edad} onChange={setEdad} />
            </div>
            <div
              className="form-group"
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <label>¿Está Castrado?</label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  type="checkbox"
                  checked={castrado}
                  onChange={() => setCastrado(!castrado)}
                />
              </div>
            </div>

            <div
              className="form-group"
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <label>¿Tiene Vacunas?</label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  type="checkbox"
                  checked={vacunas}
                  onChange={() => setVacunas(!vacunas)}
                />
              </div>
            </div>

            <div
              className="form-group"
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <label>¿Tiene Condición Especial?</label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  type="checkbox"
                  checked={condicionEspecial}
                  onChange={() => setCondicionEspecial(!condicionEspecial)}
                />
              </div>
            </div>

            <div
              className="form-group"
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <label>¿Es Sociable?</label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  type="checkbox"
                  checked={sociable}
                  onChange={() => setSociable(!sociable)} 
                />
              </div>
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
