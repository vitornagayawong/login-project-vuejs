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

      <v-btn @click="logout">Logout</v-btn>
      
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
import http from '@/axios';

export default {
  name: "loggedIn",
  methods: {
    async logout() {
      try {
        const response = http.post('logout')
        console.log(response)
        this.$router.push({ name: 'HomeComponent' })
        

      } catch (error) {
        console.log(error)
      }

    }
  }
};
</script>
