<template>
  <div>
    <van-search v-model="options.jigmc" placeholder="请输入机构名称" />

    <van-search v-model="options.xingzqhdm" placeholder="请选择行政区划"  readonly @click="showAreaClick"/>
    <van-popup v-model="showArea" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择行政区划"
        :options="area"
        @close="showAreaClose"
        @finish="onFinish"
      />
    </van-popup>

    <van-search v-model="options.zhuangt" placeholder="请选择审核状态" readonly @click="showListopen"/>
    <van-popup v-model="showList" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="showListvalue"
        @cancel="showListcancle"
      />
    </van-popup>

    <div style="width: 100%;text-align: center;margin-bottom: 10px;margin-top: 20px;">
      <van-button color="#af2c30" size="small" @click="search">搜索</van-button>
      <van-button plain size="small" @click="reset">清空</van-button>
    </div>

    <div style="text-align: left;margin-bottom: 20px;border-bottom: 1px solid #af2c30;padding: 10px;">
      <van-button color="#af2c30" size="small" @click="comFormMagAdd">新增</van-button>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell v-for="item in list" :key="item" >
          <van-cell :border="false" :title="item.jigmc" :label="item.shenhly" :value="item."/>
          <template #right>
            <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
            <van-button square type="danger" text="编辑"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.editBtn" @click="comFormMagUpdate(item)" style="border-right: 1px solid #fff;"/>
            <van-button square type="danger" text="提交"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.tijiaoBtn" @click="comFormTijiao(item)" style="border-right: 1px solid #fff;"/>
            <van-button square type="danger" text="审核"  v-if="item.zhuangt == 2 && permissionList.shenheBtn" @click="comFormShenhe(item)"/>
            <van-button square type="danger" text="删除"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.delBtn" @click="comFormMagDel(item)"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Dialog } from 'vant';
import { Toast } from 'vant';
import {
  getListData,
  delListData,
  submitListData,
  apiData
} from "@/api/outSystem/agency";

export default {
  data () {
    return {
      showArea:false,
      showList:false,
      area:[],
      columns:[],
      zt:[],

      query:{},
      options:{},

      list: [],
      loading: false,
      finished: false,
      refreshing: false,

      page: {
        pageSize: 10,
        currentPage: 0,
        total: 0,
      },
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-agency-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-agency-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-agency-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-agency-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-agency-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-agency-shenhe`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-agency-export"],
          false
        ),
      };
    },
  },
  created () {
    this.load()
  },
  methods: {
    //下拉列表显示
    showListopen(){
      this.showList = true
    },
    showListcancle(){
      this.showList = false
    },
    //下拉值确定
    showListvalue(value){
      this.options.zhuangt = value
      this.showList = false
    },
    //行政区划
    load(){
      //行政区划
      apiData({},'/aicos/api/aicos-form/baseForm/getFullRegionTree','post').then(res => {
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

      //审核状态
      this.columns = []
      apiData({code: 'shenhezt'},'/aicos/api/aicos-system/baseDict/getDictItemListByDictCode','post').then(res => {
        this.zt = res.data.data
        res.data.data.forEach(e => {
          this.columns.push(e.name)
        })
      })
    },
    showAreaClick(){
      this.showArea = true;
    },
    showAreaClose(){
      this.showArea = false;
    },
    //行政区划选择
    onFinish({ selectedOptions }) {
      this.showArea = false;
      this.options.xingzqhdm = selectedOptions.map((option) => option.text).join('/');
    },
    //搜索
    search(){
      if(this.options.zhuangt){
        this.zt.forEach(item => {
          if(item.name == this.options.zhuangt){
            this.query = {
              jigmc: this.options.jigmc,
              xingzqhdm: this.options.xingzqhdm,
              zhuangt: item.value,
            }
          }
        })
      }else{
        this.query = {
          jigmc: this.options.jigmc,
          xingzqhdm: this.options.xingzqhdm,
          zhuangt: this.options.zhuangt,
        }
      }
      this.refreshChange()
    },
    //清空
    reset(){
      this.query = {}
      this.options = {
        jigmc: '',
        xingzqhdm: '',
        zhuangt: '',
      }
      this.refreshChange()
    },
    refreshChange () {
      const dataParam = {
        reqPage: {
          current: this.page.currentPage,
          size: this.page.pageSize,
        },
        searchParam: {
          ...this.query,
        },
      };
      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.loading = false;
        this.list = dataRes.fieldList;

        if(dataRes.fieldList.length > 10){
          dataRes.fieldList.forEach( e =>{
            e.xingzqhdm = e.xingzqhdm.replace(/,/g,"/")
          })
        }else{
          this.finished = true
        }
      });
    },
    onLoad () {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.page.currentPage++
      this.loading = true;

      const dataParam = {
        reqPage: {
          current: this.page.currentPage,
          size: this.page.pageSize,
        },
        searchParam: {
          ...this.query,
        },
      };
      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.loading = false;
        this.list = dataRes.fieldList;

        if(dataRes.fieldList.length > 10){
          dataRes.fieldList.forEach( e =>{
            e.xingzqhdm = e.xingzqhdm.replace(/,/g,"/")
          })
        }else{
          this.finished = true
        }
      });
    },
    //新增
    comFormMagAdd(){
      this.$router.push({
        path: "/mobile/view",
        query: {
          id: "",
          type: "add",
        },
      });
    },
    //查看
    comFormMagView(item){
      this.$router.push({
        path: "/mobile/view",
        query: {
          id: item.id,
          type: "view",
        },
      });
    },
    //编辑
    comFormMagUpdate(item){
      this.$router.push({
        path: "/mobile/view",
        query: {
          id: item.id,
          type: "edit",
        },
      });
    },
    //删除
    comFormMagDel(item){
      Dialog.confirm({
        title: '删除',
        message: '确定删除?',
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id",item.id);
          return delListData(params);
        })
        .then(() => {
          Toast.success('删除成功！');
          this.refreshChange()
        })
        .catch(() => {
          // on cancel
        });
    },
    //提交
    comFormTijiao(item){
      Dialog.confirm({
        title: '提交',
        message: '确认提交？',
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id",item.id);
          return submitListData(params);
        })
        .then(() => {
          Toast.success('提交成功！');
          this.refreshChange()
        })
        .catch(() => {
          // on cancel
        });
    },
    //审核
    comFormShenhe(item){
      this.$router.push({
        path: "/mobile/shenhe",
        query: {
          id: item.id,
        },
      });
    }
  }
}
</script>

<style>

html,body,#app{
  height: 100%;
  background-color: #F7F7F7;
}
</style>
