<template>
  <div>
    <el-card>
      <GoodsTypeSelector v-model="type" @change="handleChange"></GoodsTypeSelector>
    </el-card>
<!--    显示当前分类的spu列表-->
    <el-card v-show="!spuVisible">
      <el-button type='primary' icon="el-icon-plus" :disabled="!type.length" @click="showAddSpu">增加</el-button>
      <el-table :data="spuList">
        <el-table-column label="序号" type="index" width="45" align="center"></el-table-column>
        <el-table-column label="SPU名" prop="spu_name" align="center" width="150"></el-table-column>
        <el-table-column label="SPU描述" prop="description" width="width"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="{row}">
            <HintButton icon="el-icon-plus" title="添加SKU"></HintButton>
            <HintButton icon="el-icon-edit" title="编辑SPU" @click="showEditSpu(row)"></HintButton>
            <HintButton icon="el-icon-info" title="查看当前SPU所有的sku情况"></HintButton>
            <el-popconfirm :title="`确定删除${row.spu_name}吗？`" @confirm = "deleteSpu(row)">
              <HintButton  slot="reference" icon="el-icon-delete" title="删除SPU"></HintButton>
            </el-popconfirm>
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
    </el-card>
  <!--添加SPU    -->
    <DialogOrCard :title="spuTitle" :visible="spuVisible">
        <el-form :model="spuForm" label-width="100px">
        <el-form-item label="SPU名">
          <el-input placeholder="请输入SPU名" v-model="spuForm.spu_name"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="spuForm.brand_id">
            <el-option v-for="item in brandList" :label="item.brand_name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input v-model="spuForm.description" type="textarea" rows="2" placeholder="SPU描述"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
              :action="uploadActionUrl"
              list-type="picture-card"
              :headers="headers"
              name="images"
              :file-list="spuForm.spuImageList"
              :on-success="handleSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSPU">保存</el-button>
            <el-button @click="spuVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
    </DialogOrCard>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import DialogOrCard from "@/components/DialogOrCard";
import GoodsTypeSelector from "@/components/GoodsTypeSelector";
import qs from "qs";
import {getToken} from "@/tool/cookie";
export default {
  name: "SPU",
  components: {GoodsTypeSelector, DialogOrCard},
  data(){
    return{
      baseURL:process.env['VUE_APP_BASE_API'],   //获得开发服务器的地址
      //分类选择
      type: [],          //收集选择商品分类数组，数组最后一个是选择的分类
      //spu列表
      spuList:[],
      //分页器用
      currentPage:1,
      limit:5,
      total:0,
      //spuDialog用
      headers: {   //给上传组件添加header，用于token验证
        Authorization:getToken(),
      },
      spuTitle:'添加SPU',
      spuVisible:false,
      brandList:[],  //品牌列表数据
      spuImageList:[],  //spu图片列表数据
      spuForm:{      //存储spuDialog数据
        type_id:undefined,
        spu_name:'',
        brand_id:undefined,
        spuImageList:[],
        description:'',
      },
      //upload组件用
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  computed:{
    uploadActionUrl(){
      return `${this.baseURL}/admin/product/spu/uploadImage'`;
    },
  },
  methods:{
    handleSuccess(response, file, fileList){
      console.log(response,file,fileList);
    },
    async saveSPU(){
      //todo:数据校验
      let results;
      if(this.spuForm.id){   //有id，则是更新数据
        results = await this.$API.spu.reqUpdateSpu(qs.stringify(this.spuForm));
      }else{
        results = await this.$API.spu.reqAddSpu(qs.stringify(this.spuForm));
      }
      if(results.status===0){
        this.$message.success(results.message);
      }else{
        this.$message.error(results.message);
      }
      this.spuVisible = false;
      this.getSpuList();
    },
    async getSpuList(){
      const {currentPage,limit}=this;
      const type_id = this.type[this.type.length-1] || 0;
      let result =await this.$API.spu.reqGetSpuList(currentPage,limit,type_id);
      if(result.status!==0){
        this.$message.warning('提示:'+result.message);
        this.spuList=[];
        console.error(result.message);
      }
      else{
        this.total = result.total;
        this.spuList = result.data;
      }
    },
    //为弹出spu对黄框准备
    async getAllBrand(){
      let brandResult = await this.$API.brand.reqAllBrand();
      if(brandResult.status === 0){
        this.brandList = brandResult.data;
      }
    },
    showAddSpu(){
      this.spuTitle = '添加SPU'
      this.getAllBrand();

      this.spuForm={      //存储spuDialog数据
            type_id:this.type[this.type.length-1],
            spu_name:'',
            brand_id:undefined,
            description:'',
      };
      this.spuVisible = true;
    },
    //显示编辑弹出框
    showEditSpu(row){
      this.spuTitle = '编辑SPU'
      this.getAllBrand();
      this.spuForm = cloneDeep(row);
      this.getSpuImageById(row.id)
      this.spuVisible = true;
    },
    //获取spu图片列表
    async getSpuImageById(id){
      let imageResult = await this.$API.spu.reqGetSpuImageById(id);
      if(imageResult.status===0){
        this.spuImageList = imageResult.data;
      }
    },
    //删除spu
    async deleteSpu(row){
      let res = await this.$API.spu.reqDeleteSpuById(row.id);
      if(res.status !== 0 ){
        this.$message.error(res.message);
      }else{
        this.$message.success(res.message);
        this.getSpuList();
      }
    },
    handleChange(){
      this.getSpuList();
    },
    handleSizeChange(limit){
      this.limit = limit;
      this.getSpuList();
    },
    handleCurrentChange(page){
      this.currentPage = page;
      this.getSpuList();
    },
    //以下两个函数upload组件用
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  }
}
</script>

<style>

</style>
