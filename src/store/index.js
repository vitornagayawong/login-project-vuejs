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
    }
  },

  getters: {
    getAvatarName(state) {
      return state.avatar.name
    }
  },

  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload;
      localStorage.setItem("authToken", payload);
    },

    SET_AVATAR_NAME(state, payload) {
      state.avatar.name = payload
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
