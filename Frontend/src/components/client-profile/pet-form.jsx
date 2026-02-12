import { useState } from "react";
import PropTypes from "prop-types";

import { updatePetInfo } from "../../services/pet";
import { Notification, useToaster } from "rsuite";

const nombreRegexp = new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/);

PetForm.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.string,
    nombre: PropTypes.string,
    edad: PropTypes.number,
    castrado: PropTypes.bool,
    vacunas: PropTypes.bool,
    condicion_especial: PropTypes.bool,
    sociable: PropTypes.bool,
  }),
};

export default function PetForm({ pet }) {
  const [nombre, setPetName] = useState({
    value: pet.nombre,
    error: false,
    touched: false,
  });
  const [edad, setAge] = useState(pet.edad);
  const [castrado, setCastrated] = useState(pet.castrado);
  const [vacunas, setVaccines] = useState(pet.vacunas);
  const [condicion_especial, setSpecialCondition] = useState(pet.condicion_especial);
  const [sociable, setSociable] = useState(pet.sociable);

  const toaster = useToaster();

  const handleNombreChange = (e) => {
    setPetName({
      ...nombre,
      value: e.target.value,
    });
  };

  const handleNombreBlur = () => {
    const hasError = !nombreRegexp.test(nombre.value);
    setPetName({
      ...nombre,
      error: hasError,
      touched: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPet = await updatePetInfo(
      nombre.value,
      Number(edad),
      castrado,
      vacunas,
      condicion_especial,
      pet.id,
      sociable
    );

    if (newPet) {
      toaster.push(
        <Notification type="success" header="¡Actualización exitosa!">
          Los datos de tu mascota han sido actualizados.
        </Notification>,
        { placement: "topEnd" }
      );
      window.location.reload();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 px-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
              Nombre de tu mascota
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleNombreChange}
              onBlur={handleNombreBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5 ${
                nombre.error && nombre.touched ? "border-red-500" : ""
              }`}
              placeholder="Nombre"
              value={nombre.value}
              required
            />
            {nombre.error && nombre.touched && (
              <p className="text-red-500">
                ❌ El nombre no cumple con el formato requerido
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="edad" className="block mb-2 text-sm font-medium text-gray-900">
              Edad
            </label>
            <input
              type="number"
              name="edad"
              id="edad"
              onChange={(e) => setAge(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5"
              placeholder="Edad"
              value={edad}
              min={0}
              max={30}
              required
            />
          </div>

          <BooleanSelect label="Castrado" value={castrado} onChange={setCastrated} />
          <BooleanSelect label="Vacunas" value={vacunas} onChange={setVaccines} />
          <BooleanSelect label="Condición especial" value={condicion_especial} onChange={setSpecialCondition} />
          <BooleanSelect label="Sociable" value={sociable} onChange={setSociable} />
        </div>

        <div className="px-4">
          <button
            type="submit"
            className="flex w-full justify-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
          >
            Cambiar
          </button>
        </div>
      </form>
    </>
  );
}

function BooleanSelect({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === "true")}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
      >
        <option value={true}>Sí</option>
        <option value={false}>No</option>
      </select>
    </div>
  );
}

BooleanSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
