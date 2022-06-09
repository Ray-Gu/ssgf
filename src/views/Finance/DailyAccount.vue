<template>
  <div>
    <el-card class="box-card">
      <el-form ref="form" :model="searchForm" label-width="120px" inline>
        <el-form-item label="选择账户">
          <el-select v-model="searchForm.account_id" placeholder="请选择">
            <el-option v-for="item in accounts" :key="item.id" :label="item.alias" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间跨度">
          <el-date-picker v-model="searchForm.dateRanger" type="daterange" align="right" unlink-panels
              value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryDailyAcount">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
        :data="dailyAccount" border style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="50">
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="日期时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="credit"
          label="贷方(元)"
          width="180">
      </el-table-column>
      <el-table-column
          prop="debit"
          label="借方(元)"
          width="180">
      </el-table-column>
      <el-table-column
          prop="balance"
          label="余额(元)"
          width="180">
      </el-table-column>
      <el-table-column
          prop="abstract"
          label="摘要">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DailyAccount",
  data(){
    return {
      dailyAccount:[],
      searchForm:{
        account_id:null,
        dateRanger: '',
      },
      accounts:[],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };

  },
  mounted() {
    this.initAccounts();
  },
  methods:{
    queryDailyAcount(){
      this.getDailyAcount();
    },
    getDailyAcount(){
      this.getRequest('/admin/dailyaccount/'+this.searchForm.account_id).then(resp=>{
        if(resp){
          this.dailyAccount = resp.data;
        }
      })
    },
    initAccounts(){
      this.getRequest('/admin/accounts').then(resp=>{
        if(resp){
          this.accounts = resp.data;
          this.searchForm.account_id = this.accounts[0].id;
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
