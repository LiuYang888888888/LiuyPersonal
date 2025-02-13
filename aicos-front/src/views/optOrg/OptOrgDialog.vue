<template>
  <div class="optOrgDialog">
    <HuilanDialog :title="optTitle"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="optTag"
      :destroy-on-close="true"
      >
      <optOrg
        ref="optOrgRef"
        :checkedData="ajaxCheckedData"
      />
      <template v-slot:footer>
        <el-button icon="el-icon-check" size="small" type="primary" @click="optOrgSave">确定</el-button>
        <el-button icon="el-icon-close" size="small" @click="optOrgClose">关闭</el-button>
      </template>
    </HuilanDialog>

    <div class="selectMain">
      <div class="selectBtn">
        <el-button icon="el-icon-circle-plus-outline" size="mini" type="primary" @click.stop="checkeOrg()">选择</el-button>
      </div>

      <div class="selectRes">
        <el-tag
          closable
          size="small"
          v-for="item in value.list"
          :key="item.id"
          :class="item.type"
          @close="removeSelect(item)"
          >{{ item.name }}
        </el-tag>

        <el-tag
          closable
          size="small"
          class="dyna"
          v-for="item in defaultDynaData"
          :key="item.prop"
          v-if="value[item.prop]"
          @close="removeSelect(item.prop)"
        >{{item.label}}</el-tag>

      </div>

    </div>


  </div>
</template>

<script>
import optOrg from './optOrg';
import { /*isNull,*/ formatOrgDataToNew, formatOrgDataToOld, defaultDynaData } from '@/util/qsgCommon.js';


export default {
  name: 'optOrgDialog',
  components: {
    optOrg
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {
        }
      }
    },
    tabs: {
      type: Array,
      default() {
        return []
      }
    },
    hasNodeApprover: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      optTag: false,
      optTitle: '选择',
      ajaxCheckedData:{},

      defaultDynaData:{},

    }
  },
  methods: {
    checkeOrg(){

      this.optTitle = this.title;

      const dataRes = formatOrgDataToNew(this.value);
      if(!this.hasNodeApprover) {
        dataRes.dyna = dataRes.dyna.filter(item=>item.prop != 'nodeApprover');
      }
      this.ajaxCheckedData = {
        ...this.ajaxCheckedData,
        ...dataRes,
        type: this.tabs || [],
        // hasNodeApprover: this.hasNodeApprover,
      }
      this.optTag = true;

    },
    optOrgSave(){

      const resData = this.$refs.optOrgRef.getResData();
      //let rex = "您设置了 "+resData.user.length +'个用户；'+resData.dept.length +'个部门；'+resData.role.length +'个角色；'
      //this.$message.success( rex );

      this.value = formatOrgDataToOld(resData);

      this.$emit("input", this.value);

      this.optTag = false;

    },
    optOrgClose(){
      //console.log('optOrgClose');
      this.optTag = false;
    },
    removeSelect(data){
      // const arr = ['applicant', 'applicantLeader', 'applicantDirectLeader', 'submitterLeader', 'submitDirectLeader', 'nodeApprover'];
      const arr = this.defaultDynaData.map(item=>item.prop);
      if( arr.includes(data) ){
        this.value[data] = false;
      }
      this.value.list = this.value.list.filter((item)=> !(item.id == data.id && item.type == data.type) );

    }

  },
  mounted(){
    this.defaultDynaData = defaultDynaData;
  },

  created(){
  },

  watch:{
    /*"value":{
      handler(newVal) {
        //console.log(newVal)
      },
      deep: true
    },
    "tabs":{
      handler(newVal) {
        //console.log(newVal)
      },
      deep: true
    },*/
  },
}
</script>
<style lang="scss" scoped>
.selectMain {
  .selectBtn {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .selectRes {
    display:inline-block;
    /deep/.el-tag {
      margin-right: 8px;
      margin-bottom: 5px;
      height: 28px;
      line-height: 26px;
      &.user {
        background-color: #409EFF50;
        border-color: #409EFF80;
      }
      &.dept {
        background-color: #90939950;
        border-color: #90939980;
      }
      &.role {
        background-color: #67C23A50;
        border-color: #67C23A80;
      }
      &.dyna {
        background-color: #E6A23C50;
        border-color: #E6A23C80;
      }
    }

  }

}
</style>
