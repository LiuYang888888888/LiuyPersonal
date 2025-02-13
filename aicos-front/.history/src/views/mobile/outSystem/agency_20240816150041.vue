<template>
  <div>
    <Header />

    <Search :list="listSearch" :options="options" @refreshChange="refreshChange" ref='search'/>
    <!-- <van-search v-model="options.jigmc" placeholder="请输入机构名称" />

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
    </van-popup> -->

    <!-- <div style="width: 100%;text-align: center;margin-bottom: 10px;margin-top: 20px;">
      <van-button color="#af2c30" size="small" @click="search">搜索</van-button>
      <van-button plain size="small" @click="reset">清空</van-button>
    </div> -->

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
            <van-cell :border="false" :title="item.jigmc" :label="item.shenhly" :value="item.zt"/>
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
  getListData,
  delListData,
  submitListData,
} from "@/api/outSystem/agency";

export default {
  data () {
    return {
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

      listSearch:[
        {
          type: 'input',
          label: '机构名称',
          prop: 'jigmc',
          search:true,
        },
        {
          type: 'area',
          label: '行政区划',
          dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          dicMethod: 'post',
          prop: 'xingzqhdm',
          dicQuery: {},
          search:true,
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
    load(){
      this.$refs.search
    },
    refreshChange (query) {
      this.query = query
      this.page.currentPage = 0
      this.onLoad()
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
          e.xingzqhdm = e.xingzqhdm.replace(/,/g,"/")
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
  margin: 0;
  padding: 0;
}
</style>
