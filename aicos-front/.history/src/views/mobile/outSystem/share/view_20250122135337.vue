<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import {saveOrUpdateListData , getById} from "@/api/outSystem/share";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '成果名称',
          prop: 'chenggmc',
        },
        {
          type: 'textarea',
          label: '成果简介',
          prop: 'chenggjj',
        },
        {
          type: 'input',
          label: '所属项目',
          prop: 'suosxm',
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
          type: 'input',
          label: '所属行业',
          prop: 'suosxy',
        },
        {
          type: 'checkbox',
          label: '应用领域',
          show:false,
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
          label: '专利人',
          prop: 'zhuanlr',
        },
        {
          type: 'choose',
          label: '专利类型',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          prop: 'zhuanllx',
          dicQuery: {
            code: 'zhuanlilx'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'input',
          label: '专利号',
          prop: 'zhuanlh',
        },
        {
          type: 'input',
          label: '发明人',
          prop: 'famr',
        },
        {
          type: 'textarea',
          label: '创新要点',
          prop: 'chuangxyd',
        },
        {
          type: 'upload',
          label: '成果LOGO',
          prop: 'chengglogo',
          limit: 1,
          multiple:false,
          fileSize: 10000,
          tip:'只能上传jpg/png，且不超过10M',
          accept: 'image/png, image/jpeg',
          dicUrl: '/aicos/api/aicos-file/miniofile/upload',
          dicMethod: 'post',
        },
        {
          type: 'choose',
          label: '密级',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          prop: 'mij',
          dicQuery: {
            code: 'mj'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'date',
          label: '采购日期',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'caigsj',
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
      saveOrUpdateListData(options).then(() => {
        Toast.success('新增成功！');
        this.$router.go(-1)
      }, error => {
        window.console.log(error);
      });
    },
    //编辑
    edit(options){
      saveOrUpdateListData(options).then(() => {
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