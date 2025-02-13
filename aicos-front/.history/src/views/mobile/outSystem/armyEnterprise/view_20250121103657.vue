<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import {
  add,
  update,
  getById
} from "@/api/armyEnterPrise/common";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '单位名称',
          prop: 'danwmc',
        },
        {
          type: 'choose',
          label: '行业类别',
          show:false,
          columns:[],
          prop: 'qiylx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'jbqyhylx'
          }
        },
        {
          type: 'input',
          label: '统一信用代码',
          prop: 'qiyxydm',
        },
        {
          type: 'textarea',
          label: '单位简介',
          prop: 'danwjj',
        },
        {
          type: 'textarea',
          label: '经营范围',
          prop: 'jingyfw',
        },
        {
          type: 'choose',
          label: '单位性质',
          show:false,
          columns:[],
          prop: 'xingylb',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'dwxz'
          }
        },
        {
          type: 'area',
          label: '所在地市',
          dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          dicMethod: 'post',
          prop: 'suozds',
          dicQuery: {}
        },
        {
          type: 'input',
          label: '通信地址',
          prop: 'tongxdz',
        },
        {
          type: 'input',
          label: '联系人',
          prop: 'lianxr',
        },
        {
          type: 'input',
          label: '联系电话',
          prop: 'lianxfs',
        },
        {
          type: 'upload',
          label: '营业执照图片',
          prop: 'yingyzzdz',
          limit: 1,
          multiple:false,
          fileSize: 10000,
          tip:'只能上传jpg/png，且不超过10M',
          accept: 'image/png, image/jpeg',
          dicUrl: '/aicos/api/aicos-file/miniofile/upload',
          dicMethod: 'post',
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