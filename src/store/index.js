//import http from "@/axios";
//import http from "@/axios";
import Vue from "vue";
import Vuex from "vuex";
import { authModule } from "./AuthStore";
import { clientModule } from "./ClientStore";
import { productsModule } from "./ProductStore";
import { couponsModule } from "./CouponsStore";
import { ordersModule } from "./OrdersStore";

Vue.use(Vuex);

//const token = localStorage.getItem("authToken");

// const authModule = {
//   namespaced: true, //precisa colocar isso para ele identificar em outro componente
//   state: {
//     token: token,
//   },
//   actions: {
//     SET_TOKEN(state, payload) {
//       state.token = payload;
//       localStorage.setItem("authToken", payload);
//     },
//   },
//   getters: {
//     getToken(state) {
//       return state.token
//     }
//   },
//   mutations: {
//     async setToken({ commit }, payload) {
//       //poderia fazer um processamento assíncrono e colocar regras de negócio
     
//       //console.log('payloadddd', payload)

//       const response = await http.post("http://127.0.0.1:8000/api/login", payload);

//       if(response.data.token) {
//         //localStorage.setItem('authToken',  response.data.token)
//         //document.cookie = 'authToken='+response.data.token
//         //this.$store.commit('SET_TOKEN', response.data.token)
//         //this.SET_TOKEN(response.data.token)
        
//         commit('SET_TOKEN', response.data.token)
//         return true
//       }

//       return false
//     },
//   }
// }

export default new Vuex.Store({
  state: {
    //token: token,
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
    // clients: [],
    // products: [],
    // pagination : {
    //   from: 1,
    //   last: 0
    // },
    // page: 1,

    // orders: [],

    // paginationOrders: {
    //   from: 1,
    //   lastPage: 0
    // },

    //pageOrders: 1,  //novo número da página.

    // coupons: [],
  },

  getters: {
    getAvatarName(state) {
      return state.avatar.name
    },

    // getAllClients(state) {
    //   return state.clients
    // },
    
    // getAllProducts(state) {
    //   return state.products
    // },

    // getPagination(state) { //paginacao dos produtos
    //   return state.pagination
    // },

    // getOrders(state) {
    //   return state.orders
    // },

    // getCoupons(state) {
    //   return state.coupons
    // }
  },

  mutations: {
    // SET_TOKEN(state, payload) {
    //   state.token = payload;
    //   localStorage.setItem("authToken", payload);
    // },

    SET_AVATAR_NAME(state, payload) {
      state.avatar.name = payload
    },

    // SET_ALL_CLIENTS(state, payload) {
    //   state.clients = payload
    // },

    // SET_ALL_PRODUCTS(state, payload) {
    //   state.products = payload.map(el => {
    //     return {
    //       ...el,
    //       personalizado: `(${el.id}) - ${el.nome} - ${el.descricao}`
    //     }
    //   })
    // },

    // SET_PAGINATION(state, payload) { //paginacao dos produtos
    //   state.pagination = payload
    // },

    // SET_PAGE(state, payload) { //página atual dos produtos
    //   state.page = payload
    // },

    // SET_ORDERS(state, payload) { 
    //  state.orders = payload 
    // },

    // SET_ORDERS_PAGINATION(state, payload) { //paginacao dos pedidos
    //   state.paginationOrders = payload
    // },

    // SET_PAGE_ORDERS(state, payload) { //página atual dos pedidos
    //   state.pageOrders = payload
    // },

    // SET_COUPONS(state, payload) {
    //   state.coupons = payload
    // }
  },

  /*
  SET_AUTH_USER(state, payload) {
    state.authUser = payload;
    state.authUser = Object.assign({}, payload);
  },
  */

  actions: {
    // async setToken({ commit }, payload) {
    //   //poderia fazer um processamento assíncrono e colocar regras de negócio
     
    //   //console.log('payloadddd', payload)

    //   const response = await http.post("http://127.0.0.1:8000/api/login", payload);

    //   if(response.data.token) {
    //     //localStorage.setItem('authToken',  response.data.token)
    //     //document.cookie = 'authToken='+response.data.token
    //     //this.$store.commit('SET_TOKEN', response.data.token)
    //     //this.SET_TOKEN(response.data.token)
        
    //     commit('SET_TOKEN', response.data.token)
    //     return true
    //   }

    //   return false
    // },

    // async setAllClients({ commit }, payload) {
    //   try {
    //     console.log('ppp')
    //     const response = await http.get('clientes')

    //     payload = response.data        

    //     if(response) {
    //       commit('SET_ALL_CLIENTS', payload)
    //     }
    //   } catch(exception) {
    //     console.log(exception)
    //   }
    // },

    // async setAllProducts({commit, state}, payload) {
    //   try {
    //     //console.log(payload)
    //     //console.log(commit)
    //     let encoded = ''

    //     if(payload) {
    //       encoded = encodeURI(`&filtroNomeProd=nome:like:${payload}`) //console.log(encoded)          
    //     }

    //     //const { data } = await http.get(`produtos?page=${state.page}${encoded}`)
    //     const response = await http.get(`produtos?page=${state.page}${encoded}`)

    //     const responseData = response.data
    //     // payload = response
    //     commit('SET_ALL_PRODUCTS', responseData.data)      
    //     commit('SET_PAGINATION', { last: responseData.last_page, from: responseData.from })
    //   } catch(exception) {  
    //     console.log(exception)
    //   }
    // },

    // setPage({commit}, payload) {
    //   commit('SET_PAGE', payload)
    // },

    // async setOrders({state, commit}) {
    //   try {
    //     const { data } = await http.get(`pedidos?page=${state.pageOrders}`) //propriedade page o laravel entende

    //     commit('SET_ORDERS', data.data)
    //     commit('SET_ORDERS_PAGINATION', { from: data.from, lastPage: data.last_page }) //objeto tem que ter os mesmos nomes das propriedades de paginationOrders ali na state
         
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },

    // setPageOrders({commit}, payload) {
    //   commit('SET_PAGE_ORDERS', payload)
    // },

    // async setCoupons({commit}, payload) {
    //   const response = await http.get('cupom-desconto')
    //   //console.log(response.data[0])

    //   payload = response.data[0]

    //   commit('SET_COUPONS', payload)

    // }

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

  modules: {
    authModule: authModule,
    clientModule: clientModule,
    productsModule: productsModule,
    couponsModule: couponsModule,
    ordersModule: ordersModule
  },
});
