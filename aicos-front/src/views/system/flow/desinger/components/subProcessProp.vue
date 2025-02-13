<template>
  <el-form ref="form" :model="form" size="small" :rules="rules" label-width="80px" class="flow-node-prop-form">
    <el-form-item label="节点名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="子流程" prop="subProcessName">
      <el-input v-model="form.subProcessName">
        <el-button slot="append" icon="el-icon-search" @click="showFlowList"></el-button>
      </el-input>
    </el-form-item>
    <el-form-item label="主流程可查看子流程" label-width="140px">
      <el-switch v-model="form.viewSub"/>
<!--      <p class="base-setting-tip">支持该节点进行打印</p>-->
    </el-form-item>
    <el-tabs v-if="form.subProcessFormId !== desinger.formId" v-model="activeTab">
      <el-tab-pane label="数据对应" name="first">
        <p class="base-setting-tip">子流程与主流程共用一张表单时，无需对应</p>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column prop="mainFieldName" label="主流程字段"/>
          <el-table-column
            label="子流程字段"
            width="180">
              <template slot-scope="scope">
                <el-select v-model="scope.row.subField" size="small" clearable=true>
<!--                  <el-option label="邮箱模板1" value="email1"/>-->
                  <el-option v-for="opt in getOptionList(scope.row)" :key="opt.name" :label="opt.displayName" :value="opt.name"/>
                </el-select>
              </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>
    <el-form-item class="submit-bar">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
    <el-dialog
      title="流程选择"
      v-loading="loading"
      :visible.sync="flowDialogVisible"
      append-to-body
      width="600px"
    >
      <el-table
        size="small"
        :data="flowList"
      >
        <el-table-column prop="name" label="流程名称"/>
        <el-table-column prop="version" label="版本"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="selectFlow(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px;"
        background
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="page.pageSize"
        layout="->, total, sizes, prev, pager, next, jumper"
        :total="page.total"
        :current-page="page.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

    </el-dialog>
  </el-form>
</template>

<script>
import {getPublishedList, getProcessConfigByDeploymentId} from '@/api/system/flow'
import {getBaseFormTemplateVersionById} from '@/api/system/form'
export default {
  name: 'SubProcessProp',
  inject: ['desinger'],
  data() {
    return {
      form: {
        name: '',
        subProcessName: '',
        subProcessFormId: '',
        viewSub: false
      },
      rules: {
        name: [
          {required: true, message: '请输入节点名称'}
        ],
        subProcessName: [
          {required: true, message: '请选择子流程'}
        ]
      },
      activeTab: 'first',
      loading: false,
      // tableData: [],
      flowList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      flowDialogVisible: false,
      subProcessFormFields: []
    }
  },
  computed: {
    tableData() {
      let data = []
      if(this.form.subProcessFormId !== this.desinger.formId) {
        const mainFields = this.desinger.formFields.filter(item=> !item.name.startsWith('column_'))
        data = mainFields.map(item => {
          let subField = ''
          if(this.form.FieldRelationship) {
            const res = this.form.FieldRelationship.find(field => field.mainField === item.name)
            if(res) {
              subField = res.subField
            }
          }
          return {
            mainFieldName: item.displayName,
            mainField: item.name,
            // subFieldName: '',
            subField: subField
          }
        })
      }
      return data
    }
  },
  watch: {
    'desinger.curNodeSetting': {
      handler(newVal) {
        this.form = newVal
        // this.fieldSetting = newVal.FieldRelationship
        if(newVal.subProcessFormId) {
          this.getSubProcessFormFields(newVal.subProcessFormId)
        }
      },
      immediate: true
    },
    // 'desinger.formFields': {
    //   handler(newVal) {
    //     let res = {}
    //     newVal.forEach(item => {
    //       res[item.name] = 'edit'
    //     })
    //
    //     this.fieldSetting = Object.assign(this.fieldSetting, res)
    //   },
    //   immediate: true
    // }
  },
  methods: {
    showFlowList() {
      this.flowDialogVisible = true
    },
    loadFlowData(params = {}) {
      const pageConf = {
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      this.loading = true;
      getPublishedList(Object.assign(params, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.flowList = data.records;
        this.page.total = data.total;
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.loadFlowData()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.loadFlowData()
    },
    async selectFlow(row) {
      if(this.form.subProcessId === row.id) {
        return
      }
      const {data: {data}} = await getProcessConfigByDeploymentId(row.deploymentId)

      const {data: {data: fromData}} = await getBaseFormTemplateVersionById(data.formTemplateVersionId)

      this.form.subProcessName = `${row.name}(版本：${row.version})`
      this.form.subProcessId = row.id
      this.form.subProcessKey = row.key
      this.form.subProcessFormId = data.formTemplateVersionId
      this.subProcessFormFields = JSON.parse(fromData.formTemplateFlatJson).filter(item=> !item.name.startsWith('column_'))
      this.flowDialogVisible = false
    },
    async getSubProcessFormFields(formTemplateVersionId) {
      const {data: {data: fromData}} = await getBaseFormTemplateVersionById(formTemplateVersionId)

      this.subProcessFormFields = JSON.parse(fromData.formTemplateFlatJson).filter(item=> !item.name.startsWith('column_'))
    },
    getOptionList(row) {
      const mainField = row.mainField
      const prefix = mainField.match(/[a-z]+_/)[0]
      const list = this.subProcessFormFields.filter(item => {
        const flag = item.name.startsWith(prefix)
        const used = this.tableData.some(line => {
          return item.name === line.subField && row.mainField !== line.mainField
        })
        return flag && !used
      })
      return list
    },
    onSubmit() {
      const me = this
      this.$refs.form.validate(function(valid) {
        if(valid) {
          const data = {
            ...me.form,
            FieldRelationship: me.tableData
          }
          me.$emit('close', data)
        }
      })

    },
    onCancel() {
      this.$emit('close',)
    }
  },
  mounted() {
    this.loadFlowData()
  }
}
</script>

<style lang="scss" scoped>
.flow-node-prop-form {
  padding: 0 10px 60px;
}
.base-setting-tip {
  margin: 5px 0 0;
  color: #8a979e;
  font-size: 12px;
  line-height: 16px;
}
.submit-bar {
  position: absolute;
  left: 10px;
  bottom: 0;
  margin-bottom: 0;
  padding: 10px 0;
  width: calc(100% - 20px);
  text-align: right;
  background: #fff;
  z-index: 2;
}
</style>
