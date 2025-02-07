<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation class="size">
      <h2>Login Form</h2>
      <!-- <v-text-field
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      ></v-text-field> -->

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <!-- Adicionando campo de senha -->
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Validate
      </v-btn>

      <v-btn class="mr-4 error secondary--text" @click="reset">
        Reset Form
      </v-btn>
    </v-form>
  </div>
</template>

<script>
//import axios from "axios";
import { mapActions, mapMutations } from "vuex";
//import http from '@/services/http'

export default {

  name: "LoginComponent",
  
  data: () => ({
    valid: true,
    // name: "",
    // nameRules: [
    //   (v) => !!v || "Name is required",
    //   (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    // ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
  }),

  methods: {
  ...mapMutations('authModule', {
    SET_TOKEN: 'SET_TOKEN'
  }),

  ...mapActions('authModule', {
    setToken: 'setToken'
  }),

  async validate() {
    const payload = {
        password: this.password,
        email: this.email,
    };

    //console.log('passssss', payload.password, payload.email)

    const result = await this.setToken(payload)

    //console.log(result)

    if(result) {
      this.$router.push({ name: 'loggedIn'}).catch(error => console.log(error))
      this.$refs.form.validate();
    }
  },
  
  /*
    async validate() {
      try {
        const payload = {
          password: this.password,
          email: this.email,
        };

        const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
          payload,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`,
            }
          }
        );

        //const response = http.post('/login', payload)
        //console.log('aquiii', response)

        if(response.data.error) console.log('Erro em autenticar!!!')

        if(response.data.token) {
            //localStorage.setItem('authToken',  response.data.token)
            //document.cookie = 'authToken='+response.data.token
            //this.$store.commit('SET_TOKEN', response.data.token)
            //this.SET_TOKEN(response.data.token)
            this.$store.dispatch('setToken', response.data.token)
            this.$router.push({ name: 'loggedIn'})
        }
        
        //this.setToken(response.data.token)

        //console.log('login', response.data);
        
        // const res = await axios.post("http://127.0.0.1:8000/api/me", null,
        //  {
        //   headers: {
        //     Authorization: `Bearer ${response.data.token}`}
        //   }
        // )

        // if (res.data.id) {
        //   // setAuthUser(res.data)

        //   this.$router.push({name: ''})
        // }               

      } catch (error) {
        console.log(error.response);
      }
      //this.$refs.form.validate();
    },

    */
    
    reset() {
      this.$refs.form.reset();
    },
  },
  computed: {
    token() {
      let token = document.cookie.split('=')[1]

      //console.log('token dentro do computed',  token)
      return token
    }
  },

  // created() {
  //   console.log('create')
  // },

  // mounted() {
  //   console.log('mountedd')
  // }
};
</script>

<style>
.size {
  width: 40%;
  margin: auto;
  margin-top: 300px;
}
</style>
