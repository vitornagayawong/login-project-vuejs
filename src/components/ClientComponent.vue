<template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    class="size"
  >
    <h1>Register User</h1> {{ this.$store.state.baseURL }}
    <v-text-field
      v-model="name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="[v => !!v || 'Password is required']"
      label="Password"
      required
    ></v-text-field>

    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reset Form
    </v-btn>

  </v-form>
</template>

<script>
import http from '@/axios';

  export default {
    name: 'Component',
    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      checkbox: false,
    }),

    methods: {
      async validate () {

        try {
            let formData = new FormData();
            formData.append('name', this.name)
            formData.append('email', this.email)
            formData.append('password', this.password)

            // let payload = {
            //     name: this.name,
            //     email: this.email,
            //     password: this.password,
            // }
    
            const response = await http.post(`user`, formData)
            //const response = await http.post(`${this.$store.state.baseURL}user`, formData)
            //const response = await http.post(`${this.$store.state.baseURL}user`, payload)

            console.log('usuarioooo', response)
    
            this.$refs.form.validate()
        } catch(e) {
            console.log(e.response)
        }
      },

      reset () {
        this.$refs.form.reset()
      },
    },


  }
</script>

<style>
.size {
  width: 40%;
  margin: auto;
  margin-top: 300px;
}
</style>