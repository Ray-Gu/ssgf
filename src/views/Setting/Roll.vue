<template>
  <div class="container">
    <div class="left">
      <el-scrollbar>
      <div>
        <el-button type="primary" @click="addRoll">添加角色</el-button>
        <el-dialog :title="title" :visible.sync="visible">
          <el-form ref="form" :model="rollForm" label-width="80px">
            <el-form-item label="角色名">
              <el-input v-model="rollForm.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoll">确 定</el-button>
          </span>
        </el-dialog>

      </div>
      <div>
        <ul>
          <li v-for="roll in rolls" :key="roll.id">
            <span class="rollname" @click="getMenusByRoll(roll)">{{roll.name}}</span>
            <span>
           <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(roll)"></el-button>
           <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRoll(roll)"></el-button>
        </span>

          </li>
        </ul>
      </div>
      </el-scrollbar>
    </div>

    <div class="right">
      <el-scrollbar wrap-class="scrollbar-wrapper">
      <h5>请选择[{{rollName}}]角色操作的菜单项</h5>
      <el-tree
          ref="menuTree"
          :data="menuData"
          show-checkbox
          node-key="id"
          default-expand-all
          @check="check"
          :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{node,data}">
        <span><i :class="data.meta_icon"></i>{{ data.meta_title===null?'/': data.meta_title}}</span>
      </span>
      </el-tree>
      <div class="rightFooter">
        <el-button type="primary" @click="saveRollMenus">保存选择</el-button>
      </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Roll",
  data(){
    return {
      rollForm:{},
      title:'增加新角色',
      visible:false,
      menuData:[],
      rolls:[],
      rollName:'',
      selectedRollId:null,
      checkedKeys:[],
    }
  },
  mounted() {
    this.initMenu();
    this.initRolls();
  },
  methods:{
    saveRollMenus(){
      this.checkedKeys = this.$refs['menuTree'].getCheckedKeys();
      this.postRequest('/admin/rolls/updmenus',{id:this.selectedRollId,menus:JSON.stringify(this.checkedKeys)}).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initRolls();
        }
      })
    },
    check(curNode,checkedNodes){
      this.checkedKeys = checkedNodes.checkedKeys;
    },
    addRoll(){
      this.title = '添加新角色'
      this.visible = true;
      this.rollForm = {};
    },
    deleteRoll(roll){
      const msg = '此操作将从后台永久删除该角色, 是否继续?';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/rolls/del/${roll.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initRolls();
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    saveRoll(){
      const url = this.rollForm.id?'/admin/rolls/upd':'/admin/rolls/add';
        this.postRequest(url,this.rollForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initRolls();
          }
        })

      this.visible = false;
    },
    edit(roll){
      this.title = '修改角色名称'
      this.visible = true;
      this.rollForm = {...roll};
    },
    getMenusByRoll(roll){
      this.selectedRollId = roll.id;
      this.rollName = roll.name;
      let obj = JSON.parse(roll.menus);
      if(obj===null) obj = [];
      this.$refs['menuTree'].setCheckedKeys(obj,false);
    },
    initMenu(){
      this.getRequest('/admin/allmenus').then(resp=>{
        if(resp){
          this.menuData = resp.data;
        }
      })
    },
    initRolls(){
      this.getRequest('/admin/rolls').then(resp=>{
        if(resp){
          this.rolls = resp.data;
        }
      })
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 8px;
  }
</style>
<style scoped lang="scss">
  .container{
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    .left{
      width: 300px;
      ul{
        list-style: none;
        padding-left: 15px;
        li{
          margin-bottom: 10px;
          color: #37567c;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          padding-right: 5px;
          .rollname{
            display: inline-block;
          }
          &:hover{
            cursor: pointer;
            font-size: 18px;
            background-color: #dce4ec;
          }
        }
      }
    }
    .right{
      border-left:1px solid #dce4ec;
      flex-grow: 1;
      h5{
        color: #0f77f1;
        margin-left: 20px;
      }
      .rightFooter{
        margin-left: 20px;
        margin-top: 20px;
      }
    }
  }
</style>
