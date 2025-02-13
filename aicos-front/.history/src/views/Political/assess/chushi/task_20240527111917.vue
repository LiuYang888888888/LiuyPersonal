<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删 除
        </el-button> -->
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permissionList.jiaBtn"
          @click.stop="comFormMagJia()"
          >新 增
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data () {
    return {
      form: {},
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
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        addBtn:false,
        index: true,
        viewBtn: true,
        selection: true,
        labelPosition: 'top',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            label: "填报年月",
            prop: "date",
            display:true,
          },
          {
            label: "用户",
            prop: "name",
            display:true,
          },
          {
            label: "所属部门",
            prop: "bumen",
            display:true,
          },
          {
            label: "是否提交",
            prop: "tijiao",
            display:true,
          },
          {
            label: "填写时间",
            prop: "time",
            display:true,
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
            hide:true,
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
            hide:true,
          },
          {
            type: 'date',
            label: '',
            span: 8,
            display: true,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_tianbny1',
            isListDisplay: true,
            search: true,
            tip: '请选择日期',
            tipPlacement: 'top',
            placeholder: '请选择日期'
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
                      prop: 'string_xingm',
                      maxlength: 100
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
                      prop: 'string_xingb',
                      value: '男'
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
                      prop: 'datetime_chusny'
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
                      type: 'html',
                      component: 'HtmlField',
                      content: '<div style=\"text-align: center\">\n政治部副主任\n</div>',
                      labelWidth: '0px',
                      span: 24,
                      display: true,
                      dataType: 'string',
                      prop: 'field1716365389637'
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
                      prop: 'string_shiftj'
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
                      prop: 'string_zhiydd'
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
                      prop: 'string_gongzzf'
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
                      prop: 'string_lianjzl',
                      labelWidth: '0px'
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
                      prop: 'string_suosbm',
                      labelWidth: '0px'
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
                      prop: 'string_chuq',
                      labelWidth: '0px'
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
                      prop: 'string_shij',
                      labelWidth: '0px'
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
                      prop: 'string_bingj',
                      labelWidth: '0px'
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
                      prop: 'string_kuangg',
                      labelWidth: '0px'
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
                      prop: 'string_zhugldpj',
                      labelWidth: '0px'
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
                      prop: 'string_qianm',
                      labelWidth: '0px'
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
                      prop: 'datetime_pingjrq',
                      labelWidth: '0px'
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
                  children: []
                }
              ]
            ],
            display: true,
            dataType: 'string',
            prop: 'field1716362710428'
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: 'field1716366868236'
          },
          {
            type: 'html',
            component: 'HtmlField',
            content: '<div style=\"text-align: center\">\n2.主管领导意见填写评语和考核等次建议。\n</div>',
            labelWidth: '0px',
            span: 24,
            display: true,
            dataType: 'string',
            prop: 'string_yongh'
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
        addMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-add`],
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
    rowSave (row, done, loading) {
      add(row).then(() => {
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
    rowUpdate (row, index, done, loading) {
      update(row).then(() => {
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
    rowDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
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
          return remove(this.ids);
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
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
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
    onLoad (page, params = {}) {
      this.loading = false;
      // getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
      //   const data = res.data.data;
      //   this.page.total = data.total;
      //   this.data = data.records;
      //   this.loading = false;
      //   this.selectionClear();
      // });
    }
  }
};
</script>

<style></style>
