import { useState, useEffect } from "react";
import ChangePasswordForm from "./change-password-form";
import { getClient } from "../../services/client";

export default function AdminInfo() {
  const [showForm, setShowForm] = useState(false);
  const [client, setClient] = useState({
    dni: "",
    email: "",
  });

  useEffect(() => {
    // Obtener los datos del cliente (admin) al montar el componente
    getClient().then((clientData) => {
      setClient(clientData); // Asignar datos al estado
    });
  }, []);

  const handleShowForm = () => {
    setShowForm(!showForm); // Alternar formulario de cambio de contraseña
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
        <button
          type="button"
          onClick={handleShowForm}
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
          Cambiar contraseña
        </button>
      </div>
      {showForm && <ChangePasswordForm />}
    </section>
  );
}
