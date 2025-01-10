import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// const token = localStorage.getItem('authToken')

export default new Vuex.Store({
  state: {
    // token: token,
    // authUser: null,
    baseURL: 'http://127.0.0.1:8000/api/'
  },
  getters: {
  },
  mutations: {
    
    SET_TOKEN(state, payload) {
      state.token = payload

      localStorage.setItem('authToken', payload)
    },

    SET_AUTH_USER(state, payload) {
      state.authUser = payload
      state.authUser = Object.assign({}, payload)
    }   
    
  },
  actions: {
    /*
    setToken({commit}, token) {

      commit('SET_TOKEN', token)
    },

    setAuthUser({commit}, payload) {
      commit('SET_AUTH_USER', payload)
    }
    */
  },
  modules: {
  }
})
