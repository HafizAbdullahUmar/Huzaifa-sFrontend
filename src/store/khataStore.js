import { create } from "zustand";
const host = "http://192.168.10.2:5000";
const khataStore = (set) => ({
  host: host,
  willRecieve: 0,
  willGive: 0,
  transactions: [{ price: 0 }],
  setTransactions: (newTrans) => {
    set((state) => ({
      transactions: newTrans,
    }));
  },
  setWillRecieve: (newRecieve) => {
    set((state) => ({
      willRecieve: newRecieve,
    }));
  },
  setWillGive: (newGive) => {
    set((state) => ({
      willGive: newGive,
    }));
  },
  getDues: async (state) => {
    const response = await fetch(`${host}/api/parties/fetchalldues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
    set((state) => ({
      willGive: json.willGive,
      willRecieve: json.willReceive,
    }));
  },
});

const useKhataStore = create(khataStore);
export default useKhataStore;
