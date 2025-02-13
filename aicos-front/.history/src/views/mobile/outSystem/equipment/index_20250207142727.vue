<template>
  <div>
    <Header />

    <Search :list="listSearch" @refreshChange="refreshChange" ref='search'/>

    <van-tabs v-model="activeName" @change="clicktabs">
      <!--我的-->
      <van-tab title="我的" name="ALL">
        <div style="text-align: left;margin-bottom: 20px;border-bottom: 1px solid #af2c30;padding: 10px;">
          <van-button color="#af2c30" size="small" @click="comFormMagAdd" v-if="permissionList.addBtn">新增</van-button>
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
                <van-cell :border="false" :title="item.shebmc" :label="item.shenhly" :value="item.zt"/>
                <template #right>
                  <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
                  <van-button square type="danger" text="编辑"  v-if="permissionList.updateBtn && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormMagUpdate(item)" style="border-right: 1px solid #fff;"/>
                  <van-button square type="danger" text="提交"  v-if="permissionList.submit && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormTijiao(item)" style="border-right: 1px solid #fff;"/>
                  <van-button square type="danger" text="共享"  v-if="permissionList.shareBtn && item.zhuangt == '4'" @click="comFormShare(item)" style="border-right: 1px solid #fff;"/>
                  <van-button square type="danger" text="审核"  v-if="permissionList.examineBtn && item.zhuangt==='2'" @click="comFormShenhe(item)" style="border-right: 1px solid #fff;"/>
                  <van-button square type="danger" text="删除"  v-if="permissionList.delBtn && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormMagDel(item)"/>
                </template>
              </van-swipe-cell>
            </van-cell-group>
          </van-list>
        </van-pull-refresh>
      </van-tab>

      <!--共享-->
      <van-tab title="共享" name="Done">
        <div style="text-align: left;margin-bottom: 20px;border-bottom: 1px solid #af2c30;padding: 10px;">
         
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
                <van-cell :border="false" :title="item.shebmc" :label="item.shenhly" :value="item.zt"/>
                <template #right>
                  <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
                </template>
              </van-swipe-cell>
            </van-cell-group>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>



  </div>
</template>

<script>
import Header from '@/views/mobile/outSystem/components/header'
import Search from '@/views/mobile/outSystem/components/search'
import { mapGetters } from "vuex";
import { Dialog } from 'vant';
import { Toast } from 'vant';
import {remove, getList, submit} from "@/api/outSystem/equipment";
import {
  apiData
} from "@/api/outSystem/agency";

export default {
  data () {
    return {
      activeName:'ALL',

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
          label: '设备名称',
          prop: 'shebmc',
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
          props:{
            label: 'name',
            value: 'value',
          }
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
          this.permission["system-equipment-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["system-equipment-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`system-equipment-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`system-equipment-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`system-equipment-submit`],
          false
        ),
        //   审核
        examineBtn: this.vaildData(
          this.permission[`system-equipment-examineBtn`],
          false
        ),
        //共享
        shareBtn: this.vaildData(
          this.permission["system-equipment-share"],
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
    //切换标签
    clicktabs(){
      this.query = {}
      this.page.currentPage = 0
      this.onLoad()
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
      if(this.activeName == 'ALL')
      getList(dataParam).then((res) => {
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
        path: "/mobile/equipmentview",
        query: {
          id: "",
          type: "add",
        },
      });
    },
    //查看
    comFormMagView(item){
      this.$router.push({
        path: "/mobile/equipmentview",
        query: {
          id: item.id,
          type: "view",
        },
      });
    },
    //编辑
    comFormMagUpdate(item){
      this.$router.push({
        path: "/mobile/equipmentview",
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
          return remove(params);
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
          return submit(params);
        })
        .then(() => {
          Toast.success('提交成功！');
          this.refreshChange()
        })
        .catch(() => {
          // on cancel
        });
    },
    //共享
    comFormShare(item){
      this.$router.push({
        path: "/mobile/equipment/share",
        query: {
          id: item.id,
          type: "share",
        },
      });
    },
    //审核
    comFormShenhe(item){
      this.$router.push({
        path: "/mobile/equipmentsh",
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
