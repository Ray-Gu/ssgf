<template>
<div>
  <div style="margin-bottom: 15px">
    <el-button type="primary" icon="el-icon-plus" @click="addNewCustomer">增加新客户</el-button>

    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form ref="form" :model="customerForm" label-width="80px">
        <el-form-item label="客户类型">
          <el-select v-model="customerForm.type" placeholder="请选择">
            <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名">
          <el-input v-model="customerForm.name" placeholder="客户名"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="customerForm.contacts" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="customerForm.telephone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="手机">
        <el-input v-model="customerForm.mobilephone" placeholder="手机"></el-input>
      </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="customerForm.email" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="customerForm.address" placeholder="地址"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCustomer">确 定</el-button>
      </span>
    </el-dialog>

  </div>
  <el-table
      :data="customers"
      border
      style="width: 100%">
    <el-table-column
        type="index"
        label="序号"
        width="50">
    </el-table-column>
    <el-table-column
        prop="name"
        label="客户名"
        width="120">
    </el-table-column>
    <el-table-column
        prop="contacts"
        label="联系人"
        width="100">
    </el-table-column>
    <el-table-column
        prop="mobilephone"
        label="手机"
        width="100">
    </el-table-column>
    <el-table-column
        prop="address"
        label="地址"
        width="width">
    </el-table-column>
    <el-table-column
        prop="receivables"
        label="应收款"
        width="80">
    </el-table-column>
    <el-table-column
        prop="dues"
        label="应付款"
        width="80">
    </el-table-column>
    <el-table-column
        prop="type"
        label="客户类型"
        width="80">
      <template slot-scope="scope">
        <el-tag v-show="scope.row.type===1">客户</el-tag>
        <el-tag v-show="scope.row.type===2" type="success">供应商</el-tag>
        <el-tag v-show="scope.row.type===3" type="warning">客户/供应商</el-tag>
      </template>
    </el-table-column>
    <el-table-column
        fixed="right"
        label="操作"
        width="100">
      <template slot-scope="scope">
        <el-button @click="editCustomer(scope.row)" type="text" icon="el-icon-edit" size="small"></el-button>
        <el-button @click="deleteCustomer(scope.row)" type="text" icon="el-icon-delete"  size="small"></el-button>
      </template>
    </el-table-column>
  </el-table>

</div>
</template>

<script>
export default {
  name: "Customer",
  data(){
    return {
      title:'',
      dialogVisible:false,
      customerForm:{type:3},
      customers:[],
      types:[{id:1,name:'客户'},{id:2,name:'供应商'},{id:3,name:'客户/供应商'}]
    }
  },
  mounted() {
    this.initCustomers();
  },
  methods:{
    editCustomer(row){
      this.dialogVisible = true;
      this.title='编辑客户|供应商信息';
      this.customerForm = {...row};
    },
    deleteCustomer(row){
      const msg = '此操作将从后台永久删除该客户, 是否继续?';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/customers/del/${row.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initCustomers();
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveCustomer(){
      const url = this.customerForm.id?'/admin/customers/upd':'/admin/customers/add';
      this.postRequest(url,this.customerForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initCustomers();
          this.dialogVisible = false;
        }
      })
    },
    addNewCustomer(){
      this.customerForm = {type:3};
      this.title = "增加新的客户/供应商";
      this.dialogVisible = true;
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

<style scoped>

</style>
