<template>

  <el-form ref="form" :model="info" label-width="100px">
    <h5>企业信息设置</h5>
    <div class="container">
      <div class="left">
        <el-form-item label="企业名称">
          <el-input v-model="info.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="info.leader" filterable clearable placeholder="请选择">
            <el-option
                v-for="item in employees"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="info.telphone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="info.address"></el-input>
        </el-form-item>
        <el-form-item label="营业范围">
          <el-input type="textarea" v-model="info.scope"></el-input>
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item label="企业Logo">
          <el-upload
              class="avatar-uploader"
              action="/admin/upload/"
              name="logo"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="info.logo" :src="info.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </div>
    </div>
    <div style="text-align: center">
      <el-button type="primary" icon="el-icon-check" @click="saveInfo">保存信息</el-button>
    </div>

  </el-form>

</template>

<script>
import {getToken} from "@/tool/cookie";

export default {
  name: "Company",
  data(){
    return {
      info:{},
      employees:[],
      headers:{
        Authorization:getToken()
      }
    }
  },
  mounted() {
    this.initCompanyInfo();
    this.initEmployees();
  },
  methods:{
    saveInfo(){
      this.postRequest('/admin/company/set',this.info).then(resp=>{
        if(resp){
          this.initCompanyInfo();
          this.$message.success(resp.message);
        }
      })
    },
    initEmployees(){//null可能要改，有bug
      this.getRequest('/admin/employees/null').then(resp=>{
        if(resp){
          this.employees = resp.data;
        }
      })
    },
    initCompanyInfo(){
      this.getRequest('/admin/company').then(resp=>{
        if(resp){
          this.info=resp.data;
        }
      })
    },
    handleAvatarSuccess(res) {
      this.info.logo = res.path;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传LOGO图片只能是 JPG | PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传LOGO图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
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

<style scoped lang="scss">
  .container{
    width: 800px;
    display: flex;
    justify-content: space-between;
    .left{
      width: 400px;
    }
    .right{
      width: 300px;
    }
  }
</style>
