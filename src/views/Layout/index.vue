<template>
  <div :class="classObj" class="app-wrapper" >
<!--    遮罩，点击遮罩菜单消失，只在小窗口时有用，待实现-->
    <div class="drawer-bg" v-if="showDrawBg" @click="handleHideSideBar">x</div>
    <NaviMenu class="sidebar-container"></NaviMenu>
    <div class="main-container">
      <NaviHeader></NaviHeader>
      <AppRouterView></AppRouterView>
    </div>
  </div>
</template>

<script>
import NaviMenu from "@/views/Layout/components/NaviMenu";
import NaviHeader from "@/views/Layout/components/NaviHeader";
import AppRouterView from "@/views/Layout/components/AppRouterView/AppRouterView";
import ResizeHandler from "@/views/Layout/mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {AppRouterView, NaviHeader, NaviMenu},
  mixins:[ResizeHandler],
  methods:{
    handleHideSideBar(){
      this.$store.commit('app/CLOSE_SIDEBAR');
    }
  },
  computed:{
    showDrawBg(){
      return this.device==='mobile' &&  this.$store.state.app.naviMenu.opened;
    },
    device(){
      return this.$store.state.app.device;
    },
    classObj(){
      return {
        hideSideBar:!this.$store.state.app.naviMenu.opened,
        //当判断是移动设备时，判断sidebar是否处于打开的状态，采用不同的显示模式初始是关闭的
        mobileOpen:this.$store.state.app.device === 'mobile' && this.$store.state.app.naviMenu.opened,
        mobileClose:this.$store.state.app.device === 'mobile' && !this.$store.state.app.naviMenu.opened
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .app-wrapper{
    @include clearfix;
    position: relative;    //relative主要针对自身的偏移，没有设置偏移，目的是提供给子元素作为容器
    height: 100%;
    width: 100%;
    .drawer-bg{
      background-color: $menuBg;
      opacity: 0.2;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 999;
    }
    //左边菜单正常电脑浏览器显示样式
    .sidebar-container{
      transition: width 0.28s;  //宽度变化，设置动画
      width: $sideBarWidth !important;   //设置菜单宽度 210px
      height: 100%;
      background-color: $menuBg;
      position: fixed;      //固定再左侧
      top:0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
    }
    //右侧主显示区
    .main-container{
      &:before,
      &:after{
        content: '';
        display: table;
        clear: both;
      }
      margin-left: $sideBarWidth;
      transition: margin-left 0.28s;
      position: relative;  //继续给子容器提供便利
      min-height: 100%;  //撑满右侧高度
    }
  }
  .hideSideBar{
    .sidebar-container{
      width: $sideBarWidthSmall!important;    //当关闭sidebar的时候，将容器设置到54px宽
    }
    .main-container{
      margin-left: $sideBarWidthSmall;
    }
  }

  .mobileOpen{
    .sidebar-container{
      width:$sideBarWidth!important;
    }
    .main-container{
      margin-left: 0;
    }
  }
  .mobileClose{
    .sidebar-container{
      width:0!important;
    }
    .main-container{
      margin-left: 0;
    }
  }
</style>
