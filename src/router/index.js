import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import LoggedIn from "@/components/LoggedIn.vue";
import ClientComponent from "@/components/ClientComponent.vue";
import LogoutComponent from "@/components/LogoutComponent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomeComponent",
    component: HomeView,
  },
  {
    path: "/login",
    name: "LoginComponent",
    component: LoginComponent,
  },
  {
    path: "/logout",
    name: "LogoutComponent",
    component: LogoutComponent,
  },
  {
    path: "/client",
    name: "ClientComponent",
    component: ClientComponent,
    meta: { requiresAuth: true },
  },
  {
    path: "/loggedin",
    name: "loggedIn",
    component: LoggedIn,
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
    next({ name: 'LoginComponent' })
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
