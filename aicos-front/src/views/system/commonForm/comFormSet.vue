<template>
  <basic-container class="formset_w">
    <div class="formset_closebtn">
      <el-button
          type="danger"
          size="small"
          icon="el-icon-circle-close"
          @click.stop="comFormSetClose"
          >关闭
        </el-button>
      </div>

    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>

    <div v-if="(this.tabActive == 1)">
      <comFormSetField
        :data="data"
      ></comFormSetField>
    </div>
    <div v-if="(this.tabActive == 2)">
      <comFormSetList
        :data="data"
      ></comFormSetList>
    </div>
    <div v-if="(this.tabActive == 3)">
      <comFormSetSearch
        :data="data"
        ></comFormSetSearch>
    </div>
    <div v-if="(this.tabActive == 4)">
      <comFormSetNeedto
        :data="data"
      ></comFormSetNeedto>
    </div>
    <div v-if="(this.tabActive == 5)">
      <comFormSetForm
        :data="data"
      ></comFormSetForm>
    </div>
    <div v-if="(this.tabActive == 6)">
      <comFormSetVerify
        :data="data"
      ></comFormSetVerify>
    </div>

    
    <!-- <div>{{data.id}}</div> -->

  </basic-container>
</template>

<script>
import comFormSetField from './comFormSetField'
import comFormSetList from './comFormSetList'
import comFormSetSearch from './comFormSetSearch'
import comFormSetNeedto from './comFormSetNeedto'
import comFormSetForm from './comFormSetForm'
import comFormSetVerify from './comFormSetVerify'
export default {
  name: 'comFormSet',
  components: {
    comFormSetField,
    comFormSetList,
    comFormSetSearch,
    comFormSetNeedto,
    comFormSetForm,
    comFormSetVerify
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      tabOption:{
        column: [
          {
            icon:'el-icon-menu',
            label: '字段设置',
            value:1,
          },
          {
            icon:'el-icon-s-grid',
            label: '列表页设置',
            value:2,
          },
          {
            icon:'el-icon-s-fold',
            label: '查询列设置',
            value:3,
          },
          /*{
            icon:'el-icon-s-unfold',
            label: '待办设置',
            value:4,
          },*/
          {
            icon:'el-icon-receiving',
            label: '表单页设置',
            value:5,
          },
          {
            icon:'el-icon-s-check',
            label: '审核设置',
            value:6,
          }
        ]
      },
      tabActive:1,

      active: 'fieldTab',
    }
  },
  methods: {
    tabChange(data){
      this.tabActive = data.value ;
      //console.log(this.data)
    },

    comFormSetClose(){
      this.$emit('comFormSetCloseFun');
    },
  }
}
</script>

<style lang="scss" scoped>
.formset_w {
  .formset_closebtn { position: absolute; top: 20px; right: 30px; background-color: #fff; z-index:4;}
}
</style>
