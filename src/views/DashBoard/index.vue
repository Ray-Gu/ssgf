<template>
  <div class="dashIndex">
    <div>
      <el-row :gutter="10">
        <el-col :span="6">
         <Card title="总销售额" count="￥ 126560">
           <template slot="charts">
             <span>周同比&nbsp;56.67%</span>
             <svg t="1652793941958"
                  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3242" width="16" height="16"><path d="M583.93 296.842l234.8 318.515a73.059 73.059 0 0 1-14.99 102.048l-2.62 1.806a78.116 78.116 0 0 1-44.612 13.908h-469.6a75.588 75.588 0 0 1-76.762-74.414 72.878 72.878 0 0 1 14.269-43.348l234.8-318.515a78.568 78.568 0 0 1 106.834-16.888 77.574 77.574 0 0 1 17.881 16.888z" p-id="3243" fill="#1afa29"></path></svg>
             <span>日同比&nbsp;19.96%</span>
             <svg t="1652794036477" class="icon"
                  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4199" width="16" height="16"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#d81e06" p-id="4200"></path></svg>
           </template>
           <template slot="footer">
             <span>日销售额 ￥1200</span>
           </template>
         </Card>
        </el-col>
        <el-col :span="6">
          <Card title="支付笔数" count="132">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日销售额 ￥1200</span>
            </template>
          </Card>
        </el-col>
        <el-col :span="6"><Card title="访问量" count="1980">
          <template slot="charts">
            <BarCharts></BarCharts>
          </template>
          <template slot="footer">
            <span>日销售额 ￥1200</span>
          </template>
        </Card>

        </el-col>
        <el-col :span="6"><Card title="会员数" count="78%">
          <template slot="charts">
            <ProgressCharts></ProgressCharts>
          </template>
          <template slot="footer">
            <span>日销售额 ￥1200</span>
          </template>
        </Card></el-col>
      </el-row>
    </div>
    <div>
      <SaleCard></SaleCard>
    </div>
    <div>
      <Observe></Observe>
    </div>

  </div>
</template>

<script>
// import * as echarts from 'echarts';

import Card from "@/views/DashBoard/HeaderCard";
import LineCharts from "@/views/DashBoard/LineCharts";
import BarCharts from "@/views/DashBoard/BarCharts";
import ProgressCharts from '@/views/DashBoard/ProgressCharts';
import SaleCard from '@/views/DashBoard/SaleCard';
import Observe from '@/views/DashBoard/Observe';
export default {
  name: "DashBoard",
  components: {BarCharts, Card,LineCharts,ProgressCharts,SaleCard,Observe},
}
</script>

<style scoped>
.dashIndex{
  font-size: 13px;
}
</style>
