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
import axios from "axios";
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
            localStorage.setItem('authToken',  response.data.token)
            document.cookie = 'authToken='+response.data.token
            this.$router.push({ name: 'loggedIn'})
        }
        
        /*
        axios.interceptors.request.use(
          config => {
            //definir para todas as requisições os parâmetros de accept e authorization

            config.headers.Accept = 'application/json'
            config.headers.Authorization = this.token

          
              // config.headers.['Accept'] = ''
              //   config.headers.['Authorization'] = ''
             

            console.log('config request:', config)
            return config
          },
          error => {
            
            console.log('Error request:', error)
            return Promise.reject(error)
          }
        )
        
        axios.interceptors.response.use(
          response => {
            console.log('response response:', response)
            return response
          },
          error => {
            
            console.log('Error response:', error)
            return Promise.reject(error)
          }
        )
        */

        
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
  }
};
</script>

<style>
.size {
  width: 40%;
  margin: auto;
  margin-top: 300px;
}
</style>
