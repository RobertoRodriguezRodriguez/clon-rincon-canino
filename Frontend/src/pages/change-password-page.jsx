import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notification, useToaster } from "rsuite";
import { changePassword } from "../services/client";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();
  const toaster = useToaster();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toaster.push(
        <Notification type="error" header="Las contraseñas no coinciden" />,
        { placement: "topEnd" }
      );
      return;
    }

    if (password.length < 5 || password.length > 16) {
      toaster.push(
        <Notification type="error" header="La contraseña debe tener entre 5 y 16 caracteres" />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      await changePassword(email, password);

      toaster.push(
        <Notification type="success" header="Contraseña actualizada con éxito" />,
        { placement: "topEnd" }
      );
      navigate("/login");

    } catch (error) {
      toaster.push(
        <Notification type="error" header={"Error: " + error.message} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans pt-10 pb-10">
      {/* Dynamic Background Polish */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Main Content Card with Internal Gradient */}
      <div className="w-full max-w-md p-10 md:p-12 rounded-[2.5rem] relative z-10 bg-[#161616] border border-white/5 shadow-2xl overflow-hidden group">
        {/* Subtle internal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/20 to-brand-violet/10 pointer-events-none" />

        <div className="relative z-10 text-center mb-10">
          <Link to="/" className="inline-block hover:scale-110 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-cyan/20 blur-2xl rounded-full scale-150" />
              <img
                src="/assets/HuellaPerro.webp"
                className="relative mx-auto h-28 w-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                alt="Huella Logo"
              />
            </div>
          </Link>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Casi listo
          </h2>
          <p className="mt-3 text-zinc-400 font-medium tracking-wide">
            Actualiza tu contraseña de seguridad
          </p>
        </div>

        <form className="relative z-10 space-y-7" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Correo electrónico
            </label>
            <div className="relative group">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="w-full bg-[#1e1e1e] border border-brand-cyan/30 focus:border-brand-cyan rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Nueva Contraseña
            </label>
            <div className="relative group">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1e1e1e] border border-brand-violet/30 focus:border-brand-violet rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="repeatPassword"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Repetir Nueva Contraseña
            </label>
            <div className="relative group">
              <input
                id="repeatPassword"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1e1e1e] border border-brand-violet/30 focus:border-brand-violet rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full relative py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500 mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
            <div className="relative text-white font-black text-lg tracking-[0.25em]">
              CAMBIAR CONTRASEÑA
            </div>
          </button>
        </form>

        <div className="relative z-10 mt-12 pt-10 text-center">
          {/* Cyan-Purple Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-violet to-transparent opacity-50 translate-x-1/2" />

          <p className="text-zinc-400 font-medium tracking-wide">
            <Link
              to="/login"
              className="inline-flex items-center group/back"
            >
              <svg
                className="w-4 h-4 mr-2 transform group-hover/back:-translate-x-1 transition-transform text-brand-cyan group-hover/back:text-brand-violet"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-black text-brand-cyan group-hover:text-brand-violet transition-colors uppercase tracking-widest border-b-2 border-brand-cyan/30 group-hover:border-brand-violet/50 pb-1">
                Regresar al inicio
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
