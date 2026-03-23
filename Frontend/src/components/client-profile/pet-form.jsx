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
      pet.id,
      nombre.value,
      Number(edad),
      castrado,
      vacunas,
      condicion_especial,
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
    <div className="bg-[#1e1e1e]/50 rounded-3xl p-6 md:p-8 border border-white/5 mx-2 md:mx-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <label htmlFor="name" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
              Nombre de tu mascota
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleNombreChange}
              onBlur={handleNombreBlur}
              className={`w-full bg-[#161616] border border-white/10 rounded-2xl py-3 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all duration-300 ${nombre.error && nombre.touched ? "border-red-500" : ""
                }`}
              placeholder="Ej: Max"
              value={nombre.value}
              required
            />
            {nombre.error && nombre.touched && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-2">
                ⚠️ El nombre solo puede contener letras
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="edad" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
              Edad (años)
            </label>
            <input
              type="number"
              name="edad"
              id="edad"
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-2xl py-3 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all duration-300"
              placeholder="Edad"
              value={edad}
              min={0}
              max={30}
              required
            />
          </div>

          <BooleanSelect label="Castrado" value={castrado} onChange={setCastrated} accent="violet" />
          <BooleanSelect label="Vacunas" value={vacunas} onChange={setVaccines} accent="cyan" />
          <BooleanSelect label="Condición especial" value={condicion_especial} onChange={setSpecialCondition} accent="violet" />
          <BooleanSelect label="Sociable" value={sociable} onChange={setSociable} accent="cyan" />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto min-w-[200px] relative py-3.5 px-10 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
          <div className="relative text-white font-black text-xs tracking-[0.25em] uppercase text-center">
            Guardar cambios
          </div>
        </button>
      </form>
    </div>
  );
}

function BooleanSelect({ label, value, onChange, accent }) {
  const accentColor = accent === "cyan" ? "focus:ring-brand-cyan/20 focus:border-brand-cyan" : "focus:ring-brand-violet/20 focus:border-brand-violet";

  return (
    <div className="space-y-2">
      <label className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === "true")}
        className={`w-full bg-[#161616] border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 transition-all duration-300 appearance-none cursor-pointer ${accentColor}`}
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
  accent: PropTypes.string,
};
