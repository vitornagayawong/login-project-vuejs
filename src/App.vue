<template>
  <v-app>
    <!-- <nav-component/> -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
//import axios from 'axios';
//import NavComponent from './components/NavComponent.vue';
export default {
  //components: { NavComponent },
  name: "App",

  data: () => ({
   
  }),
  methods: {
    //  async validate() {
    //   try {
    //     const response = await axios.post('http://127.0.0.1:8000/api/me')
    //     console.log('aquiiiiii', response)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  },
  created() {
    //this.validate()
  }
};
</script>
