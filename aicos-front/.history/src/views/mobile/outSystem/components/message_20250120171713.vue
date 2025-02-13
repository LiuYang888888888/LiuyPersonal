<template>
  <van-form @submit="onSubmit">
    <div v-for="(item,index) in list" :key="index">
      <van-field
        v-if="item.type == 'input'"
        :readonly="readonly"
        v-model="options[item.prop]"
        :label="item.label"
        :placeholder="item.label"
        :rules="[{ required: true, message: '请填写'+item.label }]"
      >
        <template slot="button" v-if="item.append">{{ item.append }}</template>
      </van-field>

      <van-field
        v-if="item.type == 'textarea'"
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

      <van-popup v-model="item.show" position="bottom" class="">
        <div class="van-picker__toolbar">
          <button type="button" class="van-picker__cancel" @click="cancel">
            取消
          </button>
          <div class="van-ellipsis van-picker__title">{{ item.label }}</div>
          <button type="button" class="van-picker__confirm" @click="onConfirm">
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
                    :name="item[option.value]"
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </van-popup>


      <van-field
        v-if="item.type == 'date'"
        readonly
        is-link
        v-model="options[item.prop]"
        :label="item.label"
        :placeholder="item.label"
        @click="showDate(index)"
      />
      <van-popup v-model="showdate" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          @confirm="showListvalue"
          @cancel="showDatecancle"
        />
      </van-popup>

      <van-field :label="item.label" :placeholder="item.label" v-if="item.type == 'upload'">
        <template #input>
          <van-uploader :disabled="disabled"  v-model="options[item.prop]" :multiple="multiple" :max-count="item.limit" :max-size="item.fileSize * 1024" :after-read="afterRead" :accept="item.accept"/>
          <div class="tip">{{ item.tip }}</div>
        </template>
      </van-field>
    </div>

    <div style="width:100%;display: flex;justify-content: space-around;margin-top:20px;margin-bottom: 40px;">
      <van-button round block type="danger" native-type="submit" v-if="type != 'view'" style="width: 40%;">保存</van-button>
      <van-button round block type="default" @click="close" style="width: 40%;">关闭</van-button>
    </div>

  </van-form>
</template>

<script>
import { Dialog } from 'vant';
import {
  apiData,uploadImg
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
      showPickerCheckbox:false
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
    }
  },
  created () {
    this.load()
  },
  methods: {
    load(){
      if(this.type == 'view'){
        this.readonly = true
        this.disabled = true
      }
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
            res.data.data.forEach(e => {
              item.columns.push(e.name)
            })
          })
        }
        if(item.type == 'checkbox'){
          item.columns = []
          apiData(item.dicQuery,item.dicUrl,item.dicMethod).then(res => {
            let option = {}
            res.data.data.forEach(e => {
              option.name = e.name
              option.value = e.name
              item.columns.push(option)
            })
          })
          console.log(item.columns)
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
      this.options[prop] = value
    },
    //新增
    onSubmit() {
      Dialog.confirm({
        title: '保存',
        message: '确认保存？',
      })
        .then(() => {
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
    //上传
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      let forms = new FormData();
      forms.append("file", file.file); //获取上传图片信息
      console.log(forms.file);
      // uploadImg(forms).then(res =>{
      //   console.log(res)
      // })
    },
    //关闭
    close(){
      this.$emit('close')
    },
    getData(val) {
      const res = this.columnsData.filter(item => {
        return val.indexOf(item[this.option.value]) > -1;
      });
      return res;
    },
    onConfirm() {
      this.resultValue = this.checkboxValue;
      this.show = !this.show;
      this.$emit('confirm', this.resultValue, this.getData(this.resultValue));
    },
    change(val) {
      this.$emit('change', val, this.getData(this.resultValue));
    },
    cancel() {
      this.show = !this.show;
      this.$emit('cancel', this.resultValue);
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    showPopup(disabled) {
      this.columnsData = JSON.parse(JSON.stringify(this.columns));
      this.checkboxValue = JSON.parse(JSON.stringify(this.selectValue));
      this.resultValue = JSON.parse(JSON.stringify(this.selectValue));
      if (disabled !== undefined && disabled !== false) {
        return false;
      } else {
        this.show = !this.show;
      }
    }
  }
}

</script>

<style scoped>
.tip{
  font-size: 14px;
  color: #af2c30;
}
</style>
