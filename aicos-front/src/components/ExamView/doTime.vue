<template>
  <span>{{useTimeToMS}}</span>
</template>
<script>
import { initSecond } from '@/util/qsgCommon.js';

export default {
  name: 'DoTime',
  props: {
    doTime: {
      type: String,
    }
  },
  data() {
    return {
      useTimeToMS: 0,
      useStartTime: 0,
      useTime: 0,
      useEndTime: 0,
      useTimer: null,
    }
  },
  methods: {
    getData(){

      let res = {
        useStartTime: this.useStartTime,
        useTime: this.useTime,
        useEndTime: this.useEndTime,
      };
      return res

    },
    useTimeStart(reset){
      const that = this;
      if(reset){ 
        window.clearInterval(that.useTimer);
        that.useTime = 0;
        that.useStartTime = Date.now();
      }
      
      that.useTimer = window.setInterval(()=>{
        that.useTime++;
      },1000)

    },
    useTimeStop(){
      this.useEndTime = Date.now();
      window.clearInterval(this.useTimer);
    },
    secondToMS(second){
      this.useTimeToMS = initSecond(second);
    },
  },
  mounted(){
    /*this.useTimeStop();
    this.useTimeStart(true); */
  },
  watch:{
    'useTime': {
      handler(val) {
        this.secondToMS(val);
      },
      immediate: true,
    },
  },
}
</script>