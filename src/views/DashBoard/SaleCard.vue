<template>
  <el-card class="box-card" style="margin-top: 10px;">
    <div slot="header" class="clearfix">
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="first"></el-tab-pane>
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker size="mini" class="date" type="daterange"
                        v-model="dateRange" value-format="yyyy-MM-dd"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
       <el-col :span="18">
         <div class="charts" ref="charts">
         </div>
       </el-col>
        <el-col :span="6">
          <h4>产品{{title}}排名</h4>
          <ul>
            <li>
              <span class="listIndex">1</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>
            <li>
              <span class="listIndex">2</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>
            <li>
              <span class="listIndex">3</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>
            <li>
              <span >4</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>
            <li>
              <span >5</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>
            <li>
              <span>6</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>
            <li>
              <span >7</span>
              <span>印记天心</span>
              <span class="listValue">58000</span>
            </li>

          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import *  as echarts from 'echarts';
import dayjs from 'dayjs'
export default {
  name: "SaleCard",
  data(){
    return {
      activeName:'first',
      myCharts:null,
      dateRange:[],
    }
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title:{
        text:'销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220,88,17,90,44,99]
        }
      ]

    })
  },
  computed:{
    title(){
      return this.activeName==='first'?'销售额':'访问量';
    },
  },
  methods:{
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.dateRange = [start,end];
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.dateRange = [start,end];
    },
    setWeek(){
      const start=dayjs().day(1).format('YYYY-MM-DD');
      const end=dayjs().day(7).format('YYYY-MM-DD');
      this.dateRange = [start,end];
    },
    setDay(){
      const day = dayjs().format('YYYY-MM-DD');
      this.dateRange = [day,day];
    }
  },
  watch:{
    title(){
      this.myCharts.setOption({
        title:{
          text:this.title+'趋势',
        }
      })
    }
  }
}
</script>
<style>
  .el-card__header{
    border: none;
  }

</style>
<style scoped lang="scss">
  .clearfix{
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .tab{
    width: 100%;
  }
  .right{
    position: absolute;
    right:0;
    span{
      margin:0 10px;
      font-size: 14px;
    }
  }
  .date{
    width: 220px;
    margin:0 10px;
  }
  .charts{
    width: 100%;
    height: 300px;
  }
  ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding:0;
    font-size: 14px;
    li{
      height: 8%;
      margin-top: 10px;
      .listIndex{
        float: left;
        width: 20px;
        height: 20px;
        text-align: center;
        background-color: black;
        color: white;
        border-radius: 50%;
        margin-right: 5px;
      }
      .listValue{
        float: right;
      }
    }
  }

</style>
