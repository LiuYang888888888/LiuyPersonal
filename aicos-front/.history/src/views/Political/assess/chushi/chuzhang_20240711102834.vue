<template>
  <basic-container>
    <el-tabs v-if="formVerify && !role" v-model="tabType" @tab-click="tabChange">
      <el-tab-pane name="ALL" v-if=" role2 == 2 ">
        <span slot="label"><i class="el-icon-s-order"></i> 我的</span>
      </el-tab-pane>
      <el-tab-pane name="TODO" v-if="permissionList.toDoBtn">
        <span slot="label"><i class="el-icon-s-management"></i> 待审核</span>
      </el-tab-pane>
      <el-tab-pane name="DONE" v-if="permissionList.doneBtn">
        <span slot="label"><i class="el-icon-s-claim"></i> 已审核</span>
      </el-tab-pane>
    </el-tabs>

    <HuilanBasicToolbar style="margin-top: 0;text-align: left;" v-if="role2 > 0 && tabType == 'ALL'">
      <el-button type="primary" size="small" v-if="permissionList.addMagBtn" @click="handleAdd">新增</el-button>
    </HuilanBasicToolbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad" @refresh-change="refreshChange">
      <template slot="menuLeft">
       
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" @click="handleView(scope.row, scope.index)" v-if="tabType != 'TODO' && permissionList.viewMagBtn">查看
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.shiftj == '草稿' || scope.row.shiftj == '审核不通过') && (role2 == scope.row.rylx) && permissionList.editMagBtn"
          @click="handleUpdate(scope.row, scope.index)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="role2 == scope.row.rylx && permissionList.lcMagBtn"
          @click="handlezt(scope.row, scope.index)">流程
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.kqtjBtn && (role2 == scope.row.rylx) && (scope.row.shiftj == '草稿' || scope.row.shiftj == '审核不通过')" @click="comFormMagkqtj(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.shiftj == '草稿' || scope.row.shiftj == '审核不通过') && (role2 == scope.row.rylx) && permissionList.delMagBtn" @click="handelDel(scope.row)">删除
        </el-button>
        <el-button type="text" size="small" v-if="formVerify && tabType == 'TODO' && permissionList.shMagBtn"
          @click="comFormMagVerify(scope.row)">审核
        </el-button>
      </template>
    </avue-crud>

    <!--审核弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="true" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
      <el-tabs v-if="formVerify && (tabType == 'TODO' || tabType == 'DONE')" v-model="verifyTab"
        @tab-click="verifyChange">
        <el-tab-pane name="VIEW">
          <span slot="label"><i class="el-icon-s-operation"></i> 数据详情</span>
        </el-tab-pane>
        <el-tab-pane name="HISTORY" lazy>
          <span slot="label"><i class="el-icon-s-unfold"></i> 流转历史</span>
          <CirculationHistory v-if="verifyTab === 'HISTORY'" :processInstanceId="verifyParamData.processInstanceId" />
        </el-tab-pane>
        <el-tab-pane name="DIAGRAM" lazy>
          <span slot="label"><i class="el-icon-picture-outline"></i> 流程图</span>
          <DiagramView v-if="verifyTab === 'DIAGRAM'" :cur="verifyParamData" class="flow-view" />
        </el-tab-pane>
      </el-tabs>

      <div class="dataMagFormBody" v-if="verifyTab == 'VIEW'">
        <div class="CMF_MAIN">
          <div class="CMF_HEAD">
            <span>{{ formName }}</span>
          </div>
          <div class="CMF_BODY">
            <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form5" :option="option5" v-if="showform">
            </avue-form>
            <!-- <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form2" :option="option5" v-if="tabType == 'TODO' && rolefinal == 0">
            </avue-form> -->
            <!-- <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form3" :option="option5" v-if="tabType == 'TODO' && rolefinal == 3">
            </avue-form>
            <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form4" :option="option4" v-if="tabType == 'DONE'">
            </avue-form> -->
          </div>
        </div>
        <div class="dataMagFormFooter">
          <div v-if="formVerify && !role && tabType == 'TODO'" class="formVerifyClass">
            <el-input type="textarea" v-model="formVerifyText" placeholder="请输入审核意见" rows="4" />
          </div>
          <div class="dataMagFormBtns">
            <el-button size="small" icon="el-icon-check" v-if="formVerify && !role && tabType == 'TODO'" type="success" @click.stop="dataMagVerifyYes" :loading="btnLoading">审核通过
            </el-button>
            <el-button size="small" icon="el-icon-close"
              v-if="formVerify && !role && tabType == 'TODO'" type="warning"
              @click.stop="dataMagVerifyNo" :loading="btnLoading">审核不通过
            </el-button>
            <!-- <el-button
              size="small"
              icon="el-icon-circle-plus-outline"
              v-if="dataMagFormSubBtnTag &&(!formVerify || (formVerify && dataMagFormSubBtnTag))"
              type="primary"
              @click="dataMagFormSave"
              :loading="btnLoading"
              >确 定
            </el-button> -->
            <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
          </div>
        </div>
      </div>
    </HuilanDialog>

    <!--流程列表弹窗-->
    <HuilanDialog :title="dataMagFormTitlelc" :fullscreen="true" append-to-body :before-close="dataMagFormCloselc"
      :visible.sync="dataMagFormTaglc" class="dataMagFormClass">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="current_node"
          label="节点名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="comment_"
          label="处理意见"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="handler_user_id"
          label="处理人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="update_time"
          align="center"
          label="处理时间">
        </el-table-column>
      </el-table>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
