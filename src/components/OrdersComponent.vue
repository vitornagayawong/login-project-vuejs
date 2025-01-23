<template>
  <div>
    <h1>Orders</h1>

    <br /><br /><br /><br /><br />

    <!--Propriedade :page no v-data-table
    A propriedade page no v-data-table controla qual página será exibida na tabela-->

    <!-- @page-count="pageCount = $event"      ESSA PROPRIEDADE iria dentro do v-data-table, mas nesse caso nem precisa devido ao :lenght do v-pagination -->
    <v-data-table
      :headers="headers"
      :items="getOrders"
      :page.sync="page" 
      hide-default-footer
      class="elevation-1"
    ></v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" @input="funcao"></v-pagination>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: "OrdersComponent",

  data() {
    return {
      page: 1,
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Cliente Id", value: "cliente_id" },
        { text: "Data", value: "data" },
        { text: "ValorTotal", value: "valor_total" },
        { text: "Forma pgt", value: "forma_pgt" },        
      ],
    };
  },

  methods: {
    ...mapActions({
        setOrders: 'setOrders',
        setPageOrders: 'setPageOrders'
    }),

    async funcao(paginacaoAtual) {
        this.setPageOrders(paginacaoAtual) // Atualiza o estado da página no Vuex
        await this.setOrders() // Recarrega os pedidos com base na página
    }
  },    

  computed: {
    ...mapState({
        lastPage: state => state.paginationOrders.lastPage
    }),

    ...mapGetters({
        getOrders: 'getOrders',
    }),

    pageCount() {
        //return this.$store.state.paginationOrders.lastPage; 
        return this.lastPage
    }
  },

  mounted() {
    this.setOrders(),
    this.setPageOrders(this.page)
  }
};
</script>
