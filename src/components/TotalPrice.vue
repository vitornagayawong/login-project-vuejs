<template>
    <div>
        <v-text-field
            label="Total Price (R$)"
            outlined
            v-model="totalPriceComma"
            disabled
        ></v-text-field>        
    </div>
</template>

<script>
    export default {
        name: 'TotalPriceComponent',
        computed: {            
            totalPriceComma() {
                return this.orderTotalPrice
            }
        }, 
        props: ['orderTotalPrice']
    }
</script>