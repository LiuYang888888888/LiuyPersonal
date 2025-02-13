<template>
  <basic-container  class="newCss" >
    <div class="verifyFormClass">
      <avue-form
        :option="verifyFormOption"
        ref="verifyFormRef"
        v-model="verifyFormData"
        @submit="verifyFormSave"
        >
        <template slot-scope="{disabled,size}" slot="flowNodes">
          <div v-for="(item,index) in nodeData" :key="index">

            <div data-v-8c018ee0="" class="el-form-item el-form-item--small">
              <div class="el-form-item__label-wrap">
                <label class="el-form-item__label" style="width: auto;">{{item.activityName}}:</label>
              </div>
              <div class="el-form-item__content">
                <el-switch v-model="item.setEdit" ></el-switch>
              </div>
            </div>

          </div>
        </template>
        <template slot-scope="{size}" slot="menuForm">
          <el-button type="primary" :size="size" icon="el-icon-check" :loading="loading" @click.stop="verifyFormSave">保存审核配置</el-button>
        </template>
      </avue-form>
    </div>
    
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
//import { getRules } from "@/util/regx";
//import { baseURL } from '@/api/common';
//import serviceList from "@/config/serviceList";
import { validatenull } from '@/util/validate';
import {
  getFlowList,
  getFlowConfig,
  updateFlowConfig
} from "@/api/system/commonForm";

export default {
  name: 'comFormSetVerify',
  components: {
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
      loading:false,
      nodeData:[],
      nodeSet:[],
      flowListData:[],
      flowSetId:'',
      formIsAudit:0,

      verifyFormData:{},
      verifyFormReload:1,
      verifyFormOption:{
        submitBtn:false,
        //submitText:"保存审核配置",
        emptyBtn:false,
        //menuPosition:'right',
        column: [
          {
            label: "ID",
            prop: "id",
            span: 24,
            display:false,
          },
          {
            label: '开启审核',
            prop: 'isAudit',
            span: 24,
            row:true,
            type: 'radio',
            dicData: [
              {label: '开启', value: 1},
              {label: '不开启', value: 0},
            ],
            value:0,
            change: ({ value }) => {
              
              if(this.formIsAudit == value){
                //console.log(value);
              }else{

                this.formIsAudit = value;
                const processDefineIdColumn = this.findObject(this.verifyFormOption.column, "processDefineId");
                const flowNodesColumn = this.findObject(this.verifyFormOption.column, "flowNodes");
                if(value != 1){
                  this.$set(processDefineIdColumn,'display',false);
                  this.$set(flowNodesColumn,'display',false);
                  this.loading = false ;
                }else if(value == 1){
                  this.loading = true ;
                  const dataParam = {
                    formTemplateId: this.data.id,
                  }
                  getFlowList(dataParam).then((res)=>{
                    processDefineIdColumn.dicData = res.data.data.map((item) => {
                      if(item.usedByForm){
                        item.usedByFormText = "[ 已选配置 ]  ";
                      }else{
                        item.usedByFormText = "";
                      }
                      item.showLabel = item.name+'  ('+item.version+')';
                      return item
                    })
                    this.$set(processDefineIdColumn,'display',true);
                    this.loading = false ;
                  });
                }
              }
              
            },

          },

          {
            label:'工作流',
            prop: 'processDefineId',
            span: 24,
            row:true,
            display:false,
            type: 'select',
            value:'',
            dicData:[],
            props: {
              label: 'showLabel',
              value: 'processId',
              desc: 'usedByFormText'
            },
            rules: [
              {
                required: true,
                message: "请选择工作流",
                trigger: "blur"
              }   
            ],
            change:({value})=>{
              //console.log(value);
              const flowNodesColumn = this.findObject(this.verifyFormOption.column, "flowNodes");
              if(!validatenull(value)){
                this.loading = true ;
                getFlowConfig({
                  formTemplateId:this.data.id,
                  processDefineId:value,
                }).then((res)=>{
                  this.$set(flowNodesColumn,'display',true);
                  const dataRes = res.data.data;
                  dataRes.map((item)=>{
                    if(item.formEdit == 'edit'){
                      item.setEdit = true ;
                    }else{
                      item.setEdit = false;
                    }
                    return item
                  });
                  this.nodeData = dataRes;
                  this.loading = false ;

                }, error => {
                  window.console.log(error);
                  this.$set(flowNodesColumn,'display',false);
                })
              }else{
                this.$set(flowNodesColumn,'display',false);
                this.loading = false ;
              }
            }
          },
          {
            label: "允许修改",
            prop: "flowNodes",
            span: 24,
            display:false,
          },
        ]
      },
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {  
       
      };
    },
  },
  methods: {
    verifyFormSave(/*form,done*/){
      this.loading = true ;
      const dataParam = {
        formTemplateId: this.data.id,
      }

      if( this.verifyFormData.isAudit == 1 ) {
        dataParam.isAudit = 1;
        if( !validatenull(this.verifyFormData.processDefineId) ){
          if(!validatenull(this.nodeData) ){
            dataParam.nodeList = this.nodeData.map((item)=>{
              if(item.setEdit){
                item.formEdit = 'edit';
              }else{
                item.formEdit = 'read';
              }
              return item
            });
          }else{
            //console.log('流程没有任务节点');
            dataParam.nodeList = [];
          }
          
        }else{
          dataParam.isAudit = 0;
        }
        dataParam.processDefineId = this.verifyFormData.processDefineId;

      }else{
        dataParam.isAudit = 0;
      }

      //console.log(dataParam);
      updateFlowConfig(dataParam).then((/*res*/) => {
        this.data.isAudit =  dataParam.isAudit;
        this.data.processDefineId = dataParam.processDefineId;
        this.loading = false ;
        this.$message({
          type: "success",
          message: "操作成功!"
        });

      }, error => {
        this.loading = false ;
        window.console.log(error);

      });

      
    },

  },
  mounted() {
    if(this.data.isAudit == 1 && !validatenull(this.data.processDefineId) ){
      //console.log("已经设置流程");
      this.findObject(this.verifyFormOption.column, "isAudit").value = 1;
      this.findObject(this.verifyFormOption.column, "processDefineId").value = this.data.processDefineId;
    }
  },
}
</script>

<style lang="scss" scoped>
.newCss {
  position:relative;
  height:100%;
  .menuTitle { position: absolute; top:30px; left:40px; font-size:22px; font-weight:500; z-index:2; }
  /deep/.avue-crud__search .avue-form__group { justify-content: flex-end; }
  /deep/.avue-crud__search .avue-form__menu { width:240px;}
  /deep/.el-card__body .avue-crud__menu  { justify-content: flex-end; }
  .verifyFormClass { width:560px;}

}
</style>


