import http from "@/axios";

export const productsModule = {
  namespaced: true,
  state: {
    products: [],
    pagination : {
        from: 1,
        last: 0
      },
      page: 1,
  },
  getters: {
    getAllProducts(state) {
      return state.products;
    },
    getPagination(state) { //paginacao dos produtos
        return state.pagination
      },
  },
  mutations: {
    SET_ALL_PRODUCTS(state, payload) {
      state.products = payload.map((el) => {
        return {
          ...el,
          personalizado: `(${el.id}) - ${el.nome} - ${el.descricao}`,
        };
      });
    },
    SET_PAGINATION(state, payload) { //paginacao dos produtos
        state.pagination = payload
      },
  
      SET_PAGE(state, payload) { //página atual dos produtos
        state.page = payload
      },
  },
  actions: {
    async setAllProducts({ commit, state }, payload) {
      try {
        let encoded = "";
        //console.log('payload',payload)
        if (payload) {
          //encoded = encodeURI(`&filtroNomeProd=nome:like:${payload}`); 
          encoded = encodeURI(`&filtro=nome:like:${payload};descricao:like:${payload}`); 
        }

        //const { data } = await http.get(`produtos?page=${state.page}${encoded}`)
        const response = await http.get(
          `produtos?page=${state.page}${encoded}`
        );

        const responseData = response.data;
        // payload = response
        commit("SET_ALL_PRODUCTS", responseData.data);
        commit("SET_PAGINATION", {
          last: responseData.last_page,
          from: responseData.from,
        });
      } catch (exception) {
        console.log(exception);
      }
    },

    setPage({commit}, payload) {
      commit('SET_PAGE', payload)
    },
  },
};
