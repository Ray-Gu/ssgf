<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <ObserveLeft></ObserveLeft>

      </el-col>
      <el-col :span="12">
        <ObserveRight></ObserveRight>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import ObserveLeft from '@/views/DashBoard/ObserveLeft';
import ObserveRight from '@/views/DashBoard/ObserveRight';

export default {
  name: "Observe",
  components: {ObserveLeft,ObserveRight},

}
</script>

<style scoped>

</style>
