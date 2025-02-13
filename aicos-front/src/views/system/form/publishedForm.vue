<template>
  <div>
    <avue-crud :option="option"
               :search.sync="query"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               @row-del="rowDel"
               :page.sync="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
       <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click.stop="addFormData(scope.row,scope.index)"
            >新增表单数据
            </el-button>
         <el-button
           type="text"
           icon="el-icon-document"
           size="small"
           @click.stop="messageTplParams(scope.row,scope.index)"
         >消息模板变量
         </el-button>
         </template>
      </avue-crud>
      <HuilanDialog
        title="新增表单数据"
        :fullscreen="true"
        append-to-body
        :visible.sync="formDialogVisible"
      >
        选择流程：<el-select
          placeholder="请选择流程"
          size="small"
          v-model="flow"
        >
          <el-option v-for="item in flowList" :key="item.id" :value="item.id" :label="`${item.name}(${item.version})`"></el-option>
        </el-select>
        <el-divider></el-divider>
        <template
          v-if="formDialogVisible"
        >
          <FormPreview
            v-if="curForm.type !=='custom'"
            ref="form"
            :option="formOption"
            :formTemplateFlatJson="formTemplateFlatJson"
            :data.sync="formData"

            :handleFormSubmit="handleFormSubmit"
          />
          <component v-else :is="FormCmp"/>
        </template>
        <template v-slot:footer>
          <el-popover
            placement="top"
            width="260"
            trigger="click"
            style="margin:0 10px;"
          >
            <p>businessId:</p>
            <el-input size="mini" v-model="businessId"/>
            <div style="text-align: right; margin: 10px 0 0">
              <el-button size="mini" type="text">取消</el-button>
              <el-button type="primary" size="mini" @click="startProcess">确定</el-button>
            </div>
            <el-button slot="reference">启动流程1</el-button>
          </el-popover>
          <el-button @click="startProcess2">启动流程2</el-button>
          <el-button @click="submitToCreate">提交到创建节点</el-button>
        </template>
      </HuilanDialog>

      <HuilanDialog
        title="消息模板变量"
        append-to-body
        :visible.sync="paramDialogVisible"
      >
        <MessageTemplateParam
          :tplId="curForm.id"
          :fieldList="formFields"
        />
<!--        <template v-slot:footer>-->
<!--          <el-button @click="submitToCreate">提交到创建节点</el-button>-->
<!--        </template>-->
      </HuilanDialog>
    </div>
  </template>

<script>
import {mapGetters} from "vuex";
import {
  getPublishedVersionList,
  deletePublishedForm,
  saveOrUpdateFormData,
  runToStartUserTask,
  startProcessById
} from '@/api/system/form'
import {getPublishedList, startProcessInstanceById} from '@/api/system/flow'

import FormPreview from '@/components/formPreview'
import MessageTemplateParam from './messageTemplateParam'
export default {
  name: 'PublishedFormMgr',
  components: {
    FormPreview,
    MessageTemplateParam
  },
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return{
      form: {},
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        menuWidth: 380,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "编码",
            prop: "code",
            span: 24,
            editDisabled: true,
            rules: [{
              required: true,
              message: "请输入编码",
              trigger: "blur"
            }]
          },
          {
            label: "名称",
            prop: "name",
            span: 24,
            search: true,
            rules: [{
              required: true,
              message: "请输入表单名称",
              trigger: "blur"
            }]
          },
          {
            label: "版本",
            prop: "version"
          }
        ]
      },

      formDialogVisible: false,
      formOption: {},
      formData: {},
      flowList: [],
      formTemplateFlatJson: [],
      flow: '',
      curForm: {},
      paramDialogVisible: false,
      formFields: [],
      FormCmp: 'FormCmp',
      businessId: ''
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false
      };
    },
  },
  methods: {
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deletePublishedForm(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          this.onLoad(this.page)
          done();
        });
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const pageConf = {
        type: 'system',
        code: this.code,
        current: page.currentPage,
        size: page.pageSize
      };
      this.loading = true;
      getPublishedVersionList(Object.assign(params, this.query, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    addFormData(row) {
      this.curForm = row
      if(row.type === 'custom') {
        const url = row.url.replace('@/views', '')

          import('@/views' + url + '.vue').then(Cmp => {
            this.$options.components.FormCmp = Cmp.default
            this.formDialogVisible = true
          })
          return
      }
      if(row.formTemplateJson) {
        this.formOption = JSON.parse(row.formTemplateJson)
        // this.formTemplateFlatJson = JSON.parse(row.formTemplateFlatJson)
      }else {
        this.formOption = {}
        this.formTemplateFlatJson = []
      }
      this.formData = {}
      this.flow = ''


      this.formDialogVisible = true
    },
    // buildSubmitData() {
    //   let res = []
    //   for(let [key, val] of Object.entries(this.formData)) {
    //     if(!key.startsWith('$')) {
    //       let v = val
    //       if(Array.isArray(val)) {
    //         v = val.join()
    //       }
    //       res.push({name: key, value: v})
    //     }
    //   }
    //   return JSON.stringify(res)
    // },
    async handleFormSubmit(form,done) {
      const params = {
        formTemplateVersionId: this.curForm.id,
        formDataJson: this.$refs.form.buildSubmitData()
      }
      const {data:{data}} = await saveOrUpdateFormData(params)

      const startp = {
        processDefinitionId: this.flow,
        businessId: `${this.curForm.id};${data.id}`
      }
      if(!this.flow) {
        this.$alert('请选择流程！')
        done()
        return
      }
      await startProcessInstanceById(startp)
      done()
      this.formDialogVisible = false
    },
    async getFlow() {
      const params = {
        current: 1,
        size: 1000
      }
      const {data:{data:{records}}} = await getPublishedList(params)

      this.flowList = records
    },
    async submitToCreate() {
      const params = {
        processId: this.flow,
        formTemplateVersionId: this.curForm.id
      }
      await runToStartUserTask(params);

      this.$message({
        type: "success",
        message: "操作成功!"
      });
    },
    messageTplParams(row) {
      this.curForm = row
      this.formFields = JSON.parse(row.formTemplateFlatJson)

      this.paramDialogVisible = true
    },
    async startProcess() {
      const params= {
        processDefinitionId: this.flow,
        businessId: this.businessId,
      }
      await startProcessById(params);

      this.$message({
        type: "success",
        message: "操作成功!"
      });
    },
    startProcess2() {
      this.$refs.form.submit()
    }
  },
  mounted() {
    this.getFlow()
    // let url = '/cdn/test/TestResource.umd.min.js';
    // require([url], function (){
    //
    // })
    // this.$axios.get(url, {responseType: 'text'}).then(({data})=> {
    //   // let a = require(data)
    //   let exports = {}
    //   let require = require
    //   // console.log(a)
    //   let b = eval(data)
    //
    //   // new Function(`return ${data}`)()
    //   // this.$options.components.TestResource = TestResource
    //   // this.cmp = 'TestResource'
    //
    // })

  }
}
</script>

  <style scoped lang="scss">
  </style>
