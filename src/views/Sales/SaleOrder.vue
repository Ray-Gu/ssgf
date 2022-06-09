<template>
  <div class="container">
    <div class="title">
      销售单
    </div>
    <el-form :model="saleOrder" inline>
    <div class="header">
      <el-form-item label="销售单号">
        <el-input v-model="saleOrder.order_no" placeholder="placeholder" disabled></el-input>
      </el-form-item>

      <el-form-item label="开单时间">
        <el-date-picker
            v-model="saleOrder.create_time"
            type="datetime"
            value-format="yyyy-MM-dd HH-mm-ss"
            placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="客户">
        <el-select v-model="saleOrder.customer_id" placeholder="请选择">
          <el-option
              v-for="item in customers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经办人">
        <el-select v-model="saleOrder.handler_id" placeholder="请选择">
          <el-option
              v-for="item in employees"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
      <div class="detail">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addNewLine">增加一行</el-button>
        <el-table :data="saleOrder.items" border show-summary style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="good" label="商品" width="180">
            <template slot-scope="{row}">
              <el-select v-model="row.good" value-key="id" filterable placeholder="请选择" @change="changeSum(row)">
                <el-option v-for="item in goods" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="good.specs" label="规格"></el-table-column>
          <el-table-column prop="good.unit_name" label="单位"></el-table-column>
          <el-table-column prop="good.sale_price" label="单价"></el-table-column>
          <el-table-column prop="quantity" label="数量">
            <template slot-scope="{row}">
              <el-input v-model="row.quantity" placeholder="输入数量" @input="changeSum(row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="discount" label="折扣">
            <template slot-scope="{row}">
              <el-input v-model="row.discount" placeholder="折扣" @input="changeSum(row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sum" label="小计">
            <template slot-scope="{row}">
              <el-input v-model="row.sum"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="{row}">
              <el-button @click="deleteItem(row)" type="danger" size="mini" icon="el-icon-close" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="saveSaleOrder" type="primary" icon="el-icon-check">确认销售</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
import formatDate from "@/tool/dateformat";

export default {
  name: "SaleOrder",
  data(){
    return {
      employees:[],
      customers:[],
      goods:[],
      saleOrder:{
        create_time:formatDate(),
        order_no:new Date().getTime(),
        handler_id:null,
        customer_id:null,
        items:[]
      }
    }
  },
  mounted() {
    this.initCustomers();
    this.initEmployee();
    this.initAllGoods();
  },
  methods:{
    saveSaleOrder(){
      const order_no = this.saleOrder.order_no;
      let amount =0;
      this.saleOrder.items.forEach(item=>{
        item.good_id = item.good.id;
        delete item.key;
        delete item.good;
        item.order_no = order_no;
        amount = amount + item.sum;
      })
      this.saleOrder.amount = amount;
    // console.log(this.saleOrder);
     this.postRequest('/admin/newSaleOrder',this.saleOrder).then(resp=>{
       if(resp){
         this.$message.success(resp.message);
       }
     })
    },
    deleteItem(row){
      const index = this.saleOrder.items.findIndex(item=>{
        return item.key === row.key;
      });
      this.saleOrder.items.splice(index,1);
    },
    changeSum(row){
      row.sum = row.good.sale_price*row.quantity*row.discount;
    },
    addNewLine(){
      this.saleOrder.items.push({
        key:new Date(),
        quantity:0,
        discount:1,
        sum:0,
      });
    },
    initAllGoods(){
      this.getRequest(`/admin/allgoods`).then(resp=>{
        if(resp){
          this.goods = resp.data;
        }
      })
    },
    initEmployee(){
      this.getRequest(`/admin/employees/null`).then(resp=>{
        if(resp){
          this.employees = resp.data;
        }
      })
    },
    initCustomers(){
      this.getRequest('/admin/customers').then(resp=>{
        if(resp){
          this.customers = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .container{
    padding: 10px;
    .title{
      font-size: 19px;
      font-weight: 550;
      letter-spacing: 10px;
      color: #303133;
      border-bottom: 1px solid #EBEEF5;
    }
    .header{
      margin-top: 10px;
    }
    .footer{
      margin-top: 10px;
      margin-right: 20px;
      float: right;
    }
  }
</style>
