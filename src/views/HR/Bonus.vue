<template>
  <div>
    <el-card class="container">
      <h3>绩效</h3>
      <div class="searchContainer">
        <el-form ref="form" :model="searchInfo" label-width="80px">
          <el-row :gutter="10">
           <el-col :span="6">
             <el-form-item label="查询月份">
               <el-date-picker
                   v-model="searchInfo.month"
                   type="month"
                   value-format="yyyy-MM"
                   placeholder="选择月">
               </el-date-picker>
             </el-form-item>
           </el-col>
            <el-col :span="6">
              <el-form-item label="茶艺师">
                <el-select v-model="searchInfo.employee_id"  clearable placeholder="请选择">
                  <el-option
                      v-for="item in employees"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="handleContainer">
        <el-button type="primary" icon="el-icon-plus" @click="addNewItem">添加一条</el-button>
        <el-button type="primary"  @click="refreshData" icon="el-icon-refresh">刷新数据</el-button>
        <el-button type="primary"  @click="downloadExcel" icon="el-icon-download">Excel下载</el-button>
        <el-button type="primary" @click="printTable" icon="el-icon-printer">打印</el-button>
      </div>
        <el-table id="bonusTable" :data="bonus" :default-sort = "{prop: 'sale_time', order: 'descending'}"
                  show-summary border style="width: 100%">
          <el-table-column prop="sale_time" label="成交日期" sortable width="220">
            <template slot-scope="scope">
              <el-date-picker v-if="scope.row.show"
                              style="width: 200px;"
                  v-model="scope.row.sale_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
              </el-date-picker>
              <span v-if="!scope.row.show">{{scope.row.sale_time}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="employee_name" label="茶艺师" width="width">
            <template slot-scope="scope" >
              <el-select v-model="scope.row.employee_name"
                         @change="onEmloyeeChange(scope.row)"
                         v-if="scope.row.show" clearable placeholder="请选择">
                <el-option
                    v-for="item in employees"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
              <span v-if="!scope.row.show">{{scope.row.employee_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="room_name" label="包间" width="120">
            <template slot-scope="scope" >
              <el-select v-model="scope.row.room_name"
                         @change="onRoomChange(scope.row)"
                         v-if="scope.row.show" clearable placeholder="请选择">
                <el-option
                    v-for="item in rooms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
              <span v-if="!scope.row.show">{{scope.row.room_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="income_type_name" label="收入类型" width="120">
            <template slot-scope="scope" >
              <el-select v-model="scope.row.income_type_name"
                         @change="onIncomeTypeChange(scope.row)"
                         v-if="scope.row.show" clearable placeholder="请选择">
                <el-option
                    v-for="item in incomeTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
              <span v-if="!scope.row.show">{{scope.row.income_type_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_name" label="付款方式" width="120">
            <template slot-scope="scope" >
              <el-select v-model="scope.row.pay_name"
                         @change="onPayTypeChange(scope.row)"
                         v-if="scope.row.show" clearable placeholder="请选择">
                <el-option
                    v-for="item in payTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
              <span v-if="!scope.row.show">{{scope.row.pay_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="income" label="金额（元）" width="100">
            <template slot-scope="scope" >
              <el-input type="number" placeholder="消费金额" v-model="scope.row.income" v-show="scope.row.show"></el-input>
              <span v-if="!scope.row.show">{{scope.row.income}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="percentages" label="比例" width="100"></el-table-column>
          <el-table-column prop="bonus" label="提成（元）" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.show"> {{scope.row.income * scope.row.percentages}}</span>
              <span v-if="!scope.row.show">{{scope.row.bonus}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="saveData(scope.row)" type="primary" size="small" v-if="scope.row.show">保存</el-button>
              <el-button @click="delItem(scope.row)" type="danger" size="small" v-if="scope.row.show">删除</el-button>
              <el-button type="text" size="small" @click="editData(scope.row)" v-if="!scope.row.show">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>

  </div>
</template>

<script>
import formatDate from "@/tool/dateformat";
import printJS from 'print-js'

export default {
  name: "Bonus",
  data(){
    return {
      bonus:[],
      employees:[],
      rooms:[],
      incomeTypes:[],
      payTypes:[],
      searchInfo:{
        month:new Date().getFullYear()+'-'+(new Date().getMonth()+1),
        employee_id:"",
      }
    }
  },
  mounted() {
    this.getBonusByYM(new Date().getFullYear(),new Date().getMonth()+1);
    this.initEmployees();
    this.initRooms();
    this.initIncomeType();
    this.initPayType();
  },

  methods:{
    printTable(){
      printJS({
        printable:this.bonus,
        type:'json',
        header:'<h3 style="text-align: center;color: red;">绩效表</h3>',
        properties:[
          {field:'sale_time',displayName:'销售时间'},
          {field:'employee_name',displayName:'茶艺师'},
          {field:'room_name',displayName:'包厢'},
          {field:'income_type_name',displayName:'收入类型'},
          {field:'pay_name',displayName:'付款方式'},
          {field:'income',displayName:'金额'},
          {field:'percentages',displayName:'比例'},
          {field:'bonus',displayName:'提成'}
        ]
      })
    },
    downloadExcel(){
      const d = new Date(this.searchInfo.month);
      const y = d.getFullYear();
      const m= d.getMonth()+1;
      this.downloadRequest(`/admin/bonus/excel/${y}/${m}`);
    },
    editData(row){
      this.$set(row,'show',true);
    },
    saveData(row) {
      row.bonus = row.income * row.percentages;
      let forAdd = {...row};
      delete forAdd.employee_name;
      delete forAdd.income_type_name;
      delete forAdd.pay_name;
      delete forAdd.room_name;
      delete forAdd.percentages;
      delete forAdd.show;
      delete forAdd.key;

      const url = forAdd.id ? '/admin/bonus/upd' : '/admin/bonus/add';
      this.postRequest(url, forAdd).then(resp => {
        if (resp) {
          this.$message.success(resp.message);
          this.$set(row, 'show', false);
          this.$set(row, 'id', resp.data);
        }
      })
    },
    delItem(row){
      const msg = row.id ? '此操作将从后台永久删除该记录, 是否继续?':'您确定不添加此条数据吗？';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(row.id){   //数据库中有
          //从后台删除
          this.deleteRequest(`/admin/bonus/del/${row.id}`).then(resp=>{
            if(resp){
              //从前端删除
              const index = this.bonus.findIndex(item=>{
                return item.id === row.id;
              });
              this.bonus.splice(index,1);
              this.$message.success(resp.message);
            }
          })
        }else{ //数据库中没有
          const index = this.bonus.findIndex(item=>{
            return item.key === row.key;
          });
          this.bonus.splice(index,1);
          this.$message.success('删除成功');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    onRoomChange(row){
      this.rooms.forEach(item=>{
        if(item.name===row.room_name){
          row.room_id = item.id;
          return ;
        }
      })
    },
    onEmloyeeChange(row){
      this.employees.forEach(item=>{
        if(item.name===row.employee_name){
          row.employee_id = item.id;
          return ;
        }
      })
    },
    onPayTypeChange(row){
      this.payTypes.forEach(item=>{
        if(item.name===row.pay_name){
          row.pay_type_id = item.id;
          return ;
        }
      })
    },
    onIncomeTypeChange(row){
      this.incomeTypes.forEach(item=>{
        if(item.name===row.income_type_name){
          row.percentages=item.percentages;
          row.income_type_id = item.id;
          return ;
        }
      })
    },
    addNewItem(){
      const d = new Date();
      const fmtDate = formatDate();
      this.bonus.unshift({sale_time:fmtDate,show:true,key:d});
    },
    handleSearch(){
      const d = new Date(this.searchInfo.month);
      const y = d.getFullYear();
      const m= d.getMonth()+1;
      this.getRequest(`/admin/bonus/${y}/${m}`,{employee_id:this.searchInfo.employee_id})
          .then(resp=>{
        if(resp){
          this.bonus = resp.data;
        }else
          this.bonus=[];
      })
    },
    refreshData(){
      this.$confirm('此操作同步数据，但未保存的数据会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getBonusByYM();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    getBonusByYM(y=null,m=null){
      if(y===null && m===null){
        y=new Date().getFullYear();
        m=new Date().getMonth()+1;
      }
      this.getRequest(`/admin/bonus/${y}/${m}`).then(resp=>{
        if(resp){
          this.bonus = resp.data;
        }else
          this.bonus=[];
      })
    },
    initEmployees(){//null可能要改，有bug
      this.getRequest('/admin/employees/null').then(resp=>{
        if(resp){
          this.employees = resp.data;
        }
      })
    },
    initRooms(){
      this.getRequest('/admin/rooms').then(resp=>{
        if(resp){
          this.rooms = resp.data;
        }
      })
    },
    initIncomeType(){
      this.getRequest('/admin/incometypes').then(resp=>{
        if(resp){
          this.incomeTypes = resp.data;
        }
      })
    },
    initPayType(){
      this.getRequest('/admin/paytypes').then(resp=>{
        if(resp){
          this.payTypes = resp.data;
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .container{
    .searchContainer{
      box-shadow: 0 0 5px 5px rgba(0,0,0,0.03);
    }
    .handleContainer{
      margin-top: 10px;
      margin-bottom: 10px;
      box-shadow: 0 0 5px 5px rgba(0,0,0,0.03);
    }
  }

</style>
