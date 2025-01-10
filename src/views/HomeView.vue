<template>
  <div>
    <v-toolbar dense>
      <v-toolbar-title>Home</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <router-link to="/login">
          <v-icon>mdi-login</v-icon>          
        </router-link>
      </v-btn>
    </v-toolbar>
  </div>  
</template>

<script>
  export default {
    name: 'HomeComponent',
  }
</script>
