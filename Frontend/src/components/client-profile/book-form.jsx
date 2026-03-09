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
    <section className="relative group max-w-2xl mx-auto">
      {/* Decorative Accent Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/10 to-brand-violet/10 rounded-[2.5rem] blur-xl opacity-20 pointer-events-none" />

      <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
        <div className="relative z-10 text-center mb-10">
          <h2 className="text-3xl font-black tracking-tight text-white mb-3">
            Registra tu mascota
          </h2>
          <p className="text-zinc-500 font-medium tracking-wide text-sm">
            Compártenos los detalles para empezar las aventuras
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="name" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                Nombre de tu mascota
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={nombre}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all duration-300"
                placeholder="Ej: Toby"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edad" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                Edad (años)
              </label>
              <input
                type="number"
                name="edad"
                id="edad"
                value={edad}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all duration-300"
                placeholder="1"
                min={0}
                max={30}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="castrado" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                Castrado
              </label>
              <select
                id="castrado"
                value={castrado}
                onChange={(e) => setCastrated(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-3.5 px-5 text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="bg-[#1e1e1e]">Seleccionar...</option>
                <option value="true" className="bg-[#1e1e1e]">Sí</option>
                <option value="false" className="bg-[#1e1e1e]">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="vacunas" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                Vacunas
              </label>
              <select
                id="vacunas"
                value={vacunas}
                onChange={(e) => setVaccines(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-3.5 px-5 text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="bg-[#1e1e1e]">Seleccionar...</option>
                <option value="true" className="bg-[#1e1e1e]">Al día</option>
                <option value="false" className="bg-[#1e1e1e]">Pendientes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="condicion_especial" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                Condición especial
              </label>
              <select
                id="condicion_especial"
                value={condicion_especial}
                onChange={(e) => setSpecialCondition(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-3.5 px-5 text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="bg-[#1e1e1e]">Seleccionar...</option>
                <option value="true" className="bg-[#1e1e1e]">Sí</option>
                <option value="false" className="bg-[#1e1e1e]">No</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="sociable" className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">
                Nivel de Sociabilidad
              </label>
              <select
                id="sociable"
                value={sociable}
                onChange={(e) => setSociability(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-3.5 px-5 text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="bg-[#1e1e1e]">Seleccion una opción...</option>
                <option value="true" className="bg-[#1e1e1e]">Muy sociable</option>
                <option value="false" className="bg-[#1e1e1e]">Reservado / En entrenamiento</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full relative py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500 mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
            <div className="relative text-white font-black text-xs tracking-[0.25em] uppercase text-center">
              REGISTRAR MASCOTA
            </div>
          </button>
        </form>
      </div>
    </section>
  );
}
