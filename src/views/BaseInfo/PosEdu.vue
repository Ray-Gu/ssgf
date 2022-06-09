<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="职位管理">
        <Position/>
      </el-tab-pane>
      <el-tab-pane label="学历管理">
        <Education></Education>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

import Position from "@/views/BaseInfo/Position";
import Education from "@/views/BaseInfo/Education";
export default {
  name: "PosEdu",
  components: {Education, Position}
}
</script>

<style scoped>

</style>
