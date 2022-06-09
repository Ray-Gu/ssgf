<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">

        <router-view :key="key">
        </router-view>

    </transition>
  </section>
</template>

<script>
export default {
  name: "AppRouterView",
  computed: {
    key() {return this.$route.path;},
  },
}
</script>

<style scoped lang="scss">
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 6px;

    /* fade-transform 定义载入routerview的动画 */
    .fade-transform-leave-active,
    .fade-transform-enter-active {
      transition: all .5s;
    }

    .fade-transform-enter {
      opacity: 0;
      transform: translateX(-30px);
    }

    .fade-transform-leave-to {
      opacity: 0;
      transform: translateX(30px);
    }
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }
</style>
