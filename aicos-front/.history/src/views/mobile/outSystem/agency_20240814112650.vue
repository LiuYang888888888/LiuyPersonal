<template>
  <div>
    <van-search v-model="options.jigmc" placeholder="请输入机构名称" />
    <van-search v-model="options.xingzqhdm" placeholder="请选择行政区划" />
    <van-search v-model="options.zhuangt" placeholder="请选择审核状态" />
    <div style="width: 100%;text-align: center;">
      <van-button color="#af2c30">搜索</van-button>
      <van-button plain>清空</van-button>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {baseURL} from "@/api/common";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  submitListData,
  auditListData,
  auditNoListData,
  getInfo,
  exportExcel
} from "@/api/outSystem/agency";

export default {
  data () {
    return {
      options:{},

      list: [],
      loading: false,
      finished: false,
      refreshing: false,

      page: {
        pageSize: 10,
        currentPage: 1,
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
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  created () {
    
  },
  methods: {
    onLoad () {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
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
        this.finished = true;
        // const dataRes = res.data.data;
        // this.page.total = dataRes.rspPage.totalItems;
        // this.page.pageSize = dataRes.rspPage.size;
        // this.page.currentPage = dataRes.rspPage.current;
        // dataRes.fieldList.forEach( e =>{
        //   e.xingzqhdm = e.xingzqhdm.replace(/,/g,"/")
        // })
        // this.list = dataRes.fieldList;
        // this.loading = false;
        
      });
    },
  }
}
</script>
