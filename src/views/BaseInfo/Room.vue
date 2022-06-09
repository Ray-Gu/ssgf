<template>
  <div class="container">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addItem">增加新包间</el-button>
      <el-dialog
          title="收款方式"
          :visible.sync="dialogVisible"
          width="30%">
        <el-form ref="form" :model="newRoom" label-width="100px">
          <el-form-item label="包间名称">
            <el-input v-model="newRoom.name" placeholder="输入包间名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoom">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="roomCardList">
      <el-card class="card" v-for="room in rooms" :key="room.id">
        <h4>{{room.name}}</h4>
        <div class="cardfooter">
          <el-button type="warning" @click="editRoom(room)">修改</el-button>
          <el-button type="danger" @click="deleteRoom(room)">删除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Room",
  data(){
    return {
      rooms:[],
      dialogVisible:false,
      newRoom:{},
    }
  },
  mounted() {
    this.initRooms();
  },
  methods:{
    deleteRoom(row){
      const msg='删除包间信息，请确认！'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/admin/rooms/del/${row.id}`).then(resp=>{
          if(resp){
            this.$message.success(resp.message);
            this.initRooms();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editRoom(row){
      this.newRoom ={...row};
      this.dialogVisible = true;
    },
    saveRoom(){
      const url = this.newRoom.id?'/admin/rooms/upd':'/admin/rooms/add';
      this.postRequest(url,this.newRoom).then(resp=>{
        if(resp){
          this.$message.success(resp.message);
          this.initRooms();
          this.dialogVisible = false;
        }
      })
    },
    addItem(){
      this.newRoom={};
      this.dialogVisible = true;
    },
    initRooms(){
      this.getRequest('/admin/rooms').then(resp=>{
        if(resp){
          this.rooms = resp.data;
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .container{

    .roomCardList{
      display: flex;
      padding: 20px;
      flex-wrap: wrap;
      .card{
        h4{
          text-align: center;
          color: #576f8c;
        }
        width: 230px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;
        .cardfooter{
          width: 100%;
          margin-top: 180px;
          text-align: center;
        }
      }
    }
  }
</style>
