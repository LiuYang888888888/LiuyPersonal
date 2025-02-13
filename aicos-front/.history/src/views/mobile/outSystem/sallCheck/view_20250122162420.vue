<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import {saveOrUpdateListData, getById} from "@/api/outSystem/sallCheck";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '企业名称',
          prop: 'qiymc',
        },
        {
          type: 'input',
          label: '企业法人',
          prop: 'qiyfr',
        },
        {
          type: 'input',
          label: '许可证编号',
          prop: 'xukzbh',
        },
        {
          type: 'choose',
          label: '注册类型',
          show:false,
          columns:[],
          prop: 'zhuclx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'yhlx'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'input',
          label: '营业执照编号',
          prop: 'gongsyyzzbh',
        },
        {
          type: 'input',
          label: '注册资金',
          prop: 'zhuczj',
        },
        {
          type: 'date',
          label: '许可证有效期',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'xukzyxq',
        },
        {
          type: 'input',
          label: '安全评价机构',
          prop: 'anqpjjg',
        },
        {
          type: 'textarea',
          label: '评价结论',
          prop: 'pingjjl',
        },
        {
          type: 'textarea',
          label: '发生违规行为',
          prop: 'faswgxw',
        },
        {
          type: 'date',
          label: '发生违规行为时间',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'xukzyxq',
        },
        {
          type: 'textarea',
          label: '评价结论',
          prop: 'pingjjl',
        },

        {
          type: 'area',
          label: '行政区划',
          dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          dicMethod: 'post',
          prop: 'xingzqhdm',
          dicQuery: {}
        },
        {
          type: 'input',
          label: '需求关键字',
          prop: 'xuqgjz',
        },
        {
          type: 'textarea',
          label: '需求内容',
          prop: 'xuqnr',
        },
        {
          type: 'upload',
          label: '需求logo',
          prop: 'xuqlogo',
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
          label: '发布者',
          prop: 'fabz',
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