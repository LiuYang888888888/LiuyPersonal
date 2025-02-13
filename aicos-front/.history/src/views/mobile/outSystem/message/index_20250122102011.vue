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
            <van-cell :border="false" :title="item.liuybt"/>
            <template #right>
              <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="回复"  v-if="permissionList.huifuBtn && !item.huifyh && !item.huifnr " @click="comFormHuifu(item)" style="border-right: 1px solid #fff;"/>
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
import { 
  getListData,
} from "@/api/outSystem/message";

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
          label: '问题标题',
          prop: 'liuybt',
          search:true,
        },
        {
          type: 'choose',
          label: '问题分类',
          dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
          dicMethod: 'post',
          dicQuery: {
            code: 'liuyanfl'
          },
          prop: 'liuyfl',
          search: true,
          show:false,
          columns:[],
          props: {
            label: 'name',
            value: 'value'
          },
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
          this.permission[`outsys-zxly-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-zxly-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-zxly-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-zxly-del`],
          false
        ),
        huifuBtn: this.vaildData(
          this.permission[`outsys-zxly-tijiao`],
          false
        ),
      };
    },
  },
  created () {
    
  },
  methods: {
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

        if(dataRes.fieldList.length < 10){
          this.finished = true
        }
      });
    },
    //新增
    comFormMagAdd(){
      this.$router.push({
        path: "/mobile/messageview",
        query: {
          id: "",
          type: "add",
        },
      });
    },
    //查看
    comFormMagView(item){
      this.$router.push({
        path: "/mobile/messageview",
        query: {
          id: item.id,
          type: "view",
        },
      });
    },
    //回复
    comFormHuifu(item){
      this.$router.push({
        path: "/mobile/messageview",
        query: {
          id: item.id,
          type: "huifu",
        },
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
