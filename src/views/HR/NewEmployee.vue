<template>
    <el-dialog :title="title" :visible.sync="isVisible"
               @close="onClose" append-to-body
               custom-class="customWidth" :close-on-click-modal="false">
      <div>

        <el-form :model="employee" ref="employeeForm" :rules="empRule">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名" label-width="50px" prop="name">
              <el-input placeholder="员工姓名" v-model="employee.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机" label-width="50px" prop="mobile_phone">
              <el-input placeholder="手机号码"  v-model="employee.mobile_phone"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="部门" prop="department_id">
              <el-cascader :options="departments" :show-all-levels="true"
                           :props="deptSelProps" clearable v-model="employee.department_id"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" label-width="70px">
              <el-select v-model="employee.status" clearable placeholder="请选择">
                <el-option label="试用" :value="0"></el-option>
                <el-option label="在职" :value="1"></el-option>
                <el-option label="休假" :value="2"></el-option>
                <el-option label="离职" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="性别" label-width="50px">
              <el-radio v-model="employee.gender" :label="0">男</el-radio>
              <el-radio v-model="employee.gender" :label="1">女</el-radio>
            </el-form-item>
         </el-col>
          <el-col :span="6">
            <el-form-item label="出生日期" label-width="70px">
              <el-date-picker
                  v-model="employee.birthday"
                  type="date" value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="6"><el-form-item label="Email" label-width="50px">
            <el-input placeholder="邮箱地址"  v-model="employee.email"></el-input>
          </el-form-item></el-col>
          <el-col :span="6">
            <el-form-item label="岗位" label-width="50px">
              <el-select v-model="employee.position_id" clearable placeholder="请选择">
                <el-option v-for="item in positions" :key="item.position_id" :label="item.position_name" :value="item.position_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="婚姻状况" label-width="70px">
                <el-select v-model="employee.married" clearable placeholder="请选择">
                  <el-option label="未婚" :value="0"></el-option>
                  <el-option label="已婚" :value="1"></el-option>
                  <el-option label="离异" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学位" label-width="50px">
              <el-select v-model="employee.education_id" clearable placeholder="请选择">
                <el-option v-for="item in educations" :key="item.education_id" :label="item.education_name" :value="item.education_id"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入职时间" label-width="70px">
                <el-date-picker
                    v-model="employee.hire_date"
                    type="date" value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同截止" label-width="70px">
                <el-date-picker
                    v-model="employee.contract_leave"
                    type="date" value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="证件类型" label-width="70px">
              <el-select v-model="employee.document_type" clearable placeholder="请选择">
                <el-option label="身份证" :value="1"></el-option>
                <el-option label="护照" :value="2"></el-option>
                <el-option label="港澳通行证" :value="3"></el-option>
                <el-option label="回乡证" :value="4"></el-option>
              </el-select>
            </el-form-item></el-col>
            <el-col :span="6"><el-form-item label="证件号" label-width="60px">
              <el-input placeholder="证件号" v-model="employee.id_number"></el-input>
            </el-form-item></el-col>
            <el-col :span="12">
              <el-form-item label="常住地址" label-width="70px">
                <el-input placeholder="常住地址" v-model="employee.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="权限角色" label-width="80px" prop="roll_id">
                <el-select v-model="employee.roll_id" clearable placeholder="请选择">
                  <el-option v-for="item in rolls" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">

            </el-col>
            <el-col :span="6">
              <el-form-item label="离职日期">
                <el-date-picker
                    v-model="employee.leave_date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="离职日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
          </div>
      <div>
        <h4 style="color: red">*新注册用户密码默认位手机号后6位 | 修改密码请在登陆后修改</h4>
          <el-button type="primary" icon="el-icon-success" style="margin-top: 10px" @click="saveNewEmployee">保存员工信息</el-button>
        </div>
    </el-dialog>

</template>

<script>

