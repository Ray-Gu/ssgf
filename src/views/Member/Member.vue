<template>
  <div class="container">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus" @click="showMemberDialog">增加新会员</el-button>
    </div>
    <div class="cardList">
      <el-card class="card">
        <div>今日过生日会员有</div>
        <div><span class="number">2</span>名</div>
        <div>本周还有3位会员过生日</div>
      </el-card>
      <el-card class="card">
        <div>会员总数有</div>
        <div><span class="number">{{members.length}}</span>名</div>
        <div></div>
      </el-card>
      <el-card class="card">
        <div>会员卡总余额有</div>
        <div><span class="number">{{ summary }}</span>元</div>
        <div></div>
      </el-card>
      <el-card class="card">
        <div>活跃会员数</div>
        <div><span class="number">2</span>名</div>
        <div></div>
      </el-card>
    </div>
    <div>
      <el-table
          :data="members"
          border
          style="width: 100%">
        <el-table-column
            fixed
            label="序号"
            type="index"
            width="150">
        </el-table-column>
        <el-table-column
            prop="name"
            label="会员名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="mobile_phone"
            label="电话"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="email"
            width="120">
        </el-table-column>
        <el-table-column
            prop="balance"
            label="余额"
            width="300">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="300">
          <template slot-scope="scope">

            <el-button @click="showDeposit(scope.row)" type="primary" size="small">充值</el-button>
            <el-button type="primary" size="small" @click="showEditMember(scope.row)">编辑</el-button>
            <el-button type="warning" size="small" @click="stopMember(scope.row)">停用</el-button>
            <el-button type="primary" size="small" @click="showDraw(scope.row)">记录</el-button>
            <el-drawer :append-to-body="true" :visible.sync="drawer"
                       :direction="direction" :before-close="handleClose">
              <div style="padding: 10px">
                <h3>会员:{{member_name}}</h3>
                <el-table :data="member_history" border stripe>
                  <el-table-column property="create_time" label="日期" width="150"></el-table-column>
                  <el-table-column property="deposit" label="存/消" width="200"></el-table-column>
                </el-table>
              </div>
            </el-drawer>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog :visible.sync="depositVisible" title="会员充值">
      <el-form>
        <el-form-item label-width="80px" label="充值金额">
          <el-input type="number" v-model="depositForm.deposit"></el-input>
        </el-form-item>
        <el-button type="primary" @click="deposit">保存</el-button>
        <el-button @click="depositVisible=false">取消</el-button>

      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="memberVisible" :title="title">
      <el-form>
        <el-form-item label="会员名" label-width="60px" v-model="memberForm">
          <el-input placeholder="请输入会员名" v-model="memberForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="60px">
          <el-input placeholder="请输入会员电话" v-model="memberForm.mobile_phone"></el-input>
        </el-form-item>
        <el-form-item label="Email" label-width="60px">
          <el-input placeholder="请输入Email" v-model="memberForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveMember">保存</el-button>
          <el-button @click="memberVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Member",
  data(){
    return{
      //history
      drawer:false,
      direction: 'rtl',
      member_history:[],
      member_name:'',
      //
      members:[],
      //depositDialog
      depositVisible:false,
      depositForm:{
        id:null,
        deposit:0,
      },
      //memberDialog
      title:'增加新会员',
      memberVisible:false,
      memberForm:{
        name:'',
        mobile_phone:'',
        email:'',
      }
    }
  },
  mounted() {
    this.initMembers();
  },
  computed:{
    summary(){
      let sum=0;
      this.members.forEach(item=>{
        sum += item.balance;
      })
      return sum;
    }
  },
  methods:{
    showEditMember(data){
      this.memberForm = data;
      this.title = '修改会员信息';
      this.memberVisible=true;
    },
    showDraw(data){
      this.getRequest(`/admin/members/history/${data.id}`).then(resp=>{
        if(resp){
          this.member_history = resp.data;
        }
        else{
          this.member_history=[];
        }
      })
      this.member_name=data.name;
      this.drawer=true;
    },
    handleClose(done) {
      this.$confirm('确认关闭侧栏显示？')
          .then(()=> {
            done();
          })
          .catch(()=> {});
    },
    stopMember(data){
      this.deleteRequest(`/admin/members/delete/${data.id}`).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initMembers();
        }
      })
    },
    deposit(){
      this.postRequest('/admin/members/deposit',this.depositForm).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.depositVisible=false;
          this.initMembers();
        }
      })
    },
    showDeposit(data){
      this.depositForm.id= data.id;
      this.depositVisible = true;
    },
    showMemberDialog(){
      this.memberVisible=true;
      this.memberForm = {};
    },
    saveMember(){

      if(this.memberForm.id){ //edit
        this.postRequest('/admin/members/upd',this.memberForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initMembers();
            this.memberVisible=false;
          }
        })
      }else{
        this.memberForm.create_date= new Date().toLocaleDateString();
        this.postRequest('/admin/members/add',this.memberForm).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initMembers();
            this.memberVisible=false;
          }
        })
      }


    },
    initMembers(){
      this.getRequest('/admin/members').then(resp=>{
        if(resp){
          this.members = resp.data;
        }else{
          this.members=[];
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .container{
    .header{
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .cardList{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
        .card{
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #8c939d;
          font-size: 14px;
          width: 280px;
          height: 130px;
          div{
            margin: 18px;
            .number{
              font-size: 22px;
              color: #d3b059;
            }
          }
        }
    }
  }
</style>
