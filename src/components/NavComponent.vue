<template>
  
    <v-navigation-drawer app color="blue" permanent>
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
        { title: "Home", icon: "mdi-view-dashboard", route: "/" },
        { title: "About", icon: "mdi-image", route: "/about" },
        { title: "LoggedIn", icon: "mdi-image", route: "/loggedin" },
      ],
    };
  },
};
</script>
