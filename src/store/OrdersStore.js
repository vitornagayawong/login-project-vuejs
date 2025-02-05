import http from "@/axios"

export const ordersModule = {
    namespaced: true,
    state: {
        orders: [],
        paginationOrders: {
            from: 1,
            lastPage: 0
        },
        pageOrders: 1,  //novo número da página.
    },
    getters: {
        getOrders(state) {
            return state.orders
        },
    },
    mutations: {
        SET_ORDERS(state, payload) { 
            state.orders = payload 
        },
        SET_ORDERS_PAGINATION(state, payload) { //paginacao dos pedidos
            state.paginationOrders = payload
        },
        SET_PAGE_ORDERS(state, payload) { //página atual dos pedidos
            state.pageOrders = payload
        },
    }, 
    actions: {
        async setOrders({state, commit}) {
            try {
              const { data } = await http.get(`pedidos?page=${state.pageOrders}`) //propriedade page o laravel entende
      
              commit('SET_ORDERS', data.data)
              commit('SET_ORDERS_PAGINATION', { from: data.from, lastPage: data.last_page }) //objeto tem que ter os mesmos nomes das propriedades de paginationOrders ali na state
               
            } catch (e) {
              console.log(e)
            }
        },
        setPageOrders({commit}, payload) {
            commit('SET_PAGE_ORDERS', payload)
        },
    }
}