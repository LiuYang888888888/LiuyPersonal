<template>
  <HuilanBasic hasTab>
    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
    <div class="inTab">
      <div v-if="(this.tabActive == 'ParticipantList')">
        <ParticipantList
          :qusnConfig="qusnConfig"
         >
        </ParticipantList>
      </div>
      <div v-if="(this.tabActive == 'Analysis')">
        <Analysis
          :qusnConfig="qusnConfig"
         >
        </Analysis>
      </div>
    </div>
 
  </HuilanBasic>
</template>
<script>
import Analysis from './analysis';
import ParticipantList from './participantList';

import { isNull } from '@/util/qsgCommon.js';

import { 
  detailQusn,
} from "@/api/questionnaire/index";


export default {
  inject: ["desktopWindow", "desktop"],

  name: 'Statistic',
  components: {
    Analysis,
    ParticipantList,
  },
  props: {
    propParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tabActive: 'ParticipantList',
      tabOption:{
        column: [
          {
            label: '参与分析',
            value: 'ParticipantList',
          },
          {
            label: '问卷统计分析',
            value: 'Analysis',
          },
          
        ]
      },

      qusnConfig: {},
    }
  },
  methods: {
    tabChange(data){
      this.tabActive = data.value;
      this.getActiveQusn();
    },

    async getActiveQusn(){

      if( this.propParams.qusnId ){
        this.qusnId = this.propParams.qusnId;
      }else if (this.desktop) {
        this.qusnId = this.desktopWindow.data.query.qusnId;
      }else{
        this.qusnId = this.$route.query.qusnId;
      }

      if( isNull(this.qusnId) ){
        this.$message.error("调查问卷参数设置错误。");
        return false
      }
      detailQusn({id:this.qusnId}).then((res)=>{
        const dataRes = res.data.data;
        this.qusnConfig = dataRes ;
        
        if( isNull( dataRes.editorFrontJson) ){
          this.$message.error("调查问卷问题设置错误。");
        }
      })

    },

  },

  created(){
    this.getActiveQusn();
  },
  watch:{
    '$route': 'getActiveQusn',
    'desktopWindow.data': {
      handler() {
        this.getActiveQusn()
      },
      deep: true
    },
    'propParams':{
      handler(){
        this.getActiveQusn();
      },
      deep: true 
    }
  },

}
</script>
<style lang="scss" scoped>

</style>
