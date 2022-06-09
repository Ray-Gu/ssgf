<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="header">
        <span>销售额类别占比</span>
      <div>
        <el-dropdown>
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    </div>
    <div>
      <el-row :gutter="10">
       <el-col :span="12">
        <div style="display:flex;align-items: center;margin-bottom: 5px;">
          <span style="margin-right: 10px">搜索用户数</span>
          <svg t="1652792804118" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2129" width="24" height="24"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2130" fill="#cdcdcd"></path></svg>
        </div>
         <div>
           <span >12321 17.1</span>
           <svg t="1652793941958"
                class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3242" width="16" height="16"><path d="M583.93 296.842l234.8 318.515a73.059 73.059 0 0 1-14.99 102.048l-2.62 1.806a78.116 78.116 0 0 1-44.612 13.908h-469.6a75.588 75.588 0 0 1-76.762-74.414 72.878 72.878 0 0 1 14.269-43.348l234.8-318.515a78.568 78.568 0 0 1 106.834-16.888 77.574 77.574 0 0 1 17.881 16.888z" p-id="3243" fill="#1afa29"></path></svg>
         </div>
         <div class="charts" ref="charts"></div>
       </el-col>
        <el-col :span="12">
          <div style="display:flex;align-items: center;margin-bottom: 5px;">
          <span style="margin-right: 10px">搜索用户数</span>
          <svg t="1652792804118" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2129" width="24" height="24"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2130" fill="#cdcdcd"></path></svg>
        </div>
          <div>
            <span >12321 17.1</span>
            <svg t="1652793941958"
                 class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3242" width="16" height="16"><path d="M583.93 296.842l234.8 318.515a73.059 73.059 0 0 1-14.99 102.048l-2.62 1.806a78.116 78.116 0 0 1-44.612 13.908h-469.6a75.588 75.588 0 0 1-76.762-74.414 72.878 72.878 0 0 1 14.269-43.348l234.8-318.515a78.568 78.568 0 0 1 106.834-16.888 77.574 77.574 0 0 1 17.881 16.888z" p-id="3243" fill="#1afa29"></path></svg>
          </div>
          <div class="charts" ref="charts2"></div></el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "ObserveLeft",
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
          type:'line',
          data:[10,3,33,12,48,9,10,9,43],
          //拐点样式
          itemStyle:{
            opacity:0,
          },
          //线条样式
          lineStyle:{
            color:"purple",
          },
          //填充颜色
          areaStyle:{
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0
      }
    })
    let lineCharts2 = echarts.init(this.$refs.charts2);
    lineCharts2.setOption({
      xAxis:{
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      series:[
        {
          type:'line',
          data:[10,3,33,12,48,9,10,9,43],
          //拐点样式
          itemStyle:{
            opacity:0,
          },
          //线条样式
          lineStyle:{
            color:"purple",
          },
          //填充颜色
          areaStyle:{
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
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

<style scoped lang="scss">
.box-card{
  font-size: 14px;

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
    height: 100px;
  }
}

</style>
