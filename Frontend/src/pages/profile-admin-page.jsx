import AdminInfo from "../components/admin-profile/admin-info";
import PetsInfo from "../components/admin-profile/pets-info";
import UploadPhoto from "../components/admin-profile/upload-photos";

import DateManagement from "../components/admin-profile/date-management";
import UserManagement from "../components/admin-profile/user-management";
import StayManagement from "../components/admin-profile/stay-management";
import ClassList from "../components/admin-profile/class-list";
import GroupReservations from "../components/admin-profile/group-reservations"; 
import StayMaker from "../components/admin-profile/stay-maker";
import StayClientsReservations from "../components/admin-profile/stay-reservations";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { getClient } from "../services/client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/navbar-admin";

export default function ProfileAdminPage() {
  const [user, setUser] = useState(null);
  const [showClasses, setShowClasses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los datos del usuario actual
    getClient(navigate).then((user) => {
      setUser(user);
    });
  }, [navigate]);

  if (!user) {
    return null; // Retorna null si los datos del usuario aún no están disponibles
  }

  if (user.error) {
    navigate("/login"); // Redirigir al login si hay un error con los datos del usuario
  }

  if (user.id !== "1") {
    navigate("/profile-user"); // Redirigir al perfil de usuario si no es un administrador
  }

  // Función para alternar entre clases y estancias
  const toggleManagement = () => {
    setShowClasses(!showClasses);
  };

  return (
    <>
      <NavbarAdmin />
      <div className="m-auto max-w-screen-lg w-full">
        {/* Información general del administrador */}
        <AdminInfo />
        <hr className="h-px my-8 bg-gray-200 border-2 shadow-2xl"></hr>

        <div>
          <button
            onClick={toggleManagement}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
          >
            {showClasses
              ? "Mostrar Gestión de Estancias"
              : "Mostrar Gestión de Clases"}
          </button>

          {/* Título alternativo entre "Gestión de clases" y "Gestión de estancias" */}
          <h2 className="mb-3 px-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
            {showClasses ? "Gestión de clases" : "Gestión de estancias"}
          </h2>

          {/* Contenido alternativo */}
          {showClasses ? (
            <>
              <DateManagement />
              <div className="px-4 pt-2">
                <h2 className="text-lg pb-4">Próximas clases</h2>
                <ClassList />
                <hr className="h-px my-8 bg-gray-200 border-2 shadow-2xl"></hr>
                <GroupReservations />{" "}
              </div>
            </>
          ) : (
            <>
              <StayMaker />
              <div className="px-4 pt-2">
                <h2 className="text-lg pb-4">Próximas estancias</h2>
                <StayManagement />
                <hr className="h-px my-8 bg-gray-200 border-2 shadow-2xl"></hr>
                {/* Asistencia a las estancias */}
                <StayClientsReservations />
              </div>
            </>
          )}
        </div>

        {/* Nuevo componente: Gestión de reservas grupales */}
        <div className="px-4">
          {/* Componente para mostrar reservas grupales */}
        </div>

        {/* Gestión de usuarios */}
        <UserManagement />

        {/* Gestión de mascotas */}
        <PetsInfo />

        {/* Subida de fotos */}
        <UploadPhoto />

        {/* Botón de cerrar sesión */}
        <div className="px-8 pb-10 space-y-2 text-center space-x-5">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("token"); // Eliminar token de sesión
              navigate("/login"); // Redirigir al login
            }}
            className="inline-flex items-center text-red-600 hover:text-white hover:bg-red-700 border border-red-600 focus:ring-2 focus:outline-none focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-1 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-1.5 -ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
