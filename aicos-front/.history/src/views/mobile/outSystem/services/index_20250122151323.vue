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
            <van-cell :border="false" :title="item.fuwmc" :label="item.shenhly" :value="item.zt"/>
            <template #right>
              <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="编辑"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.editBtn" @click="comFormMagUpdate(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="提交"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.tijiaoBtn" @click="comFormTijiao(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="审核"  v-if="item.zhuangt == 2 && permissionList.shenheBtn" @click="comFormShenhe(item)"/>
              <van-button square type="danger" text="删除"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.delBtn" @click="comFormMagDel(item)"/>
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
import {
  getListDataPro,
  delListDataPro,
  submitListDataPro,
  apiData
} from "@/api/outSystem/agency";

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
          label: '服务名称',
          prop: 'fuwmc',
          search:true,
        },
        // {
        //   type: 'choose',
        //   label: '服务领域',
        //   dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
        //   dicMethod: 'post',
        //   dicQuery: {
        //     code: 'fuwulingyu'
        //   },
        //   prop: 'fuwly',
        //   search: false,
        //   show:false,
        //   columns:[],
        // },
        // {
        //   type: 'area',
        //   label: '行政区划',
        //   dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
        //   dicMethod: 'post',
        //   prop: 'xingzqh',
        //   dicQuery: {},
        //   search:false,
        // },
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
          props:{}
        },
        // {
        //   type: 'startTimeRange',
        //   label: '开始日期',
        //   prop: 'shijdStart',
        //   props:'shijd',
        //   search: false,
        //   show:false,
        // },
        // {
        //   type: 'endTimeRange',
        //   label: '结束日期',
        //   prop: 'shijdEnd',
        //   props:'shijd',
        //   search: false,
        //   show:false,
        // },
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
          this.permission[`outsys-services-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-services-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-services-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-services-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-services-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-services-shenhe`],
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
      getListDataPro(dataParam).then((res) => {
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
        path: "/mobile/serviceview",
        query: {
          id: "",
          type: "add",
        },
      });
    },
    //查看
    comFormMagView(item){
      this.$router.push({
        path: "/mobile/serviceview",
        query: {
          id: item.id,
          type: "view",
        },
      });
    },
    //编辑
    comFormMagUpdate(item){
      this.$router.push({
        path: "/mobile/serviceview",
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
          return delListDataPro(params);
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
          return submitListDataPro(params);
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
        path: "/mobile/serviceshenhe",
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
  margin: 0;
  padding: 0;
}
</style>
