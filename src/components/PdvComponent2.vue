<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            label="Select a Client"
            :items="getAllClients"
            item-text="nome"
            item-value="id"
            v-model="selectedClient"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!--  @update:search-input="onSearchInput" -->
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <v-autocomplete
              v-model="selectedProduct"
              :items="getFilteredProducts"
              item-text="personalizado"
              item-value="id"
              dense
              filled
              label="Product name"
              :search-input="searchQuery"
              @keyup="onSearchInput"
              no-filter
              class="mx-2"
            ></v-autocomplete>

            <v-text-field
              label="Outlined"
              placeholder="Quantity"
              outlined
              v-model="selectedProductQuantity"
              class="mx-2"
            ></v-text-field>
            <v-btn @click="addToCart" class="mx-2">Add to Cart</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <br />

    <v-container class="pl-10 pr-10">
      <v-data-table
        :headers="headersCart"
        :items="cart"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="openModalCart(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-container>

    <v-dialog v-model="modalCart">
      <v-card>
        <v-card-title>
          <span class="headline">Detalhes do Produto no Carrinho</span>
        </v-card-title>

        <h1>Qtd Prod: {{ selectedProduct.quantidade }}</h1>

        <v-text-field
          label="Input a new desired quantity"
          v-model="newProductQuantityInCart"
        ></v-text-field>

        <v-card-actions>
          <v-btn text @click="closeModal">Fechar</v-btn>
          <v-btn text @click="updateItem">Update Item</v-btn>
          <v-btn text @click="removeItemFromCart">Remove Item from Cart</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <br />

    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            label="Select a type of payment"
            :items="typesPayment"
            item-text="description"
            item-value="description"
            v-model="selectedTypeOfPayment"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <v-btn @click="finalizePurchase()">Finalize purchase</v-btn>
  </div>
</template>

<script>
import http from "@/axios";
import { mapActions, mapGetters, mapState } from "vuex";
import { debounce } from "lodash";

export default {
  name: "PdvComponent2",

  data() {
    return {
      value: null,
      selectedClient: "",
      searchQuery: "",
      cart: [],
      singleSelect: true,
      selected: [],
      modal: false,
      modalCart: false,
      selectedProduct: {},
      selectedProductQuantity: 0,
      newProductQuantityInCart: 0,
      selectedTypeOfPayment: "",
      typesPayment: [
        { description: "Credit" },
        { description: "Debit" },
        { description: "Pix" },
      ],
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "nome",
        },
        { text: "Description", value: "descricao" },
        { text: "Price", value: "preco" },
        { text: "Weight", value: "peso" },
        { text: "Height", value: "altura" },
        { text: "Stock", value: "estoque" },
        { text: "Ações", value: "actions" },
      ],
      headersCart: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "nome",
        },
        { text: "Description", value: "descricao" },
        { text: "Price", value: "preco" },
        { text: "Weight", value: "peso" },
        { text: "Height", value: "altura" },
        { text: "Quantity", value: "quantidade" },
        { text: "Ações", value: "actions" },
      ],
      filterProducts: [],
    };
  },

  methods: {
    ...mapActions({
      setAllClients: "setAllClients",
      setAllProducts: "setAllProducts",
    }),

    openModal(product) {
      this.selectedProduct = product;
      this.modal = true;
    },

    openModalCart(product) {
      this.selectedProduct = product;
      this.modalCart = true;
    },

    closeModal() {
      this.modal = false;
      this.modalCart = false;
    },

    async finalizePurchase() {
      try {
        const date = new Date();
        const day = date.getDate();
        let month = date.getMonth() + 1;
        const year = date.getFullYear();

        if (month < 10) {
          month = "0" + month;
        }

        const fullDate = year + "-" + month + "-" + day;

        console.log(this.selectedTypeOfPayment);

        const payload = {
          cliente_id: this.selectedClient,
          data: fullDate,
          valor_total: this.orderTotalPrice,
          forma_pgt: this.selectedTypeOfPayment,
          produtos: this.cart,
        };

        const response = await http.post("pedidos", payload);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    },

    addToCart() {
      try {
        let obj = this.getAllProducts.find(
          (product) => product.id == this.selectedProduct
        );

        //console.log(this.selectedProduct);
        //console.log(obj);        

        if (obj) {

          let productAlreadyInCart = this.cart.find(p => p.id === obj.id)
          
          if(productAlreadyInCart) {
            productAlreadyInCart.quantidade += Number(this.selectedProductQuantity)
          } else {
            obj.quantidade = Number(this.selectedProductQuantity)
            this.cart.push(obj)
          }
          // obj.quantidade = this.selectedProductQuantity;
          // //console.log('aqui',this.selectedProductQuantity)
          // this.cart.push(obj);
          this.selectedProduct = {};
          this.selectedProductQuantity = 0;
        }       
        //console.log(this.cart)
      } catch (e) {
        console.log(e);
      }
    },

    updateItem() {
      let index = this.cart.findIndex(
        (product) => product.id == this.selectedProduct.id
      );

      this.cart[index].quantidade = this.newProductQuantityInCart;
    },

    removeItemFromCart() {
      let index = this.cart.findIndex(
        (product) => product.id == this.selectedProduct.id
      );
      this.cart.splice(index, 1);
    },

    debouncedSetAllProducts: debounce(function (query) {
      //arrow function não funciona bem por causa do this dentro da função
      this.setAllProducts(query);
    }, 1000), // 1000ms de atraso

    onSearchInput(query) {
      //evento listener de v-autocomplete

      console.log('aaaa',query)
      this.searchQuery = query.target.value;
      this.debouncedSetAllProducts(this.searchQuery);
      //this.setAllProducts(query)
    },
  },

  computed: {
    ...mapState({
      allProducts: (state) => state.products,
    }),

    ...mapGetters({
      getAllClients: "getAllClients",
      getAllProducts: "getAllProducts",
    }),

    orderTotalPrice() {
      let totalPrice = 0;

      this.cart.forEach((order) => {
        totalPrice += order.preco * order.quantidade;
      });

      return totalPrice;
    },

    getFilteredProducts() {
      if (!this.searchQuery?.trim()) {
        return this.getAllProducts;
      }

      const queryKeywords = this.searchQuery
        .toLowerCase()
        .split(/\s+/) // Divide o termo de pesquisa por espaços em branco
        .filter((word) => word.length > 0); // Remove palavras vazias

      return this.getAllProducts.filter((product) => {
        // Verifique se todas as palavras-chave aparecem no nome ou descrição
        const matchesQuery = queryKeywords.every((keyword) => {
          return (
            product.personalizado.toLowerCase().includes(keyword) ||
            product.descricao.toLowerCase().includes(keyword) ||
            product.nome.toLowerCase().includes(keyword)
          );
        });

        return matchesQuery;
      });
    },
  },

  mounted() {
    this.setAllClients();
    // params = null

    // if(params == null || params == '') {
    //   this.setAllProducts();
    // } else {
    //   params = this.searchQuery
    this.setAllProducts(this.searchQuery);
    // }
  },

  created() {},

  onMounted() {},

  beforeUpdate() {},

  //updated(params) {
  updated() {
    // params = null
    // if(params == null || params == '') {
    //   this.setAllProducts();
    // } else {
    //   params = this.searchQuery
    //   this.setAllProducts(params)
    // }
  },
};
</script>
