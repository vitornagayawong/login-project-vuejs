import http from "@/axios";

export const clientModule = {
  namespaced: true,
  state: {
    clients: [],
  },
  getters: {
    getAllClients(state) {
      return state.clients;
    },
  },
  mutations: {
    SET_ALL_CLIENTS(state, payload) {
      state.clients = payload;
    },
  },
  actions: {
    async setAllClients({ commit }, payload) {
      try {
        //console.log('oii')
        const response = await http.get("clientes");

        payload = response.data;

        if (response) {
          commit("SET_ALL_CLIENTS", payload);
        }
      } catch (exception) {
        console.log(exception);
      }
    },
  },
};
