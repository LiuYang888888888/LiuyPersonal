<template>
  <div>
    <Header />
    <van-form @submit="onSubmit">
      <div v-for="(item,index) in list" :key="index">
        <div  v-if="item.type == 'input'">
          <van-field
            :readonly="item.readonly"
            v-model="options[item.prop]"
            :label="item.label"
            :placeholder="item.label"
            :rules="[{ required: true, message: '请填写'+item.label }]"
          >
            <template slot="button" v-if="item.append">{{ item.append }}</template>
          </van-field>
        </div>

        <van-field
          v-if="item.type == 'textarea'"
          :readonly="item.readonly"
          rows="3"
          autosize
          v-model="options[item.prop]"
          type="textarea"
          :label="item.label"
          :placeholder="item.label"
          show-word-limit
        />

        <van-field
          v-if="item.type == 'choose'"
          :readonly="item.readonly"
          is-link
          v-model="options[item.prop]"
          :label="item.label"
          :placeholder="item.label"
        />
      </div>
    </van-form>
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
          readonly:true,
          append:'必填'
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
         
        },
        {
          type: 'input',
          label: '回复用户',
          prop: 'huifyh',
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
      const params = new URLSearchParams();
      params.append("id",this.id);
      viewListData(params).then(res => {
        this.options = res.data.data
      })
     
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