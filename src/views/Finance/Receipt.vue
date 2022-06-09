<template>
  <div>
    <h4>收款单</h4>
    <el-form ref="form" :model="receipt" label-width="80px" inline>
      <el-form-item label="单号">
        <el-input v-model="receipt.no" disabled></el-input>
      </el-form-item>
      <el-form-item label="来源">
        <el-input v-model="receipt.from"></el-input>
      </el-form-item>
      <el-form-item label="收款账户">
        <el-select v-model="receipt.account_id" placeholder="请选择">
          <el-option
              v-for="item in accounts"
              :key="item.id"
              :label="item.alias"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-table :data="receipt.items" border show-summary style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="good" label="科目" width="180"></el-table-column>
        <el-table-column prop="good" label="摘要" width="180"></el-table-column>
        <el-table-column prop="good" label="金额" width="180"></el-table-column>
        <el-table-column prop="good" label="科目" width="180"></el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Receipt",
  data(){
    return{
      accounts:[],
      receipt:{
        no:new Date().getTime(),
        from:'',
        account_id:null,
        items:[]
      }
    }
  },
  mounted() {
    this.initAccounts();
  },
  methods:{
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

<style scoped>

</style>
