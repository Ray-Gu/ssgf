<template>
  <div class="container">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addItem">增加新账户</el-button>
      <el-dialog title="账户信息" :visible.sync="dialogVisible">
        <el-form ref="form" :model="newAccount" label-width="100px">
          <el-form-item label="别名">
            <el-input v-model="newAccount.alias" placeholder="输入账户别名"></el-input>
          </el-form-item>
          <el-form-item label="账户名">
            <el-input v-model="newAccount.name" placeholder="输入账户名称"></el-input>
          </el-form-item>
          <el-form-item label="开户行">
            <el-input v-model="newAccount.bank" placeholder="输入开户行,备用金无需输入"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="newAccount.account_number" placeholder="输入账号,,现金账户无需输入"></el-input>
          </el-form-item>
          <el-form-item label="用户说明">
            <el-input type="textarea" v-model="newAccount.description" placeholder="输入账户使用说明"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAccount">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="roomCardList">
      <el-card class="card" v-for="account in accounts" :key="account.id">
        <div style="display: flex;justify-content: space-between">
          <h4>{{account.alias}}</h4>
          <h4>{{account.bank}}</h4>
        </div>

        <h4>{{account.name}}</h4>

        <h4>{{account.account_number}}</h4>
        <div class="cardfooter">
          <el-button type="warning" @click="editAccount(account)">修改</el-button>
          <el-button type="danger" @click="deleteAccount(account)">删除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Account",
  data(){
    return {
      accounts:[],
      dialogVisible:false,
      newAccount:{},
    }
  },
  mounted() {
    this.initAccounts();
  },
  methods:{
    deleteAccount(row){
      const msg='删除账户信息，请确认！'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/accounts/del/${row.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initAccounts();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editAccount(row){
      this.newAccount ={...row};
      this.dialogVisible = true;
    },
    saveAccount(){
      const url = this.newAccount.id?'/admin/accounts/upd':'/admin/accounts/add';
      this.postRequest(url,this.newAccount).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initAccounts();
          this.dialogVisible = false;
        }
      })
    },
    addItem(){
      this.newAccount={};
      this.dialogVisible = true;
    },
    initAccounts(){
      this.getRequest('/admin/accounts').then(resp=>{
        if(resp){
          this.accounts = resp.data;
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.container{
  padding: 20px;
  .roomCardList{
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    .card{
      background-color: #F2F6FC;
      box-shadow: 0 0 5px 5px rgba(0,10,10,0.09);
      h4{
        text-align: center;
        color: #576f8c;
      }
      width: 400px;
      height: 250px;
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      .cardfooter{
        text-align: center;
      }
    }
  }
}
</style>
