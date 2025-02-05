import http from "@/axios";

const token = localStorage.getItem("authToken");

export const authModule = {
    namespaced: true, //precisa colocar isso para ele identificar em outro componente
    state: {
      token: token,
    },
    actions: {
      SET_TOKEN(state, payload) {
        state.token = payload;
        localStorage.setItem("authToken", payload);
      },
    },
    getters: {
      getToken(state) {
        return state.token
      }
    },
    mutations: {
      async setToken({ commit }, payload) {
        //poderia fazer um processamento assíncrono e colocar regras de negócio
       
        //console.log('payloadddd', payload)
  
        const response = await http.post("http://127.0.0.1:8000/api/login", payload);
  
        if(response.data.token) {
          //localStorage.setItem('authToken',  response.data.token)
          //document.cookie = 'authToken='+response.data.token
          //this.$store.commit('SET_TOKEN', response.data.token)
          //this.SET_TOKEN(response.data.token)
          
          commit('SET_TOKEN', response.data.token)
          return true
        }
  
        return false
      },
    }
  }
