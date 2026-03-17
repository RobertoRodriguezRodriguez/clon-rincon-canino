import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Notification,
  useToaster,
  SelectPicker,
  Checkbox,
  DateRangePicker,
} from "rsuite";
import isBefore from "date-fns/isBefore";
import startOfDay from "date-fns/startOfDay";
import { format } from "date-fns";
import { useStayClientStore } from "../../stores/stay-store";
import { getClientsInfo } from "../../services/client";
import { getStayAll } from "../../services/stay";
import { formatDate } from "../client-profile/reservation/utils";

const { Column, HeaderCell, Cell } = Table;

// Utility for safe date formatting
const safeFormat = (date) => {
  if (!date || isNaN(new Date(date).getTime())) return "";
  return format(new Date(date), "yyyy-MM-dd");
};

export default function StayClientsReservations() {
  const {
    stayClients,
    loadStayClients,
    addStayClient,
    removeStayClient,
    updateStayClient,
  } = useStayClientStore();

  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [clients, setClients] = useState([]);
  const [stays, setStays] = useState([]);

  const [newReservation, setNewReservation] = useState({
    id_estancia: "",
    id_cliente: "",
    fecha_inicio: "",
    fecha_fin: "",
    nueva_id_estancia: "",
    nueva_id_cliente: "",
    lista_espera: false,
  });

  const toaster = useToaster();

  useEffect(() => {
    loadStayClients();
    reloadClients();
    reloadStays();
  }, [loadStayClients]);

  const reloadClients = async () => {
    try {
      const clientsData = await getClientsInfo();
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };

  const reloadStays = async () => {
    try {
      const stayData = await getStayAll();
      setStays(stayData || []);
    } catch (error) {
      console.error("Error al cargar estancias:", error);
    }
  };

  const handleCreate = () => {
    setEditingReservation(null);
    setNewReservation({
      id_estancia: "",
      id_cliente: "",
      fecha_inicio: "",
      fecha_fin: "",
      nueva_id_estancia: "",
      nueva_id_cliente: "",
      lista_espera: false,
    });
    setShowModal(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setNewReservation({
      id_estancia: reservation.id_estancia,
      id_cliente: reservation.id_cliente,
      fecha_inicio: reservation.fecha_inicio,
      fecha_fin: reservation.fecha_fin,
      nueva_id_estancia: reservation.id_estancia,
      nueva_id_cliente: reservation.id_cliente,
      lista_espera: !!reservation.lista_espera,
    });
    setShowModal(true);
  };

  const handleDelete = async (reservation) => {
    try {
      await removeStayClient(reservation.id_estancia, reservation.id_cliente);
      toaster.push(
        <Notification
          type="success"
          header="Relación eliminada correctamente"
        />,
        { placement: "topEnd" }
      );
      loadStayClients();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toaster.push(
        <Notification type="error" header="Error al eliminar la relación" />,
        { placement: "topEnd" }
      );
    }
  };

  const handleSave = async () => {
    const {
      id_estancia,
      id_cliente,
      nueva_id_cliente,
      fecha_inicio,
      fecha_fin,
      lista_espera,
    } = newReservation;

    if (!fecha_inicio || !fecha_fin || !nueva_id_cliente) {
      toaster.push(<Notification type="error" header="Faltan datos (fechas o cliente)" />, {
        placement: "topEnd",
      });
      return;
    }

    const selectedStayBlock = stays.find((s) => {
      const blockStart = startOfDay(new Date(s.fecha_inicio));
      const blockEnd = startOfDay(new Date(s.fecha_fin));
      const selStart = startOfDay(new Date(fecha_inicio));
      const selEnd = startOfDay(new Date(fecha_fin));

      return (
        (selStart >= blockStart || safeFormat(selStart) === safeFormat(blockStart)) &&
        (selEnd <= blockEnd || safeFormat(selEnd) === safeFormat(blockEnd))
      );
    });

    if (!selectedStayBlock) {
      toaster.push(
        <Notification
          type="error"
          header="El rango debe estar dentro de un periodo habilitado por el admin."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    const finalStayId = selectedStayBlock.id;

    try {
      if (editingReservation) {
        await updateStayClient(
          id_estancia,
          id_cliente,
          finalStayId,
          nueva_id_cliente,
          fecha_inicio,
          fecha_fin,
          lista_espera
        );
        toaster.push(
          <Notification type="success" header="Relación actualizada" />,
          { placement: "topEnd" }
        );
      } else {
        await addStayClient(
          finalStayId,
          nueva_id_cliente,
          fecha_inicio,
          fecha_fin,
          lista_espera
        );
        toaster.push(<Notification type="success" header="Relación creada" />, {
          placement: "topEnd",
        });
      }

      setShowModal(false);
      loadStayClients();
    } catch (error) {
      console.error("Error al guardar:", error);
      toaster.push(<Notification type="error" header="Error al guardar" />, {
        placement: "topEnd",
      });
    }
  };

  const filteredClients = clients.filter((client) => client.activo);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-violet">Logística de Estancia</h2>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Registro de <span className="text-zinc-500">Alojamiento</span></h3>
        </div>
        <button
          onClick={handleCreate}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl hover:scale-[1.02]"
        >
          Agendar Estancia
        </button>
      </div>

      <div className="relative overflow-hidden bg-[#161616] border border-white/5 rounded-[2.5rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/5 to-transparent pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Residente</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Periodo Reservado</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Estado de Cupo</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stayClients.map((res, idx) => {
                const client = clients.find(c => c.id_cliente === res.id_cliente);
                const stay = stays.find(s => s.id === res.id_estancia);
                return (
                  <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white transition-colors group-hover/row:text-brand-violet">
                          {client ? client.email : "—"}
                        </span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">Cliente Identificado</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            {format(new Date(res.fecha_inicio), "dd/MM/yyyy")}
                          </span>
                          <div className="w-4 h-[1px] bg-white/10" />
                          <span className="text-[10px] font-black text-brand-violet uppercase tracking-widest">
                            {format(new Date(res.fecha_fin), "dd/MM/yyyy")}
                          </span>
                        </div>
                        {stay && (
                          <span className="text-[8px] text-zinc-600 uppercase tracking-tighter mt-1 italic">
                            Periodo: {format(new Date(stay.fecha_inicio), "dd/MM/yyyy")} - {format(new Date(stay.fecha_fin), "dd/MM/yyyy")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${res.lista_espera ? 'bg-orange-400/10 text-orange-400' : 'bg-brand-violet/10 text-brand-violet'}`}>
                        {res.lista_espera ? 'Lista de Espera' : 'Confirmada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(res)} className="p-2 text-zinc-500 hover:text-brand-violet hover:bg-brand-violet/10 rounded-xl transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(res)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {stayClients.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">
                    Sin reservas activas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} size="sm" className="custom-dark-modal">
        <Modal.Header className="pb-4 border-b border-white/5">
          <Modal.Title className="text-white font-black uppercase tracking-widest text-xs italic">
            Configurar <span className="text-brand-violet">Alojamiento</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-8">
          <Form fluid className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Seleccionar Periodo (Entrada/Salida)</label>
                <DateRangePicker
                  block
                  format="dd/MM/yyyy"
                  value={
                    newReservation.fecha_inicio && !isNaN(new Date(newReservation.fecha_inicio).getTime())
                      ? [new Date(newReservation.fecha_inicio), new Date(newReservation.fecha_fin)]
                      : null
                  }
                  onChange={(val) => {
                    if (val && val[0] && val[1]) {
                      setNewReservation(prev => ({
                        ...prev,
                        fecha_inicio: safeFormat(val[0]),
                        fecha_fin: safeFormat(val[1])
                      }));
                    } else {
                      setNewReservation(prev => ({ ...prev, fecha_inicio: "", fecha_fin: "" }));
                    }
                  }}
                  shouldDisableDate={(date) => {
                    if (isBefore(date, startOfDay(new Date()))) return true;
                    if (!stays || stays.length === 0) return true;

                    const d = startOfDay(date);
                    return !stays.some((s) => {
                      const start = startOfDay(new Date(s.fecha_inicio));
                      const end = startOfDay(new Date(s.fecha_fin));
                      return (
                        (d >= start || safeFormat(d) === safeFormat(start)) &&
                        (d <= end || safeFormat(d) === safeFormat(end))
                      );
                    });
                  }}
                  className="custom-date-range-picker"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Asignar Cliente</label>
                <SelectPicker
                  data={filteredClients.map(c => ({ label: c.nombre_cliente || c.email, value: c.id_cliente }))}
                  value={newReservation.nueva_id_cliente}
                  onChange={v => setNewReservation(p => ({ ...p, nueva_id_cliente: v, ...(editingReservation ? {} : { id_cliente: v }) }))}
                  block
                  className="custom-input-picker"
                />
              </div>

              <div className="pt-2 px-2">
                <Checkbox
                  checked={!!newReservation.lista_espera}
                  onChange={(v, checked) => setNewReservation(p => ({ ...p, lista_espera: checked }))}
                  className="custom-checkbox"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mover a Lista de Espera</span>
                </Checkbox>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-brand-violet text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-violet-500 transition-colors shadow-lg"
          >
            Sincronizar Estancia
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="w-full py-3 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
          >
            Descartar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
