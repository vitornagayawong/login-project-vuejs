<template>
  <div>
    <v-app-bar
      absolute
      color="white"
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <h1>Welcome: {{ getAvatarName }}</h1>

      <v-spacer></v-spacer>

      <router-link :to="{ name: 'ProductsComponent' }">
        <v-btn> Products </v-btn>
      </router-link>

      <router-link :to="{ name: 'PdvComponent' }">
        <v-btn> PDV </v-btn>
      </router-link>

      <router-link :to="{ name: 'PdvComponent2' }">
        <v-btn> PDV2 </v-btn>
      </router-link>
      
      <router-link :to="{ name: 'ClientComponent' }">
        <v-btn> User </v-btn>
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
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: "loggedIn",

  data: () => ({
    
  }),

  methods: {
    
    ...mapMutations({
      SET_AVATAR_NAME: 'SET_AVATAR_NAME'
    }),

    async logout() {
      try {
        const response = await http.post('logout')
        console.log(response)
        this.$router.push({ name: 'HomeComponent' })

      } catch (error) {
        console.log(error)
      }
    },

    async me() {
      try {
        const response = await http.post('me')
        //this.$store.commit('SET_AVATAR_NAME', response.data.name)
        this.SET_AVATAR_NAME(response.data.name)

      } catch(error) {
        console.log(error)
      }
    }
  },

  computed: {
    ...mapState({
      avatarName: state => state.avatar.name
    }),

    ...mapGetters({
      getAvatarName: 'getAvatarName'
    })
  },

  mounted() {
    this.me()
  }
};
</script>
