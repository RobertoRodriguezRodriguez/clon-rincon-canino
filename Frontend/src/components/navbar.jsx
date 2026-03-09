import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getClient } from "../services/client";

export default function Navbar() {
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
    <nav className="bg-[#121212]/80 backdrop-blur-xl fixed w-full z-40 top-0 start-0 border-b border-white/5">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-brand-cyan/20 blur-lg rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src="/assets/HuellaPerro.webp"
              className="relative h-10 w-auto transition-transform group-hover:rotate-12"
              alt="Huella Logo"
            />
          </div>
          <span className="self-center text-xl font-black tracking-tighter text-white">
            Rincón<span className="text-brand-cyan">Canino</span>
          </span>
        </Link>

        <div className="flex md:order-2 space-x-4 items-center">
          {token === null ? (
            <Link
              to="/login"
              className="bg-white text-black hover:bg-brand-cyan hover:text-white font-bold rounded-xl text-xs px-5 py-2.5 transition-all uppercase tracking-widest shadow-xl shadow-brand-cyan/10"
            >
              Iniciar
            </Link>
          ) : (
            <Link
              to="/profile-user"
              className="bg-[#1e1e1e] text-white hover:bg-brand-cyan font-bold rounded-xl text-xs px-5 py-2.5 transition-all border border-white/10 uppercase tracking-widest"
            >
              Mi Perfil
            </Link>
          )}

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            onClick={() => {
              const nav = document.getElementById("navbar-sticky");
              nav.classList.toggle("hidden");
            }}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-zinc-400 rounded-xl md:hidden hover:bg-white/5 transition-colors"
          >
            <span className="sr-only">Menu</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-bold md:space-x-8 md:flex-row md:mt-0">
            <li>
              <Link
                to="/photos"
                className="block py-2 px-3 text-zinc-400 hover:text-brand-cyan transition-colors uppercase tracking-widest text-xs"
              >
                Galería
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
