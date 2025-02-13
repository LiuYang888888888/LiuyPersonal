<template>
  <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px" class="flow-node-prop-form">
    <el-form-item v-if="type !== 'noForm'" label="表单" prop="formName">
      <el-input v-model="form.formName" style="width: 300px;">
        <el-button slot="append" icon="el-icon-search" @click="showFormList"></el-button>
      </el-input>
    </el-form-item>
    <el-form-item label="重新提交">
<!--      <el-switch v-model="form.reSubmitable"/>-->
      <el-select v-model="form.reSubmitType">
        <el-option label="按流程顺序审批" value="restart"/>
        <el-option label="直达当前节点" value="direct"/>
      </el-select>
      <p class="setting-form-tip">被退回重新提交后处理方式</p>
    </el-form-item>
    <el-form-item label="取消挂起">
      <el-switch v-model="form.ifSyncCancelIce"/>
    </el-form-item>
    <el-form-item label="流程期限">
      <el-switch v-model="form.ifOvertime"/>
    </el-form-item>
    <el-form-item v-if="form.ifOvertime" label="" prop="overtime.number">
      <el-input placeholder="请输入内容" v-model="form.overtime.number" size="small" style="width: 200px;">
        <template slot="append">
          <el-select v-model="form.overtime.unit" size="small" style="width: 80px">
            <el-option label="天" value="day"/>
            <el-option label="时" value="hour"/>
<!--            <el-option label="分" value="min"/>-->
          </el-select>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="超期提醒">
      <el-switch v-model="form.overtimeNoticeLoopConfig.ifNotice"/>
    </el-form-item>
    <template v-if="form.overtimeNoticeLoopConfig.ifNotice">
      <el-form-item label=""  prop="overtimeNoticeLoopConfig.number">
        <el-input placeholder="请输入内容" v-model="form.overtimeNoticeLoopConfig.number" size="small" style="width: 200px;">
          <template slot="append">
            <el-select v-model="form.overtimeNoticeLoopConfig.unit" size="small" style="width: 80px">
              <el-option label="天" value="day"/>
              <el-option label="时" value="hour"/>
<!--              <el-option label="分" value="min"/>-->
            </el-select>
          </template>
        </el-input>
        <p class="setting-form-tip">超时指定时间后提醒(督办人、当前处理人),如果勾选’超期后重复提醒‘,则每隔指定的时间提醒</p>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="form.overtimeNoticeLoopConfig.ifLoop">超期后重复提醒</el-checkbox>
      </el-form-item>
      <el-form-item v-if="this.type !== 'noForm'" label="提醒方式">
        <MessageList
          style="margin-bottom: 18px;"
          :messageTypeList="messageTypeList"
          :selectedList="form.overtimeNoticeConfig"
          :curSelectedList.sync="form.curSelectedList"
        />
        <!--        :curSelectedList.sync="curSelectedList"-->
      </el-form-item>
    </template>
    <el-form-item label="督办">
      <el-switch v-model="form.ifSupervise"/>
      <!-- <SelectUser
        v-if="form.ifSupervise"
        v-model="form.superviseAuth"
        :disabledTabs="['fourth']"
      /> -->



    </el-form-item>
    <template v-if="form.ifSupervise">
      <el-form-item label="">
        <OptOrgDialog
          v-model="form.superviseAuth"
          :tabs="['user','dept','role']"
          title="设置督办"
        >
        </OptOrgDialog>
      </el-form-item>
      <el-form-item v-if="this.type !== 'noForm'" label="提醒方式">
        <MessageList
          style="margin-bottom: 18px;"
          :messageTypeList="superviseMessageTypeList"
          :selectedList="form.superviseNoticeConfig"
          :curSelectedList.sync="form.superviseCurSelectedList"
        />
        <!--        :curSelectedList.sync="curSelectedList"-->
      </el-form-item>

    </template>
    <el-form-item v-if="type !== 'noForm'" label="管理员">
      <!-- <SelectUser v-model="form.adminAuth"/> -->

      <OptOrgDialog
        v-model="form.adminAuth"
        title="设置管理员"
      >
      </OptOrgDialog>

    </el-form-item>

