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
  saveOrUpdateListData,
  viewListData,
} from "@/api/outSystem/agency";
import { Toast } from 'vant';
export default {
  data() {
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '登录账号',
          prop: 'denglzh',
        },
        {
          type: 'input',
          label: '机构名称',
          prop: 'jigmc',
        },
        {
          type: 'input',
          label: '法人代表',
          prop: 'fardb',
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
          type: 'choose',
          label: '机构类型',
          show:false,
          columns:[],
          prop: 'jiglx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'jigoulx'
          }
        },
        {
          type: 'choose',
          label: '单位性质',
          show:false,
          columns:[],
          prop: 'danwxz',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'danweixz'
          }
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
          type: 'choose',
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
          label: '注册类型',
          show:false,
          columns:[],
          prop: 'zhuclx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'zhucelx'
          }
        },
        {
          type: 'input',
          label: '传真',
          prop: 'chuanz',
        },
        {
          type: 'input',
          label: '邮箱',
          prop: 'youx',
        },
        {
          type: 'input',
          label: '通讯地址',
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
      getInfo().then( res => {
        const info = res.data.data
        if(this.type == 'add'){
          this.options.denglzh = info.account
          this.options.jigmc = info.enterpriseName
          this.options.lianxr = info.contacts
          this.options.dianh = info.mobile
        }
      })
      if(this.type != 'add'){
        const params = new URLSearchParams();
        params.append("id",this.id);
        viewListData(params).then(res => {
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