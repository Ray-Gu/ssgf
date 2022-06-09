<template>
  <div class="container">
    <div class="header">
      <h4>采购入库单</h4>
    </div>
    <el-form ref="form" :model="newOrder" label-width="90px" inline>
      <el-form-item label="订单号">
        <el-input v-model="newOrder.order_no" disabled placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="供货单位">
        <el-select v-model="newOrder.suplier" value-key="id" placeholder="请选择">
          <el-option v-for="item in customers" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="制单人">
        <el-select v-model="newOrder.prepare" value-key="id" placeholder="请选择">
          <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经办人">
        <el-select v-model="newOrder.handler" value-key="id" placeholder="请选择">
          <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="复核人">
        <el-select v-model="newOrder.reviewer" value-key="id" placeholder="请选择">
          <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开单时间">
        <el-date-picker
            v-model="newOrder.create_time"
            type="datetime"
            value-format="yyyy-MM-dd HH-mm-ss"
            placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="newOrder.desc" placeholder="摘要"></el-input>
      </el-form-item>

      <el-table :data="newOrder.items" border style="width: 100%" show-summary>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="good" label="商品" width="width">
          <template slot-scope="{row}">
            <el-select v-model="row.good" value-key="id" filterable placeholder="请选择">
              <el-option v-for="item in goods" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="good.specs" label="规格" width="100"></el-table-column>
        <el-table-column prop="good.unit" label="单位" width="100"></el-table-column>
        <el-table-column prop="good.purchase_price" label="采购价(元）" width="120">
          <template slot-scope="{row}">
            <el-input v-model="row.good.purchase_price"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" width="80">
          <template slot-scope="{row}">
            <el-input v-model="row.amount"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣" width="80">
          <template slot-scope="{row}">
            <el-input v-model="row.discount"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="sum" label="合计" width="80">
          <template slot-scope="{row}">{{ row.sum = row.good.purchase_price*row.discount*row.amount}}</template>
        </el-table-column>
        <el-table-column prop="desc" label="备注" width="80">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{row}">
            <el-button @click="deleteItem(row)" type="danger" size="mini" icon="el-icon-close" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;display: flex;justify-content: space-between;">
        <el-button type="primary" icon="el-icon-plus" @click="newLine">新增一行</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrder">确认订单</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import formatDate from '@/tool/dateformat.js'
export default {
  name: "NewBuyOrder",
  data() {
    return {
      customers:[],
      employees:[],
      goods:[],
      newOrder:{
        order_no:new Date().getTime(),
        suplier:{},
        prepare:{},
        handler:{},
        reviewer:{},
        items:[],
        create_time:formatDate(),
        amount:null,
        desc:''
      }
    }
  },
  mounted() {
    this.initCustomers();
    this.initEmployee();
    this.initAllGoods();
  },
  methods:{

    saveOrder(){
      this.postRequest('/admin/buyorders/add',this.newOrder).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.newOrder = {
            order_no:new Date().getTime(),
            suplier:{},
            prepare:{},
            handler:{},
            reviewer:{},
            items:[],
            create_time:formatDate(),
            amount:null,
            desc:''
          };
        }
      })
    },
    deleteItem(row){
      const index = this.newOrder.items.findIndex(item=>{
        return item.key === row.key;
      });
      this.newOrder.items.splice(index,1);
    },
    newLine(){
      this.newOrder.items.push(
          {
            key:new Date(), //标志
            good:{
              id:null,
              name:'',
              spec:'',
              unit:'',
              purchase_price:null,
            },
            discount:1,
            sum:null,
          }
      );
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
    .header{

    }
  }
</style>