<!--    <el-form-item label="撤回负责人">-->
<!--      <el-switch v-model="form.withdrawable"/>-->
<!--    </el-form-item>-->
<!--    <el-form-item v-if="form.withdrawable">-->
<!--      <el-radio-group v-model="form.withdrawType">-->
<!--        <el-radio label="previous">上一节点负责人</el-radio>-->
<!--        <el-radio label="customize">自定义</el-radio>-->
<!--      </el-radio-group>-->
<!--      <SelectUser v-if="form.withdrawType === 'customize'" v-model="form.users"/>-->
<!--    </el-form-item>-->
    <el-dialog
      v-if="this.type !== 'noForm'"
      title="表单选择"
      v-loading="loading"
      :visible.sync="formDialogVisible"
      append-to-body
      width="800px"
    >
      <el-table
        size="small"
        :data="formList"
      >
        <el-table-column prop="name" label="表单名称"/>
        <el-table-column prop="version" label="版本"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="selectForm(scope.row)" type="text" size="small">选择</el-button>
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
// import SelectUser from './common/selectUser'
import MessageList from './common/messageList'
import {getCanUseFormTemplateVersion} from '@/api/system/form'
// import {getDictionary} from '@/api/system/dict'
import {/*getRules,*/ createNumber} from '@/util/regx'
import {getProductCode} from '@/api/system/flow';

import OptOrgDialog from "@/views/optOrg/OptOrgDialog";

export default {
  name: 'ProcessProp',
  components: {
    // SelectUser,
    MessageList,
    OptOrgDialog
  },
  props: {
    form: Object,
    type: {
      type: String,
      // noForm、normal、simple
      default: 'normal'
    }
  },
  data() {
    // function validNumber(rule, value, callback) {
    //   const reg = /^([0-9]+)$/
    //   if(value.length !=0) {
    //     if(reg.test(value)) {
    //       const temp = Number.parseInt(value)
    //       if(temp > 0 && temp < 300) {
    //         callback()
    //       }else {
    //         callback(new Error('数字范围为0-300'))
    //       }
    //     }else {
    //       callback(new Error('只能输入数字，范围0-300'))
    //     }
    //   }else {
    //     callback()
    //   }
    // }
    return {
      // form: {
      //   formName: '',
      //   formId: '',
      //   reSubmitable: false,
      //   reSubmitType: 'restart',
      //   withdrawable: false,
      //   withdrawType: 'previous',
      //   users: {
      //     list: [
      //       {
      //         id: "2bf1132d0909171d48deb1dfc075f0f8",
      //         name: "总部领导",
      //         type: "user"
      //       },
      //       {
      //         id: "eda658c0ba306f9c8665508cd239731a",
      //         name: "产品一部",
      //         type: "dept"
      //       }
      //     ],
      //     includeChildren: false,
      //     applicantLeader: false,
      //     submitterLeader: false
      //   }
      // },
      rules: {
        formName: [
          {required: true, message: '请选择表单'}
        ],
        'overtime.number': [
          createNumber(0, 300)
        ],
        'overtimeNoticeLoopConfig.number': [
          createNumber(0, 300)
        ]
      },
      messageTypeList: [
        {
          name: '超时提醒',
          type: 'overtime',
          disabled: true,
          message: '',
          email: '',
          internal: '',
          qyWeixin: '',
          smart: '',
          custom: ''
        }
      ],
      // curSelectedList:[],
      formDialogVisible: false,
      formList: [],
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      systemCode: '',
      superviseMessageTypeList: [
        {
          name: '督办提醒',
          type: 'supervise',
          disabled: true,
          message: '',
          email: '',
          internal: '',
          qyWeixin: '',
          smart: '',
          custom: ''
        }
      ]
    }
  },
  methods: {
    // async getMessageList() {
    //   const {data:{data}} = await getDictionary({code: 'userTaskMessageType'})
    //
    //   const tableData = data.map(item => {
    //     return {
    //       name: item.name,
    //       type: item.value,
    //       message: '',
    //       email: '',
    //       internal: '',
    //       smart: ''
    //     }
    //   })
    //   this.messageTypeList = tableData
    // },
    showFormList() {
      this.formDialogVisible = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.loadFormData()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.loadFormData()
    },
    selectForm(row) {
      this.form.formName = `${row.name}(版本：${row.version})`
      this.form.formId = row.id
      this.form.formTemplateJson = {...JSON.parse(row.formTemplateJson),disabled: true, menuBtn: false}
      this.form.formFieldList = JSON.parse(row.formTemplateFlatJson)
      this.formDialogVisible = false
    },
    loadFormData(params = {}) {
      const pageConf = {
        type: 'system',
        systemCode: this.systemCode,
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      this.loading = true;
      getCanUseFormTemplateVersion(Object.assign(params, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.formList = data.records;
        this.page.total = data.total;
      });
    },
    validate(callback) {
      return this.$refs.form.validate(callback)
    },
    async getSystemCode() {
      const {data:{data}} = await getProductCode();
      this.systemCode = data
    }
  },
  async mounted() {
    if(this.type !== 'noForm') {
      await this.getSystemCode();
      this.loadFormData()
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-form-tip {
  margin: 5px 0 10px;
  color: #8a979e;
  font-size: 12px;
  line-height: 16px;
}
</style>
