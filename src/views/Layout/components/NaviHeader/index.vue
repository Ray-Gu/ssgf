<template>
  <div>
    <div class="headerContainer" :class="classObj">
      <div class="left-menu">
        <Hamburger class="hamburgerContainer"></Hamburger>
        <BreadCrumb v-if="!isMobile" class="breadcrumbContainer"></BreadCrumb>
      </div>
      <div class="logo">
        <img :src="companyInfo.logo" alt="1">
      </div>
      <div class="right-menu">
        <span class="username">{{ user.name }}</span>
        <el-dropdown @command="handleCommand">
          <img :src="user.avatar" class="avatar">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updateUserInfo">用户信息中心</el-dropdown-item>
            <el-dropdown-item divided command="logout"><span>退出系统</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-drawer title="用户中心" :append-to-body="true" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <div style="padding: 10px;text-align: center">
          <h4 style="color: cornflowerblue">{{user.name}}</h4>
          <div>

              <el-card class="box-card" style="text-align: center">
                <el-form  :model="avatarForm" label-width="90px">
                  <el-upload
                      class="avatar-uploader"
                      action="/admin/upload/"
                      name="logo"
                      :headers="headers"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                    <img v-if="avatarForm.avatar" :src="avatarForm.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-button type="primary" @click="updAvatar">头像修改</el-button>
                </el-form>
              </el-card>

              <el-card class="box-card" style="text-align: center;margin-top: 20px">
                <el-form status-icon ref="passwordForm" :model="passwordForm" label-width="80px" :rules="psRuler">
                <el-form-item label="旧密码" prop="oldPass">
                  <el-input v-model="passwordForm.oldPass" type="password" placeholder="旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                  <el-input v-model="passwordForm.pass" type="password" placeholder="新密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码确认" prop="checkPass">
                  <el-input v-model="passwordForm.checkPass" type="password" placeholder="确认新密码"></el-input>
                </el-form-item>

                <el-button type="primary" @click="updPassword('passwordForm')">密码修改</el-button>
                </el-form>

              </el-card>
            <div style="text-align: left;margin-top: 20px">
              <el-button type="text" size="normal" @click="updateUserInfo">高级更新...</el-button>
              <NewEmployee :title="title" :visible="visible"
                           :editEmployee="avatarForm"
                           @onClose="onCloseDialog" @onRefresh="onRefreshData" ></NewEmployee>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <!--    下面这个div是影子产品,占位用,屏幕变小后，面包屑放到第二行去-->
    <div :style="fixed?'height:50px':null"></div>
    <div v-if="isMobile" >
      <BreadCrumb></BreadCrumb>
    </div>

  </div>
</template>

<script>
import Hamburger from "@/views/Layout/components/Hamburger";
import BreadCrumb from "@/views/Layout/components/NaviHeader/BreadCrumb";
import {getToken} from "@/tool/cookie";
import {getUserInfo} from "@/tool/sys_refresh";
import NewEmployee from "@/views/HR/NewEmployee";
export default {
  name: "NaviHeader",
  components: {NewEmployee, Hamburger,BreadCrumb},
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.passwordForm.checkPass !== '') {
          this.$refs.passwordForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      drawer: false,  //是否显示更新用户信息对话框
      direction: 'rtl',
      avatarForm: {
        avatar:"",
      },
      passwordForm:{
        oldPass:'',
        pass:'',
        checkPass:'',
      },
      psRuler:{
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
      imageUrl: '',
      headers:{
        Authorization:getToken()
      },
      //edit
      title:'',
      visible:false,
    }
  },
  computed: {
    companyInfo(){
      return this.$store.state.company.info;
    },

    user(){
      //返回vuex中保存的用户信息
      return {
        name:this.$store.state.user.user.name===''?'unknown':this.$store.state.user.user.name,
        avatar: this.$store.state.user.user.avatar===null?'public/images/avatar.jpg':this.$store.state.user.user.avatar
      }
    },
    isMobile(){
      return this.$store.state.app.device==='mobile';
    },
    fixed(){
      return this.$store.state.app.headerFixed;
    },
    classObj(){
      return {
        backColorOfMobile:this.isMobile,
        fixedStyle:this.fixed,
        opened:this.fixed && this.$store.state.app.naviMenu.opened,
        device:this.fixed && this.$store.state.app.device ==='mobile',
      }
    }
  },
  methods: {
    onCloseDialog(){
      this.visible=false;
    },
    onRefreshData(){
      getUserInfo();
    },
    updateUserInfo(){
      this.avatarForm = {...this.$store.state.user.user};
      this.title='修改员工信息';
      this.visible=true;
    },
    updPassword(){
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          this.postRequest('/admin/employees/updpassword',this.passwordForm).then(resp=>{
            if(resp){
              this.$message.success(resp.message);
              this.$refs['passwordForm'].resetFields();
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    updAvatar(){
      this.postRequest('/admin/employees/updavatar',this.avatarForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          getUserInfo();
        }
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭侧栏显示？')
          .then(()=> {
            done();
          })
          .catch(()=> {});
    },
    handleCommand(command) {
      switch (command) {
        case 'logout': {
          this.$store.dispatch('user/logout');
          this.$store.state.routes.routes=[];
          this.$router.replace({path: '/login'});
          break;
        }
        case 'updateUserInfo': {
          this.drawer = true;
          this.avatarForm = this.$store.state.user.user;
          break;
        }
      }

    },
    handleAvatarSuccess(res) {
      this.avatarForm.avatar = res.path;
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
@import "~@/styles/variables.scss";
  .headerContainer{
    overflow: hidden;
    position: relative;
    height: 50px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.fixedStyle{
      position: fixed;
      right: 0;
      top:0;
      left:$sideBarWidthSmall;
      z-index: 1;
    }
    &.opened{
      left: $sideBarWidth;
    }
    &.device{
      left: 0;
    }

    &.backColorOfMobile{
      background-color: $headerBgWhenMobile;
    }

    .left-menu{
      display: flex;
      align-items: center;
      .hamburgerContainer{
        margin-left: 8px;
        cursor: pointer;
        transition: background .3s;
      }
    }
    .logo{
      margin-top: 6px;
      img{
        height: 38px;
        vertical-align:middle;
      }
    }

    .right-menu{
      height: 46px;
      line-height: 46px;
      margin-right: 10px;

      .username{
        display: inline-block;
        font-size: 15px;

      }
      .avatar{
        height: 38px;
        width: 38px;
        border: 1px solid #8399b2;
        border-radius: 19px;
        margin-right: 12px;
      }
    }
  }
</style>
