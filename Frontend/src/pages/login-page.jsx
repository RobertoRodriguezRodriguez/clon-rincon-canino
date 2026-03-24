import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Notification, useToaster } from "rsuite";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPasswordHash] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const toaster = useToaster();

  useEffect(() => {
    const errorMessage = location.state && location.state.error;
    if (errorMessage) {
      toaster.push(
        <Notification type="error" header={"Error: " + errorMessage} />,
        { placement: "topEnd" }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3001/api" : "https://clon-rincon-canino-back.onrender.com/api");

    if (email === "nazaretlinaresferre198@gmail.com") {
      try {
        const token = await fetch(`${apiUrl}/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!token.ok) {
          throw new Error("401");
        }

        const tokenJSON = await token.json();

        if (tokenJSON.error) {
          throw new Error(tokenJSON.error);
        }

        sessionStorage.setItem("token", tokenJSON.token);
        navigate("/profile-admin");
        return;
      } catch (error) {
        toaster.push(
          <Notification type="error" header={"Error: " + error.message} />,
          { placement: "topEnd" }
        );
      }
    }
    try {
      const token = await fetch(`${apiUrl}/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!token.ok) {
        throw new Error("401");
      }

      const tokenJSON = await token.json();

      if (tokenJSON.error) {
        throw new Error(tokenJSON.error);
      }

      sessionStorage.setItem("token", tokenJSON.token);
      navigate("/profile-user");
    } catch (error) {
      toaster.push(
        <Notification type="error" header={"Error: " + error.message} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
      {/* Dynamic Background Polish - Simplified for compatibility */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Main Content Card with Internal Gradient */}
      <div className="w-full max-w-md p-10 md:p-12 rounded-[2.5rem] relative z-10 bg-[#161616] border border-white/5 shadow-2xl overflow-hidden group">
        {/* Subtle internal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/20 to-brand-violet/10 pointer-events-none" />

        <div className="relative z-10 text-center mb-12">
          <Link to="/" className="inline-block hover:scale-110 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-cyan/20 blur-2xl rounded-full scale-150" />
              <img
                src="/assets/HuellaPerro.webp"
                className="relative mx-auto h-32 w-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                alt="Huella Logo"
              />
            </div>
          </Link>
          <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            ¡Hola de nuevo!
          </h2>
          <p className="mt-4 text-zinc-400 font-medium tracking-wide">
            Entra en el mundo de Rincón Canino
          </p>
        </div>

        <form className="relative z-10 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Correo electrónico
            </label>
            <div className="relative group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="w-full bg-[#1e1e1e] border border-brand-cyan/30 focus:border-brand-cyan rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-2">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]"
              >
                Contraseña
              </label>
              <Link
                to="/change-password"
                className="text-xs font-bold text-brand-violet hover:text-brand-violet/80 transition-colors uppercase tracking-widest"
              >
                ¿La olvidaste?
              </Link>
            </div>
            <div className="relative group">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPasswordHash(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1e1e1e] border border-brand-violet/30 focus:border-brand-violet rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full relative py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
            <div className="relative text-white font-black text-lg tracking-[0.25em]">
              INICIAR SESIÓN
            </div>
          </button>
        </form>

        <div className="relative z-10 mt-12 pt-10 text-center">
          {/* Cyan-Purple Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-violet to-transparent opacity-50 translate-x-1/2" />

          <p className="text-zinc-400 font-medium tracking-wide">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to="/sign-up"
              className="inline-flex items-center ml-1 group/reg"
            >
              <span className="font-black text-brand-cyan group-hover:text-brand-violet transition-colors uppercase tracking-widest border-b-2 border-brand-cyan/30 group-hover:border-brand-violet/50 pb-0.5">
                Regístrate ahora
              </span>
              <svg
                className="w-4 h-4 ml-2 transform group-hover/reg:translate-x-1 transition-transform text-brand-cyan group-hover/reg:text-brand-violet"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
