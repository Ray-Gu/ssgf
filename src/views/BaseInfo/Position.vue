<template>
  <div>
  <div style="margin-bottom: 12px">
    <el-button type="primary" icon="el-icon-plus" @click="showAddPos">添加新职位</el-button>

    <el-dialog :title="title" :visible.sync='visible'>
      <el-form>
        <el-form-item label="职位名"  label-width="80">
          <el-input placeholder="输入职位名称" v-model="posForm.position_name"></el-input>
        </el-form-item>
        <el-button type="primary" @click="savePos">保存</el-button>
        <el-button @click="visible=false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>

  <el-table
      border
      :data="positions"
      style="width: 100%">
    <el-table-column
        type="index"
        label="序号"
        width="100">
    </el-table-column>
    <el-table-column
        prop="position_name"
        label="职位名称"
        width="180">
    </el-table-column>
    <el-table-column
        label="操作">
      <template slot-scope="scope">
        <el-button icon="el-icon-edit" type="primary" @click="editPos(scope.row)" size="mini"></el-button>
        <el-button icon="el-icon-delete" type="danger" @click="delPos(scope.row)" size="mini"></el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  name: "Position",
  data(){
    return {
      title:'',
      visible:false,
      positions:[],
      posForm:{
        position_name:''
      }
    }
  },
  mounted() {
    this.initPosition();
  },
  methods:{
    showAddPos(){
      this.visible = true;
      this.title = '添加新职位';
      this.posForm = {
        position_name:''
      };
    },
    editPos(data){
      this.posForm = {...data};
      this.title = '编辑职位信息'
      this.visible =true;
    },
    delPos(data){

      this.$confirm('此操作将永久删除['+data.position_name+'] 职位信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/admin/positions/del/'+data.position_id).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initPosition();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });



    },
    savePos(){
      const url = this.posForm.position_id?'/admin/positions/upd':'/admin/positions/add';
      this.postRequest(url,this.posForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initPosition();
        }
      })
      this.visible=false;
    },
    initPosition(){
      this.getRequest('/admin/positions').then(resp=>{
        if(resp){
          // this.$message.success(resp.message);
          this.positions = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
