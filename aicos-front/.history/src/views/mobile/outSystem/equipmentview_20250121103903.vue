<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" checkbox/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import {getUserInfoPost} from "@/api/system/user";
import {add, update , getById} from "@/api/outSystem/equipment";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '设备名称',
          prop: 'shebmc',
        },
        {
          type: 'choose',
          label: '设备类型',
          show:false,
          columns:[],
          prop: 'sheblx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'sbzy_sblx'
          }
        },
        {
          type: 'textarea',
          label: '功能描述',
          prop: 'gongnms',
        },
        {
          type: 'input',
          label: '规格型号',
          prop: 'guigxh',
        },
        {
          type: 'input',
          label: '技术指标',
          prop: 'jiszb',
        },
        {
          type: 'upload',
          label: '设备logo',
          prop: 'sheblogo',
          limit: 1,
          multiple:false,
          fileSize: 10000,
          tip:'只能上传jpg/png，且不超过10M',
          accept: 'image/png, image/jpeg',
          dicUrl: '/aicos/api/aicos-file/miniofile/upload',
          dicMethod: 'post',
        },
        {
          type: 'input',
          label: '制造厂家',
          prop: 'zhizcj',
        },
        {
          type: 'choose',
          label: '先进程度',
          show:false,
          columns:[],
          prop: 'xianjcd',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'xjcd'
          }
        },
        {
          type: 'date',
          label: '采购日期',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'caigsj',
        },
        {
          type: 'date',
          label: '过保时间',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'guobsj',
        },
        {
          type: 'input',
          label: '联系人',
          prop: 'lianxr',
        },
        {
          type: 'input',
          label: '联系电话',
          prop: 'lianxdh',
        },
        {
          type: 'choose',
          label: '应用领域',
          show:false,
          multiple: true,
          columns:[],
          prop: 'yingyly',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'jscpyyly'
          }
        },
        {
          type: 'input',
          label: '安装地点',
          prop: 'anzdd',
        },
        {
          type: 'input',
          label: '发布者',
          prop: 'fabz',
        },
      ],
      type:'',
      id:''
    };
  },
  components: {
    Header,
    Message
  },
  created () {
    this.onLoad()
  },
  methods: {
    onLoad () {
      this.type = this.$route.query.type
      this.id = this.$route.query.id
      getUserInfoPost().then( res => {
        const info = res.data.data
        if(this.type == 'add'){
          this.options.fabz = info.account
          this.options.lianxr = info.contacts
          this.options.lianxdh = info.mobile
        }
      })
      if(this.type != 'add'){
        const params = new URLSearchParams();
        params.append("id",this.id);
        getById(params).then(res => {
          this.options = res.data.data
        })
      }
    },
    //新增
    add(options){
      add(options).then(() => {
        Toast.success('新增成功！');
        this.$router.go(-1)
      }, error => {
        window.console.log(error);
      });
    },
    //编辑
    edit(options){
      update(options).then(() => {
        Toast.success('编辑成功！');
        this.$router.go(-1)
      }, error => {
        window.console.log(error);
      });
    },
    //关闭
    close(){
      this.$router.go(-1)
    },
  }
}
</script>
<style>

html,body,#app{
  height: 100%;
  background-color: #F7F7F7;
}
</style>