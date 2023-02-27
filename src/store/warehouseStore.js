import { create } from "zustand";
const host = "http://192.168.10.2:5000";
const warehouseStore = (set) => ({
  host: host,
  items: [],
  editItem: "",
  editModale: false,
  isLoggedIn: false,
  itemNames: [],
  setIsLoggedIn: (bool) => {
    set((state) => ({
      isLoggedIn: bool,
    }));
  },
  getItemNames: async (state) => {
    const response = await fetch(`${host}/api/items/fetchitemnames`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    set((state) => ({
      itemNames: json,
    }));
  },
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
