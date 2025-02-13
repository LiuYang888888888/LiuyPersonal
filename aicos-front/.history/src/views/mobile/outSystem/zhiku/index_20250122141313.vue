<template>
  <div>
    <Header />

    <Search :list="listSearch" @refreshChange="refreshChange" ref='search'/>

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
        <van-cell-group inset>
          <van-swipe-cell v-for="item in list" :key="item" >
            <van-cell :border="false" :title="item.xuqmc" :label="item.shenhly" :value="item.zt"/>
            <template #right>
              <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="编辑"  v-if="permissionList.updateBtn && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormMagUpdate(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="下载"  v-if="permissionList.submit && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormTijiao(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="删除"  v-if="permissionList.delBtn && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormMagDel(item)"/>
            </template>
          </van-swipe-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Search from '@/views/mobile/outSystem/components/search'
import { mapGetters } from "vuex";
import { Dialog } from 'vant';
import { Toast } from 'vant';
import {delListData, getListData} from "@/api/outSystem/zhiku";
import { apiData } from "@/api/outSystem/agency";

export default {
  data () {
    return {
      query:{},
      zt:[],

      list: [],
      loading: false,
      finished: false,
      refreshing: false,

      page: {
        pageSize: 10,
        currentPage: 0,
        total: 0,
      },

      listSearch:[
        {
          type: 'input',
          label: '需求名称',
          prop: 'xuqmc',
          search:true,
        },
        {
          type: 'choose',
          label: '需求类型',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'xqxx_xqlx'
          },
          prop: 'xuqlx',
          search: false,
          show:false,
          columns:[],
        },
        {
          type: 'area',
          label: '行政区划',
          dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          dicMethod: 'post',
          prop: 'xingzqhdm',
          dicQuery: {},
          search:false,
        },
        {
          type: 'startTimeRange',
          label: '开始日期',
          prop: 'shijdStart',
          props:'shijfw',
          search: false,
          show:false,
        },
        {
          type: 'endTimeRange',
          label: '结束日期',
          prop: 'shijdEnd',
          props:'shijfw',
          search: false,
          show:false,
        },
        {
          type: 'choose',
          label: '审核状态',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'shenhezt'
          },
          prop: 'zhuangt',
          search: true,
          show:false,
          columns:[],
        },
      ]
    }
  },
  components: {
    Header,
    Search
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission["demand-user-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["demand-user-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`demand-user-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`demand-user-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`demand-user-submit`],
          false
        ),
        // 审核
        examineBtn: this.vaildData(
          this.permission[`demand-user-examineBtn`],
          false
        ),
      };
    },
  },
  created () {
    this.load()
  },
  methods: {
    load(){
      apiData({code: 'shenhezt'},'/aicos/api/aicos-system/baseDict/getDictItemListByDictCode','post').then(res => {
        this.zt = res.data.data
      })
    },
    refreshChange (query) {
      this.query = query
      this.page.currentPage = 0
      this.onLoad()
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.page.currentPage = 0

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
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
      
      if(this.page.currentPage == 1){
        this.list = []
      }
      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.loading = false;
        this.list = [...this.list,...dataRes.fieldList];
        this.list.forEach( e =>{
          this.zt.forEach(item => {
            if(item.value == e.zhuangt){
              e.zt = item.name
            }
          })
        })

        if(dataRes.fieldList.length < 10){
          this.finished = true
        }
      });
    },
    //新增
    comFormMagAdd(){
      this.$router.push({
        path: "/mobile/demandview",
        query: {
          id: "",
          type: "add",
        },
      });
    },
    //查看
    comFormMagView(item){
      this.$router.push({
        path: "/mobile/demandview",
        query: {
          id: item.id,
          type: "view",
        },
      });
    },
    //编辑
    comFormMagUpdate(item){
      this.$router.push({
        path: "/mobile/demandview",
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
  }
}
</script>

<style>

html,body,#app{
  height: 100%;
  background-color: #F7F7F7;
  margin: 0;
  padding: 0;
}
</style>
