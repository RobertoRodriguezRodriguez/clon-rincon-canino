import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Notification,
  useToaster,
} from "rsuite";
import { useState, useEffect } from "react";
import { getStayAll, deleteStay, modStay } from "../../services/stay";

const { Column, HeaderCell, Cell } = Table;

export default function StayManagement() {
  const [stay, setStay] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cupo, setCupo] = useState("");

  useEffect(() => {
    reloadStay();
  }, []);

  const reloadStay = () => {
    getStayAll().then((stay) => {
      setStay(stay);
    });
  };

  const toaster = useToaster();

  const handleEdit = (stayToEdit) => {
    setSelectedStay(stayToEdit);
    setFechaInicio(stayToEdit.fecha_inicio);
    setFechaFin(stayToEdit.fecha_fin);
    setCupo(stayToEdit.cupo?.toString() ?? "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!fechaInicio || !fechaFin || cupo === "") {
      toaster.push(
        <Notification
          type="error"
          header="Por favor, completa todos los campos."
        />,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      await modStay(selectedStay.id, fechaInicio, fechaFin, parseInt(cupo));
      reloadStay();
      setShowModal(false);
    } catch (error) {
      console.error("Error al modificar la estancia:", error);
    }
  };

  const stays = stay.sort((b, a) => (a.fecha_inicio < b.fecha_inicio ? 1 : -1));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 ml-2">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-violet shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Periodos de Disponibilidad</h4>
      </div>

      <div className="relative overflow-hidden bg-[#161616] border border-white/5 rounded-[2.5rem] shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Check-In</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Check-Out</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Capacidad</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stays.map((stay) => (
                <tr key={stay.id} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-black uppercase tracking-widest text-brand-violet/80">{stay.fecha_inicio}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{stay.fecha_fin}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-zinc-400">
                      #{stay.cupo} Plazas
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(stay)}
                        className="p-2 text-zinc-500 hover:text-brand-violet hover:bg-brand-violet/10 rounded-xl transition-all"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={async () => {
                          await deleteStay(stay.id);
                          reloadStay();
                        }}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stays.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">
                    No hay periodos configurados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición */}
      <Modal open={showModal} onClose={() => setShowModal(false)} size="sm" className="custom-dark-modal">
        <Modal.Header className="pb-4 border-b border-white/5">
          <Modal.Title className="text-white font-black uppercase tracking-widest text-xs italic">
            Refinar <span className="text-brand-violet">Disponibilidad</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-8">
          <Form fluid className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Form.Group>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Entrada</label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={setFechaInicio}
                  className="!bg-[#1a1a1a] !border-white/10 !text-white"
                />
              </Form.Group>
              <Form.Group>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Salida</label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={setFechaFin}
                  className="!bg-[#1a1a1a] !border-white/10 !text-white"
                />
              </Form.Group>
            </div>
            <Form.Group>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Cupo Total</label>
              <Input
                type="number"
                value={cupo}
                onChange={setCupo}
                min={1}
                className="!bg-[#1a1a1a] !border-white/10 !text-white"
                placeholder="Ej: 20"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-brand-violet text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-violet-500 transition-colors shadow-lg"
          >
            Actualizar Periodo
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="w-full py-3 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
          >
            Cancelar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
