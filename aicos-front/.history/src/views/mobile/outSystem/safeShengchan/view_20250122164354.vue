<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/message'
import {saveOrUpdateListData, getById} from "@/api/outSystem/safeShengchan";
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
          type: 'date',
          label: '许可证有效期',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'xukzyxq',
        },
        {
          type: 'textarea',
          label: '费用提取和使用情况',
          prop: 'feiytqhsyqk',
        },
        {
          type: 'textarea',
          label: '条件变化情况',
          prop: 'tiaojbhqk',
        },
        {
          type: 'textarea',
          label: '发生一般及以上生产安全事故情况',
          prop: 'fasybjysscaqsgqk',
        },
        {
          type: 'input',
          label: '联系人',
          prop: 'lianxr',
        },
        {
          type: 'input',
          label: '联系方式',
          prop: 'lianxfs',
        },
        {
          type: 'upload',
          listType: 'text',
          label: '上传附件',
          prop: 'shangcfj',
          limit: 1,
          multiple:false,
          fileSize: 10000,
          tip:'',
          accept: '',
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