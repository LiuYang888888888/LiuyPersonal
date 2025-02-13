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
          label: '专家姓名',
          prop: 'zhuanjxm',
        },
        {
          type: 'choose',
          label: '性别',
          show:false,
          columns:[],
          prop: 'xingb',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'sex'
          }
        },
        {
          type: 'input',
          label: '身份证号',
          prop: 'shenfzh',
        },
        {
          type: 'input',
          label: '民族',
          prop: 'minz',
        },
        {
          type: 'date',
          label: '出生年月',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          prop: 'chusny',
        },
        {
          type: 'input',
          label: '籍贯',
          prop: 'jig',
        },
        {
          type: 'choose',
          label: '学历',
          show:false,
          columns:[],
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          prop: 'xuel',
          dicQuery: {
            code: 'education'
          }
        },
        {
          type: 'choose',
          label: '学位',
          show:false,
          columns:[],
          prop: 'xuew',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'xuewei'
          }
        },
        {
          type: 'input',
          label: '专业',
          prop: 'zhuany',
        },
        {
          type: 'input',
          label: '毕业院校',
          prop: 'biyyx',
        },
        {
          type: 'choose',
          label: '技术职称',
          show:false,
          columns:[],
          prop: 'jiszc',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'jishuzhicheng'
          }
        },
        {
          type: 'choose',
          label: '专家类型',
          show:false,
          columns:[],
          prop: 'zhuanjlx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'zhuanjialx'
          }
        },
        {
          type: 'input',
          label: '工作单位',
          prop: 'gongzdw',
        },
        {
          type: 'choose',
          label: '单位类型',
          show:false,
          columns:[],
          prop: 'danwlx',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'dwxz'
          }
        },
        {
          type: 'input',
          label: '职务',
          prop: 'zhiw',
        },
        {
          type: 'input',
          label: '专业年限',
          prop: 'zhuanynx',
        },
        {
          type: 'choose',
          label: '专业领域',
          show:false,
          columns:[],
          prop: 'zhuanyly',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'fuwulingyu'
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
      getInfo().then( res => {
        const info = res.data.data
        if (this.type == 'add') {
          this.options.fabz = info.realName
          this.options.lianxr = info.contacts
          this.options.lianxdh = info.mobile
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