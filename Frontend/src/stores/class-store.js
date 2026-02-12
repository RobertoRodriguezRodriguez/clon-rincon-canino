import { create } from "zustand";
import { getClass, getIndividualClass, getIndividualClassAvailable } from "../services/class"; 
import { getGroupReservations } from "../services/class_client"; 

export const useClassStore = create((set) => ({
  // **Clases**
  classes: [],

  setClasses: (classes) => {
    console.log("✅ Clases actualizadas en el estado:", classes);
    set({ classes: Array.isArray(classes) ? classes : [] });
  },

  reloadClasses: async () => {
    try {
      console.log("📌 Cargando clases...");
      const classes = await getClass();
      console.log("✅ Clases obtenidas:", classes);
      set({ classes: Array.isArray(classes) ? classes : [] });
    } catch (error) {
      console.error("❌ Error al cargar las clases:", error);
    }
  },

  // **Reservas Grupales**
  groupReservations: [],
  loadGroupReservations: async () => {
    try {
      console.log("📌 Cargando reservas grupales...");
      const reservations = await getGroupReservations();
      console.log("✅ Reservas grupales obtenidas:", reservations);

      if (Array.isArray(reservations)) {
        set({ groupReservations: reservations });
      } else {
        console.error("⚠️ Estructura inesperada en reservas grupales:", reservations);
      }
    } catch (error) {
      console.error("❌ Error al cargar reservas grupales:", error);
    }
  },

  // **Reservas Individuales (Administrador)**
  individualReservations: [],
  loadIndividualReservations: async () => {
    try {
      console.log("📌 Cargando reservas individuales (para ADMIN)...");
      const reservations = await getIndividualClass(); // ✅ Clases reservadas
      console.log("✅ Reservas individuales obtenidas:", reservations);

      if (Array.isArray(reservations)) {
        set({ individualReservations: reservations });
      } else {
        console.error("⚠️ Estructura inesperada en reservas individuales:", reservations);
      }
    } catch (error) {
      console.error("❌ Error al cargar reservas individuales:", error);
    }
  },

  // **Clases Individuales Disponibles (Usuarios)**
  availableIndividualClasses: [],
  loadAvailableIndividualClasses: async () => {
    try {
      console.log("📌 Cargando clases individuales DISPONIBLES...");
      const availableClasses = await getIndividualClassAvailable(); // ✅ Clases disponibles para reservar
      console.log("✅ Clases individuales disponibles obtenidas:", availableClasses);

      if (Array.isArray(availableClasses)) {
        set({ availableIndividualClasses: availableClasses });
      } else {
        console.error("⚠️ Estructura inesperada en clases individuales disponibles:", availableClasses);
      }
    } catch (error) {
      console.error("❌ Error al cargar clases individuales disponibles:", error);
    }
  },
}));
