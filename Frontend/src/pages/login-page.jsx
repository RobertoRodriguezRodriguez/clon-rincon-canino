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

    if (email === "nazaretlinaresferre198@gmail.com") {
      try {
        const token = await fetch(`${import.meta.env.VITE_API_URL}/admin`, {
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
          <Notification type="error" header={"Error: " + errorMessage} />,
          { placement: "topEnd" }
        );
      }
    }
    try {
      const token = await fetch(`${import.meta.env.VITE_API_URL}/client`, {
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
        <Notification type="error" header={"Error: " + errorMessage} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow w-full h-screen justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to={"/"} className="flex items-center space-x-3">
            <img
              src="/assets/HuellaPerro.webp"
              className="mx-auto h-48 w-auto"
              alt="Huella Logo"
            />
          </Link>
          <h2 className="-mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Inicio de sesión
          </h2>
        </div>

        <div className="mt-10 mx-3 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Correo electrónico
              </label>
              <div className="mt-2 px-3 flex w-full bg-white rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full text-gray-900 placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
                />
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
              </div>
              <div className="mt-2 bg-white px-3 flex w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPasswordHash(e.target.value)}
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
                INICIAR
              </button>
            </div>
          </form>

          <p className="pt-5 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link
              to="/sign-up"
              className="font-semibold leading-6 text-sky-500 hover:text-sky-200"
            >
              Registro
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
