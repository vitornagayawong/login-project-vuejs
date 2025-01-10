<template>
  <div>
    <v-app-bar
      absolute
      color="white"
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <h1>You are logged in!</h1>

      <v-spacer></v-spacer>

      <router-link :to="{ name: 'ClientComponent' }">
          <v-btn >
            Client
          </v-btn>        
      </router-link>
      
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
export default {
  name: "loggedIn",
};
</script>
