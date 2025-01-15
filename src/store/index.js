//import http from "@/axios";
import http from "@/axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const token = localStorage.getItem("authToken");

export default new Vuex.Store({
  state: {
    token: token,
    //authUser: null,
    baseURL: "http://127.0.0.1:8000/api/",
    avatar: {
      name: '',
      email: ''
    },
    login: {
      email: '',
      password: ''
    },
    clients: [],
    products: []
  },

  getters: {
    getAvatarName(state) {
      return state.avatar.name
    },

    getAllClients(state) {
      return state.clients
    },
    
    getAllProducts(state) {
      return state.products
    }
  },

  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload;
      localStorage.setItem("authToken", payload);
    },

    SET_AVATAR_NAME(state, payload) {
      state.avatar.name = payload
    },

    SET_ALL_CLIENTS(state, payload) {
      state.clients = payload
    },

    SET_ALL_PRODUCTS(state, payload) {
      state.products = payload
    }    
  },

  /*
  SET_AUTH_USER(state, payload) {
    state.authUser = payload;
    state.authUser = Object.assign({}, payload);
  },
  */

  actions: {
    async setToken({ commit }, payload) {
      //poderia fazer um processamento assíncrono e colocar regras de negócio
     
      console.log('payloadddd', payload)

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

    async setAllClients({ commit }, payload) {
      try {
        const response = await http.get('clientes')

        payload = response.data        

        if(response) {
          commit('SET_ALL_CLIENTS', payload)
        }
      } catch(exception) {
        console.log(exception)
      }
    },

    async setAllProducts({commit}) {
      try {
        const response = await http.get('produtos')
        // payload = response
        // console.log(payload)
        commit('SET_ALL_PRODUCTS', response.data)        
      } catch(exception) {  
        console.log(exception)
      }
    }   

    //Segunda forma de fazer!
    // setToken({ commit }, payload) {
    //   commit("SET_TOKEN", payload);
    // },
      
    /*
    setAuthUser({commit}, payload) {
      commit('SET_AUTH_USER', payload)
    }
    */
  },

  modules: {},
});
