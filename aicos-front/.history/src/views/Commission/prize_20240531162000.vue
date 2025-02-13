<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0;">
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
    </HuilanBasicToolbar>
    <avue-crud
      :option="option"
      :search.sync="search"
      :table-loading="loading"
      :permission="permissionList"
      :data="data"
      ref="crud"
      v-model="form"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @selection-change="selectionChange"
      @search-change="searchChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  
  data() {
    return {
      form: {},
      isManager: false,
      search: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      treeDeptId: "0",
      option: {
        header: false,
        tip: false,
        searchShow: true,
        border:true,
        align:'center',
        menuAlign:'center',
        index: true,
        indexLabel:'编号', 
        indexWidth:100,
        selection: false,
        addBtn: false,
        viewBtn: true,
        delBtn: false,
        searchMenuSpan:4,
        menuWidth: 100,
        column: [
    {
      type: 'html',
      component: 'HtmlField',
      content: '<div style=\"text-align: center;font-size:24px;font-weight:600\">\n国防科技进步奖提名书\n</div>',
      labelWidth: '0px',
      span: 24,
      display: true,
      dataType: 'string',
      prop: 'field1717142051819'
    },
    {
      type: 'input',
      label: '成果登记号',
      span: 8,
      display: true,
      hideLabel: false,
      dataType: 'string',
      prop: 'string_chenggdjh',
      isListDisplay: true,
      search: true
    },
    {
      type: 'input',
      label: '专业委员会',
      span: 8,
      display: true,
      hideLabel: false,
      dataType: 'string',
      prop: 'string_zhuanywyh',
      isListDisplay: true,
      search: true
    },
    {
      type: 'input',
      label: '评审组',
      span: 8,
      display: true,
      hideLabel: false,
      dataType: 'string',
      prop: 'string_pingsz',
      isListDisplay: true,
      search: true
    },
    {
      type: 'table',
      component: 'TableLayout',
      span: 24,
      labelWidth: 0,
      width: '100%',
      borderWidth: 1,
      borderColor: '#DCDFE6',
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
                content: '<div style=\"text-align: center\">\n项目名称\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142136335'
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
                prop: 'string_xiangmmc',
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
                content: '<div style=\"text-align: center\">\n公布名\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142358826'
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
                prop: 'string_gongbm',
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
                content: '<div style=\"text-align: center\">\n主要完成人\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142396340'
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
                prop: 'string_zhuywcr',
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
                content: '<div style=\"text-align: center\">\n主要完成单位\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142425386'
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
                prop: 'string_zhuywcdw',
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
                content: '<div style=\"text-align: center\">主要部门（单位）\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142471479'
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
                prop: 'string_zhugbm',
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
                content: '<div style=\"text-align: center\">\n提名者\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142572422'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_timr',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n密级\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142588469'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_mij',
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
                content: '<div style=\"text-align: center\">\n提名等级\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142638401'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_timdj',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n提名日期\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142650713'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                hideLabel: true,
                dataType: 'datetime',
                prop: 'datetime_timrq',
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
                content: '<div style=\"text-align: center\">\n成果类别\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142716558'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_chengglb',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n专业分类代码\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142734923'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_zhuanyfldm',
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
                content: '<div style=\"text-align: center\">\n任务来源\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142783514'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_renwly',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n专业分类名称\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142805764'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_zhuanyflmc',
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
                content: '<div style=\"text-align: center\">\n计划名称及文号\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142884724'
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
                prop: 'string_jihmcjwh',
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
                content: '<div style=\"text-align: center\">\n国防科技工业  科技报告编号\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717142956903'
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
                prop: 'string_guofkjgykjbgbh',
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
                content: '<div style=\"text-align: center\">\n起止时间\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143058369'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
            rowspan: 1,
            width: '',
            height: '',
            children: [
              {
                type: 'date',
                label: '起始时间',
                span: 24,
                display: true,
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyy-MM-dd',
                hideLabel: false,
                dataType: 'datetime',
                prop: 'datetime_qissj'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 3,
            rowspan: 1,
            width: '',
            height: '',
            children: [
              {
                type: 'date',
                label: '完成时间',
                span: 24,
                display: true,
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyy-MM-dd',
                hideLabel: false,
                dataType: 'datetime',
                prop: 'datetime_wancsj'
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
                content: '<div style=\"text-align: center\">\n授权发明专利\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143121609'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_shouqfmzl',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n授权其他知识产权\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143143917'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_shouqqtzscq',
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
                content: '<div style=\"text-align: center\">\n应用领域\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143172646'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_yingyly',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n是否应用\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143185527'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_shifyy',
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
                content: '<div style=\"text-align: center\">\n应用起始时间\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143238521'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                hideLabel: true,
                dataType: 'datetime',
                prop: 'datetime_yingyqssj',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n工程代码\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143257986'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_gongcdm',
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
                content: '<div style=\"text-align: center\">\n技术评价方式\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143290954'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                prop: 'string_jispjfs',
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
                type: 'html',
                component: 'HtmlField',
                content: '<div style=\"text-align: center\">\n技术评价时间\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143308588'
              }
            ]
          },
          {
            type: 'tableCell',
            colspan: 2,
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
                hideLabel: true,
                dataType: 'datetime',
                prop: 'datetime_jispjsj',
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
                content: '<div style=\"text-align: center\">\n技术评价组织单位\n</div>',
                labelWidth: '0px',
                span: 24,
                display: true,
                dataType: 'string',
                prop: 'field1717143339102'
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
                prop: 'string_jispjzzdw',
                labelWidth: '0px'
              }
            ]
          }
        ]
      ],
      display: true,
      dataType: 'string',
      prop: 'field1717142130318'
    },
    {
      type: 'upload',
      label: '选择附件',
      span: 24,
      display: true,
      showFileList: true,
      multiple: true,
      limit: 10,
      action: '/aicos/api/aicos-file/miniofile/upload',
      propsHttp: {
        home: '/aicos',
        url: 'newFileName',
        name: 'oldFileName',
        res: 'data',
        fileName: 'file'
      },
      canvasOption: {},
      hideLabel: false,
      dataType: 'string',
      prop: 'string_fuj',
      isListDisplay: true,
      search: true,
      data: {
        fromSystemName: 'base'
      }
    }
  ],
        
      },
      data: [],
      treeItemId: "0",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
       
      };
    },
  },
  mounted() {},
  methods: {
    initData() {
      this.form.deptId = this.treeDeptId;
      this.form.deptName = this.treeDeptName;
    },
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    
   
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    async beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        this.initData()
      }
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
    onLoad(page, params, treeItemId) {
      if (!treeItemId) {
        treeItemId = this.treeDeptId;
      }
      var obj = {
        ...this.query,
      };
      this.loading = false;
      // getList(this.page.currentPage, this.page.pageSize, obj, treeItemId).then(
      //   (res) => {
      //     const data = res.data.data;
      //     this.page.total = data.total;
      //     this.data = data.records;
      //     this.loading = false;
      //   }
      // );
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
  },
};
</script>

<style lang="scss">
.box {
  height: 800px;
}

.box .el-scrollbar {
  height: 100%;
}

.box .el-scrollbar__wrap {
  overflow: scroll;
}
</style>
