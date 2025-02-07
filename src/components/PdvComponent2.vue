<template>
  <div>
    <v-container>
      <v-row align="center" >
        <v-col class="d-flex" cols="12" sm="12">
          <v-select
            label="Select a Client"
            :items="getAllClients"
            item-text="nome"
            item-value="id"
            v-model="selectedClient"
            :rules="clientRules"            
            autofocus
            :error="!selectedClient"
            :error-messages="!selectedClient ? 'Select an existing client!' : ''"
            style="max-width: 40%; margin: auto;"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

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
              @keydown.enter="pressEnterKey()"
              @keyup="onSearchInput"
              class="mx-2 productName"
              color="purple"
              :rules="productRules"
              hide-selected
              :menu-props="{transition: false}"
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
        no-data-text="No itens choosen yet"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="openModalCart(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="removeItemFromCart(item)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>      
        
        <template v-slot:[`item.preco`]="{ item }">
          <span>{{ item.preco.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }) }}
          </span>
        </template>
      </v-data-table>
    </v-container>

    <v-dialog v-model="modalCart" max-width="430">
      <v-card class="modalCartEdit">
        <v-card-title>
          <span class="headline">Detalhes do Produto no Carrinho</span>
        </v-card-title>

        <p id="qtdProdCarrinho">Qtd Prod: {{ newProductQuantityInCart }}</p>

        <div class="d-flex align-center">
          <v-text-field
            label="Input a new desired quantity"
            v-model="newProductQuantityInCart"
            class="newDesiredQuantity"
          ></v-text-field>

          <v-btn class="mx-3 red lighten-2" @click="subtractNewProductQuantityInCart">(-)</v-btn>
          <v-btn class="green lighten-2" @click="addNewProductQuantityInCart">(+)</v-btn>

        </div>

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
        class="pagamentoEPreco"        
      >
        <v-col cols="12" lg="6">
          <v-radio-group v-model="radioGroup">
            <v-radio             
              label="Discount in subtotal"
              value="1"
            ></v-radio>
            <v-radio             
              label="Discount on itens"
              value="2"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col class="d-flex" cols="12" sm="=12" lg="6">
          <v-select
            label="Select a type of payment"
            :items="typesPayment"
            item-text="description"
            item-value="description"
            v-model="selectedTypeOfPayment"
            :rules="typeOfPaymentRules"
            class="tipoPagamento"
            :error="!selectedTypeOfPayment"
            :error-messages="!selectedTypeOfPayment ? 'Select an existing type of payment' : ''"
          ></v-select>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Total Price (R$)"
            outlined
            v-model="totalPriceComputed"
            disabled
            class="totalPrice"
          ></v-text-field>
        </v-col>

        <div class="cupomDesc">
          <v-col cols="12" class="coupon">
            <v-text-field
              label="Do you have a discount coupon?"
              placeholder="Discount coupon"
              v-model="txtCoupon"
              outlined
              :rules="txtCouponRules"
              :disabled="isTxtCouponDisabled"
            ></v-text-field>
          </v-col>
  
          <v-col cols="12" sm="6">
            <v-btn @click="applyCoupon">Apply</v-btn>
          </v-col>
        </div>

      </v-row>
    </v-container>

    <v-btn
      @click="openDialogFinalizePurchase()"
      class="finalizarCompra green darken-1"
      >Finalize purchase</v-btn
    >

    <v-dialog v-model="dialogFinalizePurchase" persistent max-width="430">
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
          <v-toolbar color="primary" dark class="invoice1">INVOICE 1</v-toolbar>
          <div class="px-10 mt-10">
            <v-row>
              <v-col>Name</v-col>
              <v-col>Quantity</v-col>
              <v-col>Price</v-col>
            </v-row>
            <v-row v-for="(product, index) in cart" :key="index">
              <v-col>{{ product.nome }}</v-col>
              <v-col>{{ product.quantidade }}</v-col>
              <v-col>R$ {{ product.quantidade * product.preco }}</v-col>
            </v-row>
            <v-row d-flex> 
              <v-col>
                <v-card-text>Subtotal: R$ {{ this.totalPriceFakeInvoice() }}</v-card-text>
              </v-col>
              <v-col>
                <v-card-text>Discount: R$ {{ discountInReais }}</v-card-text>
              </v-col>
              <v-col>
                <v-card-text>Total Price: {{ this.totalPriceComputed }}</v-card-text>
              </v-col>
            </v-row>
          </div>          
          <v-card-actions class="justify-end">
            <v-btn text @click="closeDialogInvoice" class="red accent-4">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="dialogInvoice2"
    >
      <template>
        <v-card >
          <v-toolbar color="primary" dark>INVOICE 2</v-toolbar>    
          <div class="px-10 mt-10">
            <v-row>
              <v-col>Name</v-col>
              <v-col>Quantity</v-col>
              <v-col>Original Price</v-col>
              <v-col>Discount</v-col>
              <v-col>Final Price</v-col>
            </v-row>
            <v-row v-for="(product, index) in cartInvoice2" :key="index">
              <v-col>{{ product.nome }}</v-col>
              <v-col>{{ product.quantidade }}</v-col>
              <v-col>R$ {{ product.subtotal }}</v-col>
              <v-col>R$ {{ product.discount }} </v-col>
              <v-col>R$ {{ product.total }} </v-col>
            </v-row>
            <v-row> 
              <v-col d-flex justify-space-between>
                <v-card-text>Subtotal: R$ {{ this.totalPriceFakeInvoice() }}</v-card-text>
              </v-col>
              <v-col>
                <v-card-text>Discount: R$ {{ discountInReais }}</v-card-text>
              </v-col>
              <v-col>
                <v-card-text>Total Price: {{ this.totalPriceComputed }}</v-card-text>
              </v-col>
            </v-row>
          </div>      
          
          <v-card-actions class="justify-end">
            <v-btn text @click="closeDialogInvoice2" class="deep-purple lighten-2">Close</v-btn>
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
      user: {
        name: '',
        email: ''
      },
      radioGroup: 0,
      totalPriceInInvoice: 0,
      selectedIdCoupon: 0,
      isTxtCouponDisabled: false,
      couponDiscount: 0,
      txtCoupon: '',
      precoComPonto: "",
      dialogInvoice: false,
      dialogInvoice2: false,
      clientRules: [
        (client) => !!client || "Select a client!", 
      ],
      productRules: [
        (product) => !!product || "Insert a product!",
        //(product) => (product && product.id) || 'Invalid product selected!',
      ],
      typeOfPaymentRules: [(payment) => !!payment || "Choose a payment!"],
      selectedProductQuantityRules: [
        (selectedProductQuantity) => typeof(selectedProductQuantity) != Number || 'This must be numeric!'
      ],
      dialogFinalizePurchase: false,
      //totalPrice: 0,
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
        { text: "Price", value: "preco", width: '100px' },
        { text: "Weight", value: "peso" },
        { text: "Height", value: "altura" },
        { text: "Quantity", value: "quantidade" },
        { text: "Ações", value: "actions" },
      ],
      filterProducts: [],
      txtCouponRules: [
        () => this.txtCoupon.length <= 3 || 'Text max lenght is 3'
      ]
    };
  },

  methods: {
    // ...mapActions({
    //   setAllClients: "setAllClients",
    //   setAllProducts: "setAllProducts",
    //   setCoupons: "setCoupons"
    // }),

    async getUserData() {
      try {
        const response = await http.post('me')
        //console.log('user', response)
        this.user.name = response.data.name
        this.user.email = response.data.email
      } catch(e) {
        console.log(e)
      }
    },

    ...mapActions('clientModule', {
      setAllClients: "setAllClients",      
    }),
    ...mapActions('productsModule', {
      setAllProducts: "setAllProducts",      
    }),
    ...mapActions('couponsModule', {
      setCoupons: "setCoupons",      
    }),

    openModal(product) {
      this.selectedProduct = product;
      this.modal = true;
    },

    openModalCart(product) {
      this.selectedProduct = product;
      this.newProductQuantityInCart = product.quantidade
      this.modalCart = true;
    },

    closeModal() {
      //this.modal = false;
      this.modalCart = false;
    },

    async finalizePurchase() {
      try {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        const year = date.getFullYear();

        if (day < 10) {
          day = "0" + day;
        }

        if (month < 10) {
          month = "0" + month;
        }

        const fullDate = year + "-" + month + "-" + day;

        const payload = {
          //cupom_desconto_id: this.selectedIdCoupon,
          cliente_id: this.selectedClient,
          data: fullDate,
          subtotal: this.subTotal,
          desconto_porcentagem: this.couponDiscount, 
          valor_total: this.totalPriceComputedDot,
          forma_pgt: this.selectedTypeOfPayment,
          produtos: this.cart,
          user: this.user
        };

        if(this.selectedIdCoupon) { //adicionando um atributo dentro de um if
          payload.cupom_desconto_id = this.selectedIdCoupon
        }       

        const response = await http.post("pedidos", payload);

        //console.log('response', response)        

        if (response.data.response === null ) {
          window.alert("Fill all the required fields!");
          this.dialogFinalizePurchase = false;
        }

        if (response.data.error) {
          window.alert(response.data.error);
          //this.dialogFinalizePurchase = false
        }

        if(this.discountInRadioButtons == 1 && response.statusText == "Created") {          
          this.dialogInvoice = true;
        } else if (this.discountInRadioButtons == 2 && response.statusText == "Created"){          
          this.dialogInvoice2 = true;
        }
      } catch (e) {
        console.log(e);
      }
    },

    openDialogFinalizePurchase() {
      if (!this.selectedClient) {
        window.alert("Select a client to proceed!");
      } else if(this.cart.length == 0) {
        window.alert("Your cart is empty yet! Choose an item to proceed!");
      } else if(!this.selectedTypeOfPayment) {
        window.alert("Select a type of payment to proceed!");
      } else if(this.radioGroup == 0) {
        window.alert("Select a type of discount in invoice!");
      } else {
        this.dialogFinalizePurchase = true;
      }
    },

    closeDialogInvoice() {
      this.dialogFinalizePurchase = false;
      this.dialogInvoice = false;
    },

    closeDialogInvoice2() {
      this.dialogFinalizePurchase = false;
      this.dialogInvoice2 = false;
    },

    addToCart() {
      try {
       
        let prod = this.getAllProducts.find(
          (product) => product.id == this.selectedProduct
        );

        if (this.selectedProductQuantity == 0) {
          window.alert("Quantity has to be more than zero!");
          this.selectedProductQuantity = 1
        } else if (this.selectedProductQuantity > prod.estoque) {
          window.alert(`We don't have this quantity in our storage, sorry! Now it's available only ${prod.estoque} units!`);
          this.selectedProductQuantity = 1
        } else {
          if (prod) {
            let productAlreadyInCart = this.cart.find((p) => p.id === prod.id);
            let producIndextAlreadyInCart = this.cart.findIndex((p) => p.id === prod.id);

            if (productAlreadyInCart) {
              // productAlreadyInCart.quantidade += Number(
              //   this.selectedProductQuantity

              //console.log(productAlreadyInCart)
              //console.log('index', producIndextAlreadyInCart)
              //console.log('cartt',this.cart)

              this.cart = this.cart.map(p => {    //esse map retorna um novo array mapeado, por isso vc precisa atribuir esse novo array ao this.cart original   
                if(p.id == this.cart[producIndextAlreadyInCart].id) {
                    p.quantidade += this.selectedProductQuantity
                }
                return p //não esquecer o return devido à chave
              })

              // );
              // productAlreadyInCart = { 
              //   ...productAlreadyInCart, quantidade: productAlreadyInCart.quantidade + Number(this.selectedProductQuantity) }
              
             // this.totalPrice += this.selectedProductQuantity * productAlreadyInCart.preco;
              
             //this.totalPrice.toFixed(2)           
             //console.log('aquiiiiiiiiyuyuyy')   
              
            } else {
              //console.log('caiu quii')
              prod.quantidade = Number(this.selectedProductQuantity);
              this.cart.push(prod);
              //console.log('aqui', obj)
             //this.totalPrice += prod.quantidade * prod.preco;
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
        }
        
      } catch (e) {
        console.log(e);
      }
    },

    updateItem() {
      let choosenProductIndex = this.cart.findIndex(
        (product) => product.id == this.selectedProduct.id
      );

      //console.log('choosenProductIndex', choosenProductIndex)
      //console.log('newProductQuantityInCart', this.newProductQuantityInCart)

      //let setedQuantityInCart = this.cart[choosenProductIndex].quantidade;

      this.cart = this.cart.map(p => {
        // if(this.newProductQuantityInCart > p.estoque) {
        //   console.log('oxee', this.cart[choosenProductIndex].quantidade)
        //   console.log('oxee2', p.quantidade)
        //   this.newProductQuantityInCart = this.cart[choosenProductIndex].quantidade
        //   window.alert('New desired quantity is higher than the storage!')
        // } 

        if(p.id == this.cart[choosenProductIndex].id) {
          if(this.newProductQuantityInCart > p.estoque) {
            window.alert('New desired quantity is higher than the storage!')
            this.newProductQuantityInCart = p.quantidade
          } else {
            p.quantidade = this.newProductQuantityInCart
          }
        }
        return p
      }
    )

      //this.cart[choosenProductIndex].quantidade = this.newProductQuantityInCart;

      // this.totalPrice +=
      //   (this.newProductQuantityInCart - setedQuantityInCart) *
      //   this.cart[choosenProductIndex].preco;
    },

    removeItemFromCart(product) { 

      let confirm = window.confirm("Are you sure you want to remove this item from cart?")

      if(confirm) {
        let allProductsExceptTheChoosenOne = this.cart.filter( p => {
          return p.id != product.id
        })

        this.cart = allProductsExceptTheChoosenOne
      }       

      /* LÓGICA USANDO O MÉTODO FILTER     

      //this.selectedProduct = product;      

      let productToBeRemovedFromCart = this.cart.filter(
        (p) => { 
          
         return  p.id == product.id //SE TIVER AS CHAVES TEM QUE DAR UM RETURN

        }
      );     
      
      if (productToBeRemovedFromCart) {
        let confirm = window.confirm(
          "Are you sure you want to remove this item from cart?"
        )

        if (confirm) {          
          // this.totalPrice -=
          //   productToBeRemovedFromCart[0].quantidade *
          //   productToBeRemovedFromCart[0].preco;          

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
      this.searchQuery = query.target.value;
      this.debouncedSetAllProducts(this.searchQuery);
    },

    addNewProductQuantityInCart() {
      this.newProductQuantityInCart++
    }, 

    subtractNewProductQuantityInCart() {
      this.newProductQuantityInCart--
      if(this.newProductQuantityInCart <= 0) {
        this.newProductQuantityInCart = 0
      }
    },

    pressEnterKey(product) {
      let selectedItem = this.cart.find(p => p.id == product.id)

      if(selectedItem) {
        this.selectedProduct = selectedItem
      }
    },

    applyCoupon() { 
      let couponChoosen = this.getCoupons.filter(c => {
        //console.log('c' , c.codigo)
        return c.codigo == this.txtCoupon
      })

      //console.log('antes',couponChoosen)
      
      if(couponChoosen.length != 0) { //aqui achou o cupom
        //console.log('this.totalPriceComputed', this.totalPriceComputed)
        if(this.totalPriceComputed == 'R$ 0,00') {
          window.alert('Choose a product before to continue!')        
        } else { //tem pelo menos um produto no carrinho
          //console.log('couponChoosen.valor_desconto', couponChoosen[0].valor_desconto)
          //console.log('this.totalPriceComputed', this.totalPriceComputed)
          this.couponDiscount = Number(couponChoosen[0].valor_desconto)
          this.isTxtCouponDisabled = true
          this.selectedIdCoupon = couponChoosen[0].id
          //console.log('aquii', this.couponDiscount)
          return this.couponDiscount
        }
        //console.log('oiii')          
        
      } else {
        window.alert('Coupon not found!')
        this.txtCoupon = ''
      }

    },

    totalPriceFakeInvoice() {
      let tpc = this.cart.reduce((accumulator, product) =>  {
        return accumulator + product.quantidade * product.preco
      }, 0).toFixed(2)

      return this.totalPriceInInvoice = tpc
    },
  },  

  computed: {

    cartInvoice2() {
      let cart = this.cart.map(p => {
         return p = {
          ...p,
          subtotal: (p.quantidade * p.preco).toFixed(2),
          discount: (p.quantidade * p.preco * this.couponDiscount / 100).toFixed(2),
          total: (p.quantidade * p.preco - (p.quantidade * p.preco * this.couponDiscount / 100)).toFixed(2)
         }
      })

      return cart
    },

    discountInRadioButtons() {
      return this.radioGroup
    },

    discountInReais() {
      let dir = this.subTotal * this.couponDiscount / 100

      return dir.toFixed(2)
    },

    subTotal() {

      let subtotal = this.cart.reduce((accumulator, product) =>  {
        return accumulator + product.quantidade * product.preco
      }, 0)    

      return subtotal.toFixed(2)
    }, 

    totalPriceComputed() {

      let tpc = this.cart.reduce((accumulator, product) =>  {
        return accumulator + product.quantidade * product.preco
      }, 0)

      tpc = tpc * (100 - this.couponDiscount) * 0.01 

      return tpc.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }, 

    totalPriceComputedDot() {
      let tpcd = this.cart.reduce((accumulator, product) =>  {
        return accumulator + product.quantidade * product.preco
      }, 0)

      return tpcd.toFixed(2)
    }, 

    ...mapState({
      allProducts: (state) => state.products,
    }),

    // ...mapGetters({
    //   getAllClients: "getAllClients",
    //   getAllProducts: "getAllProducts",
    //   getCoupons: "getCoupons"
    // }),

    ...mapGetters('authModule', {
      getToken: 'getToken'
    }),
    ...mapGetters('clientModule', {
      getAllClients: 'getAllClients'
    }),
    ...mapGetters('productsModule', {
      getAllProducts: 'getAllProducts'
    }),
    ...mapGetters('couponsModule', {
      getCoupons: 'getCoupons'
    }),

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

  // watch() {
  //     cart(newValue, oldValue) => {
  //       console.log('newValue', newValue)
  //       console.log('oldValue', oldValue)
        
  //     }
  //   },

  mounted() {
    this.setAllClients();    
    this.setAllProducts(this.searchQuery);
    this.setCoupons()
  },

  created() {
    this.getUserData()
  },

  onMounted() {},

  beforeUpdate() {},
  
  updated() {
  },
};
</script>

<style>
.cliente{
  max-width: 500px;
}

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
  max-width: 18%;
  margin: auto;
  /* border: 1px solid red */
}

.tipoPagamento {
  /* width: 20px; */
  max-width: 100%;
  /* border: 1px solid red */
}

.finalizarCompra {
  position: absolute;
  bottom: 10px;
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

.totalPrice {
  
  margin: auto;
}

.cupomDesc {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.coupon {
 margin-top: 32px;
}



@media(max-width: 600px) {
  .totalPrice {
    max-width: 100%;
    margin: auto;    
  }

  .v-btn__content {
    font-size: 10px;
  }
}

@media (min-width: 960) and (max-width: 1264px) {

}

@media (min-width: 960) and (max-width: 1264px) {
  .modalCartEdit {
    max-width: 10%;
  }
}
</style>
