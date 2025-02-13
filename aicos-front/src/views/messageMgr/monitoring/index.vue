<template>
  <HuilanBasic>
    <el-card>
      <div slot="header" class="static-info-header">
        <h2>数据概览</h2>
<!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
        <div class="static-info-tool">
          <template>
            <el-radio-group v-model="timeRadio" size="mini">
              <el-radio-button label="today">今天</el-radio-button>
              <el-radio-button label="sevenDay">近7天</el-radio-button>
              <el-radio-button label="fifteenDay">近15天</el-radio-button>
              <el-radio-button label="thirtyDay">近30天</el-radio-button>
              <el-radio-button label="custom">
                <el-popover
                  placement="bottom"
                  width="376"
                  trigger="manual"
                  v-model="modelVisible">
                  <el-date-picker
                    ref="datePicker"
                    v-model="dateRange"
                    type="daterange"
                    size="mini"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                  <template #reference>
                    <span @click="handleCultomClick">自定义<i class="el-icon-caret-bottom"></i></span>
                  </template>
                </el-popover>
              </el-radio-button>
            </el-radio-group>
          </template>


<!--          <el-button-group>-->
<!--            <el-button type="primary" size="mini" icon="el-icon-arrow-left">今天</el-button>-->
<!--            <el-button type="primary" size="mini" icon="el-icon-arrow-left">近7天</el-button>-->
<!--            <el-button type="primary" size="mini" icon="el-icon-arrow-left">近15天</el-button>-->
<!--            <el-button type="primary" size="mini" icon="el-icon-arrow-left">近30天</el-button>-->
<!--            <el-button type="primary" size="mini">自定义</el-button>-->
<!--          </el-button-group>-->
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="inner-card">
            <template #header>
              <h3>平台接收消息数</h3>
            </template>
            <ul class="static-info-list">
              <li>
                <strong>{{ receiveInfo.total }}</strong>
                <h3>接收总数</h3>
              </li>
              <li>
                <strong>{{ receiveInfo.success }}</strong>
                <h3>成功总数</h3>
              </li>
              <li>
                <strong>{{ receiveInfo.fail }}</strong>
                <h3>失败总数</h3>
              </li>
            </ul>
          </el-card>
          <el-card class="inner-card">
            <template #header>
              <h3>平台发送消息数</h3>
            </template>
            <ul class="static-info-list">
              <li>
                <strong>{{ sendInfo.total }}</strong>
                <h3>发送总数</h3>
              </li>
              <li>
                <strong>{{ sendInfo.success }}</strong>
                <h3>成功总数</h3>
              </li>
              <li>
                <strong>{{ sendInfo.fail }}</strong>
                <h3>失败总数</h3>
              </li>
            </ul>
          </el-card>
          <el-card class="inner-card">
            <template #header>
              <h3>各类通道发送占比</h3>
            </template>
            <LineChar style="height: 300px;" v-loading="statisticLoading" :options="sendByChannelTypeCharOpt"/>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="inner-card">
            <template #header>
              <h3>各通道发送消息数</h3>
            </template>
            <LineChar style="height: 570px;" v-loading="statisticLoading" :options="sendByChannelCharOpt"/>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card header="队列消息概览">
          <LineChar v-loading="loading" :options="queueMessageData"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="队列运行概览">
          <LineChar v-loading="loading" :options="queueRateData"/>
        </el-card>
      </el-col>
    </el-row>
<!--    <el-card header="消息连接">-->
<!--      <ConnectionList/>-->
<!--    </el-card>-->
<!--    <el-card header="消息通道">-->
<!--      <ChannelList/>-->
<!--    </el-card>-->
  </HuilanBasic>
</template>

