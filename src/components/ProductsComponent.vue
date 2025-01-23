<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="getAllProducts"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="openModal(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>

    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="getPagination.last"
        @input="receivePaginate"
      ></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="-1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>
    </div>

    <v-dialog v-model="modal">
      <v-card>
        <v-card-title>
          <span class="headline">Detalhes do Produto</span>
        </v-card-title>

        <!-- <v-data-table
          dense
          :headers="headersModal"
          :items="selectedItem"
          item-key="id"
          class="elevation-1"
        ></v-data-table> -->

        <v-text-field v-for="(item, index) in fieldsArray" :key="index" :label="item.label" :placeholder="item.placeholder" v-model="selectedItem[item.model]"></v-text-field> <!--algumaCoisa[] o colchetes se refere ao atributo em js-->
         
        <v-card-actions>
          <v-btn text @click="closeModal">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-form ref="form" v-model="valid" lazy-validation class="size">
      <h1>Register Product</h1>
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
        :rules="priceRules"
        label="Price"
        required
      ></v-text-field>

      <v-text-field
        v-model="product.weight"
        :rules="weightRules"
        label="Weight"
        required
      ></v-text-field>

      <v-text-field
        v-model="product.height"
        :rules="heightRules"
        label="Height"
        required
      ></v-text-field>

      <v-text-field
        v-model="product.storage"
        :rules="storagetRules"
        label="Storage quantity"
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
  </div>
</template>

<script>
import http from "@/axios";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ProductsComponent",

  data: () => ({
    fieldsArray: [
      { label: 'Product Name', model: 'nome', placeholder: 'nome'},
    ],
    selectedItem: {},
    modal: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "nome",
      },
      { text: "Description", value: "descricao" },
      { text: "Price", value: "preco" },
      { text: "Weight (kg)", value: "peso" },
      { text: "Height", value: "altura" },
      { text: "Storage", value: "estoque" },
      { text: "Acoes", value: "actions" },
    ],

    headersModal: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'nome',
        },
        { text: 'Description', value: 'descricao' },
        { text: 'Price', value: 'preco' },
        { text: 'Weight', value: 'peso' },
        { text: 'Height', value: 'altura' },
        { text: 'Storage', value: 'estoque' },
      ],

    valid: true,

    product: {
      name: "",
      description: "",
      price: "",
      weight: "",
      height: "",
      storage: "",
    },

    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
    ],

    descriptionRules: [(v) => !!v || "Description is required"],

    priceRules: [
      (v) => !!v || "Price is required",
      (v) => (v && v > 0) || "Price must be higher than 0",
      (v) => (v && v < 10000) || "Price must be less than 10000",
    ],

    weightRules: [
      (v) => !!v || "Weight is required",
      (v) => (v && v > 0) || "Weight must be higher than 0kg",
      (v) => (v && v < 50) || "Weight must be less than 50kg",
    ],

    heightRules: [
      (v) => !!v || "Height is required",
      (v) => !isNaN(v) || "Height must be a numeric",
    ],

    storagetRules: [
      (v) => !!v || "Storage quantity is required",
      (v) => !isNaN(v) || "Storage quantity must be a numeric",
    ],

    checkbox: false,
  }),

  methods: {
    async openModal(item) {

      //console.log('item',item)
      this.modal = true

      const response = await http.get(`produtos/${item.id}`)

      console.log(response.data[0])

      this.selectedItem = response.data[0]
    },
    
    closeModal() {
      this.modal = false
    },

    async receivePaginate(event) {
      this.setPage(event);

      await this.setAllProducts();
    },

    ...mapActions({
      setAllProducts: "setAllProducts",
      setPage: "setPage",
    }),

    async validate() {
      try {
        let formData = new FormData();
        formData.append("nome", this.product.name);
        formData.append("descricao", this.product.description);
        formData.append("preco", this.product.price);
        formData.append("peso", this.product.weight);
        formData.append("altura", this.product.height);
        formData.append("estoque", this.product.storage);

        // let payload = {
        //     name: this.name,
        //     email: this.email,
        //     password: this.password,
        // }

        const response = await http.post(`produtos`, formData);
        //const response = await http.post(`${this.$store.state.baseURL}user`, formData)
        //const response = await http.post(`${this.$store.state.baseURL}user`, payload)

        console.log("produtooooo", response);

        this.$refs.form.validate();

        if (response) this.$refs.form.reset();
      } catch (e) {
        console.log(e.response);
      }
    },

    reset() {
      this.$refs.form.reset();
    },
  },

  computed: {
    ...mapGetters({
      getAllProducts: "getAllProducts",
      getPagination: "getPagination",
    }),
  },

  mounted() {
    this.setAllProducts();
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
