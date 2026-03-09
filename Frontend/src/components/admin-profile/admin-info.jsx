import { useState, useEffect } from "react";
import ChangePasswordForm from "./change-password-form";
import { getClient, changePassword } from "../../services/client";
import { Notification, useToaster, Input } from "rsuite";

export default function AdminInfo() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRepeatPassword, setAdminRepeatPassword] = useState("");
  const [client, setClient] = useState({
    dni: "",
    email: "",
  });

  const toaster = useToaster();

  useEffect(() => {
    // Obtener los datos del cliente (admin) al montar el componente
    getClient().then((clientData) => {
      setClient(clientData); // Asignar datos al estado
    });
  }, []);

  const handleAdminPasswordChange = async (e) => {
    e.preventDefault();

    if (!client.email) {
      toaster.push(
        <Notification type="error" header="No se pudo obtener el email del administrador." />,
        { placement: "topEnd" }
      );
      return;
    }

    if (!adminPassword || !adminRepeatPassword) {
      toaster.push(
        <Notification type="error" header="Introduce la nueva contraseña en ambos campos." />,
        { placement: "topEnd" }
      );
      return;
    }

    if (adminPassword !== adminRepeatPassword) {
      toaster.push(
        <Notification type="error" header="Las contraseñas no coinciden." />,
        { placement: "topEnd" }
      );
      return;
    }

    if (adminPassword.length < 5 || adminPassword.length > 16) {
      toaster.push(
        <Notification type="error" header="La contraseña debe tener entre 5 y 16 caracteres." />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      console.log("Cambiando contraseña para email:", client.email);
      await changePassword(client.email, adminPassword);
      toaster.push(
        <Notification type="success" header="Tu contraseña ha sido actualizada con éxito." />,
        { placement: "topEnd" }
      );
      setAdminPassword("");
      setAdminRepeatPassword("");
      setShowAdminForm(false);
    } catch (error) {
      console.error("Error al cambiar contraseña del admin:", error);
      toaster.push(
        <Notification type="error" header={`Error: ${error.message}`} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <section>
      <div className="m-auto max-w-screen-lg pt-24 px-4">
        <div className="flex space-x-10">
          <h2 className="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
            NAZARET LINARES FERRE
          </h2>
        </div>
        <dl className="flex items-center space-x-10 pt-6">
          <div>
            <dt className="mb-2 font-semibold leading-none text-gray-900">
              DNI
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5">
              {client.dni || "No disponible"}
            </dd>
          </div>
          <div>
            <dt className="mb-2 font-semibold leading-none text-gray-900">
              Correo electrónico
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5">
              {client.email || "No disponible"}
            </dd>
          </div>
        </dl>

        {/* Botones separados */}
        <div className="flex flex-wrap gap-3">
          {/* Botón para cambiar contraseña propia del admin */}
          <button
            type="button"
            onClick={() => {
              setShowAdminForm(!showAdminForm);
              if (showClientForm) setShowClientForm(false);
            }}
            className="inline-flex items-center text-zinc-600 hover:text-white border border-zinc-600 hover:bg-zinc-600 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-0.5 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-1.5 -ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Mi contraseña
          </button>

          {/* Botón para cambiar contraseña de un cliente */}
          <button
            type="button"
            onClick={() => {
              setShowClientForm(!showClientForm);
              if (showAdminForm) setShowAdminForm(false);
            }}
            className="inline-flex items-center text-zinc-600 hover:text-white border border-zinc-600 hover:bg-zinc-600 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-0.5 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-1.5 -ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Contraseña de cliente
          </button>
        </div>
      </div>

      {/* Formulario para cambiar la contraseña propia del admin */}
      {showAdminForm && (
        <form className="m-auto max-w-screen-lg pt-4 px-4" onSubmit={handleAdminPasswordChange}>
          <h3 className="font-semibold text-gray-900 mb-3">Cambiar mi contraseña</h3>
          <div className="flex flex-col space-y-3">
            <label htmlFor="admin-password-new" className="font-semibold leading-none text-gray-900">
              Nueva contraseña
            </label>
            <Input
              type="password"
              id="admin-password-new"
              name="admin-password-new"
              value={adminPassword}
              onChange={setAdminPassword}
            />
          </div>
          <div className="flex flex-col space-y-3 mt-4">
            <label htmlFor="admin-password-repeat" className="font-semibold leading-none text-gray-900">
              Repetir nueva contraseña
            </label>
            <Input
              type="password"
              id="admin-password-repeat"
              name="admin-password-repeat"
              value={adminRepeatPassword}
              onChange={setAdminRepeatPassword}
            />
          </div>
          <button
            type="submit"
            className="inline-flex mt-4 items-center text-zinc-600 hover:text-green-700 border border-zinc-600 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-0.5 text-center"
          >
            Guardar
          </button>
        </form>
      )}

      {/* Formulario para cambiar la contraseña de un cliente */}
      {showClientForm && <ChangePasswordForm adminEmail={client.email} />}
    </section>
  );
}
