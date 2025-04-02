<template>
  <div>
    <nav-component />
    <v-app-bar
      absolute
      color="red"
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
    <v-row>
      <v-col class="d-flex">
        <v-container d-flex align-center>
        <h1 class="text-subtitle-1">Welcome: {{ getAvatarName }}</h1>
        <v-spacer></v-spacer>
          <v-menu offset-y v-if="$vuetify.breakpoint.mdAndDown">
            <template v-slot:activator="{ on, attrs }">
              <v-btn  color="primary" dark v-bind="attrs" v-on="on">
                Menu
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in items" :key="index" :to="item.route">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-container>
        </v-col>
      </v-row>

      <v-btn @click="logout">Logout</v-btn>

      <!-- <router-link :to="{ name: 'ProductsComponent' }">
        <v-btn> Products </v-btn>
      </router-link>

      <router-link :to="{ name: 'OrdersComponent' }">
        <v-btn> Orders </v-btn>
      </router-link>

      <router-link :to="{ name: 'PdvComponent' }">
        <v-btn> PDV </v-btn>
      </router-link>

      <router-link :to="{ name: 'PdvComponent2' }">
        <v-btn> PDV2 </v-btn>
      </router-link>
      
      <router-link :to="{ name: 'ClientComponent' }">
        <v-btn> User </v-btn>
      </router-link> -->
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-7"
      class="overflow-y-auto"
      max-height="600"
    >
      <v-container style="height: 1500px"> </v-container>
    </v-sheet>
  </div>
</template>

<script>
import http from "@/axios";
import { mapGetters, mapMutations, mapState } from "vuex";
import NavComponent from "./NavComponent.vue";
//import vuetify from "@/plugins/vuetify";

export default {
  components: { NavComponent },
  name: "loggedIn",

  data: () => ({
    items: [
        { title: "About", icon: "mdi-information", route: "/about" },
        { title: "LoggedIn", icon: "mdi-account", route: "/loggedin" },
        { title: "Products", icon: "mdi-shopping", route: "/products" },
        { title: "Orders", icon: "mdi-truck-fast", route: "/orders" },
        { title: "Pdv1", icon: "mdi-cash-multiple", route: "/pdv" },
        { title: "Pdv2", icon: "mdi-cash-multiple", route: "/pdv2" },
        { title: "Client", icon: "mdi-human", route: "/client" },
        { title: "Client Register", icon: "mdi-human", route: "/clientRegister" },
      ],
  }),

  methods: {
    ...mapMutations({
      SET_AVATAR_NAME: "SET_AVATAR_NAME",
    }),

    async logout() {
      try {
        const response = await http.post("logout");
        console.log("aqui", response);
        this.$router.push({ name: "LoginComponent" });
      } catch (error) {
        console.log(error);
      }
    },

    async me() {
      try {
        const response = await http.post("me");
        //this.$store.commit('SET_AVATAR_NAME', response.data.name)
        this.SET_AVATAR_NAME(response.data.name);
      } catch (error) {
        console.log(error);
      }
    },
  },

  computed: {
    ...mapState({
      avatarName: (state) => state.avatar.name,
    }),

    ...mapGetters({
      getAvatarName: "getAvatarName",
    }),
  },

  mounted() {
    this.me();
  },
};
</script>
