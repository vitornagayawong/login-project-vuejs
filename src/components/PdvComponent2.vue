<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6  cliente">
          <v-select
            label="Select a Client"
            :items="getAllClients"
            item-text="nome"
            item-value="id"
            v-model="selectedClient"
            :rules="clientRules"
            class="ml-2"
            autofocus
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!--  @update:search-input="onSearchInput" -->
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" d-flex>
          <div class="produtos">
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
              class="mx-2 productName"
              color="purple"
              :rules="productRules"
            ></v-autocomplete>

            <v-text-field
              label="Quantity"
              placeholder="Quantity"
              outlined
              v-model="selectedProductQuantity"
              class="mx-2"
              :rules="selectedProductQuantityRules"
            ></v-text-field>

            <v-btn @click="addToCart" class="mx-2 mb-7" color="blue">
              Add to Cart
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <br />

    <v-container class="pl-10 pr-10" d-flex justify-center>
      <v-data-table
        :headers="headersCart"
        :items="cart"
        :items-per-page="5"
        class="elevation-3 cart"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="openModalCart(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="removeItemFromCart(item)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>       
      </v-data-table>
    </v-container>

    <v-dialog v-model="modalCart">
      <v-card>
        <v-card-title>
          <span class="headline">Detalhes do Produto no Carrinho</span>
        </v-card-title>

        <p id="qtdProdCarrinho">Qtd Prod: {{ selectedProduct.quantidade }}</p>

        <v-text-field
          label="Input a new desired quantity"
          v-model="newProductQuantityInCart"
          class="newDesiredQuantity"
        ></v-text-field>

        <v-card-actions>
          <v-btn text @click="closeModal">Fechar</v-btn>
          <v-btn text @click="updateItem" class="blue lighten-2"
            >Update Item</v-btn
          >
          <!-- <v-btn text @click="removeItemFromCart" class="red darken-1">Remove Item from Cart</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <br />

    <v-container fluid d-flex justify-center>
      <v-row
        align="center"
        d-flex
        class="pr-10 pl-10 pagamentoEPreco"
        justify-center
      >
        <v-col class="d-flex">
          <v-select
            label="Select a type of payment"
            :items="typesPayment"
            item-text="description"
            item-value="description"
            v-model="selectedTypeOfPayment"
            :rules="typeOfPaymentRules"
            class="tipoPagamento"
          ></v-select>
        </v-col>

        <v-col>
          <v-text-field
            label="Total Price (R$)"
            outlined
            v-model="totalPriceComputed"
            disabled
            class="precoTotal"
          ></v-text-field>
          <!-- <total-price
            :orderTotalPrice="orderTotalPrice"
          /> -->
        </v-col>
      </v-row>
    </v-container>

    <v-btn
      @click="openDialogFinalizePurchase()"
      class="finalizarCompra green darken-1"
      >Finalize purchase</v-btn
    >

    <v-dialog v-model="dialogFinalizePurchase" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Confirm Purchase </v-card-title>
        <v-card-text
          >Are you sure you want to finalize this purchase?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialogFinalizePurchase = false"
          >
            Disagree
          </v-btn>
          <v-btn color="green darken-1" text @click="finalizePurchase()">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="dialogInvoice"
    >
      <template>
        <v-card>
          <v-toolbar color="primary" dark>INVOICE</v-toolbar>
          <v-row>
            <v-col>Name</v-col>
            <v-col>Quantity</v-col>
            <v-col>Price</v-col>
          </v-row>
          <v-row v-for="(product, index) in cart" :key="index">
            <v-col>{{ product.nome }}</v-col>
            <v-col>{{ product.quantidade }}</v-col>
            <v-col>{{ product.quantidade * product.preco }}</v-col>
          </v-row>
          <v-card-text>Total Price: {{ orderTotalPrice }}</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="closeDialogInvoice">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import http from "@/axios";
import { mapActions, mapGetters, mapState } from "vuex";
import { debounce } from "lodash";
//import TotalPrice from "./TotalPrice.vue";

