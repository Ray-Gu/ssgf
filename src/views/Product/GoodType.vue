<template>
  <div>
<!--需要处理搜索，需要进行递归-->
    <el-table
        :data="tableData"
        style="width: 240px;margin-bottom: 20px;"
        row-key="id"
        default-expand-all
        border
        highlight-current-row
        @current-change="handleCurrentChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="label"
          label="分类名称"
          width="238" >
        <template slot="header" slot-scope="scope">
          <div>
            <el-input v-model="keywords" placeholder="暂不可用" :meta-data="scope" style="width: 160px;" ></el-input>
            <el-dropdown style="float: right">
              <el-button icon="el-icon-more" style="border: none;"></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span @click="showAdd">增加分类</span></el-dropdown-item>
                <el-dropdown-item><span @click="showEdit">修改分类</span></el-dropdown-item>
                <el-dropdown-item><span @click="showDel">删除分类</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>



          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">

      <el-form :model="form" :label-width="formLabelWidth">

        <el-form-item label="当前分类">
          <span>{{currentType}}</span>
        </el-form-item>

        <el-form-item v-show='showGrade' label="分类级别">
          <el-radio-group v-model="form.grade">
            <el-radio :label="0">同级</el-radio>
            <el-radio :label="1">下级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类名称" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;showGrade=true">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "Sorts",
  data() {
    return {
      dialogFormVisible:false,
      title:'增加分类',
      formLabelWidth:'80px',
      currentType:'',
      currentRow:null,
      showGrade:true,
      form:{
        grade:0,
        name:'',
      },
      keywords:'',  //搜索用
      tableData: []
    }
  },
  mounted() {
    this.getGoodType();
  },
  methods: {
     showDel(){
      if(this.currentRow){
        this.$confirm('确定要删除此分类吗?').then(async ()=>{
          let result = await this.$API.goodstype.reqDeleteGoodType(this.currentRow.id);
          if(result.status !== 0){
            this.$message.error(result.message);
          }
          this.getGoodType();
        })

      }
      else{
        this.$message.info('请先选择一个分类');
      }

    },
    async addType(){
      let result;
      let newType = {};
       if(this.showGrade){
         //增加
         newType.label = this.form.name;
         newType.p_id = this.form.grade===0 ? this.currentRow.p_id:this.currentRow.id;
         result = await this.$API.goodstype.reqAddGoodType(qs.stringify(newType));
       }else{
         //修改
         newType = {id:this.currentRow.id,label:this.currentRow.label,p_id:this.currentRow.p_id};
         newType.label = this.form.name;
         result = await this.$API.goodstype.reqUpdateGoodType(qs.stringify(newType));
      }
      if(result.status !== 0){
        this.$message.error(result.message);
      }else{
        this.$message.success(result.message);
        this.getGoodType();
      }
      this.showGrade = true;
      this.currentRow = null;
      this.dialogFormVisible = false;
    },
    showEdit(){
      if(this.currentRow){
        this.title = '修改分类名称';
        this.showGrade = false;
        this.form.name = this.currentRow.label;
        this.currentType = this.currentRow.label;
        this.dialogFormVisible = true;
      }
      else{
        this.$message.info('请先选择一个分类');
      }
    },
    showAdd(){
      if(this.currentRow){
        this.dialogFormVisible = true;
        this.title = '增加分类';
        this.currentType = this.currentRow.label;
      }
      else{
        this.$message.info('请先选择一个分类');
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    async getGoodType(){
      let result = await this.$API.goodstype.reqGetGoodsType();
      if(result.status === 0){
        this.tableData = result.data;
        this.$emit('getTypeData',result.data);
      }else{
        this.$message.error(result.message);
      }
    }
  },
}
</script>

<style scoped>

</style>
