<template>
<div>
  <el-tabs type="border-card">
    <el-tab-pane label="基本情况">
      <Company/>
    </el-tab-pane>
    <el-tab-pane label="部门设置">
      <Department/>
    </el-tab-pane>
    <el-tab-pane label="包间管理">
      <Room/>
    </el-tab-pane>
    <el-tab-pane label="收入类型">
      <IncomeType/>
    </el-tab-pane>
    <el-tab-pane label="收款方式">
      <PayType/>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import Department from "@/views/BaseInfo/Department";
import PayType from "@/views/BaseInfo/PayType";
import IncomeType from "@/views/BaseInfo/IncomeType";
import Room from "@/views/BaseInfo/Room";
import Company from "@/views/BaseInfo/Company"

export default {
  name: "BaseInfo",
  components: {Company,IncomeType, PayType, Department,Room},
  data(){
    return {
    }
  },

}
</script>

<style scoped>

</style>
