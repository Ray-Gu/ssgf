<template>
  <div>
    <div style="margin-bottom: 12px">
      <el-button type="primary" icon="el-icon-plus" @click="showAddEdu">添加新学历</el-button>

      <el-dialog :title="title" :visible.sync='visible'>
        <el-form>
          <el-form-item label="学历名"  label-width="80">
            <el-input placeholder="输入学历名称" v-model="eduForm.education_name"></el-input>
          </el-form-item>
          <el-button type="primary" @click="saveEdu">保存</el-button>
          <el-button @click="visible=false">取消</el-button>
        </el-form>
      </el-dialog>
    </div>

    <el-table
        border
        :data="educations"
        style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="education_name"
          label="学历名称"
          width="180">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" @click="editEdu(scope.row)" size="mini"></el-button>
          <el-button icon="el-icon-delete" type="danger" @click="delEdu(scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Education",
  data(){
    return {
      title:'',
      visible:false,
      educations:[],
      eduForm:{
        education_name:''
      }
    }
  },
  mounted() {
    this.initEducation();
  },
  methods:{
    showAddEdu(){
      this.visible = true;
      this.title = '添加新学历';
      this.eduForm = {
        education_name:''
      };
    },
    editEdu(data){
      this.eduForm = {...data};
      this.title = '编辑学历信息'
      this.visible =true;
    },
    delEdu(data){

      this.$confirm('此操作将永久删除['+data.education_name+'] 学历信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/admin/educations/del/'+data.education_id).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initEducation();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });



    },
    saveEdu(){
      const url = this.eduForm.education_id?'/admin/educations/upd':'/admin/educations/add';
      this.postRequest(url,this.eduForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initEducation();
        }
      })
      this.visible=false;
    },
    initEducation(){
      this.getRequest('/admin/educations').then(resp=>{
        if(resp){
          this.educations = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
