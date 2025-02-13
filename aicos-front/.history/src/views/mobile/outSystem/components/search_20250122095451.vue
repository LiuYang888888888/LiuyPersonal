<template>
  <div>
    <div v-for="(item,index) in list" :key="index">
      <van-search background="#972030" shape="round" v-model="options[item.prop]" :label="item.label" :placeholder="item.label" v-if="item.search && item.type=='input' "/>

      <van-search background="#972030" shape="round" v-model="options[item.prop]" :label="item.label" :placeholder="item.label"  readonly v-if="item.search && item.type=='area'" @click="showAreaClick"/>
      <van-popup v-model="showArea" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择行政区划"
          :options="area"
          @close="showAreaClose"
          @finish="onFinish"
        />
      </van-popup>

      <van-search background="#972030" shape="round" v-model="options[item.prop]" :label="item.label" :placeholder="item.label" readonly v-if="item.search && item.type=='choose'" @click="showListopen(item,index)"/>
      <van-popup v-model="item.show" position="bottom">
        <van-picker
          show-toolbar
          :columns="item.columns"
          value-key="name"
          @confirm="showListvalue"
          @cancel="showListcancle(item)"
        />
      </van-popup>

      <van-search background="#972030" shape="round" v-model="options[item.prop]" :label="item.label" :placeholder="item.label" readonly v-if="item.search && item.type=='startTimeRange'" @click="showtimeopen(index)"/>
      <van-popup v-model="showtime" position="bottom">
        <van-datetime-picker
          
          v-model="currentDate"
          type="date"
          title="选择年月日"
          @confirm="showListvalue"
          @cancel="showtimeclose"
        />
      </van-popup>

      <van-search background="#972030" shape="round" v-model="options[item.prop]" :label="item.label" :placeholder="item.label" readonly v-if="item.search && item.type=='endTimeRange'" @click="showtimeopen(index)"/>
      <van-popup v-model="showtime" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          @confirm="showListvalue"
          @cancel="showtimeclose"
        />
      </van-popup>

    </div>

    <div style="width: 100%;text-align: center;margin-bottom: 10px;margin-top: 20px;">
      <van-button color="#af2c30" size="small" @click="search">搜索</van-button>
      <van-button plain size="small" @click="reset">清空</van-button>
    </div>

  </div>
</template>

<script>
import { Toast } from 'vant';
import {
  apiData
} from "@/api/outSystem/agency";

export default{
  data(){
    return{
      area:[],
      showArea:false,
      showtime:false,
      index:0,
      query:{},
      options:{},
      zt:[],
      currentDate:new Date(),
    }
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }, 
  },
  created () {
    this.load()
  },
  methods:{
    load(){
      this.list.forEach(item => {
        if(item.type == 'area'){
          apiData(item.dicQuery,item.dicUrl,item.dicMethod).then(res => {
            res.data.data.forEach(e => {
              e.text = e.name
              e.value = e.name
              if(e.children.length > 0){
                e.children.forEach(el => {
                  el.text = el.name
                  el.value = el.name
                  Reflect.deleteProperty(el, "children")
                })
              }
            })
            this.area = res.data.data
          })
        }
        if(item.type == 'choose'){
          item.columns = []
          apiData(item.dicQuery,item.dicUrl,item.dicMethod).then(res => {
            if(item.label == '审核状态'){
              this.zt = res.data.data
            }
            item.columns = res.data.data
            // res.data.data.forEach(e => {
            //   item.columns.push(e.name)
            // })
          })
        }
      })
    },
    showAreaClick(){
      this.showArea = true;
    },
    showAreaClose(){
      this.showArea = false;
    },
    showtimeopen(index){
      this.index = index
      this.showtime = true;
    },
    showtimeclose(){
      this.showtime = false;
    },
    //行政区划选择
    onFinish({ selectedOptions }) {
      this.showArea = false;
      this.list.forEach(item => {
        if(item.type == 'area'){
          this.options[item.prop] = selectedOptions.map((option) => option.text).join('/');
        }
      })
    },
    //下拉列表显示
    showListopen(item,index){
      this.index = index
      this.list.forEach(e => {
        if(e.prop == item.prop){
          e.show = true
        }
      })
    },
    //下拉列表关闭
    showListcancle(item){
      this.list.forEach(e => {
        if(e.prop == item.prop){
          e.show = false
        }
      })
    },
    //下拉值确定
    showListvalue(value,index){
      if(this.list[this.index].type == 'startTimeRange' || this.list[this.index].type == 'endTimeRange'){
        var date = value;
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        value = date.getFullYear() + seperator1 + month + seperator1 + strDate 
      }
      let prop = this.list[this.index].prop
      this.list[this.index].show = false
      this.showtime = false
      this.options[prop] = value.name
    },

    //搜索
    search(){
      let datetimeRange = []

      this.list.forEach(item => {

        if(item.type == 'startTimeRange'){
          if(this.options[item.prop]){
            datetimeRange.push(this.options[item.prop])
          }
        }
        else if(item.type == 'endTimeRange'){
          if(this.options[item.prop]){
            if(datetimeRange.length == 1){
              datetimeRange.push(this.options[item.prop])
              this.query[item.props] = datetimeRange
            }else{
              Toast.fail('请选择开始时间！');
            }
          }else{
            if(datetimeRange.length == 1){
              Toast.fail('请选择结束时间！');
            }
          }
        }
        else if(item.type == 'choose'){
          if(item.props)
        }
        else{
          this.query[item.prop] = this.options[item.prop]
        }
      })

      if(this.query.hasOwnProperty( "zhuangt" )){
        if(this.query.zhuangt){
          this.zt.forEach(item => {
            if(item.name == this.options.zhuangt){
              this.query.zhuangt = item.value
            }
          })
        }
      }
      this.$emit('refreshChange',this.query)
    },
    //清空
    reset(){
      this.query = {}
      this.options = {}
      this.$emit('refreshChange',this.query)
    },
  }
}
</script>