export default {
  name: "NewEmployee",
  props:['visible','editEmployee','title'],
  data(){
    return {
      employee:{
        name:'',
        password:'',
        gender:0,  //0 男 1女
        birthday:null,
        married:0,  //0 未婚 1 已婚 2离异
        mobile_phone:'',
        email:'',
        address:'',
        status:null,   //0试用 1在职 2离职 3休假
        position_id:null,
        education_id:null,
        department_id:null,
        hire_date:'',
        contract_leave:'',
        leave_date:'',
        document_type:1,
        id_number:'',
        roll_id:null
      },
      rolls:[],
      is_user:false,
      positions: [],
      educations:[],
      departments:[],
      empRule:{
        name: [{required:true,message:'请输入姓名',trigger:'blur'}],
        mobile_phone: [{required:true,message:'请输入手机号',trigger:'blur'}],
        password:[{required:true,message:'请输入密码',trigger:'blur'}],
        department_id:[{required:true,message:'请选择部门',trigger:'change'}],
        roll_id:[{required:true,message:'请选择权限',trigger:'change'}],
      },
      deptSelProps:{
        label:'department_name',
        value:'id',
        emitPath:false
      }
    }
  },
  computed:{
    isVisible:{
      get(){
        return this.visible;
      },
      set(){
        this.employee={
          name:'',
          password:'',
          gender:0,  //0 男 1女
          birthday:null,
          married:0,  //0 未婚 1 已婚 2离异
          mobile_phone:'',
          email:'',
          address:'',
          status:null,   //0试用 1在职 2离职 3休假
          position_id:null,
          education_id:null,
          department_id:null,
          hire_date:'',
          contract_leave:'',
          leave_date:'',
          document_type:1,
          id_number:'',
          roll_id:null
        };
        this.onClose();
      }
    }
  },
  watch:{
    editEmployee(){
      this.employee = this.editEmployee;
      this.employee.password='******';
    }
  },
  mounted() {
    this.initEdu();
    this.initPos();
    this.initRolls();
    this.initDepts();
  },
  methods:{
    onClose(){
      this.$emit('onClose');
    },
    saveNewEmployee(){
      if(this.employee.id){
        this.$refs['employeeForm'].validate((valid) => {
          if (valid){
            this.postRequest('/admin/employees/upd',this.employee).then(resp=>{
              if(resp){
                this.$message.success(resp.message);
                this.employee={
                  name:'',
                  password:'',
                  gender:0,  //0 男 1女
                  birthday:null,
                  married:0,  //0 未婚 1 已婚 2离异
                  mobile_phone:'',
                  email:'',
                  address:'',
                  status:null,   //0试用 1在职 2离职 3休假
                  position_id:null,
                  education_id:null,
                  department_id:null,
                  hire_date:'',
                  contract_leave:'',
                  leave_date:'',
                  document_type:1,
                  id_number:'',
                  roll_id:null
                };
                this.$emit('onClose');
                this.$emit('onRefresh');
              }
            })
          }
        });

      }else{
        this.$refs['employeeForm'].validate((valid) => {
          if (valid){
            //默认密码是手机号的后4位
            this.employee.password = this.employee.mobile_phone.substr(-6);
            this.postRequest('/admin/employees/add',this.employee).then(resp=>{
              if(resp){
                this.$message.success(resp.message);
                this.employee={
                  name:'',
                  password:'',
                  gender:0,  //0 男 1女
                  birthday:null,
                  married:0,  //0 未婚 1 已婚 2离异
                  mobile_phone:'',
                  email:'',
                  address:'',
                  status:null,   //0试用 1在职 2离职 3休假
                  position_id:null,
                  education_id:null,
                  department_id:null,
                  hire_date:'',
                  contract_leave:'',
                  leave_date:'',
                  document_type:1,
                  id_number:'',
                  roll_id:null
                };
                this.$emit('onClose');
                this.$emit('onRefresh');
              }
            })
          }
        });
      }

    },
    //获取所有部门的tree数据
    initDepts(){
      this.getRequest('/admin/departments').then(resp=>{
        if(resp){
          this.departments = resp.data;
        }
      })
    },
    initRolls(){
      this.getRequest("/admin/rolls").then(resp=>{
        if(resp){
         this.rolls = resp.data;
        }
      });
    },
    initEdu(){
      this.getRequest("/admin/educations").then(resp=>{
        if(resp){
          this.educations = resp.data;
        }
      });
    },
    initPos(){
      this.getRequest("/admin/positions").then(resp=>{
        if(resp){
          this.positions = resp.data;
        }
      });
    }
  }
}
</script>

<style lang="scss">
  .customWidth{
    width: 1200px;
  }
</style>
