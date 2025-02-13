<template>
  <el-table :data="historyList">
    <el-table-column property="HistoricActivityInstance.activityName" label="节点名称"></el-table-column>
    <el-table-column property="FlowVO.comment" label="处理意见">
      <template slot-scope="scope">
        <pre style="margin: 0">{{scope.row.FlowVO.comment }}</pre>
      </template>
    </el-table-column>
    <el-table-column property="FlowVO.assignee" label="处理人"></el-table-column>
    <el-table-column
      property="FlowVO.endTime"
      label="处理时间"
      :formatter="endTimeFormatter"></el-table-column>
  </el-table>
</template>

<script>
import { historyFlowList } from '@/api/mywork/worklist'

import{ initDate } from '@/util/qsgCommon'

export default {
  name: 'CirculationHistory',
  props: {
    processInstanceId: String
  },
  data() {
    return {
      historyList: []
    }
  },
  watch: {
    processInstanceId:{
      handler() {
        this.getHistoryList()
      },
      immediate: true
    }
  },
  methods: {
    endTimeFormatter(row, column, cellValue/* , index */) {
      // console.log(row, column, cellValue, index)
      return cellValue?initDate(cellValue):'';
    },
    hexToStr(hexString) { // 移除 \x 并将十六进制字符串转换为字节数组 
      let hex = hexString.replace(/\\x/g, ''); 
      let str = ''; 
      for (let i = 0; i < hex.length; i += 2) 
      { 
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); 
      } 
      return str; 
    },
    async getHistoryList() {
      const res = await this.getHistoryListByInstanceId(this.processInstanceId)
      res.forEach(e => {
        if(e.FlowVO.comment){
          this.hexToStr(e.FlowVO.comment))
          e.FlowVO.comment = eval(e.FlowVO.comment)
        }
      });
      this.historyList = res
    },
    async getHistoryListByInstanceId(processInstanceId) {
      const params = {
        processInstanceId: processInstanceId,
        // processDefinitionId: this.cur.processDefinitionId
      }
      const {data: {data}} = await historyFlowList(params)

      let res = []
      for(let i = 0,l = data.length; i<l; i++) {
        let item = data[i]
        if(item.SubProcessConfig && item.SubProcessConfig.mainProcessLookSubProcessHistory === 'true') {
          const subList = await this.getHistoryListByInstanceId(item.HistoricActivityInstance.calledProcessInstanceId)
          res.push(item, ...subList)
        }else {
          res.push(item)
        }
      }
      return res
    }
  }
}
</script>

<style scoped>

</style>
