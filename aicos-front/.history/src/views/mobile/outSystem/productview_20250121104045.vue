<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import {getUserInfoPost} from "@/api/system/user";
import {add, update , getById} from "@/api/outSystemProduct/common";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '发布者',
          prop: 'fabz',
          readonly:true,
        },
        {
          type: 'input',
          label: '产品名称',
          prop: 'chanpmc',
        },
        {
          type: 'choose',
          label: '类型',
          show:false,
          columns:[],
          prop: 'leix',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'jscpLx'
          }
        },
        {
          type: 'checkbox',
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
          type: 'choose',
          label: '先进程度',
          show:false,
          columns:[],
          prop: 'xianjcd',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'jscpxjcd'
          }
        },
        {
          type: 'area',
          label: '行政区划',
          dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          dicMethod: 'post',
          prop: 'xingzqh',
          dicQuery: {}
        },
        {
          type: 'textarea',
          label: '产品概述',
          prop: 'chanpgs',
        },
        {
          type: 'textarea',
          label: '产品详情',
          prop: 'chanpxq',
        },
        {
          type: 'upload',
          label: '产品详情logo',
          prop: 'chanpxqlogo',
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
          label: '联系人',
          prop: 'lianxr',
        },
        {
          type: 'input',
          label: '联系电话',
          prop: 'lianxdh',
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