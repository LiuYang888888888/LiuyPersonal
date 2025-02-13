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
  getInfo,
  saveOrUpdateListDataPro,
  viewListDataPro,
} from "@/api/outSystem/junkouservices";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '服务名称',
          prop: 'fuwmc',
        },
        {
          type: 'choose',
          label: '服务领域',
          show:false,
          columns:[],
          prop: 'fuwly',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'fuwulingyu'
          }
        },
        {
          type: 'textarea',
          label: '服务范围',
          prop: 'fuwfw',
        },
        {
          type: 'input',
          label: '服务对象',
          prop: 'fuwdx',
        },
        {
          type: 'input',
          label: '服务方式',
          prop: 'fuwfs',
        },
        {
          type: 'input',
          label: '服务流程',
          prop: 'fuwlc',
        },
        {
          type: 'choose',
          label: '收费模式',
          show:false,
          columns:[],
          prop: 'shoufms',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'shoufeims'
          },
        },
        {
          type: 'input',
          label: '服务价格',
          prop: 'jiag',
          append: '万元',
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
          type: 'input',
          label: '发布者',
          prop: 'fabz',
        },
        {
          type: 'input',
          label: '电子邮箱',
          prop: 'dianzyx',
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
    this.$nextTick(function(){ 
      this.load()
    });
  },
  methods: {
    onLoad () {
      this.type = this.$route.query.type
      this.id = this.$route.query.id
      getInfo().then( res => {
        const info = res.data.data
        if(this.type == 'add'){
          this.options.fabz = info.realName
          this.options.lianxr = info.contacts
          this.options.lianxdh = info.mobile
        }
      })
      if(this.type != 'add'){
        const params = new URLSearchParams();
        params.append("id",this.id);
        viewListDataPro(params).then(res => {
          this.options = res.data.data
        })
      }
    },
    //新增
    add(options){
      saveOrUpdateListDataPro(options).then(() => {
        Toast.success('新增成功！');
        this.$router.go(-1)
      }, error => {
        window.console.log(error);
      });
    },
    //编辑
    edit(options){
      saveOrUpdateListDataPro(options).then(() => {
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