export default {
  //components: { TotalPrice },
  name: "PdvComponent2",

  data() {
    return {
      precoComPonto: "",
      dialogInvoice: false,
      clientRules: [(client) => !!client || "Select a client!"],
      productRules: [
        (product) => !!product || "Insert a product!",
        //(product) => (product && product.id) || 'Invalid product selected!',
      ],
      typeOfPaymentRules: [(payment) => !!payment || "Choose a payment!"],
      selectedProductQuantityRules: [
        (selectedProductQuantity) => typeof(selectedProductQuantity) != Number || 'This must be numeric!'
      ],
      dialogFinalizePurchase: false,
      totalPrice: 0,
      value: null,
      selectedClient: "",
      searchQuery: "",
      cart: [],
      singleSelect: true,
      selected: [],
      modal: false,
      modalCart: false,
      selectedProduct: {},
      selectedProductQuantity: 1,
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

  // watch: {
  //   orderTotalPrice() {
  //     // A cada mudança no preço total, converte e emite o valor com ponto
  //     //this.precoComPonto = newValue.replace(",", ".");
  //   },
  // },

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

        const payload = {
          cliente_id: this.selectedClient,
          data: fullDate,
          valor_total: this.totalPrice,
          forma_pgt: this.selectedTypeOfPayment,
          produtos: this.cart,
        };

        const response = await http.post("pedidos", payload);
        //console.log('aaaaaaaaaa',response);

        if (response.data.response === null) {
          window.alert("Fill all the required fields!");
          this.dialogFinalizePurchase = false;
        }

        if (response.data.error) {
          window.alert(response.data.error);
          //this.dialogFinalizePurchase = false
        }

        if (
          response.data.error ==
          "Quantidade requisitada do(a) cadeira madeira verde maior que a do estoque!"
        ) {
          let cadeiraMadeiraVerde = this.cart.find(
            (produto) => produto.nome == "cadeira madeira verde"
          );
          //console.log('aquii',cadeiraMadeiraVerde)
          let qtdCadeiraMadeiraVerdeNoCarrinho = cadeiraMadeiraVerde.quantidade;

          //console.log('qtdCadeiraMadeiraVerdeNoCarrinho', qtdCadeiraMadeiraVerdeNoCarrinho)

          let idCadeiraMadeiraVerdeNoCarrinho = this.cart.findIndex(
            (produto) => produto.nome == "cadeira madeira verde"
          );
          //console.log('idCadeiraMadeiraVerdeNoCarrinho', idCadeiraMadeiraVerdeNoCarrinho)

          this.cart.splice(idCadeiraMadeiraVerdeNoCarrinho, 1);

          //console.log('carrinho', this.cart)

          this.totalPrice -=
            qtdCadeiraMadeiraVerdeNoCarrinho * cadeiraMadeiraVerde.preco;
        }

        if (response.statusText == "Created") {
          this.dialogInvoice = true;
        }
      } catch (e) {
        console.log(e);
      }
    },

    openDialogFinalizePurchase() {
      if (!this.selectedClient || !this.cart || !this.selectedTypeOfPayment) {
        window.alert("Fill all the required fields");
      } else {
        this.dialogFinalizePurchase = true;
      }
    },

    closeDialogInvoice() {
      this.dialogFinalizePurchase = false;
      this.dialogInvoice = false;
    },

    addToCart() {
      try {
        let prod = this.getAllProducts.find(
          (product) => product.id == this.selectedProduct
        );

        //console.log('prodddd', prod)

        //console.log(this.selectedProduct);

        if (this.selectedProductQuantity == 0) {
          window.alert("Quantity has to be more than zero!");
        } else if (this.selectedProductQuantity > prod.estoque) {
          window.alert(`We don't have this quantity in our storage, sorry! Now it's available only ${prod.estoque} units!`);
          this.selectedProductQuantity = 1
        } else {
          if (prod) {
            let productAlreadyInCart = this.cart.find((p) => p.id === prod.id);

            if (productAlreadyInCart) {
              productAlreadyInCart.quantidade += Number(
                this.selectedProductQuantity
              );
              //console.log('kk',productAlreadyInCart)
              //console.log('antes', this.totalPrice)
              this.totalPrice +=
                this.selectedProductQuantity * productAlreadyInCart.preco;
              //console.log('depois', this.totalPrice)
              //this.totalPrice.toFixed(2)
            } else {
              prod.quantidade = Number(this.selectedProductQuantity);
              this.cart.push(prod);
              //console.log('aqui', obj)
              this.totalPrice += prod.quantidade * prod.preco;
            }
            // obj.quantidade = this.selectedProductQuantity;
            // //console.log('aqui',this.selectedProductQuantity)
            // this.cart.push(obj);

            // if(this.cart.length > 0) {
            //   this.cart.reduce((anterior, atual) => {
            //     //this.totalPrice += Number(anterior.preco)
            //     this.totalPrice += Number(atual.preco)
            //   }, 0)
            // } else {

            // }

            this.selectedProduct = {};
            this.selectedProductQuantity = 1;
          }
          //console.log(this.cart)
        }
        //console.log(obj);
      } catch (e) {
        console.log(e);
      }
    },

    updateItem() {
      let choosenProductIndex = this.cart.findIndex(
        (product) => product.id == this.selectedProduct.id
      );

      let setedQuantityInCart = this.cart[choosenProductIndex].quantidade;

      //console.log('opa',setedQuantityInCart)

      //console.log(this.cart)

      this.cart[choosenProductIndex].quantidade = this.newProductQuantityInCart;

      this.totalPrice +=
        (this.newProductQuantityInCart - setedQuantityInCart) *
        this.cart[choosenProductIndex].preco;
    },

    removeItemFromCart(product) { 

      let confirm = window.confirm("Are you sure you want to remove this item from cart?")

      if(confirm) {
        let allProductsExceptTheChoosenOne = this.cart.filter( p => {
          return p.id != product.id
        })

        //console.log(allProductsExceptTheChoosenOne)

        this.cart = allProductsExceptTheChoosenOne
      } 
      

      /* LÓGICA USANDO O MÉTODO FILTER
      console.log('producttttttttt', product)

      //this.selectedProduct = product;
      //console.log('selectedproduct', this.selectedProduct)
      //console.log('cartiiii', JSON.stringify(this.cart))

      let productToBeRemovedFromCart = this.cart.filter(
        (p) => { 
          //console.log('1',product.id)
          //console.log('2', p.id)
         return  p.id == product.id //SE TIVER AS CHAVES TEM QUE DAR UM RETURN
        
        //console.log('4',this.selectedProduct.id)

        }
      );     

      console.log("antess", productToBeRemovedFromCart);      
      //console.log("id", productToBeRemovedFromCart[0].id);
      //console.log("qtd", productToBeRemovedFromCart[0].quantidade);
      //console.log("preco", productToBeRemovedFromCart[0].preco);      
      //console.log('esse', productToBeRemovedFromCart)
      //console.log('carttt11', this.cart[0])
      
      if (productToBeRemovedFromCart) {
        let confirm = window.confirm(
          "Are you sure you want to remove this item from cart?"
        )
        
        console.log("depoiss", productToBeRemovedFromCart);
        //console.log('jh',confirm)
        //console.log('carttt22', this.cart[productToBeRemovedFromCart[0]])

        if (confirm) {
          //console.log("carrinhoooo", this.cart);
          // this.totalPrice -=
          //   productToBeRemovedFromCart[0].quantidade *
          //   productToBeRemovedFromCart[0].preco;

          console.log('oiiii',productToBeRemovedFromCart[0])

          this.cart.splice(productToBeRemovedFromCart[0], 1);
        }

        //atualizar saldo

        this.modalCart = false;
      }

      */
    },

    debouncedSetAllProducts: debounce(function (query) {
      //arrow function não funciona bem por causa do this dentro da função
      this.setAllProducts(query);
    }, 350), // 350ms de atraso

    onSearchInput(query) {
      //evento listener de v-autocomplete

      //console.log('aaaa',query)
      this.searchQuery = query.target.value;
      this.debouncedSetAllProducts(this.searchQuery);
      //this.setAllProducts(query)
    },
  },

  computed: {
    totalPriceComputed() {

      let tp = this.cart.reduce((accumulator, currentValue) =>
         accumulator + currentValue.preco * currentValue.quantidade
      , 0) //return já está implícito sem as chaves

      //console.log('mds', tp)

      return tp.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    },  

    // totalPriceComputed() {
    //   let tp = this.cart.reduce((accumulator, currentValue) => {
    //     return accumulator + currentValue.preco * currentValue.quantidade;
    //   }, 0);

    //   console.log('mds', tp); // Agora vai retornar o valor correto

    //   return tp.toLocaleString("pt-BR", {
    //     style: "currency",
    //     currency: "BRL"
    //   });
    // },


    ...mapState({
      allProducts: (state) => state.products,
    }),

    ...mapGetters({
      getAllClients: "getAllClients",
      getAllProducts: "getAllProducts",
    }),

    orderTotalPrice() {
      // let totalPrice = 0;

      // console.log('antes carrinho', totalPrice)
      // this.cart.forEach((order) => {
      //   console.log('orderrr', order)
      //   totalPrice += order.preco * order.quantidade;
      // });
      // console.log('depois carrinho', totalPrice)
      //console.log('tp', totalPrice)

      //totalPrice = totalPrice.toFixed(2).replace('.', ',')

      //console.log('tp', totalPrice)

      return this.totalPrice.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
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

<style>
.produtos {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 80.5%;
  /* border: 1px solid red */
  margin: auto;
  margin-top: 10px;
}

.pagamentoEPreco {
  max-width: 50%;
  /* border: 1px solid red */
}

.tipoPagamento {
  width: 20px;
  max-width: 300px;
  /* border: 1px solid red */
}

.precoTotal {
  width: 3000px;
  max-width: 300px;
  /* border: 1px solid red */
}

.finalizarCompra {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.cart {
  width: 82%;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 400px;
}

.cart th {
  background-color: #a269f1;
  color: white;
  font-weight: bold;
}

.v-icon__content {
  background-color: green;
}

.cliente {
  margin-left: 170px;
  max-width: 20%;
  margin-top: 50px;
}

.productName {
  width: 100%;
}

#qtdProdCarrinho {
  margin-left: 25px;
  text-decoration: underline;
}

.newDesiredQuantity {
  max-width: 15%;
  margin-left: 25px;
}
</style>
