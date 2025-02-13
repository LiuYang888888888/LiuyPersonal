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
import {add, update , getById} from "@/api/outSystem/safeManage";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '企业名称',
          prop: 'biaot',
        },
        {
          type: 'textarea',
          label: '企业简介',
          prop: 'jianj',
        },
        {
          type: 'text',
          label: '上年度营收情况',
          prop: '',
        },
        {
          type: 'input',
          label: '销售收入',
          prop: 'shangndxssr',
          append: '万元'
        },
        {
          type: 'input',
          label: '人均年收入',
          prop: 'shangndrjsr',
          append: '万元'
        },
        {
          type: 'input',
          label: '安全投入',
          prop: 'shangndaqtr',
          append: '万元'
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
        if (this.type == 'add') {
          this.options.fabz = info.account
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