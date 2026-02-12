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

    try {
      if (password.value !== repeatPassword.value) {
        toaster.push(
          <Notification type="error" header="Contraseñas no coinciden" />,
          { placement: "topEnd" }
        );
        throw new Error("Contraseñas no coinciden");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/client`, {
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
        navigate("/login");
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      toaster.push(<Notification type="error" header={error} />, {
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
    <div className="flex flex-grow flex-col w-full min-h-screen justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to={"/"}>
          <img
            src="/assets/HuellaPerro.webp"
            className="mx-auto h-48 w-auto"
            alt="Flowbite Logo"
          />
        </Link>
        <h2 className="-mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Registro
        </h2>
      </div>
      <div className="mt-10 mx-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nombre Completo
            </label>
            <div className="mt-2 px-3 bg-white flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="username"
                className={`w-full sm:text-sm sm:leading-6 ${
                  nombre.hasError ? "text-red-500" : "text-black-500"
                } placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent`}
                type="text"
                value={nombre.value}
                onChange={handleNombreChange}
                onBlur={handleNombreBlur}
                placeholder="Nombre Apellidos"
                required
              />
            </div>
            {nombre.touched && !nombre.hasError && (
              <p className="text-green-500">
                ✅ Campo cumplimentado correctamente
              </p>
            )}
            {nombre.touched && nombre.hasError && (
              <p className="text-red-500">❌ Nombre Apellidos</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Correo electrónico
            </label>
            <div className="mt-2 px-3 bg-white flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@gmail.com"
                required
                value={email.value}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`w-full sm:text-sm sm:leading-6 ${
                  email.hasError ? "text-red-500" : "text-black-500"
                } placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent`}
              />
            </div>
            {email.touched && !email.hasError && (
              <p className="text-green-500">
                ✅ Campo cumplimentado correctamente
              </p>
            )}
            {email.touched && email.hasError && (
              <p className="text-red-500">❌ example@gmail.com</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label
                htmlFor="dni"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                DNI / NIE
              </label>
              <div className="mt-2 px-3 bg-white flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
                <input
                  id="dni"
                  name="dni"
                  type="dni"
                  autoComplete="dni"
                  placeholder="12345678P o X1234567A"
                  required
                  value={dni.value}
                  onChange={handleDNIChange}
                  onBlur={handleDNIBlur}
                  className={`w-full sm:text-sm sm:leading-6 ${
                    dni.hasError ? "text-red-500" : "text-black-500"
                  } placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent`}
                />
              </div>
              {dni.touched && !dni.hasError && (
                <p className="text-green-500">
                  ✅ Campo cumplimentado correctamente
                </p>
              )}
              {dni.touched && dni.hasError && (
                <p className="text-red-500">❌ 12345678P o X1234567A</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Teléfono
              </label>
              <div className="mt-2 px-3 bg-white flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
                <input
                  id="telefono"
                  name="telefono"
                  type="telefono"
                  autoComplete="telefono"
                  placeholder="123456789"
                  required
                  value={telefono.value}
                  onChange={handleTelefonoChange}
                  onBlur={handleTelefonoBlur}
                  className={`w-full sm:text-sm sm:leading-6 ${
                    telefono.hasError ? "text-red-500" : "text-black-500"
                  } placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent`}
                />
              </div>
              {telefono.touched && !telefono.hasError && (
                <p className="text-green-500">
                  ✅ Campo cumplimentado correctamente
                </p>
              )}
              {telefono.touched && telefono.hasError && (
                <p className="text-red-500">❌ 123456789</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contraseña
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="mt-2 px-3 bg-white flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="• • • • • • • •"
                required
                value={password.value}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                minLength={1}
                className={`w-full sm:text-sm sm:leading-6 ${
                  password.hasError ? "text-red-500" : "text-black-500"
                } placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent`}
              />
            </div>
            {password.touched && !password.hasError && (
              <p className="text-green-500">
                ✅ Campo cumplimentado correctamente
              </p>
            )}
            {password.touched && password.hasError && (
              <p className="text-red-500">
                ❌ Debe contener entre 5 y 16 caracteres
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Repite contraseña
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="mt-2 px-3 bg-white flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
              <input
                id="password repeat"
                name="password repeat"
                type="password"
                autoComplete="repeat-password"
                placeholder="• • • • • • • •"
                required
                value={repeatPassword.value}
                onChange={handleRepeatPasswordChange}
                onBlur={handleRepeatPasswordBlur}
                minLength={1}
                className={`w-full sm:text-sm sm:leading-6 ${
                  repeatPassword.hasError ? "text-red-500" : "text-black-500"
                } placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-transparent`}
              />
            </div>
            {repeatPassword.touched && !repeatPassword.hasError && (
              <p className="text-green-500">
                ✅ Campo cumplimentado correctamente
              </p>
            )}
            {repeatPassword.touched && repeatPassword.hasError && (
              <p className="text-red-500">
                ❌ Debe ser la misma contraseña que en el campo anterior.
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="lex w-full justify-center rounded-md bg-sky-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              REGISTRAR
            </button>
          </div>
        </form>
        <p className="pt-5 pb-10 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-sky-500 hover:text-sky-200"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
