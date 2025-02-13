<template>
  <div>
    <van-search v-model="options.jigmc" placeholder="请输入机构名称" />
    <van-search v-model="options.xingzqhdm" placeholder="请选择行政区划" />
    <van-search v-model="options.zhuangt" placeholder="请选择审核状态" />
    <div style="width: 100%;text-align: center;margin-bottom: 10px;margin-top: 20px;">
      <van-button color="#af2c30" size="small">搜索</van-button>
      <van-button plain size="small">清空</van-button>
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
          <van-cell :border="false" :title="item.jigmc"/>
          <template #right>
            <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)"/>
            <van-button square type="danger" text="编辑"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.editBtn" @click="comFormMagUpdate(item)"/>
            <van-button square type="danger" text="提交"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.tijiaoBtn" @click="comFormTijiao(item)"/>
            <van-button square type="danger" text="删除"  v-if="(item.zhuangt == 1 || item.zhuangt == 3) && permissionList.delBtn" @click="comFormMagDel(item)"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {baseURL} from "@/api/common";
import {
  getListData,
  delListData,
  auditListData,
  auditNoListData,
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

    }
    //删除
    comFormMagDel(item){
      
    }
  }
}
</script>
