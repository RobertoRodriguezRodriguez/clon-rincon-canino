import { useState, useEffect } from "react";
import { changePassword, getClientsInfo } from "../../services/client";
import { Notification, useToaster, SelectPicker, Input } from "rsuite";
import PropTypes from "prop-types";

export default function ChangePasswordForm({ adminEmail, onSuccess }) {
  const [clients, setClients] = useState([]);
  const [selectedClientEmail, setSelectedClientEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const toaster = useToaster();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await getClientsInfo();
        const activeClients = clientData.filter((client) => client.activo);

        // Filtrar a la administradora si se proporciona su email
        const filteredClients = adminEmail
          ? activeClients.filter(client => client.email !== adminEmail)
          : activeClients;

        setClients(
          filteredClients.map((client) => ({
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
      if (onSuccess) onSuccess();
    } catch (error) {
      toaster.push(
        <Notification type="error" header={`Error: ${error.message}`} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="client-selector"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"
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
          className="custom-input-picker"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password-new"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"
        >
          Nueva contraseña
        </label>
        <Input
          type="password"
          id="password-new"
          name="password-new"
          value={newPassword}
          onChange={setNewPassword}
          className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-3 !text-white focus:!border-brand-violet transition-all"
        />
      </div>
      <button
        type="submit"
        className="w-full py-4 bg-brand-violet text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-violet-500 transition-colors shadow-lg mt-4"
      >
        Actualizar Contraseña
      </button>
    </form>
  );
}

ChangePasswordForm.propTypes = {
  adminEmail: PropTypes.string,
  onSuccess: PropTypes.func,
};
