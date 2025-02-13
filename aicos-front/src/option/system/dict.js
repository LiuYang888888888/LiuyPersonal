import { getRules } from '@/util/regx'

export const optionParent = {
  // height: 'auto',
  // calcHeight: 95,
  header:false,
  tip: false,
  searchShow: true,
  searchMenuSpan: 6,
  border: false,
  index: true,
  editBtn:false,
  viewBtn: false,
  delBtn: false,
  menuWidth: 280,
  dialogClickModal: false,
  dialogWidth: "40%",
  dialogType: "drawer",
  dialogCustomClass: "huilan-drawer-form",
  column: [
    {
      label: "字典编码",
      prop: "code",
      // search: true,
      editDisabled: true,
      span: 24,
      maxlength: 50,
      showWordLimit: true,
      rules: [
        {
          required: true,
          message: "请输入字典编码",
          trigger: "blur"
        },
        ...getRules(['charNumLine'])
      ]
    },
    {
      label: "字典名称",
      prop: "name",
      // search: true,
      align: "center",
      span: 24,
      maxlength: 50,
      showWordLimit: true,
      rules: [
        {
          required: true,
          message: "请输入字典名称",
          trigger: "blur"
        },
        ...getRules(['charNumHanUnderline'])
      ]
    },
    {
      label: "字典级别",
      prop: "type",
      // search: true,
      align: "center",
      type: "select",
      span: 24,
      value: 'user',
      width:120,
      dicData: [
        {
          label: "系统级",
          value: 'system'
        },
        {
          label: "用户级",
          value: 'user'
        }
      ],
      rules: [
        {
          required: true,
          message: "请输入字典名称",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典备注",
      prop: "remark",
      type: 'textarea',
      maxlength: 100,
      showWordLimit: true,
      rules: getRules(['expectSpecials']),
      span: 24,
      hide: true
    }
  ]
};

export const optionChild = {
  height: 'auto',
  calcHeight: 95,
  tip: false,
  searchShow: true,
  searchSpan: 8,
  searchMenuSpan: 6,
  // tree: true,
  border: true,
  index: true,
  // selection: true,
  viewBtn: false,
  menuWidth: 220,
  labelWidth: 100,
  searchLabelWidth: 100,
  dialogWidth: 480,
  dialogClickModal: false,
  column: [
    {
      label: "字典项编码",
      prop: "code",
      editDisabled: true,
      search: true,
      span: 24,
      maxlength: 50,
      showWordLimit: true,
      rules: [
        {
          required: true,
          message: "请输入字典项编码",
          trigger: "blur"
        },
        ...getRules(['charNumLine'])
      ]
    },
    {
      label: "字典项名称",
      prop: "name",
      search: true,
      align: "center",
      span: 24,
      maxlength: 50,
      showWordLimit: true,
      rules: [
        {
          required: true,
          message: "请输入字典项名称",
          trigger: "blur"
        },
        ...getRules(['charNumHanUnderline'])
      ]
    },
    {
      label: "字典项值",
      prop: "value",
      // width: 80,
      span: 24,
      maxlength: 200,
      showWordLimit: true,
      rules: [
        {
          required: true,
          message: "请输入字典项值",
          trigger: "blur"
        },
        ...getRules(['expectSpecials'])
      ]
    },
    {
      label:'排序',
      prop:'sort',
      span:24,
      // rules:[
      //   {
      //     pattern: /(^[1-9]\d*$)/,
      //     message: "请输入正整数",
      //     trigger: "blur"
      //   },
      // ],
      type:'number',
      minRows: 0,
      maxRows: 99999,
      precision: 0,
      hide:true
    },
    {
      label: "字典项备注",
      prop: "remark",
      type: 'textarea',
      maxlength: 200,
      showWordLimit: true,
      span: 24,
      rules: getRules(['expectSpecials']),
      hide: true
    }
  ]
};
