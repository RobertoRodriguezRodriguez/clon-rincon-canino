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
    <div className="flex flex-col flex-grow w-full h-screen justify-center bg-zinc-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to={"/"} className="flex items-center space-x-3">
          <img
            src="/assets/HuellaPerro.webp"
            className="mx-auto h-48 w-auto"
            alt="Huella Logo"
          />
        </Link>
        <h2 className="-mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Cambiar Contraseña
        </h2>
      </div>

      <div className="mt-10 mx-3 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Correo electrónico
            </label>
            <div className="mt-2 px-3 flex w-full bg-white rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full text-gray-900 placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Nueva Contraseña
            </label>
            <div className="mt-2 bg-white px-3 flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="• • • • • • • •"
                className="w-full text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="repeatPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Repetir Nueva Contraseña
            </label>
            <div className="mt-2 bg-white px-3 flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="repeatPassword"
                name="repeatPassword"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="• • • • • • • •"
                className="w-full text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-sky-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              CAMBIAR CONTRASEÑA
            </button>
          </div>
        </form>

        <p className="pt-5 text-center text-sm text-gray-500">
          <Link to="/login" className="font-semibold leading-6 text-sky-500 hover:text-sky-200">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
