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

      <div style="width:100%;display: flex;justify-content: space-around;margin-top:20px;margin-bottom: 40px;">
        <van-button round block type="danger" native-type="submit" v-if="type != 'view'" style="width: 40%;">提交</van-button>
        <van-button round block type="default" @click="close" style="width: 40%;">关闭</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import { Dialog } from 'vant';
import {
  viewListData,
  submitListData
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
          readonly:true,
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
          readonly:true,
        },
        {
          type: 'textarea',
          label: '问题内容',
          prop: 'liuynr',
          readonly:true,
        },
        {
          type: 'input',
          label: '留言用户',
          prop: 'liuyyh',
          readonly:true,
        },
        
        {
          type: 'input',
          label: '联系电话',
          prop: 'dianh',
          readonly:true,
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
        getInfo().then(res => {
          const info = res.data.data
          this.options.huifyh = info.realName
        })
      })
    },
    //回复
    onSubmit(options){
      Dialog.confirm({
        title: '提交',
        message: '确认提交？',
      }).then(() => {
        const params = {
          id:this.id,
          huifnr:options.huifnr,
          huifyh:options.huifyh
        }
        console.log(this.options)
        // submitListData(params).then(() => {
        //   Toast.success('提交成功！');
        //   this.$router.go(-1)
        // }, error => {
        //   window.console.log(error);
        // });
      });
    },
    //关闭
    close(){
      this.$router.go(-1)
    },
  }
}
</script>
<style scoped>

html,body,#app{
  height: 100%;
  background-color: #F7F7F7;
}

.tip{
  font-size: 14px;
  color: #af2c30;
}

.multiplePicker-content {
  max-height: 50vh;
  overflow-y: auto;
}
/deep/ .van-checkbox__icon--checked .van-icon{
  background-color: #af2c30 !important;
  border-color: #af2c30 !important;
}
/deep/.van-picker__confirm{
  color: #af2c30 !important;
}
</style>