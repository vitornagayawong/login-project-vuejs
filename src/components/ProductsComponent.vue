<template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    class="size"
  >
    <h1>Register Product</h1> {{ this.$store.state.baseURL }}
    <v-text-field
      v-model="product.name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      v-model="product.description"
      :rules="descriptionRules"
      label="Description"
      required
    ></v-text-field>

    <v-text-field
      v-model="product.price"
      :rules=priceRules
      label="Price"
      required
    ></v-text-field>

    <v-text-field
      v-model="product.weight"
      :rules=weightRules
      label="Weight"
      required
    ></v-text-field>

    <v-text-field
      v-model="product.height"
      :rules=heightRules
      label="Height"
      required
    ></v-text-field>

    <v-text-field
      v-model="product.storage"
      :rules=storagetRules
      label="Storage quantity"
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
    name: 'ProductsComponent',
    data: () => ({
      valid: true,
      product: {
        name: '',
        description: '',
        price: '',
        weight: '',
        height: '',
        storage: '',
      },
      
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters',
      ],
      
      descriptionRules: [
        v => !!v || 'Description is required',
      ],

      priceRules: [
        v => !!v || 'Price is required',
        v => (v && v > 0) || 'Price must be higher than 0',
        v => (v && v < 10000 ) || 'Price must be less than 10000',
      ],

      weightRules: [
        v => !!v || 'Weight is required',
        v => (v && v > 0) || 'Weight must be higher than 0kg',
        v => (v && v < 50) || 'Weight must be less than 50kg',
      ],

      heightRules: [
        v => !!v || 'Height is required',
        v => !isNaN(v) || 'Height must be a numeric'
      ],

      storagetRules: [
        v => !!v || 'Storage quantity is required',
        v => !isNaN(v) || 'Storage quantity must be a numeric'
      ],

      checkbox: false,
    }),

    methods: {
       async validate () {

        try {
            let formData = new FormData();
            formData.append('nome', this.product.name)
            formData.append('descricao', this.product.description)
            formData.append('preco', this.product.price)
            formData.append('peso', this.product.weight)
            formData.append('altura', this.product.height)
            formData.append('estoque', this.product.storage)

            // let payload = {
            //     name: this.name,
            //     email: this.email,
            //     password: this.password,
            // }
    
            const response = await http.post(`produtos`, formData)
            //const response = await http.post(`${this.$store.state.baseURL}user`, formData)
            //const response = await http.post(`${this.$store.state.baseURL}user`, payload)

            console.log('produtooooo', response)
    
            this.$refs.form.validate()

            if(response) this.$refs.form.reset()
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