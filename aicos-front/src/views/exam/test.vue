<template>
  <div style="margin: 50px;">


    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="qusnDesignOpen()">建个问卷设计器</el-button>

    <hr style="margin-top: 30px;">
    给前端一个Json{{qusnFrontJson}}

    <hr style="margin-top: 30px;">
    给后端一个Json{{qusnBackJson}}

    <hr style="margin-top: 30px;">
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="updateQusnTemplete()">打开个已发布的json</el-button>

    <hr style="margin-top: 30px;">
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="qusnOpen()">再搞个组件打开问卷开始答题</el-button>

    <hr style="margin-top: 30px;">
    <el-button icon="el-icon-check" size="small" type="primary" @click.stop="qusnUpdate()">编辑已经填过的问卷</el-button>


    <HuilanDialog title="问卷设计器"
      :fullscreen="true"
      width="960px"
      append-to-body
      :visible.sync="qusnDesignTag"
      :destroy-on-close="true"
      class="qusnDesign-dialog"
      >
      <avue-questionnaire-design 
        ref="qusnDesignRef"
        :options="options"
        @submit="handleSubmit"
        :custom-fields="customFields">
      </avue-questionnaire-design>
      
      <template v-slot:footer>
        <el-button icon="el-icon-check" size="small" type="primary" @click="qusnDesignSave">确定</el-button>
        <el-button icon="el-icon-close" size="small" @click="qusnDesignClose">关闭</el-button>
      </template>
    </HuilanDialog>


    <HuilanDialog title="问卷填写"
      :fullscreen="true"
      width="960px"
      append-to-body
      :visible.sync="qusnTag"
      :destroyOnClose="true"
      class="qusn-dialog"
      >
      <QusnView
        ref="qusnFromRef"
        :data="qusnFromData"
        :option="qusnFromOption"
        >
      </QusnView>

      <template v-slot:footer>
        <el-button icon="el-icon-check" size="small" type="primary" @click="qusnSave">提交</el-button>
        <el-button icon="el-icon-close" size="small" @click="qusnClose">关闭</el-button>
      </template>
    </HuilanDialog>

    <div>

      <el-button icon="el-icon-check" size="small" type="primary" @click="changeOption">1变成2</el-button>
      <el-button icon="el-icon-check" size="small" type="primary" @click="selectName">选中name</el-button>

      <div style="float: left; width:45%">
        <avue-form 
          ref="formRef"
          :option="formOption"
          v-model="formData"
          :key='formOptionKey'
        >
        </avue-form>
      </div>
      <div  style="float: left; width:45%">
        <!-- <avue-form 
          ref="formRef2"
          :option="formOption2"
          v-model="formData2"
        >
        </avue-form> -->
      </div>
    </div>
    

  </div>
</template>
<script>

//import { sortObject } from '@/util/qsgCommon.js';
import QusnView from '@/components/QusnView/index';
import { getDictItemListByDictCodeURL } from "@/api/common";

