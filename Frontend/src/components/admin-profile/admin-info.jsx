import { useState, useEffect } from "react";
import ChangePasswordForm from "./change-password-form";
import { getClient, changePassword } from "../../services/client";
import { Notification, useToaster, Input } from "rsuite";

export default function AdminInfo() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRepeatPassword, setAdminRepeatPassword] = useState("");
  const [client, setClient] = useState({
    dni: "",
    email: "",
  });

  const toaster = useToaster();

  useEffect(() => {
    // Obtener los datos del cliente (admin) al montar el componente
    getClient().then((clientData) => {
      setClient(clientData); // Asignar datos al estado
    });
  }, []);

  const handleAdminPasswordChange = async (e) => {
    e.preventDefault();

    if (!client.email) {
      toaster.push(
        <Notification type="error" header="No se pudo obtener el email del administrador." />,
        { placement: "topEnd" }
      );
      return;
    }

    if (!adminPassword || !adminRepeatPassword) {
      toaster.push(
        <Notification type="error" header="Introduce la nueva contraseña en ambos campos." />,
        { placement: "topEnd" }
      );
      return;
    }

    if (adminPassword !== adminRepeatPassword) {
      toaster.push(
        <Notification type="error" header="Las contraseñas no coinciden." />,
        { placement: "topEnd" }
      );
      return;
    }

    if (adminPassword.length < 5 || adminPassword.length > 16) {
      toaster.push(
        <Notification type="error" header="La contraseña debe tener entre 5 y 16 caracteres." />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      console.log("Cambiando contraseña para email:", client.email);
      await changePassword(client.email, adminPassword);
      toaster.push(
        <Notification type="success" header="Tu contraseña ha sido actualizada con éxito." />,
        { placement: "topEnd" }
      );
      setAdminPassword("");
      setAdminRepeatPassword("");
      setShowAdminForm(false);
    } catch (error) {
      console.error("Error al cambiar contraseña del admin:", error);
      toaster.push(
        <Notification type="error" header={`Error: ${error.message}`} />,
        { placement: "topEnd" }
      );
    }
  };

  return (
    <section className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/10 to-brand-violet/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />

      <div className="relative bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">
                Administrador de Sistema
              </h2>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                Nazaret <span className="text-zinc-500">Linares Ferre</span>
              </h3>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 pt-8 border-t border-white/5">
              <div className="space-y-1">
                <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">DNI de Seguridad</dt>
                <dd className="text-lg font-bold text-zinc-200">{client.dni || "—"}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Email Corporativo</dt>
                <dd className="text-lg font-bold text-zinc-200">{client.email || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-3 min-w-[240px]">
            <button
              type="button"
              onClick={() => {
                setShowAdminForm(!showAdminForm);
                if (showClientForm) setShowClientForm(false);
              }}
              className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-2xl transition-all duration-300 group/btn"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zinc-500 group-hover/btn:text-brand-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white transition-colors">Mi Seguridad</span>
              </div>
              <svg className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${showAdminForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowClientForm(!showClientForm);
                if (showAdminForm) setShowAdminForm(false);
              }}
              className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-2xl transition-all duration-300 group/btn"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zinc-500 group-hover/btn:text-brand-violet transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-white transition-colors">Ajustar Clientes</span>
              </div>
              <svg className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${showClientForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic Forms Area */}
        <div className={`grid transition-all duration-500 ease-in-out ${showAdminForm || showClientForm ? 'grid-rows-[1fr] opacity-100 mt-12' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
          <div className="overflow-hidden">
            <div className="pt-8 border-t border-white/5">
              {showAdminForm && (
                <form className="max-w-md space-y-6 animate-in fade-in slide-in-from-top-4 duration-500" onSubmit={handleAdminPasswordChange}>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase italic">Actualizar Credenciales</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Cambia tu clave de acceso al sistema</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Nueva Contraseña</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-3 !text-white focus:!border-brand-cyan transition-all"
                        value={adminPassword}
                        onChange={setAdminPassword}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Confirmar Contraseña</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="!bg-[#1a1a1a] !border-white/10 !rounded-xl !py-3 !text-white focus:!border-brand-cyan transition-all"
                        value={adminRepeatPassword}
                        onChange={setAdminRepeatPassword}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="relative w-full py-3 bg-brand-cyan text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  >
                    Actualizar Cuenta
                  </button>
                </form>
              )}

              {showClientForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <ChangePasswordForm adminEmail={client.email} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
