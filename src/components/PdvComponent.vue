<template>
  <div>
    <v-container fluid>
      <v-row align="center">
        <v-col
          class="d-flex"
          cols="12"
          sm="6"
        >
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

    <!-- <v-text-field
      
      label="Filter by name"
      prepend-icon="mdi-magnify"
      clearable
    >
    </v-text-field> -->

    <!-- <v-data-table
    v-model="selected"
    :headers="headers"
    :items="getAllProducts"
    :single-select="singleSelect"
    item-key="name"
    show-select
    class="elevation-1"
    >
      <template v-slot:top>
        <v-switch
          v-model="singleSelect"
          label="Single select"
          class="pa-3"
        ></v-switch>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
  </v-data-table> -->

  <v-text-field
      v-model="searchQuery"
      label="Filter products by name"
      prepend-icon="mdi-magnify"
      
  ></v-text-field>

  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="filteredProducts"
    item-key="id"
    class="elevation-1"   
  >    

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        icon
        @click="openModal(item)"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
    
  </v-data-table> 

  <v-dialog v-model="modal">
    <v-card>
      <v-card-title>
        <span class="headline">Detalhes do Produto</span>
      </v-card-title>

      <v-text-field label="Quantity" v-model="selectedProductQuantity"></v-text-field>      
      {{ cart }}
      <v-card-actions>
        <v-btn text @click="closeModal">Fechar</v-btn>
        <v-btn text @click="addToCart">Add to Cart</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: 'PdvComponent',
    data () {
      return {
        selectedClient: '',
        searchQuery: '',
        cart: [],
        singleSelect: true,
        selected: [],
        modal: false,  
        selectedProduct: {        
        },
        selectedProductQuantity: 0,
        headers: [
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
          { text: 'Stock', value: 'estoque' },
          { text: 'Ações', value: 'actions' },
        ],
        
      }
    },
    methods: {
      ...mapActions({
          setAllClients: 'setAllClients',
          setAllProducts: 'setAllProducts'
      }),

      openModal(product) {
        this.selectedProduct = product; // Armazena o produto selecionado
        this.modal = true; // Abre o modal
      },    
      
      closeModal() {
        this.modal = false
      },

      addToCart() {
        if(this.selectedProductQuantity > this.selectedProduct.estoque) {
          console.log('quantity higher then the stock')
        } else { //ok          
          this.selectedProduct.estoque -= this.selectedProductQuantity
          
          //this.cart.push(this.selectedProduct)          
        }
       
      }
       
    },
    computed: {
      ...mapState({
        allProducts: state => state.products
      }),
      ...mapGetters({
        getAllClients: 'getAllClients',
        getAllProducts: 'getAllProducts'            
      }),
      
      filteredProducts() {
        return this.allProducts.filter(product => product.nome.toLowerCase().includes(this.searchQuery.toLowerCase()))
      },

      
    },

    mounted() {
        this.setAllClients()
        this.setAllProducts()
    },
      
    created() {
    }
}
</script>