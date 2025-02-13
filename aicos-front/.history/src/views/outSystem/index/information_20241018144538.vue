<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
    <div class="sysIndexTitle" id="tongji">
     
    </div>
  </HuilanBasic>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "indexTools",
  data() {
    return {
      
    }
  },
  mounted() {
    
  },
  methods: {
    drawpie(){
      let chartDom = document.getElementById('tongji');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        legend: {
          top: '0',
          x: 'center',
          textStyle: {
            fontSize: 16,
            color: 'rgba(101, 213, 255, 1)',
          },
          icon:
            'path://M512 881.777778 512 881.777778C716.222629 881.777778 881.777778 716.222629 881.777778 512 881.777778 307.777371 716.222629 142.222222 512 142.222222 307.777373 142.222222 142.222222 307.777371 142.222222 512 142.222222 716.222629 307.777373 881.777778 512 881.777778L512 881.777778ZM512 1024 512 1024C229.230208 1024 0 794.769789 0 512 0 229.230211 229.230208 0 512 0 794.769789 0 1024 229.230211 1024 512 1024 794.769789 794.769789 1024 512 1024L512 1024Z',
          itemWidth: 8, // 设置宽度
          itemHeight: 8, // 设置高度、
          itemGap: 12, // 设置间距
        },
        tooltip: {
          show: true,
          trigger: 'axis', //axis , item
          backgroundColor: 'RGBA(0, 49, 85, 1)',
          borderColor: 'rgba(0, 151, 251, 1)',
          borderWidth: 1,
          borderRadius: 0,
          textStyle: {
            color: '#BCE9FC',
            fontSize: 16,
            align: 'left',
          },
        },
        grid: {
          right: '5%',
          top: '15%',
          left: '5%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          nameTextStyle: {
            color: '#65d5ff',
          },
          type: 'category',
          boundaryGap: true,
          data: ['2020', '2021', '2022', '2023', '2024'],
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            //	margin:15,
            textStyle: {
              color: '#65D5FF',
              fontStyle: 'normal',
              fontSize: 16,
            },
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: false,
          },
          axisLine: {
            show: true,
            //坐标轴轴线相关设置
            lineStyle: {
              color: 'rgba(77, 128, 254, 0.2)',
            },
          },
          splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            show: true,
            lineStyle: {
              color: 'rgba(77, 128, 254, 0.2)',
            },
          },
        },
        yAxis: [
          {
            name: '个',
            nameTextStyle: {
              color: '#65d5ff',
            },
            type: 'value',
            splitNumber: 3,
            axisLabel: {
              textStyle: {
                color: '#65D5FF',
                fontStyle: 'normal',
                fontSize: 16,
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(77, 128, 254, 0.2)',
              },
            },
          },
          {
            name: '',
            nameTextStyle: {
              color: '#65d5ff'
            },
            min: 0,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#233653'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#233653'
              }
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#78bdf5'
              },
              formatter: function (value) {
                return value * 100 + '%'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '航天',
            type: 'pictorialBar',
            barWidth: '50%',
            label: {
              normal: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255, 64, 0, 0.8)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 34, 66, 0.2)', // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                }, //渐变颜色
              },
            },
            symbol:
              'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

            data: [23, 44, 22, 27, 12],
          },
          {
            name: '航空',
            type: 'pictorialBar',
            barWidth: '50%',
            label: {
              normal: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(48, 236, 166,0.8)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 34, 66, 0.2)', // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                }, //渐变颜色
              },
            },
            symbol:
              'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

            data: [13, 24, 31, 12, 7],
          },
          {
            name: '军工',
            type: 'pictorialBar',
            barWidth: '50%',
            label: {
              normal: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(161, 159, 158, 0.8)', // 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(133, 133, 196, 0.2)', // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                }, //渐变颜色
              },
            },
            symbol:
              'path://M12.000,-0.000 C12.000,-0.000 16.074,60.121 22.731,60.121 C26.173,60.121 -3.234,60.121 0.511,60.121 C7.072,60.121 12.000,-0.000 12.000,-0.000 Z',

            data: [4, 3, 12, 4, 15],
          },
        ],
      };
      myChart.setOption(option, true)
    }
  }
}
</script>
<style scoped lang="scss">

/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
}

</style>