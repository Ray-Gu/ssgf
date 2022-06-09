<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addItem">增加新付款方式</el-button>
      <el-dialog
          title="收款方式"
          :visible.sync="dialogVisible"
          width="30%">
        <el-form ref="form" :model="newPayType" label-width="100px">
          <el-form-item label="付款方式">
              <el-input v-model="newPayType.name" placeholder="输入付款方式名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePayType">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-table
        :data="payTypes"
        style="width: 100%">
      <el-table-column
          label="序号"
          type="index"
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="付款方式"
          width="180">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-button @click="editPayType(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small" @click="deletePayType(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "PayType",
  data(){
    return {
      payTypes:[],
      dialogVisible:false,
      newPayType:{},
    }
  },
  mounted() {
    this.initPayType();
  },
  methods:{
    deletePayType(row){
      const msg='删除付款方式，请确认！'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/paytypes/del/${row.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initPayType();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editPayType(row){
      this.newPayType ={...row};
      this.dialogVisible = true;
    },
    savePayType(){
      const url = this.newPayType.id?'/admin/paytypes/upd':'/admin/paytypes/add';
      this.postRequest(url,this.newPayType).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initPayType();
          this.dialogVisible = false;
        }
      })
    },
    addItem(){
      this.newPayType={};
      this.dialogVisible = true;
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

<style scoped>

</style>
