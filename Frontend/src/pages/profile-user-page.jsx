import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import UserInfo from "../components/client-profile/user-info";
import PetInfo from "../components/client-profile/pet-info";
import BookForm from "../components/client-profile/book-form";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import ReservationInfo from "../components/client-profile/reservation/reservation-info";
import IndividualClass from "../components/client-profile/reservation/individual-class";
import GroupClass from "../components/client-profile/reservation/group-class";
import Stay from "../components/client-profile/reservation/stay";
import UploadPetPhoto from "../components/client-profile/upload-photos-user";

import { getPet } from "../services/pet";
import { getClient } from "../services/client";

export default function ProfileUserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getClient(navigate);
        if (userData?.error) {
          navigate("/login");
        } else if (userData?.id === "1") {
          navigate("/profile-admin");
        } else {
          setUser(userData);

          const petData = await getPet(userData.id);
          setPet(petData || {}); // Asegura que pet nunca sea undefined
        }
      } catch (error) {
        console.error("Error al cargar datos del cliente o mascota:", error);
      }
    }

    fetchData();
  }, [navigate]);

  if (!user) {
    return <p>Cargando datos...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="m-auto max-w-screen-lg w-screen overflow-x-hidden">
        <UserInfo
          id={user.id}
          name={user.nombre}
          email={user.email}
          dni={user.dni}
          phone={user.telefono}
        />
        {pet?.id_cliente === user.id && (
          <>
            <PetInfo pet={pet} />
          </>
        ) }
        <hr className="h-px mb-8 bg-gray-200 border-2 shadow-2xl"></hr>
        {pet?.id ? (
          <>
            <ReservationInfo id_cliente={user.id} id_pet={pet.id} />
            <IndividualClass id_cliente={user.id} />
            <GroupClass id_cliente={user.id} />
            <Stay id_cliente={user.id} mascota={pet} userName={user.nombre}/>
          </>
        ) : (
          <p>Por favor, registra una mascota para continuar.</p>
        )}
        <hr className="h-px mb-8 mt-8 bg-gray-200 border-2 shadow-2xl"></hr>
        <div className="px-8 pb-10 space-y-2 text-center space-x-5">
        {pet?.id_cliente === user.id ? (
          <>
            <UploadPetPhoto petId={pet.id} /> 
          </>
        ) : (
          <BookForm id_cliente={user.id} />
        )}
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("token");
              navigate("/login");
            }}
            className="inline-flex items-center text-red-600 hover:text-white border border-red-600 hover:border-red-800 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-1 text-center"
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
                d="M6 18 18 6M6 6l12 12"
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
