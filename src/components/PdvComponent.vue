<template>
  <div>
    <v-container fluid>
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

    <v-text-field
      v-model="searchQuery"
      label="Filter products by name"
      prepend-icon="mdi-magnify"
    ></v-text-field>

    <v-data-table
      :headers="headers"
      :items="filteredProducts"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="openModal(item)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>

    </v-data-table>

    <v-dialog v-model="modal">
      <v-card>
        <v-card-title>
          <span class="headline">Detalhes do Produto</span>
        </v-card-title>

        <v-text-field
          label="Quantity"
          v-model="selectedProductQuantity"
        ></v-text-field>      
        
        <v-card-actions>
          <v-btn text @click="closeModal">Fechar</v-btn>
          <v-btn text @click="addToCart">Add to Cart</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            label="Select a type of payment"
            :items=typesPayment
            item-text="description"
            item-value="description"
            v-model="selectedTypeOfPayment"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>    
    
    <br>
    
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
  
  <br>
  
  <v-btn @click="finalizePurchase()">Finalize purchase</v-btn>
  </div>
</template>

<script>
import http from "@/axios";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "PdvComponent",

  data() {
    return {
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
      selectedTypeOfPayment: '',
      typesPayment: [
        {description: 'Credit'},
        {description: 'Debit'},
        {description: 'Pix'}
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
        { text: "Ações", value: "actions" }          
      ],
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
        const date = new Date()
        const day = date.getDate()
        let month = date.getMonth() + 1
        const year = date.getFullYear()

        //console.log(day, month, year)

        if(month < 10) {
          month = '0' + month
        }

        const fullDate = year + '-' + month + '-' + day

        console.log(this.selectedTypeOfPayment)

        const payload = {
          cliente_id: this.selectedClient,
          data: fullDate,
          valor_total: this.orderTotalPrice,
          forma_pgt: this.selectedTypeOfPayment,
          produtos: this.cart
        }

        //const timeStamp = Date.now()
        //console.log(timeStamp)

        const response = await http.post('pedidos', payload)
        console.log(response)

      } catch(e) {
        console.log(e)
      }
    },

    addToCart() {
      try {
        if (this.selectedProductQuantity > this.selectedProduct.estoque) {
          console.log("Quantidade maior que o estoque");
        } else {
          const existingProductIndex = this.cart.findIndex((item) => item.id === this.selectedProduct.id);

          console.log('a', existingProductIndex);

          if (existingProductIndex !== -1) {
            this.cart[existingProductIndex].quantidade += Number(this.selectedProductQuantity);
            this.selectedProduct.estoque -= this.selectedProductQuantity;
            this.cart[existingProductIndex].estoque = this.selectedProduct.estoque
          } else {
            this.selectedProduct.estoque -= this.selectedProductQuantity;

            const productToBePutInCart = {
              ...this.selectedProduct, //spread operator
              quantidade: parseInt(this.selectedProductQuantity)
            }

            //console.log('aquii',JSON.stringify(productToBePutInCart))

            this.cart.push(productToBePutInCart)
          }
        }        
      } catch (e) {
        console.log(e);
      }
    },

    updateItem() {
      //console.log(this.cart);
      //console.log(this.selectedProduct)
      //this.selectedProduct.quantidade = this.selectedProductQuantity
      let index = this.cart.findIndex(product => product.id == this.selectedProduct.id)
      this.cart[index].quantidade = this.newProductQuantityInCart
      //console.log(this.cart[index].id)
      //console.log(this.cart[index].quantidade)
    },

    removeItemFromCart() {
      let index = this.cart.findIndex(product => product.id == this.selectedProduct.id)
      this.cart.splice(index, 1)
      console.log(this.cart)
    }
  },

  computed: {
    ...mapState({
      allProducts: (state) => state.products,
    }),

    ...mapGetters({
      getAllClients: "getAllClients",
      getAllProducts: "getAllProducts",
    }),

    filteredProducts() {
      return this.allProducts.filter((product) =>
        product.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    orderTotalPrice() {
      let totalPrice = 0
      this.cart.forEach(order => {
        totalPrice += order.preco * order.quantidade
      });

      return totalPrice
    }
  },

  mounted() {
    this.setAllClients();
    this.setAllProducts();
  },

  created() {},

  updated() {}
};
</script>
