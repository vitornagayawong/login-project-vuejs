import Vue from "vue";
import http from "@/axios";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import LoggedIn from "@/components/LoggedIn.vue";
import ClientComponent from "@/components/ClientComponent.vue";
import LogoutComponent from "@/components/LogoutComponent.vue";
import PdvComponent from "@/components/PdvComponent.vue";
import ProductsComponent from "@/components/ProductsComponent.vue";
import PdvComponent2 from "@/components/PdvComponent2.vue";
import OrdersComponent from "@/components/OrdersComponent.vue";
import ClientComponentRegister from "@/components/ClientComponentRegister.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LoginComponent",
    component: LoginComponent,
  },
  {
    path: "/home",
    name: "HomeComponent",
    component: HomeView,
  },
  {
    path: "/logout",
    name: "LogoutComponent",
    component: LogoutComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/client",
    name: "ClientComponent",
    component: ClientComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/clientRegister",
    name: "ClientComponentRegister",
    component: ClientComponentRegister,
    meta: { requiresAuth: true },
  },
  {
    path: "/loggedin",
    name: "loggedIn",
    component: LoggedIn,
    meta: { requiresAuth: true },
  },
  {
    path: "/pdv",
    name: "PdvComponent",
    component: PdvComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/pdv2",
    name: "PdvComponent2",
    component: PdvComponent2,
    meta: { requiresAuth: true },
  },
  {
    path: "/products",
    name: "ProductsComponent",
    component: ProductsComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    name: "OrdersComponent",
    component: OrdersComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "aboutComponent",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),    
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  //console.log("dentro do router.beforeEach TO:", to);
  //console.log("dentro do router.beforeEach from:", from);
  //console.log("dentro do router.beforeEach next:", next);

  let token = localStorage.getItem("authToken");

  //console.log('tokennnn', token)

  //if (!token && to.name != 'LoginComponent') {
  if (!token && to.meta.requiresAuth) {
    console.log("Precisa de autorização para entrar na rota: " + to);
    next({ name: 'HomeComponent' })
  }

  if (to.meta.requiresAuth) {
    const me = http.post('me')
    me
    .then(() => {})
    .catch(error => {console.log(error)} )
  }

  next()
});

// beforeEnter: (to, from, next) => {
//   // ...
//   if (authUser) {
//     next()
//   } else {
//     next({name: 'login'})
//   }
// }
export default router;
