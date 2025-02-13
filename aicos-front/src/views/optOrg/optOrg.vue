<template>
  <div class="orgTab">
    <el-tabs
      v-model="tabActive"
      :before-leave="beforeTabChange"
      v-if="( checkedData.type.length > 1 )"
    >
      <el-tab-pane name="user" :lazy="true" v-if="( checkedData.type.includes('user') )">
        <span slot="label" class="orgTabLabel"><i class="el-icon-date"></i>用户</span>
      </el-tab-pane>

      <el-tab-pane name="dept" :lazy="true" v-if="( checkedData.type.includes('dept') )">
        <span slot="label" class="orgTabLabel"><i class="el-icon-date"></i>部门</span>
      </el-tab-pane>

      <el-tab-pane name="role" :lazy="true" v-if="( checkedData.type.includes('role') )">
        <span slot="label" class="orgTabLabel"><i class="el-icon-date"></i>角色</span>
      </el-tab-pane>

      <el-tab-pane name="rank" :lazy="true" v-if="( checkedData.type.includes('rank') )">
        <span slot="label" class="orgTabLabel"><i class="el-icon-date"></i>职级</span>
      </el-tab-pane>

      <el-tab-pane name="dyna" :lazy="true" v-if="( checkedData.type.includes('dyna') )">
        <span slot="label" class="orgTabLabel"><i class="el-icon-date"></i>动态绑定</span>
      </el-tab-pane>

    </el-tabs>

    <div v-if="(this.tabActive == 'user')">
      <optUser ref="optUserRef" :checkedData="formatCheckedData"
      />
    </div>
    <div v-if="(this.tabActive == 'dept')">
      <optDept ref="optDeptRef" :checkedData="formatCheckedData"
      />
    </div>
    <div v-if="(this.tabActive == 'role')">
      <optRole ref="optRoleRef" :checkedData="formatCheckedData"
      />
    </div>
    <div v-if="(this.tabActive == 'rank')">
      <optRank ref="optRankRef" :checkedData="formatCheckedData" />
    </div>
    <div v-if="(this.tabActive == 'dyna')">
      <optDyna ref="optDynaRef" :checkedData="formatCheckedData" />
    </div>


    <!-- <div>{{checkedData.type}}</div> -->

  </div>
</template>

<script>
import { deepAssignNoArr, isNull } from '@/util/qsgCommon.js';

import optUser from './optUser';
import optDept from './optDept';
import optRole from './optRole';
import optRank from './optRank';
import optDyna from './optDyna';

export default {
  name: 'optOrg',
  components: {
    optUser,
    optDept,
    optRole,
    optRank,
    optDyna,
  },
  props: {
    checkedData: {
      type: Object,
      default() {
        return {}
      }
    },
  },

  data() {
    return {
      tabActive: [],
      formatCheckedData:{},
    }
  },
  methods: {

    getResData(){

      if( this.tabActive == 'user' ){
        this.formatCheckedData.user = this.$refs.optUserRef.getResData();
      }else if(this.tabActive == 'dept'){
        this.formatCheckedData.dept = this.$refs.optDeptRef.getResData();
      }else if(this.tabActive == 'role'){
        this.formatCheckedData.role = this.$refs.optRoleRef.getResData();
      }else if(this.tabActive == 'rank'){
        this.formatCheckedData.rank = this.$refs.optRankRef.getResData();
      }else if(this.tabActive == 'dyna'){
        this.formatCheckedData.dyna = this.$refs.optDynaRef.getResData();
      }

      return this.formatCheckedData
    },
    beforeTabChange(activeName, oldActiveName){

      //console.log('切换前')
      //console.log(activeName, oldActiveName)

      if( oldActiveName == 'user'){
        this.formatCheckedData.user = this.$refs.optUserRef.getResData();
      }else if( oldActiveName == 'dept'){
        this.formatCheckedData.dept = this.$refs.optDeptRef.getResData();
      }else if( oldActiveName == 'role'){
        this.formatCheckedData.role = this.$refs.optRoleRef.getResData();
      }else if( oldActiveName == 'rank'){
        this.formatCheckedData.rank = this.$refs.optRankRef.getResData();
      }else if( oldActiveName == 'dyna'){
        //console.log(this.$refs.optDynaRef)
        this.formatCheckedData.dyna = this.$refs.optDynaRef.getResData();
      }

    },
    /*tabChange(tab, event){
      console.log('切换后')
      console.log(tab)
    },*/

    /*数据格式化，保持各tab数据格式统一*/
    checkedDataFormat(){
      const defaultData = {
        type:[],
        num:{
          user:{ max:99999, min:0, },
          dept:{ max:99999, min:0, },
          role:{ max:99999, min:0, },
          rank:{ max:99999, min:0, },
          dyna:{ max:99999, min:0, },
        },
        user:[],
        dept:[],
        role:[],
        rank:[],
        dyna:[],
      };

      /*如果type不传值 默认选择tab可用*/
      if( !this.checkedData.type || isNull(this.checkedData.type) ){
        this.checkedData.type = ['user','dept','role',/*'rank',*/'dyna'];
      }

      this.formatCheckedData = deepAssignNoArr(defaultData,this.checkedData);
      this.tabActive = this.formatCheckedData.type[0];
    },

  },
  mounted(){

  },
  created(){
    //console.log(this.checkedData);


    this.checkedDataFormat();
  },
  watch: {
    /*"checkedData.type":{
      handler(newVal){
        //console.log('二级变化type')
        this.tabActive = newVal[0];
      }
    },*/
    "checkedData":{
      handler(newVal/*,oldVal*/) {
        this.tabActive = newVal[0];
        this.checkedDataFormat();
      },
      deep: true
    },

    /*"formatCheckedData":{
      handler(newVal) {
        console.log('formatCheckedData二级变化')
      },
      deep: true
    },*/
  },

}
</script>

<style lang="scss" scoped>
.orgTab {
  /deep/.el-tabs__item {
    padding: 0 10px;
  }
  .orgTabLabel {
    padding: 0 10px;
  }
  .orgTabLabel>i {
    margin-right: 5px;
  }

}
</style>
