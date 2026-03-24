import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Notification, useToaster } from "rsuite";

const nombreRegexp = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /^([A-Za-zÑñÁáÉéÍíÓóÚú]+(['\-][A-Za-zÑñÁáÉéÍíÓóÚú]+)?)(\s+[A-Za-zÑñÁáÉéÍíÓóÚú]+(['\-][A-Za-zÑñÁáÉéÍíÓóÚú]+)?)*$/
);
const emailRegexp = new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/);
const telefonoRegexp = new RegExp(/^\d{9}$/);
const dniRegexp = new RegExp(/^[XYZ]?\d{7,8}[A-Za-z]$/i);

export default function SignUpPage() {
  const [nombre, setUsername] = useState({
    value: "",
    hasError: false,
    touched: false,
  });
  const [password, setPasswordHash] = useState({
    value: "",
    hasError: false,
    touched: false,
  });
  const [repeatPassword, setRepeatPassword] = useState({
    value: "",
    hasError: false,
    touched: false,
  });
  const [email, setEmail] = useState({
    value: "",
    hasError: false,
    touched: false,
  });
  const [telefono, setTelefono] = useState({
    value: "",
    hasError: false,
    touched: false,
  });
  const [dni, setDni] = useState({
    value: "",
    hasError: false,
    touched: false,
  });

  const navigate = useNavigate();
  const toaster = useToaster();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3001/api" : "https://clon-rincon-canino-back.onrender.com/api");

    try {
      if (password.value !== repeatPassword.value) {
        toaster.push(
          <Notification type="error" header="Contraseñas no coinciden" />,
          { placement: "topEnd" }
        );
        throw new Error("Contraseñas no coinciden");
      }

      const response = await fetch(`${apiUrl}/client`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.value,
          telefono: telefono.value,
          dni: dni.value,
          email: email.value,
          password: password.value,
        }),
      });

      if (response.ok) {
        // Intentar iniciar sesión automáticamente para obtener el token
        const loginResponse = await fetch(`${apiUrl}/client`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        if (loginResponse.ok) {
          const tokenJSON = await loginResponse.json();
          sessionStorage.setItem("token", tokenJSON.token);
          navigate("/profile-user");
        } else {
          navigate("/login");
        }
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      toaster.push(<Notification type="error" header={error.message} />, {
        placement: "topEnd",
      });
    }
  };

  //Funciones de Cambio y Desenfoque de Nombre

  const handleNombreChange = (e) => {
    setUsername((prevState) => ({ ...prevState, value: e.target.value }));
  };

  const handleNombreBlur = () => {
    const hasError = !nombreRegexp.test(nombre.value);
    setUsername((prevState) => ({ ...prevState, hasError, touched: true }));
  };

  //Funciones de Cambio y Desenfoque de Email

  const handleEmailChange = (e) => {
    setEmail((prevState) => ({ ...prevState, value: e.target.value }));
  };

  const handleEmailBlur = () => {
    const hasError = !emailRegexp.test(email.value);
    setEmail((prevState) => ({ ...prevState, hasError, touched: true }));
  };

  //Funciones de Cambio y Desenfoque de DNI

  const handleDNIChange = (e) => {
    setDni((prevState) => ({ ...prevState, value: e.target.value }));
  };

  const handleDNIBlur = () => {
    const hasError = !dniRegexp.test(dni.value);
    setDni((prevState) => ({ ...prevState, hasError, touched: true }));
  };

  //Funciones de Cambio y Desenfoque de Teléfono

  const handleTelefonoChange = (e) => {
    setTelefono((prevState) => ({ ...prevState, value: e.target.value }));
  };

  const handleTelefonoBlur = () => {
    const hasError = !telefonoRegexp.test(telefono.value);
    setTelefono((prevState) => ({ ...prevState, hasError, touched: true }));
  };

  //Funciones de Cambio y Desenfoque de Contraseña

  const handlePasswordChange = (e) => {
    setPasswordHash((prevState) => ({ ...prevState, value: e.target.value }));
  };

  const handlePasswordBlur = () => {
    const hasError = password.value.length < 5 || password.value.length > 16;
    setPasswordHash((prevState) => ({ ...prevState, hasError, touched: true }));
  };

  //Funciones de Cambio y Desenfoque de repetir contraseña

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword((prevState) => ({
      ...prevState,
      value: e.target.value,
    }));
  };

  const handleRepeatPasswordBlur = () => {
    const hasError = repeatPassword.value !== password.value;
    setRepeatPassword((prevState) => ({
      ...prevState,
      hasError,
      touched: true,
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans pt-10 pb-10">
      {/* Dynamic Background Polish */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Main Content Card with Internal Gradient */}
      <div className="w-full max-w-lg p-10 md:p-12 rounded-[2.5rem] relative z-10 bg-[#161616] border border-white/5 shadow-2xl overflow-hidden group">
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
            Crea tu cuenta
          </h2>
          <p className="mt-3 text-zinc-400 font-medium tracking-wide">
            Únete a la comunidad de Rincón Canino
          </p>
        </div>

        <form className="relative z-10 space-y-7" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Nombre Completo
            </label>
            <div className="relative group">
              <input
                id="username"
                type="text"
                required
                value={nombre.value}
                onChange={handleNombreChange}
                onBlur={handleNombreBlur}
                placeholder="Nombre y Apellidos"
                className={`w-full bg-[#1e1e1e] border ${nombre.touched && nombre.hasError ? "border-red-500/50" : "border-brand-cyan/30"
                  } focus:border-brand-cyan rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all duration-300 text-lg`}
              />
            </div>
            {nombre.touched && !nombre.hasError && (
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest ml-2 mt-1">
                ✅ Nombre válido
              </p>
            )}
            {nombre.touched && nombre.hasError && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-2 mt-1">
                ❌ Formato de nombre inválido
              </p>
            )}
          </div>

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
                value={email.value}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="tu@ejemplo.com"
                className={`w-full bg-[#1e1e1e] border ${email.touched && email.hasError ? "border-red-500/50" : "border-brand-cyan/30"
                  } focus:border-brand-cyan rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all duration-300 text-lg`}
              />
            </div>
            {email.touched && !email.hasError && (
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest ml-2 mt-1">
                ✅ Correo válido
              </p>
            )}
            {email.touched && email.hasError && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-2 mt-1">
                ❌ Formato de correo inválido
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="dni"
                className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
              >
                DNI / NIE
              </label>
              <div className="relative group">
                <input
                  id="dni"
                  type="text"
                  required
                  value={dni.value}
                  onChange={handleDNIChange}
                  onBlur={handleDNIBlur}
                  placeholder="12345678X"
                  className={`w-full bg-[#1e1e1e] border ${dni.touched && dni.hasError ? "border-red-500/50" : "border-brand-violet/30"
                    } focus:border-brand-violet rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-300 text-lg`}
                />
              </div>
              {dni.touched && dni.hasError && (
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-2 mt-1 text-center">
                  ❌ Formato inválido
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="telefono"
                className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
              >
                Teléfono
              </label>
              <div className="relative group">
                <input
                  id="telefono"
                  type="tel"
                  required
                  value={telefono.value}
                  onChange={handleTelefonoChange}
                  onBlur={handleTelefonoBlur}
                  placeholder="999 999 999"
                  className={`w-full bg-[#1e1e1e] border ${telefono.touched && telefono.hasError ? "border-red-500/50" : "border-brand-violet/30"
                    } focus:border-brand-violet rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-300 text-lg`}
                />
              </div>
              {telefono.touched && telefono.hasError && (
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-2 mt-1 text-center">
                  ❌ 9 dígitos
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Contraseña
            </label>
            <div className="relative group">
              <input
                id="password"
                type="password"
                required
                value={password.value}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="••••••••"
                className={`w-full bg-[#1e1e1e] border ${password.touched && password.hasError ? "border-red-500/50" : "border-brand-cyan/30"
                  } focus:border-brand-cyan rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all duration-300 text-lg`}
              />
            </div>
            {password.touched && password.hasError && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-2 mt-1">
                ❌ Entre 5 y 16 caracteres
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password-repeat"
              className="block text-xs font-bold text-zinc-300 ml-2 uppercase tracking-[0.2em]"
            >
              Repite Contraseña
            </label>
            <div className="relative group">
              <input
                id="password-repeat"
                type="password"
                required
                value={repeatPassword.value}
                onChange={handleRepeatPasswordChange}
                onBlur={handleRepeatPasswordBlur}
                placeholder="••••••••"
                className={`w-full bg-[#1e1e1e] border ${repeatPassword.touched && repeatPassword.hasError ? "border-red-500/50" : "border-brand-cyan/30"
                  } focus:border-brand-cyan rounded-2xl py-3.5 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all duration-300 text-lg`}
              />
            </div>
            {repeatPassword.touched && repeatPassword.hasError && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-2 mt-1">
                ❌ Las contraseñas no coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full relative py-4 rounded-2xl overflow-hidden group/btn shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500 mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-violet transition-transform duration-500 group-hover/btn:scale-105" />
            <div className="relative text-white font-black text-lg tracking-[0.25em]">
              REGISTRARSE
            </div>
          </button>
        </form>

        <div className="relative z-10 mt-12 pt-10 text-center">
          {/* Cyan-Purple Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-violet to-transparent opacity-50 translate-x-1/2" />

          <p className="text-zinc-400 font-medium tracking-wide">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="inline-flex items-center ml-1 group/login"
            >
              <span className="font-black text-brand-cyan group-hover:text-brand-violet transition-colors uppercase tracking-widest border-b-2 border-brand-cyan/30 group-hover:border-brand-violet/50 pb-1">
                Inicia sesión
              </span>
              <svg
                className="w-4 h-4 ml-2 transform group-hover/login:translate-x-1 transition-transform text-brand-cyan group-hover/login:text-brand-violet"
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
