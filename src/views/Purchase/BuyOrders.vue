<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-button type="primary" icon="el-icon-plus" >添加新的采购单</el-button>
    </div>
    <el-table
        :data="buyOrders"
        border
        style="width: 100%"
    >
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
          label="供应商"
          width="100">
      </el-table-column>
      <el-table-column
          prop="prepare_name"
          label="制单人"
          width="100">
      </el-table-column>
      <el-table-column
          prop="handler_name"
          label="经办人"
          width="width">
      </el-table-column>
      <el-table-column
          prop="reviewer_name"
          label="复核人"
          width="80">
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

    <el-dialog custom-class="customWidth" :visible.sync="visible">
      <div style="text-align: center;letter-spacing: 5px;">
        <h3>采购入库单</h3>
      </div>
      <div>
        <el-form  label-width="80px" inline>
          <el-form-item label="订单号">{{orderDetail.order_no}}</el-form-item>
          <el-form-item label="摘要">{{orderDetail.create_time}}</el-form-item>
          <el-form-item label="摘要">{{orderDetail.description}}</el-form-item>
          <el-table :data="detailForm" border style="width: 100%">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="specs" label="规格" width="100"></el-table-column>
            <el-table-column prop="unit" label="单位" width="80">
            </el-table-column>
            <el-table-column prop="purchase_price" label="价格" width="80"></el-table-column>
            <el-table-column prop="discount" label="折扣" width="80"></el-table-column>
            <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
            <el-table-column prop="sum" label="小计" width="80"></el-table-column>
            <el-table-column prop="description" label="备注" width="width"></el-table-column>
          </el-table>
          <el-form-item label="制单人">{{orderDetail.prepare_name}}</el-form-item>
          <el-form-item label="经办人">{{orderDetail.handler_name}}</el-form-item>
          <el-form-item label="复核人">{{orderDetail.reviewer_name}}</el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "BuyOrders",
  data(){
    return {
      buyOrders:[],
      visible:false,
      orderDetail:{},
      detailForm:{},
    }
  },
  mounted() {
    this.initBuyOrders();
  },
  methods:{
    showDetail(row){
      this.getRequest(`/admin/buyorders/getdetail/${row.order_no}`).then(resp=>{
        if(resp){
          this.detailForm = resp.data;
          this.orderDetail = {...row};
          this.visible = true;
        }
      })
    },
    initBuyOrders(){
      this.getRequest('/admin/buyorders').then(resp=>{
        if(resp){
          this.buyOrders = resp.data;
        }
      })
    }
  }
}
</script>

<style >
.customWidth{
  width: 900px;
}
</style>
