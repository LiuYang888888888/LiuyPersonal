<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删除
        </el-button> -->
        <!-- <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permissionList.jiaBtn"
          @click.stop="comFormMagJia()"
          >新 增
        </el-button> -->
      </template>

      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.detailBtn" @click="comFormMagDetail(scope.row)">详情
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.jiaBtn" @click="comFormMagJia(scope.row)">生成
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editMagBtn" @click="handleEdit(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.xiafaBtn" @click="handleXiafa(scope.row)">下发
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delMagBtn" @click="handledel(scope.row)">删除
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.hzmxBtn" @click="handleHzmx(scope.row)">各部门汇总明细
        </el-button>
        <el-button type="text" size="small"  v-if="permissionList.mingxiBtn" @click="handleMingxi(scope.row)">明细下载
        </el-button>
        <el-button type="text" size="small"  v-if="permissionList.huizongBtn" @click="handleHuizong(scope.row)">汇总下载
        </el-button>
      </template>
    </avue-crud>

    <!--考勤表单下发新增-->
    <HuilanDialog :title="kaoqinTitle" :fullscreen="true" width="90%" append-to-body :visible.sync="kaoqinTag">
      <div class="kqtitle">
        <div class="kqtxt">标题：{{ kqtitle }}</div>
        <!-- <el-input v-model="kqtitle" placeholder="请输入标题内容" :disabled="kqdis"></el-input> -->
      </div>
      <!-- <div class="listadd" v-show="!kqdis"><el-button type="primary" @click="kqadd()">新增</el-button></div> -->
      <el-table :data="tableData" height="400" border style="width: 60%;margin: 0 auto;">
        <el-table-column align="center" label="处室名称" width="180">
          <template slot-scope="{ row }">
            <span>{{ row.chusmc }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="月份">
          <template slot-scope="{ row }">
            <span>{{ row.yuef }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="考核人数">
          <template slot-scope="{ row }">
            <span v-show="!editid">{{ row.kaohrs }}</span>
            <el-input v-show="editid" v-model="row.kaohrs"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" label='“好”人数'>
          <template slot-scope="{ row }">
            <span v-show="!editid">{{ row.haors }}</span>
            <el-input v-show="editid" v-model="row.haors"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="备注">
          <template slot-scope="{ row }">
            <span v-show="!editid">{{ row.beiz }}</span>
            <el-input v-show="editid" v-model="row.beiz" style="text-align: center;"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" v-if="!editid">
          <template slot-scope="{row}">
            <!-- <el-button type="primary" size="mini" v-show="!kqdis" @click="kaoqindel(row)">
              删除
            </el-button> -->

            <el-button type="primary" size="mini"  @click="kaoqinInfo(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer">
        <el-button type="primary" plain @click="savekq" v-if="editid" :loading="btnLoading">保存</el-button>
        <el-button plain @click="closekq">取消</el-button>
      </div>
    </HuilanDialog>

    <!--处室详情表-->
    <HuilanDialog :title="kaoqinTitle" :fullscreen="true" width="80%" append-to-body :visible.sync="csInfo">
      <div class="kqtitle">
        <div class="kqtxt">标题：{{ kqtitle }}</div>
      </div>

      <el-table :data="tableDatacs" border style="width: 80%;margin: 0 auto;">
        <el-table-column align="center" label="处室名称" width="180">
          <template slot-scope="{ row }">
            <span>{{ row.suosbm }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="月份" width="180">
          <template slot-scope="{ row }">
            <span>{{ row.kaohjd }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="考核用户" width="180">
          <template slot-scope="{ row }">
            <span>{{ row.xingm }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label='主管领导评鉴' width="220">
          <template slot-scope="{ row }">
            <span>{{ row.zhugldpj }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="chushiInfo(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer">
        <el-button plain @click="closecs">关闭</el-button>
      </div>
    </HuilanDialog>

    <!--处室个人考勤详情-->
    <HuilanDialog :title="csTitle" :fullscreen="true" width="80%" append-to-body :visible.sync="chushiDetail">
      <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form1" :option="option1">
      </avue-form>
      <!-- <div class="cstitle">{{ csTitle }}</div>
      <div class="csdate">{{ csyear }} 年 {{ csmonth }} 月</div>

      <div style="width: 100%;padding:10px">
        <table align="center" width="100%" class="table xunw_table_form" border="1">
          <tr>
            <td>姓名</td>
            <td>测试1</td>
            <td>性别</td>
            <td>男</td>
            <td>出生年月</td>
            <td>1988.2.10</td>
          </tr>
          <tr>
            <td>处室及职务</td>
            <td colspan="5">政治部副主任</td>
          </tr>
          <tr>
            <td>考核指标</td>
            <td colspan="4">评价要素</td>
            <td>考核结果</td>
          </tr>
          <tr>
            <td>政治品质</td>
            <td colspan="4">讲政治，具有较强的政治意识、大局意识、核心意识、看齐意识，认真贯彻执行党的路线、方针、政策。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>职业道德</td>
            <td colspan="4">忠于职守，服从命令，精通业务，勤勉敬业，遵守公务员职业道德，依法执行公务。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>工作作风</td>
            <td colspan="4">热爱本职工作，敢于担当，积极主动，尽职尽责，求真务实，深入基层，服务企业。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>廉洁自律</td>
            <td colspan="4">严格遵守《廉政准则》、中央八项规定、省委省政府20条意见，无不正之风或违纪违规现象。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>个性指标</td>
            <td colspan="4">工作数量、质量、效率以及所产生的效益和业务能力等。</td>
            <td>好</td>
          </tr>
          <tr>
            <td rowspan="2">出勤情况</td>
            <td>出勤（天）</td>
            <td>事假（天）</td>
            <td>病假（天）</td>
            <td>旷工（天）</td>
            <td></td>
          </tr>
          <tr>
            <td>21</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowspan="2">主管领导评鉴</td>
            <td rowspan="2" colspan="5">
              <div style="float:left;margin-left:50px;width:50px;">较好</div>
              <div style="float:left;margin-left:120px;margin-top:30px;">（签名）</div>
              <input style="float:left;margin-left:10px;margin-top:30px;line-height:40px;border:none;" value="测试1"
                readonly />
              <div style="float:right;margin-right:100px;margin-top:30px;">2024年1月11日</div>
            </td>
          </tr>
          <tr>
          </tr>
          <tr>
            <td rowspan="2">政治部审定</td>
            <td rowspan="2" colspan="5">
              <div style="float:left;margin-left:50px;width:50px;">较好</div>
              <div style="float:left;margin-left:120px;margin-top:30px;">（签章）</div>
              <input style="float:left;margin-left:10px;margin-top:30px;line-height:40px;border:none;" readonly />
              <div style="float:right;margin-right:100px;margin-top:30px;">2024年1月11日</div>
            </td>
          </tr>
          <tr>
          </tr>
        </table>
        <div class="zhushi">注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；<br />2.主管领导意见填写评语和考核等次建议。</div>
      </div> -->

      <div class="csfooter">
        <el-button plain @click="closecsDetail">关闭</el-button>
      </div>
    </HuilanDialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getDepartment,
  getNotice,
  saveNotice,
  removeNotice,
  saveNoticeDetail,
  getNoticeDetail,
  saveNoticeDetailList,
  updateNotice,
  sendNotice,
  getDetail,
  kaoheDetail
} from "@/api/Political/common";
export default {
  data () {
    return {
      kaoqinTitle: '下发通知',
      kaoqinTag: false,
      kqtitle: '',
      tableData: [],

      csInfo: false,
      tableDatacs: [],

      chushiDetail: false,
      csTitle: '公务员平时考核登记表',
      jidunum1: '1',
      jidunum2: '2',
      jidunum3: '3',
      heji1: '1人',
      heji2: '1人',
      heji3: '1人',
      hzList: [],
      hzJiDu: '2024年第一季度',
      hzJob: '政治部',
      csyear: '2024',
      csmonth: '1',

      editid:false,
      btnLoading:false,
      form: {},
      form1: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        selection: true,
        column: [
          {
            type: 'input',
            label: '标题',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fabbt',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发布部门',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'fabbm',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '发布状态',
            dicData: [
              {
                label: '未发布',
                value: '0'
              },
              {
                label: '已发布',
                value: '1'
              }
            ],
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            prop: 'fabzt',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发布人',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'fabr',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发布时间',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'fabsj',
            isListDisplay: true,
          },
          {
            type: 'year',
            label: '考核年度',
            span: 16,
            display: true,
            format: 'yyyy',
            valueFormat: 'yyyy',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'khnd',
            isListDisplay: true,
            hide:true,
          },
          {
            type: 'select',
            label: '考核季度',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            hide:true,
            prop: 'kaohjd',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'khjd'
            }
          }
        ],
      },
      option1: {
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
            label: '',
            prop: 'tianbny1',
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
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingm',
                      maxlength: 100,
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
                      label: '',
                      span: 24,
                      display: true,
                      hideLabel: false,
                      dataType: 'string',
                      prop: 'xingb',
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
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-add`],
          false
        ),
        jiaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-jia`],
          false
        ),
        xiafaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-xiafa`],
          false
        ),
        detailBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-detail`],
          false
        ),
        editMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-edit`],
          false
        ),
        delMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-del`],
          false
        ),
        mingxiBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-mingxi`],
          false
        ),
        huizongBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-huizong`],
          false
        ),
        hzmxBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-hzmx`],
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
    //明细表生成
    comFormMagJia (row) {
      this.kaoqinTag = true
      saveNoticeDetail({id:row.id}).then(res => {
        if (res.data.code == 200) {
          this.editid = true
          this.kqtitle = row.fabbt
          this.tableData = res.data.data
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      },error => {
        window.console.log(error);
      });
    },
    //保存
    savekq () {
      this.btnLoading = true;
      saveNoticeDetailList(this.tableData).then(res =>{
        if(res.data.code == 200){
          this.btnLoading = false
          this.$message({
            type: "success",
            message: '操作成功！',
          });
          this.kaoqinTag = false
          this.tableData = []
          this.refreshChange();
        }
      },error => {
        window.console.log(error);
        this.btnLoading = false
      });
    },
    //取消
    closekq () {
      this.kaoqinTag = false
      this.tableData = []
    },
    kqadd () {
      let i = this.tableData.length
      let obj = { i: i, chushi: '', month: '', khnum: '', goodnum: '', beizhu: '', editid: true }
      this.tableData.push(obj)
    },
    kaoqindel (row) {
      this.$confirm(
        "确认删除该数据？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.tableData.splice(row.i, 1)
        this.tableData.forEach((item, index) => {
          item.i = index
        })
      })
    },
    kaoqinInfo (row) {
      getDetail({id:row.id}).then(res =>{
        if(res.data.code == 200){
          this.csInfo = true
          this.tableDatacs = res.data.data
        }else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      },error => {
        window.console.log(error);
      });
    },
    //详情
    comFormMagDetail (row) {
      this.kaoqinTag = true
      getDepartment().then(res =>{
        if(res.data.data.deptName.includes('政治部')){
          getNoticeDetail({guanlzbid:row.id,current:1,size:9999}).then(res => {
            if (res.data.code == 200) {
              this.editid = false
              this.kqtitle = row.fabbt
              this.tableData = res.data.data
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          },error => {
            window.console.log(error);
          });
        }else{
          getNoticeDetail({guanlzbid:row.id,current:1,size:9999,chusdm:res.data.data.id}).then(res => {
            if (res.data.code == 200) {
              this.editid = false
              this.kqtitle = row.fabbt
              this.tableData = res.data.data
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          },error => {
            window.console.log(error);
          });
        }
      })
    },
    //各处室详情
    chushiInfo (row) {
      const params = new URLSearchParams();
      params.append("id",row.id);
      kaoheDetail(params).then(res =>{
        if(res.data.code == 200){
          this.chushiDetail = true
          this.form1 = res.data.data
        }else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      },error => {
        window.console.log(error);
      });
    },
    closecs () {
      this.csInfo = false
    },
    closecsDetail () {
      this.chushiDetail = false
    },
    //下发
    handleXiafa (row) {
      this.$confirm(
        "是否确认下发？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        return sendNotice({id:row.id});
      })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
    },
    rowSave (row, done, loading) {
      saveNotice(row).then(() => {
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
    handleEdit(row){
      this.$refs.crud.rowEdit(row)
    },
    rowUpdate (row, index, done, loading) {
      updateNotice(row).then(() => {
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
    handledel(row){
      this.$refs.crud.rowDel(row)
    },
    rowDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removeNotice({id:row.id});
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removeNotice(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    initData(){},

    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        this.initData(type);
      }
      done();
    },
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
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    onLoad (page) {
      this.loading = false;
      // const dataParam = {
      //   reqPage: {
      //     current: page.currentPage,
      //     size: page.pageSize,
      //   },
      //   searchParam: {
      //     ...this.query,
      //   },
      // };
      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
      };
      getNotice(dataParam).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style scoped>
.kqtitle {
  display: flex;
  height: 60px;
  width: 100%;
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

.csdate {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}

.kqtxt {
  font-size: 18px;
  width: 100%;
  text-align: center;
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

.csfooter {
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}
/deep/ .el-button--primary.is-plain{
  color: #fff;
}
</style>
