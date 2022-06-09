<template>
  <div>
    <el-cascader v-bind="$attrs" v-on="$listeners" :options="goodsType" placeholder="请选择商品分类"  clearable> </el-cascader>
  </div>
</template>

<script>
export default {
  name: "GoodsTypeSelector",
  data(){
    return{
      goodsType:[],
    }
  },
  mounted() {
    this.getGoodType();
  },
  methods:{
    async getGoodType(){
      let result = await this.$API.goodstype.reqGetGoodsType();
      if(result.status === 0){
        this.goodsType = result.data;
      }else{
        this.$message.error(result.message);
      }
    },
  }
}
</script>

<style scoped>

</style>
