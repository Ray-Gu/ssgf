<template>
  <div>
    <el-card>
          <el-cascader v-model="type" :options="goodsType" style="width: 280px;" @change="handleChange" clearable></el-cascader>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" @click="showAdd" :disabled="!type.length">增加</el-button>
      <el-table :data="attrsList">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="attr_name" label="属性名" width="180"></el-table-column>
        <el-table-column  label="属性值">
          <template slot-scope="scope">
            <el-tag size="medium" v-for="item in scope.row.attrValues" :key="item.id" style="margin-right: 10px">{{item.attr_value}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="{row}">
            <el-button size="mini" icon="el-icon-edit"
                @click="handleEdit(row)"></el-button>

            <el-popconfirm
                :title="`确定要删除[${row.attr_name}]及其属性值吗?`"
                @confirm="handleDelete(row)"
            >
              <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete"></el-button>
            </el-popconfirm>


          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DialogOrCard :title="title"  :visible="visible">
      <el-form ref="form" :model="attrInfo" label-width="20px">
        <el-form-item>
          <el-input v-model="attrInfo.attr_name" placeholder="请输入属性名"></el-input>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attr_name.trim()">增加属性值</el-button>
        <el-table :data="attrInfo.attrValues">
          <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
          <el-table-column label="属性值" prop='attr_value' width="width">
            <template slot-scope="{row,$index}">
              <el-input :ref='$index' v-model="row.attr_value" placeholder="请输入属性值名称" v-if="row.mode" @blur="toLookMode(row)" @keyup.enter.native="toLookMode(row)"></el-input>
              <span @click="toEditMode(row,$index)" v-else style="display: block">{{row.attr_value}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除[${row.attr_value}]吗？`" @confirm="deleteAttrValueItem($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveAttr">保存</el-button>
          <el-button @click="visible=false">取消</el-button>
        </el-form-item>

      </el-form>

    </DialogOrCard>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import qs from "qs";
import DialogOrCard from "@/components/DialogOrCard";

export default {
  name: "Attr",
  components: {DialogOrCard},
  data(){
    return{
      type: [],          //收集选择商品分类数组
      goodsType: [],     //存储从服务器返回的多级列表
      attrsList: [],     //存储返回相应分类的属性列表
      title: '增加属性',   //对话框的标题
      visible: false,     //控制弹出对话框的显示
      attrInfo: {        //收集用户输入的属性名及属性值数据
        type_id: 0,      //分类id,提交时要从分类数组最后一个元素取得
        attr_name: '',
        attrValues: [
          // {
          // attr_id:0,      //属性名的id
          // attr_value:''    //属性值
          // }
        ]
      }
    }
  },
  mounted() {
    this.getGoodType();
  },
  methods:{
    async saveAttr(){
      //判断属性名是否重复或者空
      if(this.attrInfo.attr_name.trim()===''){
        this.$message.error('属性名不能为空');
        return ;
      }
      //重复
      if (this.attrInfo.id===undefined && this.attrsList!==undefined) {  //有id,是编辑属性，没有id,是新增，新增不可以重复
        const isRepeat = this.attrsList.some(item => {
          return item.attr_name === this.attrInfo.attr_name;
        })
        if (isRepeat) {
          this.$message.error('属性名已存在，不可以重复保存');
          return;
        }
      }
      //去除空属性值和flag;
      this.attrInfo.attrValues = this.attrInfo.attrValues.filter(item=>{
        if(item.attr_value.trim()!==''){
          delete item.mode;
          return true;
        }
      })

      let result = await this.$API.attr.reqSaveAttrValue(qs.stringify(this.attrInfo));
      if(result.status !== 0){
        this.$message.error(result.message);
      }
      else{
        this.$message.success('保存数据成功');
        this.getAttrs();
      }
      this.visible = false;
    },
    toLookMode(row){
      if(row.attr_value.trim()===''){
        this.$message.warning('请输入正常的属性值');
        return;
      }
      const isRepeat = this.attrInfo.attrValues.some(item=>{
        if(item!==row){
          return item.attr_value === row.attr_value;
        }
      });
      if(isRepeat){
        this.$message.warning('属性值输入重复');
        return;
      }
      row.mode = false;
    },
    toEditMode(row,index){
      row.mode = true;
      this.$nextTick(()=>{
        this.$refs[index].focus();
      })
    },
    addAttrValue(){
      //添加一个属性值对象到数组中，显示
      this.attrInfo.attrValues.push({
        attr_id:this.attrInfo.id,      //编辑的时候有，添加的时候属性名还是未知,id也不存在，所以为Undefined
        attr_value:'',    //属性值
        mode:true,        //切换输入模式和查看模式
      });
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValues.length-1].focus();

      })
    },
    deleteAttrValueItem(index){
      this.attrInfo.attrValues.splice(index,1);
    },
    showAdd() {
      this.attrInfo = {        //收集用户输入的属性名及属性值数据
        type_id: this.type[this.type.length-1],      //分类id,提交时要从分类数组最后一个元素取得
        attr_name: '',
        attrValues: []
      }
      this.visible = true;
    },
    handleEdit(row) {
      //一定要使用深度拷贝，因为对象里有对象
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValues.forEach(item=>{
        //对对象的改变，一定要确保是响应式数据 不可以item.mode=false;
        this.$set(item,'mode',false);
      });
      this.visible = true;
    },
    async handleDelete(row) {
       //只需要传递good_attr.id也是good_attr_values的attr_id
      let result = await this.$API.attr.reqDelAttr(row.id);
      if(result.status!==0){
        this.$message.error(result.message);
      }else{
        this.$message.success(result.message);
        this.getAttrs();
      }
    },
    handleChange(){
     this.getAttrs();
    },
    async getGoodType(){
      let result = await this.$API.goodstype.reqGetGoodsType();
      if(result.status === 0){
        this.goodsType = result.data;
      }else{
        this.$message.error(result.message);
      }
    },
    async getAttrs(){
      if(this.type.length<1){
        this.$message.error('请选择商品分类');
        return false;
      }
      const id = this.type[this.type.length-1];
      let result = await this.$API.attr.reqGetAttrs(id);
      this.attrsList = result.data;
    }
  }
}
</script>

<style scoped>

</style>
