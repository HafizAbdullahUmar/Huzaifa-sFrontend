import { create } from "zustand";

const warehouseStore = (set) => ({
  host: "http://192.168.10.2:5000",
  items: [],
  editItem: "",
  editModale: false,
  setEditModale: (bool) => {
    set((state) => ({
      editModale: bool,
    }));
  },
  setEditItem: (item) => {
    set((state) => ({
      editItem: item,
    }));
  },
  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  setItems: (newItems) => {
    set((state) => ({
      items: newItems,
    }));
  },
});
const useWarehouseStore = create(warehouseStore);
export default useWarehouseStore;
