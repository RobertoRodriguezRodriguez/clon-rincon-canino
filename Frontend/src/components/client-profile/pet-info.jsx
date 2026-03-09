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
    <section className="relative group">
      {/* Decorative Accent Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-violet/20 to-brand-cyan/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

      <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Subtle internal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-violet mb-2">
              Perfil de Mascota
            </h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              {pet.nombre}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleShowForm}
            className="flex items-center space-x-2 text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs hover:text-brand-violet transition-colors group/btn"
          >
            <div className="p-2 bg-white/5 rounded-xl group-hover/btn:bg-brand-violet/10 transition-colors">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span>Gestionar mascota</span>
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-10 pt-10 border-t border-white/5">
          <div className="space-y-1">
            <dt className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Edad</dt>
            <dd className="text-xl font-bold text-zinc-200">{pet.edad} años</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Castrado</dt>
            <dd className={`text-sm font-black uppercase tracking-widest ${pet.castrado ? "text-brand-cyan" : "text-zinc-400"}`}>
              {pet.castrado ? "Confirmado" : "No"}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Vacunas</dt>
            <dd className={`text-sm font-black uppercase tracking-widest ${pet.vacunas ? "text-brand-cyan" : "text-zinc-400"}`}>
              {pet.vacunas ? "Al día" : "Pendiente"}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[10px) font-black uppercase tracking-[0.25em] text-zinc-500">Sociable</dt>
            <dd className={`text-sm font-black uppercase tracking-widest ${pet.sociable ? "text-brand-cyan" : "text-zinc-400"}`}>
              {pet.sociable ? "Muy sociable" : "Reservado"}
            </dd>
          </div>
          <div className="lg:col-span-2 space-y-1">
            <dt className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Condiciones especiales</dt>
            <dd className={`text-sm font-black uppercase tracking-widest ${pet.condicion_especial ? "text-brand-violet" : "text-zinc-400"}`}>
              {pet.condicion_especial ? "Requiere atención" : "Ninguna reportada"}
            </dd>
          </div>
        </div>

        {showForm && (
          <div className="mt-10 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <PetForm pet={pet} />
          </div>
        )}
      </div>
    </section>
  );
}