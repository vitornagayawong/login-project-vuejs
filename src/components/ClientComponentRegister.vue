<template>
  <v-form ref="form" v-model="valid" lazy-validation class="size">
    <h1>Register Cliente</h1>
    {{ this.$store.state.baseURL }}
    <v-text-field
      v-model="name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="Height"
      :rules="heightRules"
      label="Height"
      required
    ></v-text-field>

    <v-text-field
      v-model="Age"
      :rules="[
        (v) => !!v || 'Age is required',
        (v) => !isNaN(v) || 'Age must be numeric.',
      ]"
      label="Age"
      required
    ></v-text-field>

    <v-text-field
      v-model="address.cep"
      :rules="[(v) => !!v || 'CEP is required']"
      label="CEP"
      required
      @click="ViaCep(address.cep)"
    ></v-text-field>

    <v-text-field
      v-model="address.cidade"
      disabled
      :rules="[(v) => !!v || 'Cidade is required']"
      label="Cidade"
      required
    ></v-text-field>

    <v-text-field
      v-model="address.rua"
      disabled
      :rules="[(v) => !!v || 'Rua is required']"
      label="Rua"
      required
    ></v-text-field>

    <v-checkbox
      v-model="checkbox"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
      Validate
    </v-btn>

    <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
  </v-form>
</template>

<script>
import http from "@/axios";
import axios from "axios";

export default {
  name: "ClientComponentRegister",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [(v) => !!v || "Name is required"],
    Height: "",
    heightRules: [
      (v) => !!v || "Height is required",
      (v) => !isNaN(v) || "Height must be numeric.",
    ],
    Age: null,
    address: {
      cidade: "",
      rua: "",
      cep: "",
    },
    checkbox: false,
  }),

  methods: {
    async validate() {
      try {
        // let formData = new FormData();
        // formData.append('name', this.name)
        // formData.append('email', this.email)
        // formData.append('password', this.password)
        // formData.append('address', JSON.stringify(this.address))

        let payload = {
          nome: this.name,
          idade: this.Height,
          altura: this.Age,
          address: this.address,
        };

        // let payload = {
        //     name: this.name,
        //     email: this.email,
        //     password: this.password,
        // }

        const response = await http.post(`clientes`, payload);

        console.log("usuarioooo", response);

        this.$refs.form.validate();
      } catch (e) {
        console.log(e.response);
      }
    },

    reset() {
      this.$refs.form.reset();
    },

    async ViaCep(cep) {
      if(cep.length === 8) {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        console.log(response);
        this.address.cidade = response.data.localidade
        this.address.rua = response.data.logradouro
      }
    },
  },
};
</script>

<style>
.size {
  width: 40%;
  margin: auto;
  margin-top: 300px;
}
</style>
