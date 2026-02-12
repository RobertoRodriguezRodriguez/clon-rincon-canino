import { create } from 'zustand'
import { getReservations } from '../services/class_client';
import { getStayClientAll } from '../services/stay_client';

export const useReservClassesStore = create((set) => ({
  reservations: [],
  reloadReservClasses: async (id_cliente) => {
    try {
      const reservations = await getReservations(id_cliente);
      set({ reservations });
      console.log("Reservas de clases actualizadas:", reservations);
    } catch (error) {
      console.error("Error al cargar reservas de clases:", error);
    }
  },
}));

export const useStayPetStore = create((set) => ({
  stays: [],
  reloadStays: async (id_pet) => {
    try {
      const stays = await getStayClientAll(id_pet);
      set({ stays });
      console.log("Estancias actualizadas:", stays);
    } catch (error) {
      console.error("Error al cargar estancias:", error);
    }
  },
}));
