import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import UserInfo from "../components/client-profile/user-info";
import PetInfo from "../components/client-profile/pet-info";
import BookForm from "../components/client-profile/book-form";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import ReservationInfo from "../components/client-profile/reservation/reservation-info";
import ClientClassReservation from "../components/client-profile/client-class-reservation";
import Stay from "../components/client-profile/reservation/stay";
import UploadPetPhoto from "../components/client-profile/upload-photos-user";

import { getPet } from "../services/pet";
import { getClient } from "../services/client";
import { useReservClassesStore } from "../stores/reservation-store";

export default function ProfileUserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const { reloadReservClasses } = useReservClassesStore();

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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
        {/* Profile Card Section */}
        <UserInfo
          id={user.id}
          name={user.nombre}
          email={user.email}
          dni={user.dni}
          phone={user.telefono}
        />

        {pet?.id_cliente === user.id && (
          <PetInfo pet={pet} />
        )}

        <div className="space-y-12">
          {pet?.id ? (
            <>
              <ReservationInfo id_cliente={user.id} id_pet={pet.id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ClientClassReservation onReservationSuccess={() => reloadReservClasses(user.id)} />
                <Stay id_cliente={user.id} mascota={pet} userName={user.nombre} />
              </div>
            </>
          ) : (
            <div className="bg-[#161616] border border-white/5 rounded-3xl p-10 text-center shadow-xl">
              <p className="text-zinc-400 font-medium">Por favor, registra una mascota para continuar.</p>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center justify-center space-y-8 pt-8">
          {pet?.id_cliente === user.id ? (
            <UploadPetPhoto petId={pet.id} />
          ) : (
            <BookForm id_cliente={user.id} />
          )}

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("token");
              navigate("/login");
            }}
            className="group flex items-center space-x-2 text-zinc-500 hover:text-red-400 transition-colors duration-300 font-bold uppercase tracking-[0.2em] text-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-4 h-4 transform group-hover:rotate-12 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