//import { validatenull } from "@/util/validate";
import { 
  czgetList, 
  saveOrUpdateListData, 
  viewListData, 
  czremove, 
  cztijiao, 
  role ,
  getprocessId,
  czflowNo,
  czflowYes,
  userInfo,
  getDepartment,
  //getInfo
} from "@/api/Political/common";
import {
  getFromTemplateNewest,
  getToDoListData,
  getFinishListData,
  //getFromTemplate,
} from "@/api/system/commonFormData";
import FormPreview from "@/components/formPreview";
//import {isNull } from "@/util/qsgCommon";
import DiagramView from "../../../system/commonForm/diagramView.vue";
import CirculationHistory from "../../../system/commonForm/circulationHistory";
export default {
  components: {
    DiagramView,
    CirculationHistory,
    FormPreview
  },
  data () {
    return {
      showform:false,
      role2:0,
      rolefinal:0,
      dataMagFormOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [],
      },
      dataMagFormClass:'',
      dataMagFormFlatJson: [],
      formTemplateOnetomanyFlatJson: {},
      dataFormData: {},
      formDataColumn: [],
      dataMagFormKey:0,
      dataInitId: null,
      dataInitTemplateId: "",
      dataMagFormSubBtnTag:false,
      dataMagFormSubType: "add",
      
      formDataId:'',//审核点击时当前表单id

      dataMagFormTitlelc:'流转历史',
      dataMagFormTaglc:false,
      tableData:[],
      btnLoading:false,
      rolename: '',
      dataMagFormTitle: '审核',
      dataMagFormTag: false,
      formVerify: false,
      tabType: "ALL",
      metObjName: "dyf_aicos_chusrykhgl_957",
      systemCode: 'AiCOS',
      formVerifyText: '',
      pingjianval: '',
      pingjianqianming: '',
      pingjiandate: '',
      zhengzhival: '',
      zhengzhidate: '',
      form: {},
      form2: {},
      form3: {},
      form4: {},
      form5:{},
      verifyParamData: {},
      verifyTab: "VIEW",
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      templateId: '',
      selectionList: [],
      option: {
        submitBtn: false,
        emptyBtn: false,
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: false,
        labelPosition: 'top',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            label: "填报年月",
            prop: "tianbny1",
            display: false,
          },
          {
            label: "用户",
            prop: "xingm",
            display: false,
          },
          {
            label: "所属部门",
            prop: "suosbm",
            display: false,
          },
          {
            label: "流程状态",
            prop: "shiftj",
            display: false,
          },
          {
            label: "填写时间",
            prop: "create_time",
            display: false,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center;font-size:18px;font-weight:600;\">\n公务员平时考核登记表\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: 'field1716362285283',
            hide: true,
          },
          {
            type: 'title',
            span: 8,
            display: true,
            styles: {
              fontSize: '18px',
              color: '#000'
            },
            labelWidth: '0px',
            value: '',
            dataType: 'string',
            prop: 'string_tianxsj',
            hide: true,
          },
          {
            type: 'month',
            label: '',
            span: 8,
            display: true,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'tianbny1',
            isListDisplay: true,
            search: false,
            tip: '请选择日期',
            tipPlacement: 'top',
            placeholder: '请选择日期',
            hide: true,
            required: true,
            rules: [
              {
                required: true,
                message: '必须选择日期',
              }
            ]
          },
          {
            type: 'table',
            component: 'TableLayout',
            span: 24,
            labelWidth: 0,
            width: '100%',
            borderWidth: 1,
            borderColor: '#000000',
            data: [
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n姓名\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362745227'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingm',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写',
                        }
                      ],
                      maxlength: 100,
                      readonly:true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n性别\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362803813'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      dicQuery: {
                        code: 'sex'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingb',
                      readonly:true,
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择',
                        }
                      ],
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出生年月\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362866970'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: false,
                      dataType: 'datetime',
                      prop: 'chusny',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择',
                        }
                      ],
                      readonly:true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n处室及职务\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365355111'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 5,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'suosbm',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写',
                        }
                      ],
                      readonly:true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365479956'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n评价要素\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365501293'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核结果\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365512549'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治品质\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365539711'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n讲政治，具有较强的政治意识、大局意识、核心意识、看齐意识，认真贯彻执行党的路线、方针、政策。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365559222'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      labelWidth: '0px',
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      dicQuery: {
                        code: 'khjieguo'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhengzpz'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n职业道德\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365704552'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n忠于职守，服从命令，精通业务，勤勉敬业，遵守公务员职业道德，依法执行公务。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365719481'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      labelWidth: '0px',
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      dicQuery: {
                        code: 'khjieguo'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhiydd'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作作风\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365791608'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n热爱本职工作，敢于担当，积极主动，尽职尽责，求真务实，深入基层，服务企业。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365805909'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      labelWidth: '0px',
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      dicQuery: {
                        code: 'khjieguo'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'gongzzf'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n廉洁自律\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365851082'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n严格遵守《廉政准则》、中央八项规定、省委省政府20条意见，无不正之风或违纪违规现象。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365864900'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      labelWidth: '0px',
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      dicQuery: {
                        code: 'khjieguo'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'lianjzl',
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n个性指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365900292'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作数量、质量、效率以及所产生的效益和业务能力等。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365913850'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      labelWidth: '0px',
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      dicQuery: {
                        code: 'khjieguo'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'gexzb',
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤情况\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366131613'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366148982'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n事假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366159504'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n病假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366166451'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n旷工（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366174120'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'chuq',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'shij',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'bingj',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'kuangg',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n主管领导评鉴\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366436308'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhugldpj',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签名）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366619695'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'qianm',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366773994'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'pingjrq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治部审定\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366830995'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 16,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhengzbsd',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签章）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366838769'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366852835'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 16,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'zhengzbsdrq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ]
            ],
            display: true,
            dataType: 'string',
            prop: 'field1716362710428',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n2.主管领导意见填写评语和考核等次建议。\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          }
        ],
      },
      option2: {
        submitBtn: false,
        emptyBtn: false,
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: false,
        labelPosition: 'top',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            label: "填报年月",
            prop: "tianbny1",
            display: false,
            disabled: true,
          },
          {
            label: "用户",
            prop: "xingm",
            display: false,
            disabled: true,
          },
          {
            label: "所属部门",
            prop: "suosbm",
            display: false,
            disabled: true,
          },
          {
            label: "流程状态",
            prop: "shiftj",
            display: false,
            disabled: true,
          },
          {
            label: "填写时间",
            prop: "create_time",
            display: false,
            disabled: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center;font-size:18px;font-weight:600;\">\n公务员平时考核登记表\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: 'field1716362285283',
            hide: true,
          },
          {
            type: 'title',
            span: 8,
            display: true,
            styles: {
              fontSize: '18px',
              color: '#000'
            },
            labelWidth: '0px',
            value: '',
            dataType: 'string',
            prop: 'string_tianxsj',
            hide: true,
            disabled: true,
          },
          {
            type: 'month',
            label: '',
            span: 8,
            display: true,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'tianbny1',
            isListDisplay: true,
            search: false,
            tip: '请选择日期',
            tipPlacement: 'top',
            placeholder: '请选择日期',
            hide: true,
            disabled: true,
          },
          {
            type: 'table',
            component: 'TableLayout',
            span: 24,
            labelWidth: 0,
            width: '100%',
            borderWidth: 1,
            borderColor: '#000000',
            data: [
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n姓名\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362745227'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingm',
                      maxlength: 100,
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n性别\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362803813'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '男',
                          value: '0'
                        },
                        {
                          label: '女',
                          value: '1'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingb',
                      disabled: true,
                      value: '男',
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出生年月\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362866970'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: false,
                      dataType: 'datetime',
                      prop: 'chusny',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n处室及职务\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365355111'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 5,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'suosbm',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365479956'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n评价要素\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365501293'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核结果\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365512549'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治品质\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365539711'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n讲政治，具有较强的政治意识、大局意识、核心意识、看齐意识，认真贯彻执行党的路线、方针、政策。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365559222'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhengzpz',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n职业道德\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365704552'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n忠于职守，服从命令，精通业务，勤勉敬业，遵守公务员职业道德，依法执行公务。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365719481'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhiydd',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作作风\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365791608'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n热爱本职工作，敢于担当，积极主动，尽职尽责，求真务实，深入基层，服务企业。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365805909'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'gongzzf',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n廉洁自律\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365851082'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n严格遵守《廉政准则》、中央八项规定、省委省政府20条意见，无不正之风或违纪违规现象。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365864900'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'lianjzl',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n个性指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365900292'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作数量、质量、效率以及所产生的效益和业务能力等。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365913850'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'gexzb',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤情况\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366131613'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366148982'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n事假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366159504'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n病假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366166451'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n旷工（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366174120'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'chuq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'shij',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'bingj',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'kuangg',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n主管领导评鉴\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366436308'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'name',
                        value: 'value'
                      },
                      dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
                      dicMethod: 'post',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      dicQuery: {
                        code: 'khjieguo'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhugldpj',
                      labelWidth: '0px',
                      disabled:false,
                      change: ({ value }) => {
                        this.pingjianval = value
                      },
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签名）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366619695'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'qianm',
                      disabled:false,
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ],
                      change: ({ value }) => {
                        this.pingjianqianming = value
                      },
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366773994'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'pingjrq',
                      disabled:false,
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须选择'
                        }
                      ],
                      change: ({ value }) => {
                        this.pingjiandate = value
                      },
                    }
                  ]
                }
              ],
              [],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治部审定\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366830995'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 16,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhengzbsd',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签章）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366838769'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366852835'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 16,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'zhengzbsdrq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ]
            ],
            display: true,
            dataType: 'string',
            prop: 'field1716362710428',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n2.主管领导意见填写评语和考核等次建议。\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          }
        ],
      },
      option3: {
        submitBtn: false,
        emptyBtn: false,
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: true,
        labelPosition: 'top',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            label: "填报年月",
            prop: "tianbny1",
            display: false,
            disabled: true,
          },
          {
            label: "用户",
            prop: "xingm",
            display: false,
            disabled: true,
          },
          {
            label: "所属部门",
            prop: "suosbm",
            display: false,
            disabled: true,
          },
          {
            label: "流程状态",
            prop: "shiftj",
            display: false,
            disabled: true,
          },
          {
            label: "填写时间",
            prop: "create_time",
            display: false,
            disabled: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center;font-size:18px;font-weight:600;\">\n公务员平时考核登记表\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: 'field1716362285283',
            hide: true,
          },
          {
            type: 'title',
            span: 8,
            display: true,
            styles: {
              fontSize: '18px',
              color: '#000'
            },
            labelWidth: '0px',
            value: '',
            dataType: 'string',
            prop: 'string_tianxsj',
            hide: true,
            disabled: true,
          },
          {
            type: 'month',
            label: '',
            span: 8,
            display: true,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'tianbny1',
            isListDisplay: true,
            search: false,
            tip: '请选择日期',
            tipPlacement: 'top',
            placeholder: '请选择日期',
            hide: true,
            disabled: true,
          },
          {
            type: 'table',
            component: 'TableLayout',
            span: 24,
            labelWidth: 0,
            width: '100%',
            borderWidth: 1,
            borderColor: '#000000',
            data: [
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n姓名\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362745227'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingm',
                      maxlength: 100,
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n性别\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362803813'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '男',
                          value: '0'
                        },
                        {
                          label: '女',
                          value: '1'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingb',
                      disabled: true,
                      value: '男',
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出生年月\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362866970'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: false,
                      dataType: 'datetime',
                      prop: 'chusny',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n处室及职务\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365355111'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 5,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'suosbm',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365479956'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n评价要素\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365501293'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核结果\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365512549'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治品质\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365539711'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n讲政治，具有较强的政治意识、大局意识、核心意识、看齐意识，认真贯彻执行党的路线、方针、政策。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365559222'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhengzpz',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n职业道德\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365704552'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n忠于职守，服从命令，精通业务，勤勉敬业，遵守公务员职业道德，依法执行公务。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365719481'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhiydd',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作作风\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365791608'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n热爱本职工作，敢于担当，积极主动，尽职尽责，求真务实，深入基层，服务企业。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365805909'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'gongzzf',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n廉洁自律\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365851082'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n严格遵守《廉政准则》、中央八项规定、省委省政府20条意见，无不正之风或违纪违规现象。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365864900'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'lianjzl',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n个性指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365900292'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作数量、质量、效率以及所产生的效益和业务能力等。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365913850'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'gexzb',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤情况\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366131613'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366148982'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n事假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366159504'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n病假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366166451'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n旷工（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366174120'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'chuq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'shij',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'bingj',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'kuangg',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n主管领导评鉴\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366436308'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhugldpj',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签名）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366619695'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'qianm',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366773994'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'pingjrq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治部审定\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366830995'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 16,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhengzbsd',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ],
                      change: ({ value }) => {
                        this.zhengzhival = value
                      },
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签章）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366838769'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366852835'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 16,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'zhengzbsdrq',
                      labelWidth: '0px',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ],
                      change: ({ value }) => {
                        this.zhengzhidate = value
                      },
                    }
                  ]
                }
              ]
            ],
            display: true,
            dataType: 'string',
            prop: 'field1716362710428',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n2.主管领导意见填写评语和考核等次建议。\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          }
        ],
      },
      option4: {
        submitBtn: false,
        emptyBtn: false,
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: true,
        labelPosition: 'top',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            label: "填报年月",
            prop: "tianbny1",
            display: false,
            disabled: true,
          },
          {
            label: "用户",
            prop: "xingm",
            display: false,
            disabled: true,
          },
          {
            label: "所属部门",
            prop: "suosbm",
            display: false,
            disabled: true,
          },
          {
            label: "流程状态",
            prop: "shiftj",
            display: false,
            disabled: true,
          },
          {
            label: "填写时间",
            prop: "create_time",
            display: false,
            disabled: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center;font-size:18px;font-weight:600;\">\n公务员平时考核登记表\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: 'field1716362285283',
            hide: true,
          },
          {
            type: 'title',
            span: 8,
            display: true,
            styles: {
              fontSize: '18px',
              color: '#000'
            },
            labelWidth: '0px',
            value: '',
            dataType: 'string',
            prop: 'string_tianxsj',
            hide: true,
            disabled: true,
          },
          {
            type: 'month',
            label: '',
            span: 8,
            display: true,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'tianbny1',
            isListDisplay: true,
            search: false,
            tip: '请选择日期',
            tipPlacement: 'top',
            placeholder: '请选择日期',
            hide: true,
            disabled: true,
          },
          {
            type: 'table',
            component: 'TableLayout',
            span: 24,
            labelWidth: 0,
            width: '100%',
            borderWidth: 1,
            borderColor: '#000000',
            data: [
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n姓名\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362745227'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingm',
                      maxlength: 100,
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n性别\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362803813'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '男',
                          value: '0'
                        },
                        {
                          label: '女',
                          value: '1'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingb',
                      disabled: true,
                      value: '男',
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出生年月\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716362866970'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: false,
                      dataType: 'datetime',
                      prop: 'chusny',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n处室及职务\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365355111'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 5,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'suosbm',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365479956'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n评价要素\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365501293'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n考核结果\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365512549'
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治品质\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365539711'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n讲政治，具有较强的政治意识、大局意识、核心意识、看齐意识，认真贯彻执行党的路线、方针、政策。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365559222'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhengzpz',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n职业道德\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365704552'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n忠于职守，服从命令，精通业务，勤勉敬业，遵守公务员职业道德，依法执行公务。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365719481'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'zhiydd',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作作风\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365791608'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n热爱本职工作，敢于担当，积极主动，尽职尽责，求真务实，深入基层，服务企业。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365805909'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'gongzzf',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n廉洁自律\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365851082'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n严格遵守《廉政准则》、中央八项规定、省委省政府20条意见，无不正之风或违纪违规现象。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365864900'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'lianjzl',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n个性指标\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365900292'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 4,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n工作数量、质量、效率以及所产生的效益和业务能力等。\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365913850'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      dicData: [
                        {
                          label: '好',
                          value: '0'
                        },
                        {
                          label: '较好',
                          value: '1'
                        },
                        {
                          label: '一般',
                          value: '2'
                        },
                        {
                          label: '较差',
                          value: '3'
                        }
                      ],
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'gexzb',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤情况\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366131613'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n出勤（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366148982'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n事假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366159504'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n病假（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366166451'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n旷工（天）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366174120'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'chuq',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'shij',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'bingj',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'kuangg',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                }
              ],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n主管领导评鉴\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366436308'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'select',
                      label: '',
                      cascaderItem: [],
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhugldpj',
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签名）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366619695'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'qianm',
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ],
                      labelWidth: '0px',
                      disabled: true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366773994'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 2,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 24,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'pingjrq',
                      labelWidth: '0px',
                      disabled: true,
                      required: true,
                      rules: [
                        {
                          required: true,
                          message: '必须填写'
                        }
                      ],
                    }
                  ]
                }
              ],
              [],
              [
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治部审定\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366830995'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'input',
                      label: '',
                      span: 16,
                      display: true,
                      hideLabel: true,
                      dataType: 'string',
                      prop: 'zhengzbsd',
                      labelWidth: '0px',
                      disabled:true,
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n（签章）\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366838769'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: []
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n日期：\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716366852835'
                    }
                  ]
                },
                {
                  type: 'tableCell',
                  colspan: 1,
                  rowspan: 1,
                  width: '',
                  height: '',
                  children: [
                    {
                      type: 'date',
                      label: '',
                      span: 16,
                      display: true,
                      format: 'yyyy-MM-dd',
                      valueFormat: 'yyyy-MM-dd',
                      hideLabel: true,
                      dataType: 'datetime',
                      prop: 'zhengzbsdrq',
                      labelWidth: '0px',
                      disabled:true,
                    }
                  ]
                }
              ]
            ],
            display: true,
            dataType: 'string',
            prop: 'field1716362710428',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n2.主管领导意见填写评语和考核等次建议。\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: '',
            hide: true,
          }
        ],
      },
      option5:{},
      data: []
    };
  },
  async mounted () {
    await this.getActiveForm();
    await this.roleInfo()
  },
  watch: {
    $route: "getActiveForm",
    "desktopWindow.data": {
      handler (/*newVal*/) {
        this.getActiveForm();
      },
      deep: true,
    },
    magParamsData: {
      handler (/*newVal*/) {
        //console.log(newVal)
        this.getActiveForm();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    permissionList () {
      return {
        toDoBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-toDo`],
          false
        ),
        doneBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-done`],
          false
        ),
        addMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-add`],
          false
        ),
        delMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-del`],
          false
        ),
        editMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-edit`],
          false
        ),
        viewMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-view`],
          false
        ),
        kqtjBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-kqtjcs`],
          false
        ),
        ldpjBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-ldpj`],
          false
        ),
        lcMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-lc`],
          false
        ),
        shMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-cs-sh`],
          false
        ),
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    //流程列表
    handlezt(row){
      this.dataMagFormTaglc = true
      getprocessId({id:row.id}).then((res) => {
        this.tableData = res.data.data
      })
    },
    dataMagFormCloselc(){
      this.tableData = []
      this.dataMagFormTaglc = false
    },
    //审核弹窗
    async comFormMagVerify (row) {
      this.btnLoading = false;
      this.showform = true
      this.formVerifyText = "";
      this.verifyTab = "VIEW";
      this.verifyParamData = {
        taskId: row.aicos_task_id,
        processInstanceId: row.aicos_process_instance_id,
        processDefinitionId: row.aicos_process_definition_id,
        taskDefinitionKey: row.aicos_task_definition_key,
      };
     
      this.dataInitTemplateId = row.template_version_id;
      this.dataInitId = row.id;
      this.dataMagFormSubBtnTag = false;
      if(this.rolefinal == 3){
        this.option5 = {}
        this.option5 = this.option3
        this.form5 = await this.formData(row);
      }else{
        this.option5 = {}
        this.option5 = this.option2
        this.form5 = await this.formData(row);
      }
      this.dataMagFormTag = true;
    },

    async formData(row){
      this.form2 = {}
      this.form3 = {}
      this.form4 = {}
      this.form5 = {}
      const params = new URLSearchParams();
      params.append("id",row.id);
      const dataResFun = await viewListData(params);
      const dataRes = dataResFun.data.data;
      return dataRes
    },
    //审核通过
    async dataMagVerifyYes () {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          this.btnLoading = true;
          if(this.rolefinal == 3){
            this.form5.zhengzbsd = this.zhengzhival
            this.form5.zhengzbsdrq = this.zhengzhidate
            saveOrUpdateListData(this.form5).then(
              (/*res*/) => {
                const dataParam2 = {
                  ...this.verifyParamData,
                  passStatus: "agree",
                  comment: this.formVerifyText,
                  formDataId:this.dataInitId
                };
                czflowYes(dataParam2).then(
                  (/*res*/) => {
                    this.btnLoading = false;
                    this.refreshChange();
                    this.dataMagFormClose();
                    this.showform = false
                    this.$message({
                      type: "success",
                      message: "操作成功!",
                    });
                  },
                  (error) => {
                    window.console.log(error);
                  }
                );
              },
              (error) => {
                window.console.log(error);
              }
            );
          }else{
            this.form5.zhugldpj = this.pingjianval
            this.form5.qianm = this.pingjianqianming
            this.form5.pingjrq = this.pingjiandate
            saveOrUpdateListData(this.form5).then(
              (/*res*/) => {
                const dataParam2 = {
                  ...this.verifyParamData,
                  passStatus: "agree",
                  comment: this.formVerifyText,
                  formDataId:this.dataInitId
                };
                czflowYes(dataParam2).then(
                  (/*res*/) => {
                    this.btnLoading = false;
                    this.refreshChange();
                    this.dataMagFormClose();
                    this.showform = false
                    this.$message({
                      type: "success",
                      message: "操作成功!",
                    });
                  },
                  (error) => {
                    window.console.log(error);
                  }
                );
              },
              (error) => {
                window.console.log(error);
              }
            );
          }
        } else {
          this.btnLoading = false;
        }
      });
    },
    //审核不通过
    async dataMagVerifyNo () {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          this.btnLoading = true;
          const dataParam = {
            ...this.verifyParamData,
            passStatus: "closeForDisagree",
            comment: this.formVerifyText,
            formDataId:this.dataInitId,
          };
          czflowNo(dataParam).then(
            (/*res*/) => {
              this.btnLoading = false;
              this.refreshChange();
              this.dataMagFormClose();
              this.showform = false
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            },
            (error) => {
              window.console.log(error);
            }
          );
        } else {
          this.btnLoading = false;
        }
      });
    },
    dataMagFormClose () {
      this.form2 = {}
      this.form3 = {}
      this.form4 = {}
      this.form5 = {}
      this.formVerifyText = ''
      this.cmfCustData = "";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = "";
      this.dataInitId = null;
      this.dataMagFormTag = false;
    },
    async getActiveForm () {
      this.formVerifyText = "";
      this.verifyTab = "VIEW";
      await this.getTemplateNewestVersion(this.metObjName);
    },
    async roleInfo () {
      const dataResFun = await role();
      const rolename = dataResFun.data.data[0].roleName
      this.rolename = rolename
      if (rolename.includes("分管领导") || rolename.includes("政治部") || rolename.includes("处长")) {
        this.role = false
      } else {
        this.role = true
      }
      if (!rolename.includes("处长") && !rolename.includes("政治部") && !rolename.includes("分管领导")) {
        this.role2 = 1
      }
      if (rolename.includes("处长")) {
        this.role2 = 2
        this.tabType = 'ALL'
      }

      if (rolename.includes("政治部")) {
        this.rolefinal = 3
      }

      if (rolename.includes("政治部") || rolename.includes("分管领导")) {
        this.tabType = 'TODO'
        this.onLoad(this.page);
      }
    },
    async getTemplateNewestVersion (thisObjName) {
      const dataResFun = await getFromTemplateNewest({
        metaObjName: thisObjName,
      });
      const dataRes = dataResFun.data.data;
      this.templateId = dataRes.id
      this.formVerify = dataRes.isAudit == 1 ? true : false;
    },

    comFormMagkqtj (row) {
      this.$confirm("确认提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return cztijiao({formDataId:row.id})
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
        })
    },
    
    rowUpdate (row, index, done, loading) {
      saveOrUpdateListData(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    async handleView (row, index) {
      if(this.tabType == 'ALL'){
        this.$refs.crud.rowView(row, index);
      }else{
        this.showform = true
        this.verifyParamData = {
          taskId: row.aicos_task_id,
          processInstanceId: row.aicos_process_instance_id,
          processDefinitionId: row.aicos_process_definition_id,
          taskDefinitionKey: row.aicos_task_definition_key,
        };
        this.dataMagFormSubType = "view";
        this.dataMagFormTag = true;
        this.dataMagFormTitle = "数据查看";
        this.dataInitTemplateId = row.template_version_id;
        this.dataInitId = row.id;
        this.option5 = this.option4
        this.form5 = await this.formData(row);
        this.dataMagFormSubBtnTag = false;
      }
    },
    
    async handleUpdate (row,index) {
      this.$refs.crud.rowEdit(row, index);
    },
    handelDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id",row.id);
          return czremove(params);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    
    async beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if(type == "add"){
          const userinfo = await userInfo()
          this.form.xingm = userinfo.data.data.realName
          this.form.xingb = userinfo.data.data.sex
          this.form.chusny = userinfo.data.data.birthday
          const dept = await getDepartment()
          this.form.suosbm = dept.data.data.deptName + userinfo.data.data.tel
          this.form.zhiw = userinfo.data.data.tel
          this.form.suoscs = userinfo.data.data.tel
        }
        this.initData(type);
      }
      done();
    },
    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    verifyChange(){},
    initData (/*type*/) {},

    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },

    async onLoad (page) {
      this.loading = true;
      if (this.tabType == "TODO") {
        const dataParam = {
          metaObjName: this.metObjName,
          templateVersionId: this.templateId,
          systemCode: this.systemCode,
          reqPage: {
            current: page.currentPage,
            size: page.pageSize,
          },
          searchParam: {
            ...this.query,
          },
        };
        getToDoListData(dataParam).then(res => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.data = dataRes.fieldList;
          this.loading = false;
          this.selectionClear();
        });
      } else if (this.tabType == "DONE") {
        const dataParam = {
          metaObjName: this.metObjName,
          templateVersionId: this.templateId,
          systemCode: this.systemCode,
          reqPage: {
            current: page.currentPage,
            size: page.pageSize,
          },
          searchParam: {
            ...this.query,
          },
        };
        getFinishListData(dataParam).then(res => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.data = dataRes.fieldList;
          this.loading = false;
          this.selectionClear();
        });
      } else{
        const dataParam = {
          metaObjName: this.metObjName,
          templateVersionId: this.templateId,
          systemCode: this.systemCode,
          reqPage: {
            current: page.currentPage,
            size: page.pageSize,
          },
          searchParam: {
            ...this.query,
          },
        };
        czgetList(dataParam).then(res => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.formName = dataRes.formName;
          this.data = dataRes.fieldList;
          this.loading = false;
          this.selectionClear();
        });
      }
    },
    async refreshChange () {
      this.onLoad(this.page, this.query);
    },

    async handleAdd () {
      this.$refs.crud.rowAdd();
    },
    rowSave (row, done, loading) {
      saveOrUpdateListData(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },

    // async dataMagFormSave(saveByFlow) {
    //   this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
    //     if (valid) {
    //       const dataMagFormDataJson =
    //         this.$refs.dataMagFormRef.buildSubmitData();
    //       const dataParam = {
    //         id: this.dataInitId,
    //         formTemplateVersionId: this.dataInitTemplateId
    //           ? this.dataInitTemplateId
    //           : this.templateId,
    //         formDataJson: dataMagFormDataJson,
    //       };
          
    //       saveOrUpdateListData(dataParam).then(
    //         (/*res*/) => {
    //           if (saveByFlow != "flow") {
    //             if (this.dataMagFormSubType == "add") {
    //               this.tabType = "ALL";
    //             }
    //             this.refreshChange();

    //             this.dataMagFormTag = false;
    //             this.cmfCustData = "";
    //             this.$message({
    //               type: "success",
    //               message: "操作成功!",
    //             });
    //           }
    //         },
    //         (error) => {
    //           window.console.log(error);
    //         }
    //       );
    //     } else {
    //       window.console.log("error submit!!");
    //       //this.cmfCustData = "";
    //       return false;
    //     }
    //   });
    // },

  }
};
</script>

