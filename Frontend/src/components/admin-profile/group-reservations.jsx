import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Notification,
  useToaster,
  SelectPicker,
} from "rsuite";
import { useClassStore } from "../../stores/class-store";
import { editReservation } from "../../services/class_client";
import { getClientsInfo } from "../../services/client";
import { format } from "date-fns";

const { Column, HeaderCell, Cell } = Table;

export default function Reservations() {
  const {
    groupReservations,
    individualReservations,
    loadGroupReservations,
    loadIndividualReservations,
    classes,
    reloadClasses,
  } = useClassStore();

  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [clients, setClients] = useState([]);

  // Filtra solo los clientes activos y luego, si lo deseas, puedes ordenarlos
  const filteredClients = clients.filter((client) => client.activo);

  // console.log("clientes filtrados", filteredClients);

  const [newReservation, setNewReservation] = useState({
    id_clase: "",
    id_cliente: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  });

  const toaster = useToaster();

  useEffect(() => {
    loadGroupReservations();
    loadIndividualReservations();
    reloadClients();
    reloadClasses();
  }, [loadGroupReservations, loadIndividualReservations]);

  const reloadClients = async () => {
    try {
      const clients = await getClientsInfo();
      setClients(clients);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };

  const handleCreate = () => {
    setEditingReservation(null);
    setNewReservation({
      id_clase: "",
      id_cliente: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
    });
    setShowModal(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setNewReservation({ ...reservation });
    setShowModal(true);
  };

  const handleDelete = async (reservation) => {
    console.log("Reserva seleccionada para borrar:", reservation);

    try {
      const response = await fetch("/api/class_client", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_clase: reservation.id_clase,
          id_cliente: reservation.id_cliente,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud DELETE");
      }

      toaster.push(
        <Notification
          type="success"
          header="Reserva eliminada correctamente"
        />,
        { placement: "topEnd" }
      );
      loadGroupReservations();
      loadIndividualReservations();
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      toaster.push(
        <Notification type="error" header="Error al eliminar la reserva" />,
        { placement: "topEnd" }
      );
    }
  };

  const handleSave = async () => {
    const isEditing = !!editingReservation;
    if (
      !newReservation.id_clase ||
      !newReservation.id_cliente ||
      (isEditing &&
        (!newReservation.fecha ||
          !newReservation.hora_inicio ||
          !newReservation.hora_fin))
    ) {
      toaster.push(
        <Notification type="error" header="Faltan datos en la reserva" />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      if (editingReservation) {
        await editReservation(
          newReservation.id_clase,
          newReservation.id_cliente,
          newReservation.fecha,
          newReservation.hora_inicio,
          newReservation.hora_fin
        );

        toaster.push(
          <Notification
            type="success"
            header="Reserva actualizada correctamente"
          />,
          { placement: "topEnd" }
        );
      } else {
        // Nueva reserva
        const response = await fetch("/api/class_client", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReservation),
        });

        if (!response.ok) {
          throw new Error("Error en la solicitud POST");
        }

        toaster.push(
          <Notification type="success" header="Reserva creada correctamente" />,
          { placement: "topEnd" }
        );
      }

      setShowModal(false);
      loadGroupReservations();
      loadIndividualReservations();
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      toaster.push(
        <Notification type="error" header="Error al guardar la reserva" />,
        { placement: "topEnd" }
      );
    }
  };

  // console.log("reservas", groupReservations);
  // console.log("clases en group", classes);


  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">Gestión de Asistencia</h2>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Registro de <span className="text-zinc-500">Clases</span></h3>
        </div>
        <button
          onClick={handleCreate}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl hover:scale-[1.02]"
        >
          Nueva Inscripción
        </button>
      </div>

      {/* Group Reservations Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Sesiones Grupales</h4>
        </div>

        <div className="relative overflow-hidden bg-[#161616] border border-white/5 rounded-[2.5rem] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Cliente</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Programación</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Ventana de Tiempo</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groupReservations.map((res, idx) => (
                  <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white transition-colors group-hover/row:text-brand-cyan">{res.email_cliente}</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">Acceso Verificado</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-zinc-300 italic">
                        {format(new Date(res.fecha), "dd/MM/yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">{res.hora_inicio}</span>
                        <div className="w-4 h-[1px] bg-white/10" />
                        <span className="text-[10px] font-black text-brand-cyan uppercase">{res.hora_fin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(res)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Individual Reservations Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-violet shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Entrenamientos One-to-One</h4>
        </div>

        <div className="relative overflow-hidden bg-[#161616] border border-white/5 rounded-[2.5rem] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Cliente Especializado</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Día</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Horario Reservado</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {individualReservations.map((res, idx) => (
                  <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-zinc-200 group-hover/row:text-brand-violet transition-colors">{res.email_cliente}</td>
                    <td className="px-6 py-4 text-xs italic text-zinc-400">
                      {format(new Date(res.fecha), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-brand-violet uppercase tracking-widest">{res.hora_inicio} — {res.hora_fin}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(res)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} size="sm" className="custom-dark-modal">
        <Modal.Header className="pb-4 border-b border-white/5">
          <Modal.Title className="text-white font-black uppercase tracking-widest text-xs italic">
            Configurar <span className="text-brand-cyan">Reserva</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-8">
          <Form fluid className="space-y-6">
            {!editingReservation && (
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Seleccionar Sesión</label>
                  <SelectPicker
                    data={classes.map(c => ({
                      label: `${format(new Date(c.fecha), "dd/MM/yyyy")} | ${c.hora_inicio}`,
                      value: c.id || c.id_clase,
                    }))}
                    value={newReservation.id_clase}
                    onChange={v => setNewReservation({ ...newReservation, id_clase: v })}
                    block
                    className="custom-input-picker"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Asignar Cliente</label>
                  <SelectPicker
                    data={filteredClients.map(c => ({ label: c.nombre_cliente, value: c.id_cliente }))}
                    value={newReservation.id_cliente}
                    onChange={v => setNewReservation({ ...newReservation, id_cliente: v })}
                    block
                    className="custom-input-picker"
                  />
                </div>
              </div>
            )}

            {editingReservation && (
              <div className="space-y-4">
                <Form.Group>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Fecha Calendario</label>
                  <Input type="date" value={newReservation.fecha} onChange={v => setNewReservation({ ...newReservation, fecha: v })} className="!bg-[#1a1a1a] !border-white/10 !text-white" />
                </Form.Group>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Group>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Inicio</label>
                    <Input type="time" value={newReservation.hora_inicio} onChange={v => setNewReservation({ ...newReservation, hora_inicio: v })} className="!bg-[#1a1a1a] !border-white/10 !text-white" />
                  </Form.Group>
                  <Form.Group>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Término</label>
                    <Input type="time" value={newReservation.hora_fin} onChange={v => setNewReservation({ ...newReservation, hora_fin: v })} className="!bg-[#1a1a1a] !border-white/10 !text-white" />
                  </Form.Group>
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-brand-cyan text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-400 transition-colors"
          >
            Confirmar Reserva
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
