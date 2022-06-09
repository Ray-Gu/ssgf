<template>
  <div>

    <el-button icon="el-icon-plus" type="primary" style="margin-bottom: 10px" @click="addBrand">添加</el-button>

    <el-table :data="brandData" :default-sort = "{prop: 'brandName', order: 'descending'}">
      <el-table-column type="index" label="序号" align="center" width="45">
      </el-table-column>
      <el-table-column prop="brand_name" label="品牌名" align="center" width="90">
      </el-table-column>
      <el-table-column prop="logo_url" label="品牌Logo" width="width" align="center">
        <template slot-scope="{row}">
          <img :src="row.logo_url" style="height: 40px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(row)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
<!--        layout="prev, pager, next, ->,jumper,total, sizes"-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="limit"
        layout="prev, pager, next,total,->, sizes"
        :total="total"
        style="margin-top: 20px">
    </el-pagination>

    <el-dialog :title="title" :visible.sync="visible">
      <el-form :model="brandForm" :rules="brandForm_rule" ref="ruleForm">
        <el-form-item prop="brand_name" label="品牌名" :label-width="formLabelWidth">
          <el-input v-model="brandForm.brand_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="logo_url" label="品牌logo" :label-width="formLabelWidth">
          <el-upload
              class="avatar-uploader"
              action="/admin/upload/"
              name="logo"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="brandForm.logo_url" :src="brandForm.logo_url" class="avatar" alt="logo">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="addBrandToServer">确 定</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>

  </div>
</template>

<script>

import {getToken} from "@/tool/cookie";

export default {
  name: "Brand",
  data(){
    return{
      currentPage:1,
      brandData:[],
      total:0,
      limit:10,
      page:1,

      visible:false,
      formLabelWidth:'70px',
      headers: {   //给上传组件添加header，用于token验证
        Authorization:getToken(),
      },
      title:'',  //增加或修改弹出框
      brandForm:{
        brand_name:'',
        logo_url:'',
      },
      brandForm_rule:{
        brand_name: [
          {required:true,trigger:'blur',message:'品牌名不能为空'},
          {min:1,trigger: 'blur',message: '品牌名不少于1位'}],
      }
    }
  },
  methods: {
    addBrand(){
      this.visible = true;
      this.title = '增加品牌'
      this.brandForm = {
        brand_name:'',
        logo_url:'',
      }
    },
    addBrandToServer(){
      this.$refs.ruleForm.validate(async (success)=>{
        if(success){
          this.visible = false;
          let result;
          //
          if(this.brandForm.id){
            result = await this.postRequest('/admin/brands/upd',this.brandForm);
          }
          else{
            result = await this.postRequest('/admin/brands/add',this.brandForm);
          }

          if(result.status === 0){
            this.$message({
              type:'success',
              message:this.brandForm.id?'修改品牌成功！':'添加品牌成功'
            });
          }
          else{
            this.$message({
              type:'error',
              message:result.message
            })
          }
          await this.getPageList();
        }
        else{
          return false;
        }
      })
    },
    cancelAdd(){
      this.visible = false;
    },
    handleEdit(row) {
      this.brandForm = {...row};
      this.title = '修改品牌信息'
      this.visible = true;
    },
    async handleDelete(row) {
      this.$confirm('此操作将删除该品牌信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.deleteRequest(`/admin/brands/del/${row.id}`)
        .then(value=>{
          this.$message({
            type: 'success',
            message: value.message
          });
          this.getPageList();
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPageList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getPageList();
    },
    //获取品牌列表
    async getPageList(){
      const {page,limit} = this;
      let result = await  this.getRequest(`/admin/brands/${page}/${limit}`);
      if(result.status === 0){
        this.brandData = result.data;
        this.total = result.total;
      }
    },

    handleAvatarSuccess(res) {
      this.brandForm.logo_url = res.path;
    },
    /*
    * 上传之前检查文件类型和文件大小，是否符合限制条件
    * */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isIMG = isJPG || isPNG;
      if (!isIMG) {
        this.$message.error('上传头像图片只能是 JPG | PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isIMG && isLt2M;
    }

  },
  mounted() {
    this.getPageList();
  }
}
</script>

<style >


    .avatar-uploader {
      border: 1px dashed #d9d9d9;
      width: 180px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

</style>
