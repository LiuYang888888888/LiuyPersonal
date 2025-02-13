import serviceList from '@/config/serviceList'
// import {getRules} from '@/util/regx'
import {baseURL} from '@/api/common';

export default {
  emptyBtn: false,
  column: [{
    label: '头像',
    type: 'upload',
    listType: 'picture-img',
    // showFileList: false,
    // propsHttp: {
    //   res: 'data',
    //   url: 'link',
    // },
    canvasOption: {
      text: ' ',
      ratio: 0.1
    },
    accept:".jpg,.png",
    action: '/aicos/api/aicos-file/miniofile/upload',
    propsHttp: {
      // home: '/aicos',
      url: 'newFileName',
      name: 'oldFileName',
      res: 'data',
      fileName: 'file'
    },
    data: {
      fromSystemName: 'base'
    },
    tip: '只能上传jpg/png用户头像，且不超过500kb',
    span: 12,
    row: true,
    prop: 'avatar',
    uploadAfter(res, show) {
      const base = baseURL.replace(/\/$/, '');
      // console.log("上传后",base)
      res.newFileName = base + res.newFileName;
      show(res)
    }
  }, {
    label: '账号',
    span: 12,
    row: true,
    prop: 'account',
    disabled: true
  }, {
    label: '密码',
    span: 12,
    row: true,
    prop: 'pwd',
    type: 'password',
    disabled: true,
    value: '******'
  },{
    type: 'select',
    label: '用户类型',
    cascaderItem: [],
    span: 12,
    display: true,
    props: {
      label: 'name',
      value: 'value'
    },
    hideLabel: false,
    dataType: '',
    prop: 'memberType',
    isListDisplay: true,
    search: false,
    dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
    dicMethod: 'post',
    dicQuery: {
      code: 'yhlx'
    },
    rules: [],
    disabled: true,
  }, {
    label: '姓名',
    span: 12,
    row: true,
    prop: 'realName'
  }, {
    label: '联系人',
    span: 12,
    row: true,
    prop: 'contacts'
  }, {
    label: '手机号',
    span: 12,
    row: true,
    prop: 'mobile'
  }, {
    label: '邮箱',
    prop: 'email',
    span: 12,
    row: true,
    rules: [{
      type: 'email',
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }]
  }]
}
