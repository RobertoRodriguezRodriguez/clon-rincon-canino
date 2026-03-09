import { Table } from "rsuite";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// import { getReservations } from "../../../services/class_client";
import { getStayAll } from "../../../services/stay";
import { useReservClassesStore } from "../../../stores/reservation-store";

const { Column, HeaderCell, Cell } = Table;

ReservationInfo.propTypes = {
  id_cliente: PropTypes.string.isRequired,
  id_pet: PropTypes.string.isRequired,
};

export default function ReservationInfo({ id_cliente, id_pet }) {
  const { reservations, reloadReservClasses } = useReservClassesStore();

  const [stays, setStays] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);

  const getData = (data) => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
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

  useEffect(() => {
    reloadReservClasses(id_cliente);

    const fetchStays = async () => {
      try {
        const allStays = await getStayAll();
        console.log("Estancias obtenidas:", allStays); // Depuración: verificar datos
        setStays(allStays);
      } catch (error) {
        console.error("Error al cargar estancias:", error);
      }
    };

    fetchStays();
  }, [id_cliente, id_pet]);

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  // console.log("Reservas de clases:", reservations);
  // console.log("Estancias disponibles:", stays);

  return (
    <div className="sm:flex">
      <div className="m-auto w-full max-w-screen-lg px-4">
        <h2 className="my-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
          Próximas clases
        </h2>
        <Table
          height={250}
          data={getData(reservations)}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          loading={loading}
        >
          <Column width={140} fixed sortable>
            <HeaderCell>Fecha</HeaderCell>
            <Cell dataKey="fecha" />
          </Column>

          <Column width={145} sortable>
            <HeaderCell>Hora inicio</HeaderCell>
            <Cell dataKey="hora_inicio" />
          </Column>

          <Column width={154} sortable>
            <HeaderCell>Hora fin</HeaderCell>
            <Cell dataKey="hora_fin" />
          </Column>

          <Column width={140} sortable>
            <HeaderCell>Tipo</HeaderCell>
            <Cell>
              {(rowData) => ((rowData.cupo_original || rowData.cupo) === 1 ? "Individual" : "Grupal")}
            </Cell>
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Cupo</HeaderCell>
            <Cell dataKey="cupo" />
          </Column>
        </Table>
      </div>

      <div className="m-auto sm:w-8/12 max-w-screen-lg pt-8 sm:pt-0 px-4">
        <h2 className="my-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
          Próximas estancias
        </h2>
        <Table
          height={250}
          data={getData(stays)}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          loading={loading}
        >
          <Column width={190} fixed sortable>
            <HeaderCell>Fecha entrada</HeaderCell>
            <Cell dataKey="fecha_inicio" />
          </Column>

          <Column width={190} sortable>
            <HeaderCell>Fecha salida</HeaderCell>
            <Cell dataKey="fecha_fin" />
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Cupo</HeaderCell>
            <Cell dataKey="cupo" />
          </Column>
        </Table>
      </div>
    </div>
  );
}
