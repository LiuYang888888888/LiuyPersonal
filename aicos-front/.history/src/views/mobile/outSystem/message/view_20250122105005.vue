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
  saveOrUpdateListData,
  viewListData,
} from "@/api/outSystem/message";
import { getInfo } from "@/api/outSystem/agency";
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
        {
          type: 'textarea',
          label: '回复内容',
          prop: 'huifnr',
          hide:false
        },
        {
          type: 'input',
          label: '回复用户',
          prop: 'huifyh',
          hide:false
        }
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
      getInfo().then( res => {
        const info = res.data.data
        if (this.type == 'add') {
          this.options.liuyyh = info.realName
          this.options.dianh = info.mobile
        }
      })
      if(this.type != 'add'){
        const params = new URLSearchParams();
        params.append("id",this.id);
        viewListData(params).then(res => {
          this.options = res.data.data
          if(this.options.huifnr){
            this.list[5].hide = false
            this.list[5].hide = false
          }
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