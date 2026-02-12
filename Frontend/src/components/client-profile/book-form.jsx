import { useState } from "react";
import PropTypes from "prop-types";
import { Notification, useToaster } from "rsuite";

import { createPet } from "../../services/pet";

BookForm.propTypes = {
  id_cliente: PropTypes.string.isRequired,
};

export default function BookForm({ id_cliente }) {
  const [nombre, setPetName] = useState("");
  const [edad, setAge] = useState("");
  const [castrado, setCastrated] = useState("");
  const [vacunas, setVaccines] = useState("");
  const [condicion_especial, setSpecialCondition] = useState("");
  const [sociable, setSociability] = useState("");

  const toaster = useToaster();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nombre ||
      !edad ||
      castrado === "" ||
      vacunas === "" ||
      condicion_especial === "" ||
      sociable === ""
    ) {
      toaster.push(
        <Notification
          type="error"
          header="Por favor, completa todos los campos antes de enviar."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    const response = await createPet(
      nombre,
      edad,
      castrado === "true", 
      vacunas === "true",   
      condicion_especial === "true",
      id_cliente,
      sociable === "true", 

    );
    

    if (response) {
      toaster.push(
        <Notification
          type="success"
          header="Mascota registrada exitosamente"
        />,
        { placement: "topEnd" }
      );
      window.location.reload();
    } else {
      toaster.push(
        <Notification type="error" header="Error al registrar la mascota" />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-lg lg:py-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Introduce la información de tu mascota
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Nombre de tu mascota
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={nombre}
                onChange={(e) => setPetName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Toby"
                required
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="edad"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Edad
              </label>
              <input
                type="number"
                name="edad"
                id="edad"
                value={edad}
                onChange={(e) => setAge(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="1"
                min={0}
                max={30}
                required
              />
            </div>

            <div>
              <label
                htmlFor="castrado"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Castrado
              </label>
              <select
                id="castrado"
                value={castrado}
                onChange={(e) => setCastrated(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="vacunas"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Vacunas
              </label>
              <select
                id="vacunas"
                value={vacunas}
                onChange={(e) => setVaccines(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="true">Todas</option>
                <option value="false">Ninguna</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="condicion_especial"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Condición especial
              </label>
              <select
                id="condicion_especial"
                value={condicion_especial}
                onChange={(e) => setSpecialCondition(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sociable"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Sociable
              </label>
              <select
                id="sociable"
                value={sociable}
                onChange={(e) => setSociability(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
          >
            Registrar
          </button>
        </form>
      </div>
    </section>
  );
}
