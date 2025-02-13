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
  viewListData,
} from "@/api/outSystem/message";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '问题标题',
          prop: 'liuybt',
        },
        {
          type: 'choose',
          label: '问题分类',
          show:false,
          columns:[],
          prop: 'liuyfl',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'liuyanfl'
          },
          props: {
            label: 'name',
            value: 'value'
          },
        },
        {
          type: 'textarea',
          label: '问题内容',
          prop: 'liuynr',
        },
        {
          type: 'input',
          label: '留言用户',
          prop: 'liuyyh',
        },
        
        {
          type: 'input',
          label: '联系电话',
          prop: 'dianh',
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
      const params = new URLSearchParams();
      params.append("id",this.id);
      viewListData(params).then(res => {
        this.options = res.data.data
      })
     
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