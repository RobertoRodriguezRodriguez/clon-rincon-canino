import { useState, useEffect } from "react";
import { changePassword, getClientsInfo } from "../../services/client";
import { Notification, useToaster, SelectPicker, Input } from "rsuite";

export default function ChangePasswordForm() {
  const [clients, setClients] = useState([]);
  const [selectedClientEmail, setSelectedClientEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const toaster = useToaster();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await getClientsInfo();
        const activeClients = clientData.filter((client) => client.activo);
        setClients(
          activeClients.map((client) => ({
            label: `${client.nombre_cliente} (${client.email})`,
            value: client.email,
          }))
        );
      } catch (error) {
        toaster.push(
          <Notification type="error" header="Error al cargar los clientes." />,
          { placement: "topEnd" }
        );
      }
    };
    fetchClients();
  }, [toaster]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClientEmail || !newPassword) {
      toaster.push(
        <Notification
          type="error"
          header="Por favor, selecciona un cliente e introduce una nueva contraseña."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    if (newPassword.length < 5 || newPassword.length > 16) {
      toaster.push(
        <Notification
          type="error"
          header="La contraseña debe tener entre 5 y 16 caracteres"
        />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      await changePassword(selectedClientEmail, newPassword);
      toaster.push(
        <Notification
          type="success"
          header="Contraseña actualizada con éxito."
        />,
        { placement: "topEnd" }
      );
      setSelectedClientEmail(null);
      setNewPassword("");
    } catch (error) {
      toaster.push(
        <Notification type="error" header={`Error: ${error.message}`} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <form className="m-auto max-w-screen-lg pt-4 px-4" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-3">
        <label
          htmlFor="client-selector"
          className="font-semibold leading-none text-gray-900"
        >
          Cliente
        </label>
        <SelectPicker
          id="client-selector"
          data={clients}
          onChange={setSelectedClientEmail}
          value={selectedClientEmail}
          block
          placeholder="Selecciona un cliente"
        />
      </div>
      <div className="flex flex-col space-y-3 mt-4">
        <label
          htmlFor="password-new"
          className="font-semibold leading-none text-gray-900"
        >
          Nueva contraseña
        </label>
        <Input
          type="password"
          id="password-new"
          name="password-new"
          value={newPassword}
          onChange={setNewPassword}
        />
      </div>
      <button
        type="submit"
        className="inline-flex mt-4 items-center text-zinc-600 hover:text-green-700 border border-zinc-600 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-0.5 text-center"
      >
        Guardar
      </button>
    </form>
  );
}
