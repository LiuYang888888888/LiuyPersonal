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
import {add, update , getById} from "@/api/outSystem/company";
import { Toast } from 'vant';
export default {
  data(){
    return {
      options:{},
      list:[
        {
          type: 'input',
          label: '登录账号',
          prop: 'denglzh',
        },
        {
          type: 'choose',
          label: '用户类型',
          show:false,
          columns:[],
          prop: 'yonghlx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'qyxx_yhlx'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'input',
          label: '单位名称',
          prop: 'qiymc',
        },
        {
          type: 'textarea',
          label: '单位概况',
          prop: 'danwgk',
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
          label: '法定代表人',
          prop: 'faddbr',
        },
        {
          type: 'input',
          label: '联系人',
          prop: 'lianxr',
        },
        {
          type: 'input',
          label: '电话',
          prop: 'dianh',
        },
        {
          type: 'input',
          label: '邮箱',
          prop: 'youx',
        },
        {
          type: 'input',
          label: '统一信用代码',
          prop: 'tongyshxydm',
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
            code: 'dwxz'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'input',
          label: '成立时间',
          prop: 'chenglshij',
          append: '年'
        },
        {
          type: 'input',
          label: '注册资本',
          prop: 'zhuczb',
          append: '万元'
        },
        {
          type: 'input',
          label: '人员规模',
          prop: 'renygm',
        },
        {
          type: 'choose',
          label: '军工资质',
          show:false,
          columns:[],
          prop: 'jungzz',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'qyxx_jgzz'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'choose',
          label: '涉密情况',
          show:false,
          columns:[],
          prop: 'baomdj',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'qyxx_bmdj'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'input',
          label: '所在地',
          prop: 'suozd',
        },
        {
          type: 'choose',
          label: '企业类型',
          show:false,
          columns:[],
          prop: 'qiylx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'qylx'
          },
          props: {
            label: 'name',
            value: 'name'
          },
        },
        {
          type: 'choose',
          label: '所属领域',
          show:false,
          columns:[],
          prop: 'suosly',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'qyxx_ssly'
          }
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
          this.options.denglzh = info.account
          this.options.yonghlx = info.memberType
          this.options.lianxr = info.contacts
          this.options.dianh = info.mobile
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