<script>
import { dateFormat } from '@/util/date'
import { getOverview, getMessageOverview } from '@/api/messageMgr/monitoring'
import LineChar from './lineChar'
// import { formatDate } from 'element-ui/lib/utils/date-util'
// import { dateFormat } from '@/util/date'
// import ConnectionList from './connectionList'
// import ChannelList from './channelList'
export default {
  name: 'index',
  components: {
    LineChar,
    // ConnectionList,
    // ChannelList
  },
  data() {
    return {
      statisticLoading: true,
      receiveInfo: {
        total: 0,
        success: 0,
        fail: 0
      },
      sendInfo: {
        total: 0,
        success: 0,
        fail: 0
      },
      sendByChannelTypeCharOpt: {},
      sendByChannelCharOpt: {},
      timeRadio: '',
      modelVisible: false,
      dateRange: [],
      pickerOptions: {
        disabledDate: this.disabledDate
      },

      overviewData: {
        queue_totals: {
          messages_details: {
            samples: []
          },
          messages_ready_details: {
            samples: []
          },
          messages_unacknowledged_details: {
            samples: []
          }
        },
        message_stats: {
          publish_details: {
            samples: []
          }
        }
      },
      loading: true
    }
  },
  computed: {
    queueMessageData() {
      const queueTotals = this.overviewData.queue_totals
      return this.buildQueuedMessage(queueTotals)
    },
    queueRateData() {
      const queueTotals = this.overviewData.message_stats
      return this.buildRateMessage(queueTotals)
    }
  },
  watch: {
    timeRadio(newVal) {
      if(newVal !== 'custom') {
        this.translateTime(newVal)
      }
    },
    dateRange() {
      this.modelVisible = false
      this.getStatisticsInfo()
    }
  },
  methods: {
    buildQueuedMessage(data) {
      const list = [
        {
          name: '总数',
          key: 'messages'
        },
        {
          name: '待接收',
          key: 'messages_ready'
        },
        {
          name: '收到未确认',
          key: 'messages_unacknowledged'
        }
      ]
      const opt = {
        // title: {
        //   text: '队列信息'
        // },
        grid: {
          left: '3%',
          right: 110,
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: []
        },
        xAxis: {
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      list.forEach((item, index) => {
        const serie = {
          name: item.name,
          type: 'line',
          smooth: true,
          data: []
        }
        opt.legend.data.push(item.name)
        const details = data[`${item.key}_details`]
        if(details && details.samples) {
          details.samples.forEach(sample => {
            serie.data.push(sample.sample);
            if(index === 0) {
              opt.xAxis.data.push(dateFormat(new Date(sample.timestamp), 'hh:mm:ss'))
            }
          })
        }
        // 数据反转
        serie.data.reverse()
        opt.series.push(serie)
      })
      // 时间反转
      opt.xAxis.data.reverse()
      return opt
    },
    buildRateMessage(data) {
      const list = [
        {
          name: '发布',
          key: 'publish'
        },
        {
          name: '发布者确认',
          key: 'confirm'
        },
        {
          name: '发布 (In)',
          key: 'publish_in'
        },
        {
          name: '发布 (Out)',
          key: 'publish_out'
        },
        {
          name: '交付（手动确认）',
          key: 'deliver'
        },
        {
          name: '交付（自动确认）',
          key: 'deliver_no_ack'
        },
        {
          name: '消费者确认',
          key: 'ack'
        },
        {
          name: '重新发送',
          key: 'redeliver'
        },
        {
          name: '获取（手动确认）',
          key: 'get'
        },
        {
          name: '获取（自动确认）',
          key: 'get_no_ack'
        },
        {
          name: '获取（空）',
          key: 'get_empty'
        },
        {
          name: '不可路由（返回）',
          key: 'return_unroutable'
        },
        {
          name: '不可路由（丢弃）',
          key: 'drop_unroutable'
        },
        {
          name: '磁盘读取',
          key: 'disk_reads'
        },
        {
          name: '磁盘写入',
          key: 'disk_writes'
        }
      ]
      const opt = {
        // title: {
        //   text: '消息速率'
        // },
        grid: {
          left: '3%',
          right: 180,
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          right: 0,
          data: []
        },
        xAxis: {
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      list.forEach((item, index) => {
        const serie = {
          name: item.name,
          type: 'line',
          smooth: true,
          data: []
        }
        const list = data[`${item.key}_details`]
        if(list) {
          opt.legend.data.push(item.name)
          let temp
          list.samples.forEach((sample, i) => {
            if(i===0) {
              temp = sample;
              return
            }
            const rate = (temp.sample - sample.sample) *1000 / (temp.timestamp - sample.timestamp)
            serie.data.push(rate);
            if(index === 0) {
              opt.xAxis.data.push(dateFormat(new Date(sample.timestamp), 'hh:mm:ss'))
            }
            temp = sample
          })
          // 将数据反转
          serie.data.reverse();
          opt.series.push(serie)
        }
      })
      // 将时间反转
      opt.xAxis.data.reverse()
      return opt
    },
    async getData() {
      const req = {
        lengths_age: 60,
        lengths_incr: 5,
        msg_rates_age: 60,
        msg_rates_incr: 5
      }
      const {data:{data}} = await getOverview(req)
      const res = JSON.parse(data)
      this.overviewData = res
      this.loading = false
    },
    disabledDate(date) {
      return date.getTime() > Date.now()
    },
    translateTime(type) {
      // 一天的毫秒数
      const baseTime = 24 * 60 * 60 * 1000
      const format = 'yyyy-MM-dd'
      const today = dateFormat(Date.now(), format)
      let startDate
      switch (type) {
        case 'today':
          startDate = today
          break;
        case 'sevenDay':
          startDate = dateFormat(Date.now() - baseTime * 6, format)
          break;
        case 'fifteenDay':
          startDate = dateFormat(Date.now() - baseTime * 14, format)
          break;
        case 'thirtyDay':
          startDate = dateFormat(Date.now() - baseTime * 29, format)
          break;
      }
      this.dateRange = [startDate, today]
    },
    handleCultomClick() {
      this.modelVisible = !this.modelVisible
    },
    buildReceiveInfo({getReceiveTotalNumberByStatus={}}) {
      const {fail, success} = getReceiveTotalNumberByStatus
      const res = {
        total: fail + success,
        success,
        fail
      }
      this.receiveInfo = res
    },
    buildSendInfo({getTotalNumberByStatus}) {
      const res = {
        success: 0,
        fail: 0
      }

      getTotalNumberByStatus.forEach(item=> {
        if(item.status === '0') {
          res.fail = item.count
        }else {
          res.success = item.count
        }
      })
      res.total = res.success + res.fail
      this.sendInfo = res
    },
    tanslateChannnelType(type) {
      const map = {
        mail: '邮箱',
        shortmessage: '短信',
        weixin: '微信',
        telephone: '电话',
        third: '业务系统',
        others: '其它'
      }
      return map[type]
    },
    buildChannelTypeCharOpt({getSendTotalNumberByChannelType}) {

      const data = getSendTotalNumberByChannelType.map(item=> {
        return {
          name: this.tanslateChannnelType(item.channel_type),
          value: item.count
        }
      })
      const res = {
        legend: {
          top: 'bottom'
        },
        series: [
          {
            // name: '通道发送占比',
            type: 'pie',
            radius: [25, 120],
            center: ['50%', 130],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              formatter: '{b}({d}%)'
            },
            data: data
          }
        ]
      }
      this.sendByChannelTypeCharOpt = res
    },
    buildChannelCharOpt({getSendTotalNumberByChannelNameAndChannelType: list}) {
      const data = []
      const axis = []
      list.forEach(item=> {
        data.push(item.count)
        axis.push(`【${this.tanslateChannnelType(item.channel_type)}】${item.channel_name}`)
      })
      const res = {
        xAxis: {
          type: 'category',
          data: axis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            data: data
          }
        ]
      };
      this.sendByChannelCharOpt = res
    },
    async getStatisticsInfo() {
      const [beginDate, endDate] = this.dateRange
      const params = {
        beginDate: `${beginDate} 00:00:00`,
        endDate: `${endDate} 23:59:59`,
      }
      this.statisticLoading = true
      const {data:{data}} = await getMessageOverview(params)

      this.statisticLoading = false
      this.buildReceiveInfo(data)
      this.buildSendInfo(data)
      this.buildChannelTypeCharOpt(data)
      this.buildChannelCharOpt(data)
    }
  },
  mounted() {
    this.timer = setInterval(()=>{
      this.getData()
    }, 5000)

    this.timeRadio = 'sevenDay'
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.static-info-header {
  display: flex;

  h2 {
    flex: 1;
    margin: 0;
    font-size: 16px;
    font-weight: 400;
  }
}
.inner-card {

  /deep/.el-card__header {
    padding: 1px 10px !important;
    border-bottom: none;

    h3 {
      margin: 0;
      font-size: 14px;
    }
  }
  /deep/.el-card__body {
    padding: 10px 10px 20px;
  }
}
.static-info-list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style-type: none;
  justify-content: space-between;

  li {
    text-align: center;

    strong {
      font-size: 1.5em;
    }
    h3 {
      font-size: 14px;
      font-weight: 400;
      margin: 0;
    }

    &:first-child {
      strong {
        color: #409EFF
      }
    }
    &:nth-child(2) {
      strong {
        color: #67C23A
      }
    }
    &:last-child {
      strong {
        color: #F56C6C
      }
    }
  }
}
</style>
