<template>
  <div >
    <div style="width: 240px;margin-right: 10px">
      <GoodType @getTypeData="getTypeData"></GoodType>
    </div>

    <div>
      <el-button type="primary" @click="showAdd">增加商品</el-button>
      <el-table :data="goodsData" border style="width: 100%" >
        <el-table-column label="序号" width="50" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="商品编码">
                <span>{{ props.row.code }}</span>
              </el-form-item>
              <el-form-item label="生产厂家">
                <span>{{ props.row.producer }}</span>
              </el-form-item>
              <el-form-item label="保质期">
                <span>{{ props.row.quality }}</span>
              </el-form-item>
            </el-form>
          </template>

        </el-table-column>
        <el-table-column prop="name" label="商品名" sortable width="150"></el-table-column>
        <el-table-column prop="code" label="编码" width="100"></el-table-column>
        <el-table-column prop="producer" label="生产厂家" width="180"></el-table-column>
        <el-table-column prop="model" label="型号" sortable width="100"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(row)">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="limit"
          layout="prev, pager, next, ->,jumper,total, sizes"
          :total="total"
          style="margin-top: 20px">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品分类">
          <el-cascader v-model="form.type" :options="goodsType" style="width: 100%;"></el-cascader>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-select v-model="form.producer" filterable placeholder="请选择厂家">
            <el-option
                v-for="item in producerList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
          <!--弹出框，增加厂商-->
          <el-popover placement="right" width="280" v-model="producerVisible">
            <el-form :model="producerForm" label-width="70px">
              <el-form-item label="厂商名称">
                <el-input v-model="producerForm.name"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="producerVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="addProducer">确定</el-button>
            </div>
            <el-button slot="reference" icon="el-icon-plus"></el-button>
          </el-popover>


        </el-form-item>
        <el-form-item label="保质期">
          <el-input placeholder="请输入内容" v-model="form.quality" class="input-with-select" style="width: 180px">
            <el-select v-model="form.YMD" slot="append" style="width: 80px">
              <el-option label="年" value="Y"></el-option>
              <el-option label="月" value="M"></el-option>
              <el-option label="日" value="D"></el-option>
            </el-select>
          </el-input>

        </el-form-item>
        <el-form-item label="产品描述">
          <el-input type="textarea" placeholder='产品描述' v-model="form.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import GoodType from "@/views/Product/GoodType";
import qs from "qs";
export default {
  name: "Goods",
  components:{GoodType},
  data(){
    return{
      goodsType:[],    //存储从服务器返回的多级列表
      //分页器使用
      currentPage:1,
      goodsData:[],
      total:0,
      limit:10,
      page:1,
      //增加商品对话框使用
      title:'增加商品',
      visible:false,
      form:{
        type:[],     //存储选中的值
        name: '',
        code:'',
        producer: '',
        quality:0,       //保质期
        YMD:'Y',       //年月日
        comment: '',
      },
      //生产厂家对话框使用
      producerVisible:false,
      producerList:[],
      producerForm:{
        name:''
      },
    }
  },
  mounted() {
    this.getPageList();
    this.getProducerList();
  },
  methods:{
    showAdd(){
      this.visible=true;
    },
    async onSubmit() {
      //validator
      const newGood = {...this.form,type:this.form.type.toString()};
      console.log(newGood);
      let result = await this.$API.goods.reqAddGood(qs.stringify(newGood));
      if(result.status!==0){
        this.$message.error(result.message);
      }else{
       this.$message.success(result.message);
       this.getPageList();
      }
      this.visible= false;
    },
    handleEdit(row){
      console.log(row);
    },
    handleDelete(row){
      console.log(row);
    },
    async addProducer(){
      let result = await this.$API.producer.reqAddProducer(qs.stringify(this.producerForm));
      if(result.status === 0){
        this.$message.success(result.message);
        this.getProducerList();
      }
      else{
        this.$message.error(result.message);
      }
      this.producerVisible= false;
      this.producerForm = {name:''};
    },
    getTypeData(value){
      this.goodsType = value;
    },
    async getProducerList(){
      let result = await this.$API.producer.reqGetProducers();
      if(result.status === 0){
        this.producerList = result.data;
      }
      else{
        this.$message.err(result.message);
      }
    },
    //获取商品列表
    async getPageList(){
      const {page,limit} = this;
      let result = await this.$API.goods.reqGetGoods(page,limit);
      if(result.status === 0){
        this.goodsData = result.data;
        this.total = result.total;
      }
      else{
        this.$message.err(result.message);
      }
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPageList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getPageList();
    },
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 14px;
  margin-left:28px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
