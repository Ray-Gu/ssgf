<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
      <h2>S S G F</h2>
      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user" placeholder="请输入用户名或手机号" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" show-password v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input placeholder="点击图片更换验证码" v-model="loginForm.code" style="width: 330px;margin-right: 10px;"></el-input>
        <img :src="captchaUrl" style="width: 130px;height: 35px;margin-bottom: -12px" @click="changeCaptcha">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录系统</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "Login",
  data(){
    return{
      captchaUrl:'/admin/captcha?'+new Date(),
      loginForm:{
        username:'admin',
        password:'admin',
        code:'',
      },
      loginRules:{
        username:[{required:true,trigger:'blur',message:'用户名不能为空'},
          {min:5,trigger: 'blur',message: '用户名不少于5位'}],
        password: [{required:true,trigger:'blur',message:'密码不能为空'},
          {min:5,trigger: 'blur',message: '密码不少于5位'}],
        code:[{required:true,trigger:'blur',message:'验证码不能为空'}],
      },
      redirect:undefined,
    }
  },
  watch:{
    //将redirect来的提取出来
    $route:{
      handler:function (route){
        const query = route.query
        if(query){
          this.redirect = query.redirect;
        }
      },
      immediate:true
    }
  },
  methods:{
    //更新验证码
    changeCaptcha(){
      this.captchaUrl = '/admin/captcha?'+new Date();
    },
    //系统登录
    handleLogin(){
      this.$refs.loginForm.validate().then(valid=>{
        if(valid){
          this.postRequest('/admin/login',this.loginForm).then(resp=>{
            if(resp){
              this.$store.commit('user/SET_TOKEN',resp.token);
              this.$router.replace({path:this.redirect || '/' });
            }
          })
        }
        else{
          this.$message.error(valid.message);
          return false;
        }
      })
    },
  }
}
</script>
<style lang="scss">
$light_gray:#fff;
  .login-container{
    .el-input{
      input{
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        color: $light_gray;
        height: 45px;
        caret-color:$light_gray;    //光标的颜色，设置成和字体一样的颜色
      }
    }
    .el-form-item{
      //border: 1px solid rgba(255,255,255,0.1);
      background: rgba(0,0,0,0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style scoped lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
  .login-container{
    background-color:$bg;
    //这三个搭配解决满屏背景问题
    min-height: 100%;
    width: 100%;
    overflow: hidden;  //为什么设置overflow之后可以满屏？1\清除浮动2\解决塌陷问题，子元素设置margin，父元素也跟着他先，设置overflow后解决
    .el-form{
      width: 550px;     //大屏幕设备最小宽度
      max-width: 100%;  //解决小屏幕设备溢出到屏幕外的问题
      margin:0 auto;
      padding: 160px 35px 0;  //设置上，左右的padding
      overflow: hidden;
      h2{
        text-align: center;
        color: $light_gray;
        padding-bottom: 15px;
      }

      .el-button{
        width: 100%;
        height: 45px;
      }
    }

  }
</style>
