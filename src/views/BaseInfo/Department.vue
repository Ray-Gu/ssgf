<template>
  <div class="container">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加部门</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="showEditDialog">编辑部门信息</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="delDept">删除选择部门</el-button>
      <el-dialog title="添加部门/分支" :visible.sync="visible">
        <el-form>
          <el-form-item label="当前" label-width="60px">
             [{{selectNode.department_name}}]
          </el-form-item>
          <el-form-item label="级别" label-width="60px">
            <el-radio v-model="grade" label="1">添加同级</el-radio>
            <el-radio v-model="grade" label="2">添加下级</el-radio>
          </el-form-item>
          <el-form-item label="部门名" label-width="60px">
            <el-input placeholder="输入部门/分支名称" v-model="addDeptForm.department_name"></el-input>
          </el-form-item>
          <el-button type="primary" @click="addDept">确定</el-button>
          <el-button @click="visible=false">取消</el-button>
        </el-form>
      </el-dialog>
      <el-dialog title="编辑部门/分支" :visible.sync="editVisible">
        <el-form>
          <el-form-item label="部门名">
            <el-input placeholder="输入部门/分支名称" v-model="editDeptForm.department_name"></el-input>
          </el-form-item>
          <el-button type="primary" @click="editDept">确定</el-button>
          <el-button @click="editVisible=false">取消</el-button>
        </el-form>
      </el-dialog>
    </div>
    <el-tree :data="departments" :props="defaultProps" default-expand-all @node-click="handleNodeClick">
    </el-tree>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: "Department",
  data(){
    return {
        editVisible:false,
        editDeptForm:{
          department_name:'',
          id:null
        },
      grade:'1', //1同级，2下级
      addDeptForm:{
        department_name:'',
        p_id:null,
      },
      visible:false,
      departments:[],
      selectNode: {},
      defaultProps:{
        children: 'children',
        label: 'department_name'
      }
    }
  },
  mounted() {
    this.initDepartments();
  },
  methods:{
    editDept(){
      this.postRequest('/admin/departments/upd',this.editDeptForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initDepartments();
        }
      })
      this.editVisible = false;
    },
    showEditDialog(){
      if(this.selectNode.id === undefined){
        this.$message.info('请选择要操作的内容');
      }else{
        this.editDeptForm.department_name = this.selectNode.department_name;
        this.editDeptForm.id = this.selectNode.id;
        this.editVisible = true;
      }
    },
    delDept(){
      if(this.selectNode.id === undefined){
        this.$message.info('请选择要操作的内容');
        return ;
      }
      this.$confirm('此操作将永久删除['+this.selectNode.department_name+'] 部门信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/admin/departments/del/'+this.selectNode.id).then(resp=>{
          if(resp){
            this.$message.success('删除部门信息成功');
            this.initDepartments();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showAddDialog(){
      this.addDeptForm ={
        department_name:'',
        p_id:null,
      };
      if(this.selectNode.id === undefined){
        this.$message.info('请选择要操作的内容');
      }else{
        this.visible = true;
      }
    },
    addDept(){
      if(this.grade === '1')
        this.addDeptForm.p_id = this.selectNode.p_id;
      if(this.grade === '2')
        this.addDeptForm.p_id = this.selectNode.id;

      this.postRequest('/admin/departments/add',this.addDeptForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initDepartments();
        }

      })
      this.visible = false;
    },
    handleNodeClick(data){
      this.selectNode = data;
    },
    initDepartments(){
      this.getRequest('/admin/departments').then(resp=>{
        // console.log(resp);
        if(resp){
          this.departments = resp.data;
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
  .container{
    padding: 10px;
    .header{
      margin-bottom: 10px;
    }
  }
</style>
