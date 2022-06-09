<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "BarCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis:{
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      series:[
        {
          type:'bar',
          data:[10,3,33,12,48,9,10,9,43,10,9,43],
        }
      ],
      tooltip:{},
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0
      }
    })
  }
}
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
