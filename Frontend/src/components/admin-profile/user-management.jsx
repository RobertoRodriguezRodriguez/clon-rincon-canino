import { Table, Button, Input, Notification, useToaster } from "rsuite";
import { useState, useEffect } from "react";

import {
  getClientsInfo,
  deleteClient,
  activeClient,
  desactivateClient
} from "../../services/client";

import { deleteReservation } from "../../services/class_client";
import { deleteStay } from "../../services/stay";

const { Column, HeaderCell, Cell } = Table;

export default function UserManagement() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toaster = useToaster();

  // Filtrar los clientes por nombre y ordenar los activos primero.
  const filteredClients = clients
    .filter((client) =>
      client.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1));

  // Cargar los clientes al montar el componente.
  useEffect(() => {
    reloadClients();
  }, []);

  const reloadClients = async () => {
    try {
      const clients = await getClientsInfo();
      setClients(clients);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };


  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">Gobernanza de Red</h2>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Directorio de <span className="text-zinc-500">Usuarios</span></h3>
        </div>
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-zinc-500 group-hover:text-brand-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Input
            placeholder="FILTRAR POR NOMBRE..."
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            className="!bg-white/[0.03] !border-white/5 !rounded-2xl !pl-10 !py-6 !text-[10px] !font-black !uppercase !tracking-[0.2em] !text-white focus:!border-brand-cyan/30 transition-all placeholder:text-zinc-600"
          />
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#161616] border border-white/5 rounded-[2.5rem] shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Identidad</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Contacto</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mascota Principal</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Autoridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id_cliente} className={`group/row transition-colors ${client.activo ? 'hover:bg-white/[0.02]' : 'bg-black/20'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span
                        className={`text-xs font-black uppercase tracking-widest cursor-pointer transition-colors ${client.activo ? 'text-white group-hover/row:text-brand-cyan' : 'text-zinc-600'}`}
                        onClick={() => {
                          navigator.clipboard.writeText(client.id_cliente);
                          toaster.push(<Notification type="success" header="ID Sincronizado" />, { placement: "topEnd" });
                        }}
                      >
                        {client.nombre_cliente}
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase tracking-tighter">DNI: {client.dni}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-[10px] font-bold cursor-pointer transition-colors ${client.activo ? 'text-zinc-400 hover:text-white' : 'text-zinc-700'}`}
                        onClick={() => {
                          navigator.clipboard.writeText(client.email);
                          toaster.push(<Notification type="success" header="Email Copiado" />, { placement: "topEnd" });
                        }}
                      >
                        {client.email}
                      </span>
                      <span className={`text-[10px] ${client.activo ? 'text-zinc-500' : 'text-zinc-800'}`}>{client.telefono}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {client.nombre_mascota ? (
                      <span className={`px-2 py-0.5 bg-white/5 rounded text-[10px] font-black uppercase ${client.activo ? 'text-zinc-400' : 'text-zinc-800'}`}>
                        {client.nombre_mascota}
                      </span>
                    ) : <span className="text-[10px] text-zinc-800 uppercase italic">Sin Registro</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${client.activo ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500/50'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${client.activo ? 'text-emerald-400' : 'text-red-500/50'}`}>
                        {client.activo ? 'ACTIVO' : 'Sancionado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                      {client.activo ? (
                        <button
                          onClick={async () => {
                            await desactivateClient(client.id_cliente);
                            reloadClients();
                          }}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          title="Suspender"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await activeClient(client.id_cliente);
                            reloadClients();
                          }}
                          className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all"
                          title="Rehabilitar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await deleteClient(client.id_cliente);
                          reloadClients();
                        }}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all"
                        title="Borrado Permanente"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">
                    Sin coincidencias en el registro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