<style>
.CMF_MAIN {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.CMF_HEAD {
  text-align: center;
  background-color: #409eff;
}

.CMF_HEAD span {
  font-size: 18px;
  line-height: 50px;
  color: #fff;
}

.CMF_BODY {
  padding: 20px 10px 0;
}

.CMF_FOOT {}

.CMF_CUST {}

.dataMagFormClass .dataMagFormBody {
  background-color: #f5f5f5;
  padding: 20px 0 0;
}

.dataMagFormClass .dataMagFormFooter {
  background-color: #fff;
  margin-top: 20px;
}

.formVerifyClass {
  padding: 30px 10px 10px;
  max-width: 1000px;
  margin: 0 auto;
}

.dataMagFormBtns {
  text-align: center;
  padding: 30px 10px 60px;
}

@media print {
  .el-popup-parent--hidden {
    overflow: auto;
  }

  .dataMagFormClass {
    position: static;
  }

  .dataMagFormClass .el-dialog {
    height: auto;
  }
}
</style>

<style lang="scss" scoped>
.newCss {
  position: relative;
  height: 100%;

  .search-from-tool {
    margin-right: 0;

    /deep/.el-form-item__content {
      line-height: 1px;
    }

    /deep/.el-button--small {
      padding: 5px;

      i {
        font-size: 20px;
      }
    }
  }

  .menuTitle {
    position: absolute;
    top: 85px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }

  .menuTitleV {
    position: absolute;
    top: 35px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }

  /deep/.avue-crud__search .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.avue-crud__search .avue-form__menu {
    width: 240px;
  }

  /deep/.el-card__body .avue-crud__menu {
    justify-content: flex-end;
  }

  /deep/.rightSearch .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.rightSearch .avue-form__menu {
    width: 240px;
  }

  /deep/.rightSearch .avue-array {
    display: flex;
    justify-content: space-between;
  }

  /deep/.rightSearch .avue-array:after {
    content: "-";
    display: block;
    width: 30px;
    height: 30px;
    order: 2;
    text-align: center;
  }

  /deep/.rightSearch .avue-array> :first-child {
    order: 1;
  }

  /deep/.rightSearch .avue-array> :last-child {
    order: 3;
  }

  /deep/.rightSearch .avue-array .el-button {
    display: none;
  }

  /deep/.el-table__header-wrapper {
    background-color: #fafafa;
  }
}

.flow-view {
  height: calc(100vh - 175px);
}

.CMF_BODY {
  /deep/ .dynamic-print-table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    table-layout: fixed;
    display: none;

    td,
    th {
      border: 1px solid #ebeef5;
      height: 49px;

      &:first-child {
        width: 50px;
        text-align: center;
      }
    }
  }

  @media print {
    /deep/.avue-dynamic {
      .avue-crud {
        display: none;
      }

      .dynamic-print-table {
        display: table;
      }
    }
  }
}

.kqtitle {
  display: flex;
  height: 60px;
  width: 500px;
  line-height: 60px;
  margin: 40px auto;
}

.cstitle {
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  margin: 40px auto 0;
  font-size: 18px;
  font-weight: 600;
}

.kqtxt {
  font-size: 18px;
  width: 80px;
}

.listadd {
  width: 60%;
  margin: 0 auto 40px;
  text-align: right;
}

.footer {
  width: 200px;
  margin: 200px auto 0;
  display: flex;
}

.csfooter {
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}

.csdate {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}

.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
}

.zhushi {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.hzTop {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.hztitle {
  margin-left: 10%;
}

.jidu {
  margin-right: 10%;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #000 !important;
}
</style>
