import { Table } from "rsuite";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// import { getReservations } from "../../../services/class_client";
import { getStayAll } from "../../../services/stay";
import { useReservClassesStore } from "../../../stores/reservation-store";
import { useStayClientStore } from "../../../stores/stay-store";

const { Column, HeaderCell, Cell } = Table;

ReservationInfo.propTypes = {
  id_cliente: PropTypes.string.isRequired,
  id_pet: PropTypes.string.isRequired,
};

export default function ReservationInfo({ id_cliente, id_pet }) {
  const { reservations, reloadReservClasses } = useReservClassesStore();
  const { stayClients, loadStayClients } = useStayClientStore();

  const [stays, setStays] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reloadReservClasses(id_cliente);
    loadStayClients();

    const fetchStays = async () => {
      try {
        const allStays = await getStayAll();
        setStays(allStays);
      } catch (error) {
        console.error("Error al cargar bloques de estancia:", error);
      }
    };

    fetchStays();
  }, [id_cliente, id_pet, loadStayClients, reloadReservClasses]);

  // Filtrar las reservas de estancia de este cliente específico
  const myStayReservations = stayClients.filter(
    (sc) => String(sc.id_cliente) === String(id_cliente)
  );

  const getData = (data) => {
    if (sortColumn && sortType) {
      return [...data].sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (sortType === "asc") {
          return x > y ? 1 : -1;
        } else {
          return x < y ? 1 : -1;
        }
      });
    }
    return data;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Classes Table Card */}
      <div className="bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <h2 className="text-xl font-black tracking-tight text-white uppercase italic">
            Próximas <span className="text-brand-cyan">Clases</span>
          </h2>
          <div className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">Agendado</span>
          </div>
        </div>

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Fecha</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Horario</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {getData(reservations).map((res, idx) => (
                <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 text-sm font-bold text-zinc-200">{res.fecha}</td>
                  <td className="py-4 text-sm font-bold text-zinc-200">
                    {res.hora_inicio} - {res.hora_fin}
                  </td>
                  <td className="py-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${(res.cupo_original || res.cupo) === 1
                      ? "bg-brand-cyan/10 text-brand-cyan"
                      : "bg-brand-violet/10 text-brand-violet"
                      }`}>
                      {(res.cupo_original || res.cupo) === 1 ? "Individual" : "Grupal"}
                    </span>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs italic">
                    Sin clases próximas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stays Table Card */}
      <div className="bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <h2 className="text-xl font-black tracking-tight text-white uppercase italic">
            Tus <span className="text-brand-violet">Estancias</span>
          </h2>
          <div className="px-3 py-1 bg-brand-violet/10 border border-brand-violet/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-violet">Reserva</span>
          </div>
        </div>

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Check-In</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Check-Out</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {getData(myStayReservations).map((res, idx) => (
                <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 text-sm font-bold text-zinc-200">{res.fecha_inicio}</td>
                  <td className="py-4 text-sm font-bold text-zinc-200">{res.fecha_fin}</td>
                  <td className="py-4 text-sm font-bold text-zinc-300 text-right">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${res.lista_espera ? 'bg-orange-500/10 text-orange-500' : 'bg-brand-violet/10 text-brand-violet'}`}>
                      {res.lista_espera ? 'Espera' : 'Confirmado'}
                    </span>
                  </td>
                </tr>
              ))}
              {myStayReservations.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs italic">
                    Sin estancias reservadas
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
