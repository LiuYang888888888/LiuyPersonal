<template>
  <van-form @submit="onSubmit">
    <div v-for="(item,index) in list" :key="index">
      <div  v-if="item.type == 'input'">
        <van-field
          v-if="!item.hide"
          :readonly="readonly"
          v-model="options[item.prop]"
          :label="item.label"
          :placeholder="item.label"
          :rules="[{ required: true, message: '请填写'+item.label }]"
        >
          <template slot="button" v-if="item.append">{{ item.append }}</template>
        </van-field>
      </div>

      <div v-if="item.type == 'text'" class="wenben">{{ item.label}}</div>
      <van-field
        v-if="item.type == 'textarea' && !item.hide"
        :readonly="readonly"
        rows="3"
        autosize
        v-model="options[item.prop]"
        type="textarea"
        :label="item.label"
        :placeholder="item.label"
        show-word-limit
      />

      <van-field
        v-if="item.type == 'area'"
        is-link
        :readonly="readonly"
        v-model="options[item.prop]"
        :label="item.label"
        :placeholder="item.label"
        @click="showAreaClick"
      />
      <van-popup v-model="showArea" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择行政区划"
          :options="area"
          @close="showAreaClose"
          @finish="onFinish"
        />
      </van-popup>

      <van-field
        v-if="item.type == 'choose'"
        readonly
        is-link
        v-model="options[item.prop]"
        :label="item.label"
        :placeholder="item.label"
        @click="showListopen(item,index)"
      />
      <van-popup v-model="item.show" position="bottom">
        <van-picker
          show-toolbar
          :columns="item.columns"
          value-key="name"
          @confirm="showListvalue"
          @cancel="showListcancle(item)"
        />
      </van-popup>


      <van-field
        v-if="item.type == 'checkbox'"
        readonly
        is-link
        v-model="options[item.prop]"
        :label="item.label"
        :placeholder="item.label"
        @click="showListopen(item,index)"
      />

      <van-popup v-model="item.show" position="bottom" v-if="item.type == 'checkbox'">
        <div class="van-picker__toolbar">
          <button type="button" class="van-picker__cancel" @click="showListcancle(item)">
            取消
          </button>
          <div class="van-ellipsis van-picker__title">{{ item.label }}</div>
          <button type="button" class="van-picker__confirm" @click="showListvalue">
            确认
          </button>
        </div>
        <div class="multiplePicker-content">
          <van-checkbox-group
            ref="checkboxGroup"
            v-model="checkboxValue"
            @change="change"
          >
            <van-cell-group>
              <van-cell
                v-for="(item, index) in item.columns"
                :key="index"
                :title="item.name"
                clickable
                @click="toggle(index)"
              >
                <template #right-icon>
                  <van-checkbox
                    ref="checkboxes"
                    shape="square"
                    :name="item.value"
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </van-popup>
    </div>

    <div style="width:100%;display: flex;justify-content: space-around;margin-top:20px;margin-bottom: 40px;">
      <van-button round block type="danger" native-type="submit" style="width: 40%;">提交</van-button>
      <van-button round block type="default" @click="close" style="width: 40%;">关闭</van-button>
    </div>

  </van-form>
</template>

<script>
import { Dialog } from 'vant';
import {
  apiData
} from "@/api/outSystem/agency";

export default {
  data() {
    return {
      cascaderValue:'',
      showArea:false,
      showdate:false,
      area:[],
      index:0,
      readonly:false,
      disabled:false,
      currentDate:new Date(),
      checkboxValue: [],
      uploadImgList:[],
    };
  },
  props: {
    options:{
      type: Object,
      default: () => {
        return {}
      }
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    },
    id:{
      type: String,
      default: ''
    }
  },
  watch: {
    options: {
      handler(newVal, oldVal) {
        this.options = newVal;
        newVal && this.load(); 
      },
    },
  },
  created(){
    this.$nextTick(function(){ 
      this.load()
    });
  },
  methods: {
    load(){
      if(this.type == 'view'){
        this.readonly = true
        this.disabled = true
      }
      this.list.forEach(item => {
        if(item.type == 'choose'){
          if(item.dicUrl){
            apiData(item.dicQuery,item.dicUrl,item.dicMethod).then(res => {
              item.columns = res.data.data
              if(item.props.value == 'value'){
                if(this.options[item.prop]){
                  item.columns.forEach(e => {
                    if(e.value == this.options[item.prop]){
                      this.options[item.prop] = e.name
                    }
                  })
                }
              }
            })
          }else{
            if(item.props.value == 'value'){
              if(this.options[item.prop]){
                item.columns.forEach(e => {
                  if(e.value == this.options[item.prop]){
                    this.options[item.prop] = e.name
                  }
                })
              }
            }
          }
        }
        if(item.type == 'checkbox'){
          item.columns = []
          apiData(item.dicQuery,item.dicUrl,item.dicMethod).then(res => {
            res.data.data.forEach(e => {
              let option = {}
              option.name = e.name
              option.value = e.name
              item.columns.push(option)
            })
          })
        }
        
      })
    },
    showAreaClick(){
      if(this.type != 'view'){
        this.showArea = true;
      }
    },
    showAreaClose(){
      this.showArea = false;
    },
    showDate(index){
      this.index = index
      if(this.type == 'view'){
        this.showdate = false
      }else{
        this.showdate = true
      }
    },
    showDatecancle(){
      this.showdate = false
    },
   
    //下拉列表显示
    showListopen(item,index){
      if(this.type != 'view'){
        this.index = index
        this.list.forEach(e => {
          if(e.prop == item.prop){
            e.show = true
          }
        })
      }
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
    showListvalue(value){
      if(this.list[this.index].type == 'date'){
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
      this.showdate = false
      if(this.list[this.index].type == 'checkbox'){
        if(this.checkboxValue.length > 0){
          this.options[prop] = this.checkboxValue.join(',')
        }
      }else if(this.list[this.index].type == 'choose'){
        this.options[prop] = value.name
      }else{
        this.options[prop] = value
      }
    },
    //新增
    onSubmit() {
      Dialog.confirm({
        title: '提交',
        message: '确认提交？',
      })
        .then(() => {
          this.list.forEach(item => {
            if(item.type == 'choose'){
              if(item.props.value == 'value'){
                if(this.options[item.prop]){
                  item.columns.forEach(e => {
                    if(e.name == this.options[item.prop]){
                      this.options[item.prop] = e.value
                    }
                  })
                }
              }
            }
          })

          if(this.type == 'add'){
            this.$emit('addData',this.options)
          }

          if(this.type == 'edit'){
            this.options.id = this.id
            this.$emit('editData',this.options)
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    
    //点击附件下载
    showUpload(item){
      if(item.listType == 'text'){
        //创建a标签
        var a = document.createElement('a');
        var url = this.options[item.prop]
        a.href = url;
        a.download = this.options[item.prop];
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    //关闭
    close(){
      this.$emit('close')
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
  }
}

</script>

<style scoped>
.tip{
  font-size: 14px;
  color: #af2c30;
}
.wenben{
  font-size: 1rem;
  font-weight: 600;
  height: 3rem;
  line-height: 3rem;
  margin-left: .5rem;
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
