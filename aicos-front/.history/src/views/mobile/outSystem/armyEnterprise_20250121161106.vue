<template>
  <div>
    <van-overlay :show="show" style="overflow-y: scroll;">
      <div class="armyEnter" v-if="armyFlag">
        <h1>成为军保优质企业说明</h1>
        <div class="armyEnterBox">
          <p>1．具有企（事）业法人资格，成立时间满3年（具有世界或者国内首创产品，国内市场无类似或可替代产品的企业除外）；</p>
          <p>
            2．物资类生产型、工程、服务供应商近3年加权平均净资产100万元以上，物资类销售型供应商近3年加权平均净资产3,000万元以上；（加权平均净资产近1年占50%、近2年占30%、近3年占20%。）</p>
          <p>3．注册产品类别应当符合营业执照经营范围；</p>
          <p> 4．遵守国家和军队有关法律法规及保密要求；</p>
          <p>5．能够为军队提供所需的物资、工程和服务，符合国家、军队、行业或企业质量、技术、安全和环境标准；</p>
          <p>6．具有依法缴纳税收、社会保障资金的良好记录，健全的财务会计制度，良好的财务状况和履行合同的能力； </p>
          <p>7．具备固定的生产经营、服务场地、设施设备和相应的质量保证体系；</p>
          <p>8．近3年内在生产经营活动中没有违法犯罪记录，没有受到军队采购和地方省级以上政府采购处罚的记录；</p>
          <p>9．工程类非外资（含港澳台）独资或入股，其他类非外资独资或控股；</p>
          <p>10．法律、法规规定的其他条件。</p>
          <p>其他入库要求</p>
          <p>1.不接受2家以上供应商组成的联合体，以1家的名义申请加入军队供应商库。</p>
          <p>
            2.2家或2家以上单位负责人为同一人或者存在直接控股、管理关系的不同供应商，且提供的产品类别有交叉的，只能有1家申请加入军队供应商库。</p>
        </div>
        <div class="armyEnterBtn">
          <el-button @click="showList()">符合以上要求</el-button>
        </div>
      </div>
    </van-overlay>

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
            <van-cell :border="false" :title="item.danwmc" :label="item.shenhly" :value="item.zt"/>
            <template #right>
              <van-button square type="danger" text="查看"  v-if="permissionList.viewBtn" @click="comFormMagView(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="编辑"   v-if="permissionList.updateBtn && (item.zhuangt == '1' || item.zhuangt == '3')" @click="comFormMagUpdate(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="提交"  v-if="permissionList.submit && item.zhuangt === '1'" @click="comFormTijiao(item)" style="border-right: 1px solid #fff;"/>
              <van-button square type="danger" text="审核"  v-if="permissionList.examineBtn && item.zhuangt === '2'" @click="comFormShenhe(item)"/>
              <van-button square type="danger" text="删除"  v-if="permissionList.delBtn" @click="comFormMagDel(item)"/>
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
  apiData
} from "@/api/outSystem/agency";
import {
  remove,
  getEnterList,
  submit,
} from "@/api/armyEnterPrise/common";

export default {
  data () {
    return {
      show:true,
      armyFlag:true,

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
          label: '单位名称',
          prop: 'danwmc',
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
          this.permission["sys-user-armyAdd"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["sys-user-armyView"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`sys-user-armyUpdate`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`sys-user-armyDel`],
          false
        ),
        //审核
        examineBtn: this.vaildData(
          this.permission[`sys-user-armyExamine`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`sys-user-armySubmit`],
          false
        ),
      };
    },
  },
  created () {
    this.load()
  },
  methods: {
    showList() {
      this.armyFlag = false;
      this.show = false
    },
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
      getEnterList(dataParam).then((res) => {
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
        path: "/mobile/armyEnterpriseview",
        query: {
          id: "",
          type: "add",
        },
      });
    },
    //查看
    comFormMagView(item){
      this.$router.push({
        path: "/mobile/armyEnterpriseview",
        query: {
          id: item.id,
          type: "view",
        },
      });
    },
    //编辑
    comFormMagUpdate(item){
      this.$router.push({
        path: "/mobile/armyEnterpriseview",
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
    //审核
    comFormShenhe(item){
      this.$router.push({
        path: "/mobile/armyEnterprisesh",
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

.armyEnter {
  background: #fff;
  padding: 50px !important;
  box-sizing: border-box;
}

.armyEnter h1 {
  text-align: center;
  margin: 0px;
  margin-bottom: 30px;
}

.armyEnter .armyEnterBox {
  font-size: 16px;
  line-height: 28px;
  overflow: auto;
}

.armyEnter .armyEnterBtn {
  text-align: center;
  margin-top: 50px;
}
</style>
