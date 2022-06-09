<template>
  <div class="wrapper">
    <template v-if="itsDialog">
      <el-dialog :title="title" :visible.sync="visible" v-bind="$attrs" v-on="$listeners" :close-on-click-modal='false'>
        <slot></slot>
      </el-dialog>
    </template>
    <template v-else>
      <div class="bg-drawer" v-if="visible"></div>
      <div class="card">
          <el-card  v-bind="$attrs" v-on="$listeners" v-show="visible" shadow="hover">
            <span slot="header">{{ title }}</span>
            <div class="box">
              <slot></slot>
            </div>
          </el-card>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "DialogOrCard",
  props:{
    title:{
      type:String,
      required:true
    },
    visible:{
      type:Boolean,
      required:true
    }},
  computed:{
    itsDialog(){
      return this.$store.state.app.device!=='mobile';
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";
  .wrapper{
    .bg-drawer{
      position: fixed;
      opacity: 0.2;
      top:0;
      left:0;
      bottom: 0;
      right: 0;
      z-index: 800;
      background-color: $headerBgWhenMobile;
    }
    .card {
        position: fixed;
        top:160px;
        width: 800px;
        max-width: 98%;
        //height: calc(100% - 160px);
        font-weight: bold;
        z-index: 999!important;
        .el-card{
          .box{ //不够理想的滚动条解决方案
            height: 400px;
            overflow: auto;
          }
        }
    }
  }


</style>
