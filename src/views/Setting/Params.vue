<template>
  <el-tabs type="border-card">
    <el-tab-pane label="参数设置">
      <el-form ref="form" :model="paramsForm" label-width="120px" inline>
        <el-form-item label="采购单号规则">
          <el-input v-model="input" placeholder="placeholder"></el-input>
          -
          <el-input v-model="input" placeholder="placeholder"></el-input>
          -
          <el-input v-model="input" placeholder="placeholder"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="其它">
    其它
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "Params",
  data(){
    return{
      paramsForm:{

      }
    }
  }
}
</script>

<style scoped>

</style>
