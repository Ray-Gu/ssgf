 <template>
<!--    一定要支持滚动，不然菜单超出了选择不了-->
    <el-scrollbar wrap-class="scrollbar-wrapper">
<!--     目前只支持两级菜单，简洁明了 -->
      <el-menu :default-active="activeMenu" mode="vertical" :collapse="!opened" :background-color="cssVariables.menuBg"
               :text-color="cssVariables.menuText" :active-text-color="cssVariables.menuActiveText"
               :collapse-transition="false"
               @select="handleSelect" @open="handleOpen" @close="handleClose">
        <template v-for="item in menus">
          <template  v-if="!noMetaNoChild(item)">
            <!-- 没有子菜单     -->
            <template v-if="noMetaOneChild(item)">
              <el-menu-item :index="item.path" :key="item.path">
                <i :class="item.children[0].meta.icon"></i><span>{{item.children[0].meta.title}}</span>
              </el-menu-item>
            </template>
            <!-- 有子菜单       -->
            <template v-else>
              <el-submenu :index="item.path" :key="item.path">
                <template slot="title">
                  <i :class="item.meta.icon"></i>
                  <span slot="title">{{item.meta.title}}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.path" :index="`${item.path}/${child.path}`">
                  <i :class="child.meta.icon"></i>
                  <span>{{child.meta.title}}</span>
                </el-menu-item>
              </el-submenu>
            </template>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
</template>

<script>

import cssVariables from '@/styles/variables.scss'

export default {
  name: "NaviMenu",
  computed:{
    menus(){
      // return  this.$router.options.routes;
      return this.$store.state.routes.routes;
    },
    activeMenu(){
      return '/'  //todo:要记录
    },
    cssVariables(){   //获取菜单样式的一些变量
      return cssVariables;
    },
    opened(){
      return this.$store.state.app.naviMenu.opened;
    }
  },
  methods: {

    //no meta,no child
    noMetaNoChild(item){
      return !item.meta && !item.children;
    },
    //no meta,one child,用onchild的meta.title,meta.icon作显示
    noMetaOneChild(item){
      return !item.meta && item.children && item.children.length===1;
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key,keyPath){
      console.log(key,keyPath);
      this.$router.push(key);
      //如果是移动设备，选择后关闭菜单
      if(this.$store.state.app.device==='mobile')
        this.$store.commit('app/CLOSE_SIDEBAR');
    }
  }
}
</script>
<style lang="scss">
//必须为公共样式才可以解决滚动条的问题
.el-scrollbar__wrap{
  overflow-x: hidden!important;
}
.el-scrollbar__bar.is-vertical {
  right: 0;
}
.el-scrollbar {
  height: 100%;
  width: 100%;
}
</style>

<style scoped lang="scss">
  .el-menu{
    border: none;
    width: 100%;
    //max-width: 50px;
    height: 100%;
  }
</style>
