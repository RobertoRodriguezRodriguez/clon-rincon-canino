// stores/stay-store.js
import { create } from "zustand";
import {
  getStayClients,
  createStayClient,
  deleteStayClient,
  getStayClientAll,
  updateStayClient,
} from "../services/stay_client";

export const useStayClientStore = create((set) => ({
  // Lista de estancias-clientes
  stayClients: [],

  // Cargar todas las relaciones estancia-cliente
  loadStayClients: async () => {
    try {
      console.log("📌 Cargando estancias-clientes...");
      const data = await getStayClientAll();
      console.log("✅ Estancias-clientes obtenidas:", data);

      if (Array.isArray(data)) {
        set({ stayClients: data });
      } else {
        console.error("⚠️ Estructura inesperada en stayClients:", data);
      }
    } catch (error) {
      console.error("❌ Error al cargar estancias-clientes:", error);
    }
  },

  // Crear una nueva relación estancia-cliente
  addStayClient: async (id_estancia, id_cliente, fecha_inicio, fecha_fin, lista_espera = false) => {
    try {
      console.log("📌 Creando estancia-cliente...");
      console.log("Datos:", id_estancia, id_cliente, fecha_inicio, fecha_fin, lista_espera);
      const newEntry = await createStayClient(
        id_estancia,
        id_cliente,
        fecha_inicio,
        fecha_fin,
        lista_espera
      );
      console.log("✅ Estancia-cliente creada:", newEntry);

      if (newEntry) {
        set((state) => ({
          stayClients: [...state.stayClients, newEntry],
        }));
      }
    } catch (error) {
      console.error("❌ Error al crear estancia-cliente:", error);
    }
  },

  // Eliminar una relación estancia-cliente
  removeStayClient: async (id_estancia, id_cliente) => {
    try {
      console.log("📌 Eliminando estancia-cliente...");
      const result = await deleteStayClient(id_estancia, id_cliente);
      console.log("✅ Estancia-cliente eliminada:", result);

      if (result?.success || !result?.error) {
        set((state) => ({
          stayClients: state.stayClients.filter(
            (item) =>
              item.id_estancia !== id_estancia || item.id_cliente !== id_cliente
          ),
        }));
      }
    } catch (error) {
      console.error("❌ Error al eliminar estancia-cliente:", error);
    }
  },

  // Actualizar una relación estancia-cliente
  updateStayClient: async (
    id_estancia,
    id_cliente,
    nueva_id_estancia,
    nueva_id_cliente,
    fecha_inicio,
    fecha_fin,
    lista_espera
  ) => {
    try {
      console.log("📌 Actualizando estancia-cliente...");

      // Llamada a la función que se comunica con el servidor
      const updatedEntry = await updateStayClient(
        id_estancia,
        id_cliente,
        nueva_id_estancia,
        nueva_id_cliente,
        fecha_inicio,
        fecha_fin,
        lista_espera
      );
      console.log("✅ Estancia-cliente actualizada:", updatedEntry);

      // Si la actualización fue exitosa, actualizamos el estado
      if (updatedEntry && !updatedEntry.error) {
        set((state) => ({
          stayClients: state.stayClients.map((item) =>
            item.id_estancia === id_estancia && item.id_cliente === id_cliente
              ? { ...item, ...updatedEntry } // Actualiza el item con los nuevos valores
              : item
          ),
        }));
      } else {
        console.error("❌ Error en la actualización:", updatedEntry.error);
      }
    } catch (error) {
      console.error("❌ Error al actualizar estancia-cliente:", error);
    }
  },
}));
