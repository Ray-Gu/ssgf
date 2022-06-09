<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addItem">增加新收入类型</el-button>
      <el-dialog
          title="收入类型"
          :visible.sync="dialogVisible"
          width="30%">
        <el-form ref="form" :model="newIncomeType" label-width="100px">
          <el-form-item label="付款方式">
            <el-input v-model="newIncomeType.name" placeholder="输入收入类型名称"></el-input>
          </el-form-item>
          <el-form-item label="提成比例">
            <el-input type="number" v-model="newIncomeType.percentages" placeholder="输入提成比例"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveIncomeType">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-table
        :data="incomeTypes"
        style="width: 100%">
      <el-table-column
          label="序号"
          type="index"
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="收入类型"
          width="180">
      </el-table-column>
      <el-table-column
          prop="percentages"
          label="提成比例"
          width="180">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-button @click="editIncomeType(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteIncomeType(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "IncomeType",
  data(){
    return {
      incomeTypes:[],
      dialogVisible:false,
      newIncomeType:{},
    }
  },
  mounted() {
    this.initIncomeType();
  },
  methods:{
    deleteIncomeType(row){
      const msg='删除收入方式，请确认！'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/incometypes/del/${row.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initIncomeType();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editIncomeType(row){
      this.newIncomeType ={...row};
      this.dialogVisible = true;
    },
    saveIncomeType(){
      const url = this.newIncomeType.id?'/admin/incometypes/upd':'/admin/incometypes/add';
      this.postRequest(url,this.newIncomeType).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initIncomeType();
          this.dialogVisible = false;
        }
      })
    },
    addItem(){
      this.newIncomeType={};
      this.dialogVisible = true;
    },
    initIncomeType(){
      this.getRequest('/admin/incometypes').then(resp=>{
        if(resp){
          this.incomeTypes = resp.data;
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
