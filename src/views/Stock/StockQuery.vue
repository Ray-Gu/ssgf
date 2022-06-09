<template>
  <div>
    <el-table :data="stocks" stripe border style="width: 100%" show-summary>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="商品名" width="180"></el-table-column>
      <el-table-column prop="specs" label="规格" width="120"></el-table-column>
      <el-table-column prop="unit_name" label="单位" width="120"></el-table-column>
      <el-table-column prop="purchase_price" label="进价（元）" width="120"></el-table-column>
      <el-table-column prop="stock" label="库存" width="120"></el-table-column>
      <el-table-column prop="stock_cost" label="成本(元）" width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "StockQuery",
  data(){
    return {
      stocks:[],
    }
  },
  mounted() {
    this.initStock();
  },
  methods:{
    initStock(){
      this.getRequest('/admin/stocks').then(resp=>{
        if(resp){
          this.stocks = resp.data;
        }

      })
    }
  }
}
</script>

<style scoped>

</style>
