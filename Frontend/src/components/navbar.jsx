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
    <nav className="bg-white shadow-lg shadow-indigo-100 fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto sm:p-3 p-2">
        <div
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/assets/HuellaPerro.webp"
            className="h-10 sm:h-12"
            alt="Huella Logo"
          />
          <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap">
            RincónCanino
          </span>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {token === null ? (
          <button
            type="button"
            onClick={() => {
              navigate("/login");
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 sm:py-2 py-1.5 text-center"
          >
            Iniciar
          </button>
          ) : (
          <button
            type="button"
            onClick={() => {
              navigate("/profile-user");
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 sm:py-2 py-1.5 text-center"
          >
            Volver
          </button>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            onClick={() => {
              document
                .getElementById("navbar-sticky")
                .classList.toggle("hidden");

              if (
                document
                  .getElementById("navbar-sticky")
                  .classList.contains("hidden")
              ) {
                document
                  .getElementById("navbar-sticky")
                  .setAttribute("aria-expanded", "false");
              } else {
                document
                  .getElementById("navbar-sticky")
                  .setAttribute("aria-expanded", "true");
              }
            }}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to="/photos"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >
                Fotos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
