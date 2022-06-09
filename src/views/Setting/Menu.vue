<template>
  <div>
    <h4>菜单管理</h4>
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="add1Menu">增加一级菜单</el-button>
      <el-button type="primary" @click="add2Menu"
                 :disabled="!(currentRow.id && currentRow.p_path===null)">增加二级子菜单</el-button>

      <el-button type="primary" @click="refresh">刷新同步后台数据</el-button>

      <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
        <el-form ref="form" :model="newMenu" :rules="newMenuRule" label-width="80px">
          <el-form-item label="位置" prop="order_id">
            <el-input type="number" v-model="newMenu.order_id"></el-input>
          </el-form-item>
          <el-form-item label="菜单名" prop="meta_title">
            <el-input v-model="newMenu.meta_title" placeholder="输入菜单的显示名称"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input v-model="newMenu.path" placeholder="输入菜单的跳转路径"></el-input>
          </el-form-item>
          <el-form-item label="组件" prop="component">
            <el-input v-model="newMenu.component" placeholder="Vue组件名"></el-input>
          </el-form-item>
          <el-form-item label="重定向">
            <el-input v-model="newMenu.redirect" placeholder="输入重定向的路径"></el-input>
          </el-form-item>
          <el-form-item label="路径名">
            <el-input v-model="newMenu.name" placeholder="请输入路径名，用于KeepAlive"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="meta_icon">
            <el-input v-model="newMenu.meta_icon" placeholder="输入菜单的图标"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMenu">确 定</el-button>
        </span>
      </el-dialog>

    </div>
    <el-table
        :data="menuData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
        default-expand-all
        :tree-props="{children: 'children'}">
      <el-table-column prop="order_id" label="顺序" width="80">
        <template slot-scope="scope" >
          <el-input  placeholder="顺序" v-model="scope.row.order_id" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show">{{scope.row.order_id}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="meta_title" label="菜单名" width="120">
        <template slot-scope="scope" >
          <el-input  placeholder="菜单名称" v-model="scope.row.meta_title" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show">{{scope.row.meta_title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
        <template slot-scope="scope" >
          <el-input  placeholder="路径" v-model="scope.row.path" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show">{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路径名">
        <template slot-scope="scope" >
          <el-input  placeholder="路径名" v-model="scope.row.name" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件">
        <template slot-scope="scope" >
          <el-input  placeholder="组件名" v-model="scope.row.component" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show">{{scope.row.component}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="redirect" label="重定向">
        <template slot-scope="scope" >
          <el-input  placeholder="重定向" v-model="scope.row.redirect" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show">{{scope.row.redirect}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="meta_icon" align="center" label="图标">
        <template slot-scope="scope" >
          <el-input  placeholder="图标" v-model="scope.row.meta_icon" v-show="scope.row.show"></el-input>
          <span v-if="!scope.row.show" style="font-size: 20px;"><i :class="scope.row.meta_icon"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-edit" @click="editMenuItem(row)" v-show="!row.show"></el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteMenuItem(row)" v-show="!row.show"></el-button>
          <el-button type="success" size="mini" @click="updMenu(row)" icon="el-icon-check" v-show="row.show" circle></el-button>
          <el-button type="info" size="mini" @click="cancel(row)" icon="el-icon-close" v-show="row.show" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>

export default {
  name: "Menu",
  data() {
    return {
      newMenu:{},
      menuData:[],
      currentRow:{},
      title:'',
      dialogVisible:false,
      newMenuRule:{
        meta_title: [{required:true,message:'请输入菜单名',trigger:'blur'}],
        path: [{required:true,message:'请输入路径',trigger:'blur'}],
        component:[{required:true,message:'请输入Vue组件名',trigger:'blur'}],
        meta_icon:[{required:true,message:'请输入图标名',trigger:'blur'}],
      }
    }
  },
  mounted() {
    this.initMenu();
  },
  methods:{
    deleteMenuItem(row){
      const msg = '此操作将从后台永久删除该菜单项, 是否继续?';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/menus/del/${row.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            //todo,列表中删除
            for(let i=0;i<this.menuData.length;i++){
              if(this.menuData[i].id===row.id){
                this.menuData.splice(i,1);
                return ;
              }
              if(this.menuData[i].children){
               for(let j=0;j<this.menuData[i].children.length;j++){
                 if(this.menuData[i].children[j].id===row.id){
                   this.menuData[i].children.splice(j,1);
                   return ;
                 }
               }
              }
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    refresh(){
      this.initMenu();
    },
    updMenu(row){
      delete row.show;
      let tmpChildren={};
      if(row.children){
        tmpChildren = {...row.children};
        delete row.children;
      }
      if(row.tmp) delete row.tmp;
      this.postRequest('/admin/menus/upd',row).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.$set(row,'children',tmpChildren);
          this.$set(row,'show',false);
        }
      })
    },
    saveMenu(){
      this.postRequest('/admin/menus/add',this.newMenu).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initMenu();
          this.dialogVisible = false;
          this.currentRow={};
        }
      })
    },
    add2Menu(){
      this.title=`增加[${this.currentRow.meta_title}]二级菜单`;
      this.newMenu = {};
      this.newMenu.p_path=this.currentRow.path;
      this.dialogVisible = true;
    },
    add1Menu(){
      this.title="增加一级菜单";
      this.newMenu={};
      this.dialogVisible = true;
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    cancel(row){
      this.$set(row,"show",false);

      if(!row.tmp){
        this.menuData.shift();
      }else{
        const tmp = {...row.tmp};
        delete row.tmp;
        row = Object.assign(row,tmp);
      }

      delete row.show;
    },
    editMenuItem(row){
      this.$set(row,"show",true);
      row.tmp = {...row};
    },
    initMenu(){
      this.getRequest('/admin/allmenus').then(resp=>{
        if(resp){
          this.menuData = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
