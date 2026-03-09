import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getClient } from "../services/client";

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    getClient(navigate).then((response) => {
      setToken(response);
    });
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#101010]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src="/assets/HuellaPerro.webp"
              className="relative h-10 w-10 object-contain brightness-110 group-hover:scale-110 transition-transform duration-500"
              alt="Huella Logo"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-white italic">
              Rincón<span className="text-brand-cyan">Canino</span>
            </span>
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Panel de Administración</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/photos"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-brand-cyan transition-colors"
          >
            Galería
          </Link>
          <Link
            to="/calendar"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-brand-cyan transition-colors"
          >
            Cronograma
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          {token === null ? (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-brand-cyan text-black font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10"
            >
              Identificarse
            </button>
          ) : (
            <button
              onClick={() => navigate("/profile-admin")}
              className="px-6 py-2 border border-white/10 hover:border-brand-cyan/30 text-white font-black uppercase text-[10px] tracking-widest rounded-lg transition-all"
            >
              Dashboard
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-zinc-500 hover:text-white"
          onClick={() => {
            document.getElementById("mobile-menu").classList.toggle("hidden");
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-[#161616] border-b border-white/5 p-6 animate-in fade-in slide-in-from-top-4">
        <div className="flex flex-col gap-6">
          <Link to="/photos" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Galería</Link>
          <Link to="/calendar" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cronograma</Link>
          <button
            onClick={() => navigate(token ? "/profile-admin" : "/login")}
            className="w-full py-4 bg-brand-cyan text-black font-black uppercase text-[10px] tracking-widest rounded-xl"
          >
            {token ? "Dashboard" : "Identificarse"}
          </button>
        </div>
      </div>
    </nav>
  );
}
