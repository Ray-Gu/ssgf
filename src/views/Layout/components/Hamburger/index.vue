<template>
  <div class="hamburger" @click="toggleClick">
      <i :class="opened?'el-icon-s-fold':'el-icon-s-unfold'"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  computed:{
    opened(){
      return this.$store.state.app.naviMenu.opened;
    }
  },
  methods: {
    toggleClick() {
      this.$store.commit('app/TOGGLE_SIDEBAR');
    }
  }
}
</script>

<style scoped lang="scss">
.hamburger {
  display: inline-block;
  font-size: 22px;
  color: #37567c;
  &:hover{
    color: #6b0b0b;
  }
}

</style>
