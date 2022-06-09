<template>
  <div class="wrapper">
    <div class="tree">
      <div class="treeHeader">
        <el-input placeholder="搜索部门" v-model="filterText" prefix-icon="el-icon-search"></el-input>
      </div>
      <div>
        <el-tree :data="departments" :props="defaultProps" node-key="id" ref="deptTree"
                 @node-click="handleNodeClick" :filter-node-method="filterNode"
                  default-expand-all>
        </el-tree>
      </div>
    </div>
    <div class="table">
      <div class="tableHeader">
            <el-input placeholder="请输入关键字查询职员信息" v-model="keywords" style="width: 330px;margin-bottom: 8px;"></el-input>
      </div>
      <div class="tableContainer">
        <el-button type="primary" icon="el-icon-plus" @click="showAddEmployee" style="margin-bottom: 5px;">新职员入职</el-button>

        <el-table stripe :data="employees.filter(data => !keywords || data.name.toLowerCase().includes(keywords.toLowerCase()))" border>
          <el-table-column label="序号" width="50" type="index"></el-table-column>
          <el-table-column label="姓名" prop="name" width="width"></el-table-column>
          <el-table-column label="性别" prop="gender" width="60">
            <template slot-scope="{row}">
              <el-tag v-if="row.gender===0">男</el-tag>
              <el-tag v-else-if="row.gender===1" type="danger">女</el-tag>
              <el-tag v-else  type="danger">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="手机" prop="mobile_phone" width="100"></el-table-column>
          <el-table-column label="Email" prop="email" width="130"></el-table-column>
          <el-table-column label="部门" prop="department_name"  width="80"></el-table-column>
          <el-table-column label="职位" prop="position_name"  width="80"></el-table-column>
          <el-table-column label="入职时间" prop="hire_date" width="90"></el-table-column>
          <el-table-column label="状态" prop="status"  width="70">
            <template slot-scope="{row}">
              <!--            //0 试用\n1 在职\n2 休假\n3 离职\n-->
              <el-tag v-if="row.status===0">试用</el-tag>
              <el-tag v-else-if="row.status===1" type="success">在职</el-tag>
              <el-tag v-else-if="row.status===2" type="info">休假</el-tag>
              <el-tag v-else-if="row.status===3" type="warning">离职</el-tag>
              <el-tag v-else  type="danger">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditEmployee(row)">修改</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="setEmployeeStatus(row,3)">离职</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <NewEmployee :title="title" :visible="visible" :editEmployee="editRow" @onClose="onCloseDialog" @onRefresh="onRefreshData"></NewEmployee>
  </div>
</template>

<script>


import NewEmployee from "@/views/HR/NewEmployee";
export default {
  name: "Employee",
  components: {NewEmployee},
  data() {
    return {
      visible:false,
      title:'',
      editRow:{},
      //部门树形控件
      departments: [],
      defaultProps: {
        value:'id',   //要加这个cascade才可以使用
        label: 'department_name'
      },
      filterText:'',  //过滤文字
      //table数据
      employees:[],
      keywords:'',

      //部门啊
      selectNode: {},
    };
  },
  mounted() {
    this.initDepts();
    this.getEmployeeByDeptId();
  },
  watch: {
    filterText(val) {  //监视变化进行过滤
      this.$refs.depTree.filter(val);
    }
  },
  methods: {
    setEmployeeStatus(row,status){
      this.postRequest(`/admin/employees/updstatus/`,{id:row.id,status:status}).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.getEmployeeByDeptId(this.selectNode.id);
        }
      })
    },
    onRefreshData(){
      this.getEmployeeByDeptId(this.selectNode.id);
    },
    onCloseDialog(){
      this.visible=false;
    },
    showEditEmployee(data){
      this.editRow = {...data};
      this.title='修改员工信息';
      this.visible=true;
    },

    handleNodeClick(data){
      this.selectNode = data;
      this.getEmployeeByDeptId(data.id);
    },

    //todo:获得分类下的职员列表,参数是选中的节点数组
    getEmployeeByDeptId(id=null){
      this.getRequest(`/admin/employees/${id}`).then(resp=>{
        if(resp){
          this.employees = resp.data;
        }else{
          this.employees=[];
        }
      })
    },
    //获取所有部门的tree数据
     initDepts(){
        this.getRequest('/admin/departments').then(resp=>{
          if(resp){
            this.departments = resp.data;
          }
        })
    },
    //tree过滤函数
    filterNode(value, data) {
      if (!value) return true;
      return data.department_name.indexOf(value) !== -1;
    },
    showAddEmployee(){
      this.title='增加新员工';
      this.visible=true;
    },
  }
}
</script>

<style scoped  lang="scss">
  .wrapper{
    display: flex;
    align-items: stretch;
    position: absolute;
    width: 100%;
    height: 100%;
    .tree{
      width: 210px;
      .treeHeader{
        margin: 5px;
        display: flex;
        .el-button{
          margin-left: 7px;
        }
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        }
      }
    }
    .table{
      border-left:1px solid #dce4ec;
      flex-grow: 1;
      .tableHeader{
        margin:5px 5px 0 5px;
        border-bottom: 1px solid #dce4ec
      }
      .tableContainer{
        margin:5px;
      }
    }


</style>

