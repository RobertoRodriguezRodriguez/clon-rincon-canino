import {
  List,
  FlexboxGrid,
  Button,
  Modal,
  Form,
  Input,
  useToaster,
  Notification
} from "rsuite";
import { useState, useEffect } from "react";
import { deleteClass, updateClass } from "../../services/class";
import { useClassStore } from "../../stores/class-store";
import { format } from "date-fns";

// Función para obtener el día de la semana a partir de una fecha
function setDay(fecha) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const date = new Date(fecha);
  return days[date.getDay()];
}

export default function ClassList() {
  const { classes, setClasses, reloadClasses } = useClassStore();
  const [showModal, setShowModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  const toaster = useToaster();

  useEffect(() => {
    reloadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (class_) => {
    // console.log("Clase seleccionada para editar:", class_);
    setCurrentClass(class_);
    setShowModal(true); // Cambiar a true para mostrar el modal
    // console.log("showModal:", showModal); // Verifica que el estado se actualiza correctamente
  };

  const handleModalClose = () => {
    // console.log("Cerrando el modal");
    setShowModal(false);
    setCurrentClass(null);
  };

  const handleUpdate = async () => {
    if (currentClass) {
      try {
        // Actualizar clase en el backend
        await updateClass(currentClass.id, {
          calendar: currentClass.fecha,
          startTime: currentClass.hora_inicio,
          endTime: currentClass.hora_fin,
          places: currentClass.cupo,
        });

        // Actualizar el estado localmente sin depender de reloadClasses
        const updatedClasses = classes.map((class_) =>
          class_.id === currentClass.id ? currentClass : class_
        );

        setClasses(updatedClasses); // Actualiza el estado de clases
        setShowModal(false);
        setCurrentClass(null);
      } catch (error) {
        console.error("Error al actualizar la clase:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden bg-[#161616] border border-white/5 rounded-[2rem] shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Día</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Fecha</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Horario</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Cupo</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {classes.map((class_) => (
                <tr key={class_.id} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-black uppercase tracking-widest text-brand-cyan/80">{setDay(class_.fecha)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigator.clipboard
                          .writeText(class_.id)
                          .then(() => {
                            toaster.push(
                              <Notification type="success" header="ID copiado" />,
                              { placement: "topEnd" }
                            );
                          })
                      }
                      className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                      title="Copiar ID"
                    >
                      {format(new Date(class_.fecha), "dd/MM/yyyy")}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-zinc-300">
                    {class_.hora_inicio} — {class_.hora_fin}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-zinc-400">
                      #{class_.cupo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const updatedClasses = await deleteClass(class_.id);
                            if (updatedClasses) setClasses(updatedClasses);
                          } catch (error) {
                            console.error("Error al eliminar clase:", error);
                          }
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
              {classes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">
                    No hay clases programadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar clase */}
      <Modal open={showModal} onClose={() => setShowModal(false)} size="sm" className="custom-dark-modal">
        <Modal.Header className="border-b border-white/5 pb-4">
          <Modal.Title className="text-white font-black uppercase tracking-widest text-xs">
            Refinar <span className="text-brand-cyan">Sesión</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-8">
          {currentClass && (
            <Form fluid className="space-y-6">
              <div className="space-y-4">
                <Form.Group>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Fecha Programa</label>
                  <Input
                    type="date"
                    value={currentClass.fecha}
                    onChange={(value) => setCurrentClass({ ...currentClass, fecha: value })}
                    className="!bg-[#1a1a1a] !border-white/10 !text-white"
                  />
                </Form.Group>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Group>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Apertura</label>
                    <Input
                      type="time"
                      value={currentClass.hora_inicio}
                      onChange={(value) => setCurrentClass({ ...currentClass, hora_inicio: value })}
                      className="!bg-[#1a1a1a] !border-white/10 !text-white"
                    />
                  </Form.Group>
                  <Form.Group>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Cierre</label>
                    <Input
                      type="time"
                      value={currentClass.hora_fin}
                      onChange={(value) => setCurrentClass({ ...currentClass, hora_fin: value })}
                      className="!bg-[#1a1a1a] !border-white/10 !text-white"
                    />
                  </Form.Group>
                </div>
                <Form.Group>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Capacidad de Cupo</label>
                  <Input
                    type="number"
                    value={currentClass.cupo}
                    onChange={(value) => setCurrentClass({ ...currentClass, cupo: value })}
                    disabled={currentClass.cupo == 1}
                    className="!bg-[#1a1a1a] !border-white/10 !text-white"
                  />
                </Form.Group>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t border-white/5 pt-4">
          <button
            onClick={handleUpdate}
            className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-violet text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] transition-all"
          >
            Sincronizar Cambios
          </button>
          <button
            onClick={handleModalClose}
            className="w-full py-3 mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Cancelar Operación
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
