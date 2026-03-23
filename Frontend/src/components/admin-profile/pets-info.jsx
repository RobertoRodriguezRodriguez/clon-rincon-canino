import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Notification,
  useToaster,
} from "rsuite";
import { useState, useEffect } from "react";
import { getPetsInfo, deletePet, updatePetInfo } from "../../services/pet";

const { Column, HeaderCell, Cell } = Table;

export default function PetsInfo() {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [castrado, setCastrado] = useState(false);
  const [vacunas, setVacunas] = useState(false);
  const [condicionEspecial, setCondicionEspecial] = useState(false);
  const [sociable, setSociable] = useState(false);

  const toaster = useToaster();

  const filteredPets = pets
    .filter((pet) =>
      pet.nombre_mascota.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.nombre_mascota < b.nombre_mascota ? -1 : 1));

  useEffect(() => {
    getPetsInfo().then((pets) => {
      // console.log(pets); // Verifica los datos de las mascotas
      setPets(pets);
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      try {
        await deletePet(id);
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
      } catch (error) {
        console.error("Error al eliminar la mascota:", error);
      }
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setNombre(pet.nombre_mascota);
    setEdad(pet.edad);
    setCastrado(pet.castrado);
    setVacunas(pet.vacunas);
    setCondicionEspecial(pet.condicion_especial);
    setSociable(pet.sociable);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nombre || !edad) {
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
      await updatePetInfo(
        selectedPet.id,
        nombre,
        parseInt(edad),
        castrado,
        vacunas,
        condicionEspecial,
        sociable
      );

      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.id === selectedPet.id
            ? {
              ...pet,
              nombre_mascota: nombre,
              edad: parseInt(edad),
              castrado,
              vacunas,
              condicion_especial: condicionEspecial,
              sociable,
            }
            : pet
        )
      );

      setShowModal(false); // Cerrar modal después de guardar
    } catch (error) {
      console.error("Error al actualizar la mascota:", error);
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toaster.push(
          <Notification type="success" header="ID copiado al portapapeles" />,
          { placement: "topEnd" }
        );
      })
      .catch((error) => {
        console.error("Error al copiar al portapapeles: ", error);
      });
  };

  // console.log(filteredPets[0]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">Censo de Compañeros</h2>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Registro de <span className="text-zinc-500">Mascotas</span></h3>
        </div>
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-zinc-500 group-hover:text-brand-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Input
            placeholder="UBICAR POR NOMBRE..."
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
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mascota</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Edad</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Salud & Perfil</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Propietario</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPets.map((pet) => (
                <tr key={pet.id} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span
                        className="text-xs font-black uppercase tracking-widest text-white group-hover/row:text-brand-cyan cursor-pointer transition-colors"
                        onClick={() => copyToClipboard(pet.id)}
                      >
                        {pet.nombre_mascota}
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase tracking-tighter italic">ID Verificado</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-zinc-400">{pet.edad} <span className="text-[10px] font-black uppercase text-zinc-600 ml-1">Años</span></span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {pet.castrado ? <span className="px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan text-[8px] font-black uppercase rounded">Castrado</span> : ""}
                      {pet.vacunas ? <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded">Vacunado</span> : ""}
                      {pet.sociable ? <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[8px] font-black uppercase rounded">Sociable</span> : ""}
                      {pet.condicion_especial ? <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[8px] font-black uppercase rounded">C. Especial</span> : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">
                    {pet.nombre_cliente}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-40 group-hover/row:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(pet)}
                        className="p-2 text-zinc-500 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-xl transition-all"
                        title="Editar Perfil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        title="Remover"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPets.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">
                    No se localizaron mascotas con ese criterio
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
            Refinar Perfil <span className="text-brand-cyan">Canino</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-8">
          <Form fluid className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Form.Group>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Nombre</label>
                <Input
                  value={nombre}
                  onChange={setNombre}
                  className="!bg-[#1a1a1a] !border-white/10 !text-white"
                />
              </Form.Group>
              <Form.Group>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Edad</label>
                <Input
                  type="number"
                  value={edad}
                  onChange={setEdad}
                  className="!bg-[#1a1a1a] !border-white/10 !text-white"
                />
              </Form.Group>
            </div>

            <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={castrado}
                  onChange={() => setCastrado(!castrado)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-cyan focus:ring-brand-cyan/30 focus:ring-offset-0"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Castrado</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={vacunas}
                  onChange={() => setVacunas(!vacunas)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-cyan focus:ring-brand-cyan/30 focus:ring-offset-0"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vacunado</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={sociable}
                  onChange={() => setSociable(!sociable)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-cyan focus:ring-brand-cyan/30 focus:ring-offset-0"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sociable</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={condicionEspecial}
                  onChange={() => setCondicionEspecial(!condicionEspecial)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-cyan focus:ring-brand-cyan/30 focus:ring-offset-0"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Especial</span>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-brand-cyan text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-400 transition-colors shadow-lg"
          >
            Sincronizar Datos
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
