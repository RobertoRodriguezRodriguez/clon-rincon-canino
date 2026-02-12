import { Table, Button, Input, Notification, useToaster } from "rsuite";
import { useState, useEffect } from "react";

import {
  getClientsInfo,
  deleteClient,
  activeClient,
  desactivateClient
} from "../../services/client";

import { deleteReservation } from "../../services/class_client";
import { deleteStay } from "../../services/stay";

const { Column, HeaderCell, Cell } = Table;

export default function UserManagement() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toaster = useToaster();

  // Filtrar los clientes por nombre y ordenar los activos primero.
  const filteredClients = clients
    .filter((client) =>
      client.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1));

  // Cargar los clientes al montar el componente.
  useEffect(() => {
    reloadClients();
  }, []);

  const reloadClients = async () => {
    try {
      const clients = await getClientsInfo();
      setClients(clients);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };


  return (
    <div className="m-auto pt-3 max-w-screen-lg px-4">
      <h2 className="my-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
        Gestión de usuarios
      </h2>
      <Input
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
        style={{ marginBottom: "10px" }}
      />
      <Table height={300} data={filteredClients}>
        <Column width={145} fixed>
          <HeaderCell>Nombre</HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                className={rowData.activo === 0 ? "text-zinc-400" : ""}
                style={{ cursor: "pointer" }}
                title="Haga clic para copiar el ID"
                onClick={() => {
                  navigator.clipboard
                    .writeText(rowData.id_cliente)
                    .then(() => {
                      toaster.push(
                        <Notification
                          type="success"
                          header="ID copiado al portapapeles"
                        />,
                        { placement: "topEnd" }
                      );
                    })
                    .catch((err) => {
                      console.error("Error al copiar el ID: ", err);
                    });
                }}
              >
                {rowData.nombre_cliente}
              </span>
            )}
          </Cell>
        </Column>

        <Column width={125}>
          <HeaderCell>Teléfono</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.activo === 0 ? (
                <span className="text-zinc-400">{rowData.telefono}</span>
              ) : (
                <span>{rowData.telefono}</span>
              )
            }
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Mascota</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.activo === 0 ? (
                <span className="text-zinc-400">{rowData.nombre_mascota}</span>
              ) : (
                <span>{rowData.nombre_mascota}</span>
              )
            }
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>DNI</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.activo === 0 ? (
                <span className="text-zinc-400">{rowData.dni}</span>
              ) : (
                <span>{rowData.dni}</span>
              )
            }
          </Cell>
        </Column>

        <Column width={222}>
          <HeaderCell>Email</HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                title={rowData.email} // Tooltip con el correo completo
                className={rowData.activo === 0 ? "text-zinc-400" : ""}
                onClick={() => {
                  // Copiar al portapapeles
                  navigator.clipboard
                    .writeText(rowData.email)
                    .then(() => {
                      toaster.push(
                        <Notification
                          type="success"
                          header="Correo copiado al portapapeles"
                        />,
                        { placement: "topEnd" }
                      );
                    })
                    .catch((err) => {
                      console.error("Error al copiar el correo: ", err);
                    });
                }}
                style={{ cursor: "pointer" }} // Para mostrar que el correo es clickeable
              >
                {rowData.email}
              </span>
            )}
          </Cell>
        </Column>

        <Column width={120} fixed="right">
          <HeaderCell
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Eliminar
          </HeaderCell>
          <Cell
            style={{
              padding: "6px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {(rowData) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {/* Botón de Eliminar */}
                <Button
                  appearance="link"
                  onClick={() => {
                    deleteClient(rowData.id_cliente);
                    reloadClients();
                  }}
                  title="Eliminar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-red-600 hover:text-red-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </Cell>
        </Column>

        <Column width={140} fixed="right">
          <HeaderCell>Habilitar/Deshabilitar</HeaderCell>
          <Cell
            style={{
              padding: "6px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {(rowData) =>
              rowData.activo === 0 ? ( // Usuario inactivo: opción para habilitar
                <Button
                  appearance="link"
                  title="Habilitar"
                  onClick={async () => {
                    try {
                      await activeClient(rowData.id_cliente); // Activa al usuario
                      reloadClients();
                    } catch (error) {
                      console.error("Error al activar el usuario:", error);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 -ml-1 text-green-600 hover:text-green-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Button>
              ) : (
                // Usuario activo: opción para deshabilitar
                <Button
                  appearance="link"
                  title="Deshabilitar"
                  onClick={async () => {
                    try {
                      await Promise.all([
                        desactivateClient(rowData.id_cliente),
                        deleteStay(rowData.id_mascota),
                        // deleteReservation(rowData.id_cliente),
                      ]);
                      reloadClients();
                    } catch (error) {
                      console.error("Error al deshabilitar el usuario:", error);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 -ml-1 text-red-600 hover:text-red-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Button>
              )
            }
          </Cell>
        </Column>
      </Table>
    </div>
  );
}
