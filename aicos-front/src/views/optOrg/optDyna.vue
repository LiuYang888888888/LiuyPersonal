<template>
  <div class="dynaW">

    <div class="dyna">
      <div class="dyna-li" v-for="item of selectData" :key="item.prop" >
        <el-tooltip 
            popper-class="dyna-li-tips" 
            effect="dark" 
            :disabled="( !(item.tips) )" 
            :content="item.tips" 
            placement="right"
        >
          <el-checkbox :checked="item.value" name="item.prop" @change="changeCheckbox" v-model="item.value" >{{ item.label || item.prop}}</el-checkbox>
        </el-tooltip>
      </div>
    </div>
    
   <!-- <div>{{selectData}}</div> -->

  </div>
</template>
<script>
//import { deepAssignNoArr, isNull } from '@/util/qsgCommon.js';

export default {
  name: 'optDyna',
  props: {
    checkedData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      selectData:[],

      selectProps: {
        label: "",
        prop: "",
        value: "",
      },
    }
  },
  methods: {
    getResData(){
      return this.selectData
    },

    changeCheckbox(){
      //console.log(this.selectData)
    },

    initData(){
      //防止数据双向绑定，影响初始化
      const tempArr = [];
      this.checkedData.dyna.map((item)=>{
        tempArr.push({...item});
      });
      this.selectData = tempArr;
    },

  },
  mounted(){
    this.initData();
  },
  created(){

  },
  watch: {
    "checkedData":{
      handler(/*newVal*/) {
        this.initData();
      },
      deep: true
    },
  },

}
</script>
<style>
.dyna-li-tips.el-tooltip__popper {
  background-color: #336ad3;
  font-size: 12px;
  color: #fff;
}
.dyna-li-tips.el-tooltip__popper .popper__arrow {
  border-right-color: #336ad3;
}
.dyna-li-tips.el-tooltip__popper .popper__arrow::after {
  border-right-color: #336ad3;
}
</style>
<style lang="scss" scoped>
.dynaW {
  height: 429px;
  overflow-y: auto;
  padding: 10px; 
  .dyna{
    padding-left: 30px;
    .dyna-li {
      margin-top: 20px; 
      /deep/.el-checkbox__label {
        font-size: 14px;
      }
    }
    
  }
}


</style>