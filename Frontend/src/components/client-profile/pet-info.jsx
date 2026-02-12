import PropTypes from 'prop-types';
import { useState } from 'react';

import PetForm from './pet-form';

PetInfo.propTypes = {
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

export default function PetInfo({ pet }) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  }

  return (
    <>
      <div className="px-4 pb-10 space-y-2 sm:space-x-5">
        <h2 className="text-2xl font-bold text-gray-900">Información de tu mascota</h2>
        <div className="flex flex-col pb-4 space-y-2">
          <p className="text-gray-900">
            <span className="font-bold">Nombre:</span> {pet.nombre}
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Edad:</span> {pet.edad}
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Castrado:</span> {pet.castrado ? "Sí" : "No"}
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Vacunas:</span> {pet.vacunas ? "Sí" : "No"}
          </p>
          <p>
            <span className="font-bold">Sociable:</span> {pet.sociable ? "Sí" : "No"}
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Condiciones especiales:</span> {pet.condicion_especial ? "Sí" : "No"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleShowForm}
          className="inline-flex items-center text-blue-700 border border-blue-700 hover:bg-white focus:ring-2 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-1.5 text-center"
        >
          Modificar información de tu mascota
        </button>
      </div>
      {showForm && <PetForm pet={pet} />}
    </>
  )
}