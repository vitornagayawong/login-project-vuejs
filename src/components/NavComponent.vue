<template>
  
    <v-navigation-drawer app color="blue" >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Application </v-list-item-title>
          <v-list-item-subtitle> subtext </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.route">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  
</template>

<script>
export default {
  name: "NavComponent",
  data() {
    return {
      items: [
        { title: "About", icon: "mdi-information", route: "/about" },
        { title: "LoggedIn", icon: "mdi-account", route: "/loggedin" },
        { title: "Products", icon: "mdi-shopping", route: "/products" },
        { title: "Orders", icon: "mdi-truck-fast", route: "/orders" },
        { title: "Pdv1", icon: "mdi-cash-multiple", route: "/pdv" },
        { title: "Pdv2", icon: "mdi-cash-multiple", route: "/pdv2" },
        { title: "Client", icon: "mdi-human", route: "/client" },
        { title: "Client Register", icon: "mdi-human", route: "/clientRegister" }
      ],
    };
  },
};
</script>
