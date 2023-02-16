import { create } from "zustand";

const saleStore = (set) => ({
  host: "http://192.168.10.2:5000",
  sales: [{ price: 0 }],
  purchases: [{ price: 0 }],
  setSales: (newSales) => {
    set((state) => ({
      sales: newSales,
    }));
  },
  setPurchases: (newpurchases) => {
    set((state) => ({
      purchases: newpurchases,
    }));
  },
});

const useSaleStore = create(saleStore);
export default useSaleStore;