export default {
  name: 'optTest',
  components: {
    QusnView
  },
  data() {
    return {
      options: {},
      qusnDesignTag: false,

      qusnFrontJson:'',
      qusnBackJson:'',

      hasJson: { "column": [ { "type": "checkbox", "typeQusn": "checkboxQusn", "label": "多选题2222222222", "dicData": [ { "label": "选项一1111111111", "value": "a167100191377276693_Rm_38689_Pr_1" } ], "display": true, "props": { "label": "label", "value": "value" }, "prop": "a167100191377276693" }, { "type": "textarea", "typeQusn": "textareaQusn", "label": "论述题2222222222", "display": true, "prop": "a167100191442885768", "showWordLimit": true }, { "type": "input", "typeQusn": "inputQusn", "label": "简答题22222222", "display": true, "prop": "a167100191488477011", "showWordLimit": true } ], "span": 24, "labelPosition": "top", "labelSuffix": " ", "labelWidth": 120, "gutter": 0, "detail": false, "menuBtn": false, "submitBtn": false, "submitText": "提交", "emptyBtn": false, "emptyText": "清空", "menuPosition": "center", "readonly": false, "disabled": false, "showLabelIndex": true },

      hasData:{"qusnData":{"a167100884711092727":"a167100884711092727_Rm_98393_Pr_2","a167100884779760223":"22","a167100884855055375":["a167100884855055375_Rm_40982_Pr_2","a167100884855055375_Rm_23449_Pr_3"],"a167100884903880407":"333"},"qusnOption":{"column":[{"type":"radio","typeQusn":"radioQusn","label":"单选题","dicData":[{"label":"选项一","value":"a167100884711092727_Rm_67923_Pr_1"},{"label":"选项_98393","value":"a167100884711092727_Rm_98393_Pr_2"}],"display":true,"props":{"label":"label","value":"value"},"prop":"a167100884711092727"},{"type":"input","typeQusn":"inputQusn","label":"简答题","display":true,"prop":"a167100884779760223","showWordLimit":true},{"type":"checkbox","typeQusn":"checkboxQusn","label":"多选题","dicData":[{"label":"选项一","value":"a167100884855055375_Rm_68023_Pr_1"},{"label":"选项_40982","value":"a167100884855055375_Rm_40982_Pr_2"},{"label":"选项_23449","value":"a167100884855055375_Rm_23449_Pr_3"}],"display":true,"props":{"label":"label","value":"value"},"prop":"a167100884855055375"},{"type":"textarea","typeQusn":"textareaQusn","label":"论述题","display":true,"prop":"a167100884903880407","showWordLimit":true}],"span":24,"labelPosition":"top","labelSuffix":" ","labelWidth":120,"gutter":0,"detail":false,"menuBtn":false,"submitBtn":false,"submitText":"提交","emptyBtn":false,"emptyText":"清空","menuPosition":"center","readonly":false,"disabled":false,"showLabelIndex":true}},

      qusnTag: false,

      qusnFromOption: {},
      qusnFromData: {},

      formOption:{
        
        column: [
          {
            label: '姓名',
            prop: 'name'
          },
        ]
      },
      formOptionKey: 0,
      formOption2:{
        column: [
          {
            label: '姓名2',
            prop: 'name2'
          },
          {
            label: "类型",
            prop: "type",
            type: "select",
            width: 120,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "cloud-vendor-type",
            },
            props: {
              label: "name",
              value: "code",
            },
          },
        ]
      },

    }
  },
  methods: {
    qusnDesignOpen(){
      this.qusnDesignTag = true;
    },
    qusnDesignClose(){
      this.qusnDesignTag = false;
    },
    async qusnDesignSave(){
      const designData = await this.$refs.qusnDesignRef.getData();
      //console.log(designData);
      this.qusnFrontJson = designData;
      this.qusnBackJson = designData;
      this.qusnDesignTag = false;
    },
    updateQusnTemplete(){
      this.options = this.hasJson;
      this.qusnDesignTag = true;
    },
    

    qusnOpen(){
      this.qusnFromOption = this.qusnFrontJson;
      this.qusnTag = true;
    },
    qusnSave(){
      const formData = this.$refs.qusnFromRef.getData();
      window.console.log(formData)
      window.console.log( JSON.stringify(formData) )
      //this.qusnTag = false;

    },
    qusnClose(){
      this.qusnTag = false;
    },
    qusnUpdate(){
      this.qusnFromOption = this.hasData.qusnOption;
      this.qusnFromData = this.hasData.qusnData;
      this.qusnTag = true;
    },
    changeOption(){
      this.formOption = this.formOption2;
      this.formOptionKey++;
    },
    selectName(){

      this.$refs.formRef.getPropRef('name').$el.firstElementChild.select();
    },


  },
  watch:{

    
  },
}
</script>
<style lang="scss" scoped>
.qusnDesign-dialog {
  .el-dialog__body {
    height: calc(100% - 120px);
    padding: 0;
  }
}
</style>
