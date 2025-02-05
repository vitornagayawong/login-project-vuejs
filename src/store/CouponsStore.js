import http from "@/axios"

export const couponsModule = {
    namespaced: true,
    state: {
        coupons: [],
    },
    getters: {
        getCoupons(state) {
            return state.coupons
        }
    },
    mutations: {
        SET_COUPONS(state, payload) {
            state.coupons = payload
        }
    }, 
    actions: {
        async setCoupons({commit}, payload) {
            const response = await http.get('cupom-desconto')
            //console.log(response.data[0])
        
            payload = response.data[0]
        
            commit('SET_COUPONS', payload)
    
        }
    }
}