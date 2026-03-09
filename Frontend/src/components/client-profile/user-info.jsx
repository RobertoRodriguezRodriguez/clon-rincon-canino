import PropTypes from "prop-types";
import { useState } from "react";

import ChangeDataForm from "./change-data-form";

UserInfo.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  dni: PropTypes.string,
};

export default function UserInfo({ id, name, phone, email, dni }) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  return (
    <section className="relative group">
      {/* Decorative Blur and Accent */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/20 to-brand-violet/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

      <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Subtle internal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              {name}
            </h2>
            <p className="text-brand-cyan font-bold text-lg tracking-wide">
              {phone}
            </p>
          </div>

          <button
            type="button"
            onClick={handleShowForm}
            className="flex items-center space-x-2 text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs hover:text-brand-cyan transition-colors group/btn"
          >
            <div className="p-2 bg-white/5 rounded-xl group-hover/btn:bg-brand-cyan/10 transition-colors">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span>Editar perfil</span>
          </button>
        </div>

        <dl className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 pt-10 border-t border-white/5">
          <div className="space-y-2">
            <dt className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              Documento Identidad
            </dt>
            <dd className="text-lg font-bold text-zinc-200">{dni}</dd>
          </div>
          <div className="space-y-2">
            <dt className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              Dirección de correo
            </dt>
            <dd className="text-lg font-bold text-zinc-200">{email}</dd>
          </div>
        </dl>

        {showForm && (
          <div className="mt-10 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <ChangeDataForm id={id} phone={phone} email={email} />
          </div>
        )}
      </div>
    </section>
  );
}
