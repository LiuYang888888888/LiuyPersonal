<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @addData="add" @close="close" @editData="edit" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/share'
import {getEnterList , getById} from "@/api/outSystem/share";
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
          type: 'choose',
          show:false,
          columns:[],
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
    
    //编辑
    edit(options){
      getEnterList(options).then(() => {
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