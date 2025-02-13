<template>
  <div>
    <Header />
    <Message :list="list" :type="type" :options="options" @close="close" @shareData="share" :id="id"/>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Message from '@/views/mobile/outSystem/components/share'
import {getEnterList , getById} from "@/api/outSystem/share";
import {danwei} from "@/api/outSystem/fileManage";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '设备名称',
shebmc          readonly:true
        },
        {
          type: 'textarea',
          label: '成果简介',
          prop: 'chenggjj',
          readonly:true
        },
        {
          type: 'checkbox',
          label: '共享单位',
          show:false,
          columns:[],
          prop: 'xiafdw',
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
  async mounted () {
    this.onLoad()
    this.danweiList()
  },
  methods: {
    onLoad () {
      this.type = this.$route.query.type
      this.id = this.$route.query.id

      const params = new URLSearchParams();
      params.append("id",this.id);
      getById(params).then(res => {
        this.options = res.data.data
      })
    },
    danweiList(){
      const params = new URLSearchParams();
      params.append("name", '');
      danwei(params).then(res=>{
        this.list[2].columns = res.data.data
      })
    },
    
    //编辑
    share(options){
      getEnterList(options).then(() => {
        Toast.success('提交成功！');
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