<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-button type="primary" icon="el-icon-plus" >添加新的销售单</el-button>
    </div>
    <el-table :data="orders" border style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="50">
      </el-table-column>
      <el-table-column
          prop="order_no"
          label="订单号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="customer_name"
          label="客户"
          width="100">
      </el-table-column>

      <el-table-column
          prop="handler_name"
          label="经办人"
          width="width">
      </el-table-column>

      <el-table-column
          prop="amount"
          label="金额"
          width="80">
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="开单时间"
          width="140">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)"  type="text" icon="el-icon-search" size="small">详情</el-button>
          <el-button  type="text" icon="el-icon-delete"  size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "SaleOrderList",
  data(){
    return {
      orders:[]
    }
  },
  mounted() {
    this.initOrders();
  },
  methods:{
    showDetail(row){
      console.log(row)
    },
    initOrders(){
      this.getRequest('/admin/saleOrderList').then(resp=>{
        if(resp){
          this.orders = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
