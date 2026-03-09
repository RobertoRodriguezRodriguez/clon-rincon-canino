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

import Footer from "../components/footer";

import { getClient } from "../services/client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/navbar-admin";
import { CustomProvider } from "rsuite";

export default function ProfileAdminPage() {
  const [user, setUser] = useState(null);
  const [showClasses, setShowClasses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getClient(navigate).then((userData) => {
      if (userData.error) {
        navigate("/login");
      } else if (userData.id !== "1") {
        navigate("/profile-user");
      } else {
        setUser(userData);
      }
    });
  }, [navigate]);

  if (!user) return null;

  const toggleManagement = () => setShowClasses(!showClasses);

  return (
    <CustomProvider theme="dark">
      <div className="min-h-screen bg-[#101010] text-zinc-400 font-sans selection:bg-brand-cyan/30 selection:text-white overflow-x-hidden">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-cyan/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-violet/5 blur-[120px] rounded-full animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <NavbarAdmin />

        <main className="relative z-10 m-auto max-w-screen-xl w-full px-6 py-12 lg:py-20 space-y-24">
          {/* Header Section */}
          <AdminInfo />

          <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
              <div className="space-y-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">
                  Panel de Control
                </h2>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white italic">
                  Gestión de <span className="text-zinc-500">{showClasses ? "Clases" : "Estancias"}</span>
                </h3>
              </div>

              <button
                onClick={toggleManagement}
                className="relative group/btn flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-2xl transition-all duration-300 shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/10 to-brand-violet/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <span className="relative text-xs font-black uppercase tracking-widest text-zinc-300 group-hover/btn:text-white transition-colors">
                  {showClasses ? "Ir a Estancias" : "Ir a Clases"}
                </span>
                <svg className="relative w-4 h-4 text-brand-cyan group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {showClasses ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <DateManagement />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                      Próximas Clases
                    </h4>
                    <ClassList />
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-violet shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                      Reservas Grupales
                    </h4>
                    <GroupReservations />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <StayMaker />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                      Próximas Estancias
                    </h4>
                    <StayManagement />
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-violet shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                      Lista de Asistentes
                    </h4>
                    <StayClientsReservations />
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="pt-24 border-t border-white/5 space-y-24">
            <UserManagement />
            <PetsInfo />
            <UploadPhoto />
          </section>

          {/* Logout Footer */}
          <footer className="pt-12 pb-20 flex flex-col items-center gap-8 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("token");
                navigate("/login");
              }}
              className="group flex items-center gap-4 px-10 py-4 text-zinc-500 hover:text-red-400 transition-all duration-500"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-red-500/10 border border-white/5 group-hover:border-red-500/20 transition-all">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Cerrar Sesión Segura</span>
            </button>
            <Footer />
          </footer>
        </main>
      </div>
    </CustomProvider>
  );
}
