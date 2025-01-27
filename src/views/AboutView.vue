<template>
  <div class="about">
    <v-container>
      <v-row>
        <v-col class="d-flex justify-space-between">
          <h1>This is an about page!!</h1>
          <v-btn :to="'/loggedin'">Go back!</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <div>Conteúdo responsivo</div>
        </v-col>
      </v-row>
    </v-container>   
  </div>
</template>

<script>
export default {
  name: 'aboutComponent'
}
</script>
