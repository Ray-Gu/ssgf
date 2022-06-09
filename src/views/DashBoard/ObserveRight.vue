<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="radioValue" size="mini">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="charts" ref="charts">


      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "ObserveRight",
  data(){
    return {
      radioValue:'全部渠道',
    }
  },
  mounted() {
    let myChart = echarts.init(this.$refs.charts);
    myChart.setOption({
      title:{
        text:'text',
        subtext:'value',
        left:'center',
        top:'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    });
    myChart.on('mouseover',  (params)=> {
      let {name,value} = params.data;
      myChart.setOption({
        title:{
          text:name,
          subtext:value,
        }
      })
    });
  }
}
</script>

<style scoped lang="scss">
  .clearfix{
    border-bottom: 1px solid #eee;
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .charts{
    width: 100%;
    height: 300px;
  }
</style>
