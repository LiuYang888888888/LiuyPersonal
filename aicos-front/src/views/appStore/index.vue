<template>
  <HuilanBasic class="app_store">
    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>

    <div class="app_store_main">
      <div
        class="app_store_li"
        v-for="item of listData"
        :key="item.id"
        :data="item"
      >
        <div class="avue-card__item">
          <div class="avue-card__body">
            <div class="avue-card__avatar">
              <i
                :class="item.appstoreIcon"
                :style="{ color: iconColors[Math.floor(Math.random() * 10)] }"
              ></i>
            </div>
            <div class="avue-card__detail">
              <div class="avue-card__title">{{ item.name }}</div>
              <div class="avue-card__info">{{ item.desc }}</div>
            </div>
          </div>
          <div class="app_store_type">
            <div v-if="item.isHot" class="app_store_hot"></div>
            <div v-if="item.isLatest" class="app_store_new"></div>
          </div>
          <div class="app_store_License">
            <span
              v-html="calcDate(item.licenseEndTime)"
              v-if="
                item.status == '1' &&
                permissionList.statusInBtn &&
                item.type == '0'
              "
              @click.stop="updateLicense(item)"
            ></span>
            <span
              v-else-if="
                item.status == '0' &&
                permissionList.statusInBtn &&
                item.type == '0'
              "
            >
              <span style="color: #f56c6c"
                ><i class="el-icon el-icon-warning-outline"></i>未开通</span
              >
            </span>
          </div>

          <div class="app_store_menu">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-view"
              @click="viewAppInfo(item)"
              >查看介绍
            </el-button>

            <el-button
              v-if="
                item.status == '0' &&
                permissionList.statusInBtn &&
                item.type == '0'
              "
              type="primary"
              size="mini"
              @click="insLicenseApp(item)"
              >授权开通
            </el-button>
            <el-button
              v-if="
                item.status == '1' &&
                permissionList.statusInBtn &&
                item.type == '0'
              "
              type="primary"
              size="mini"
              plain
              @click.stop="updateLicense(item)"
              >更新授权
            </el-button>

            <!-- <el-button
                type="primary"
                size="mini"
                @click="updateAiCOSLicense(item)"
                >更新AiCOS
              </el-button> -->

            <!-- <el-button
                v-if="((item.status=='0')&&(permissionList.statusInBtn) )"
                type="primary"
                size="mini"
                @click="insApp(item)"
                >立即开通
              </el-button> -->
            <!-- <el-button
                v-if="( (item.status=='1')&&(permissionList.statusUnBtn)&&(item.type=='0') )"
                type="warning"
                size="mini"
                plain
                @click="unsApp(item)"
                >卸载
              </el-button> -->
            <el-button
              type="primary"
              size="mini"
              plain
              :disabled="item.specUrl.length < 1"
              @click="toOpenNewWindow(item.specUrl)"
              >资料下载
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="avue-crud__pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :hide-on-single-page="true"
        :page-size="page.pageSize"
        :current-page="page.currentPage"
        :total="page.total"
        :page-sizes="page.pageSizes"
        @size-change="pageSizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>

    <LicenseModel
      :title="LicenseTitle"
      :isShow.sync="isShow"
      :paramData="lsData"
      @successFun="lsSuccessFun"
    ></LicenseModel>

    <!-- <HuilanDialog :title="viewTitle"
      append-to-body
      :visible.sync="viewTag"
      :fullscreen="false"
      width="660px"
      >
      <template>
        <avue-article :props="viewProps" :data="viewData"></avue-article>
      </template>
      <template v-slot:footer>
        <el-button icon="el-icon-close" size="small" @click="viewTag=false">关闭</el-button>
      </template>
    </HuilanDialog> -->

    <HuilanDialog
      :title="insTitle"
      append-to-body
      :visible.sync="insTag"
      :fullscreen="false"
      width="660px"
    >
      <avue-form ref="insFormRef" v-model="insFormObj" :option="insFormOption">
        <template slot-scope="scope" slot="roleIds">
          <div>
            <div
              class="el-select avue-select"
              v-if="insFormObj.roleIds.length > 0"
            >
              <span
                class="el-tag el-tag--info el-tag--small el-tag--light"
                v-for="(item, index) of insFormObj.roleIds"
                :key="item.id"
              >
                <span class="el-select__tags-text">{{ item.roleName }}</span>
                <i
                  class="el-tag__close el-icon-close"
                  @click="delSelectedRoles(item, index)"
                ></i>
              </span>
            </div>

            <el-link
              :underline="false"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="insRoleSelect"
            >
              选择角色
            </el-link>
          </div>
        </template>

        <template slot-scope="scope" slot="tipsText">
          <div>
            <el-link :underline="false" type="warning" icon="el-icon-warning">
              应用详细配置请在“系统设置”页面编辑和修改！
            </el-link>
          </div>
        </template>
      </avue-form>
      <template v-slot:footer>
        <el-button
          icon="el-icon-check"
          size="small"
          type="primary"
          @click="insAppSave"
          >确定</el-button
        >
        <el-button icon="el-icon-close" size="small" @click="insAppClose"
          >关闭</el-button
        >
      </template>
    </HuilanDialog>

    <HuilanDialog
      :title="insRoleTitle"
      append-to-body
      :visible.sync="insRoleTag"
      :fullscreen="false"
      width="900px"
    >
      <SelectRoles ref="insRoleSelectRef" v-model="insRoleSelectObj" />

      <template v-slot:footer>
        <el-button
          icon="el-icon-check"
          size="small"
          type="primary"
          @click="insRoleSave"
          >确定</el-button
        >
        <el-button icon="el-icon-close" size="small" @click="insRoleClose"
          >关闭</el-button
        >
      </template>
    </HuilanDialog>

    <transition name="viewSlide">
      <div v-if="viewTag" class="app_store_view">
        <el-scrollbar>
          <div class="app_store_detail" :data="viewData">
            <div
              class="app_store_detail_back"
              @click="viewAppInfoClose"
              title="返回"
            >
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="app_store_detail_header">
              <div class="app_store_detail_header_icon">
                <i
                  :class="viewData.appstoreIcon"
                  :style="{ color: iconColors[Math.floor(Math.random() * 10)] }"
                ></i>
              </div>
              <div class="app_store_detail_header_info">
                <h1>
                  <span>{{ viewData.name }}</span>
                  <span
                    v-if="viewData.type == '0'"
                    :class="viewData.status == '1' ? 'hasIns' : ''"
                    >{{
                      viewData.status == "1" ? "[已开通]" : "[未开通]"
                    }}</span
                  >
                  <span
                    v-if="viewData.status == '1' && viewData.type == '0'"
                    class="hasIns"
                    >{{
                      viewData.licenseEndTime == null ||
                      viewData.licenseEndTime == "0000-00-00"
                        ? "授权日期无限制"
                        : "授权至：" + viewData.licenseEndTime
                    }}</span
                  >
                </h1>
                <p>{{ viewData.desc }}</p>
                <div class="detail-header-tool">
                  <el-button
                    v-if="
                      viewData.status == '1' &&
                      permissionList.statusInBtn &&
                      viewData.type == '0'
                    "
                    type="primary"
                    size="samll"
                    @click.stop="updateLicense(viewData)"
                    >更新授权</el-button
                  >
                  <el-button
                    v-if="
                      viewData.status == '0' &&
                      permissionList.statusInBtn &&
                      viewData.type == '0'
                    "
                    type="primary"
                    size="samll"
                    @click="insLicenseApp(viewData)"
                    >授权开通</el-button
                  >

                  <el-button
                    v-if="
                      viewData.status == '1' &&
                      permissionList.statusUnBtn &&
                      viewData.type == '0'
                    "
                    type="warning"
                    size="samll"
                    plain
                    @click.stop="unsApp(viewData)"
                    >卸载
                  </el-button>

                  <el-button
                    :type="viewData.specUrl.length < 1 ? 'default' : 'primary'"
                    size="samll"
                    :disabled="viewData.specUrl.length < 1"
                    @click="toOpenNewWindow(viewData.specUrl)"
                    plain
                    >资料下载</el-button
                  >
                  <el-button
                    :type="viewData.contact.length < 1 ? 'default' : 'primary'"
                    size="samll"
                    :disabled="viewData.contact.length < 1"
                    @click="toOpenNewWindow(viewData.contact)"
                    plain
                    >联系服务商</el-button
                  >
                </div>
              </div>
            </div>

            <div class="app_store_detail_content" v-html="viewData.note">
              <!-- {{ viewData.note }} -->
            </div>
            <div class="app_store_detail_sc">
              <el-carousel
                height="240px"
                direction="vertical"
                class="app_store_detail_pics"
              >
                <el-carousel-item
                  v-for="item in Math.ceil(viewData.picArr.length / 4)"
                  :key="item"
                >
                  <div class="app_store_detail_pics_list">
                    <template v-for="i in 4">
                      <el-image
                        v-if="(item - 1) * 4 + (i - 1) < viewData.picArr.length"
                        :key="i"
                        :src="viewData.picArr[(item - 1) * 4 + (i - 1)]"
                        :preview-src-list="[
                          viewData.picArr[(item - 1) * 4 + (i - 1)],
                        ]"
                      >
                      </el-image>
                    </template>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </transition>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import { baseURL } from "@/api/common";
import { getLazyList } from "@/api/system/menu";
//import { getRules } from "@/util/regx";
import { getListData, installApp, uninstallApp } from "@/api/appStore/manage";

import SelectRoles from "./selectRoles";

import LicenseModel from "@/views/license/index";
import { calcDate } from "@/util/date.js";

export default {
  name: "应用商城",
  components: {
    SelectRoles,
    LicenseModel,
  },
  data() {
    const scop = this;
    return {
      tabOption: {
        column: [
          /*{
            icon:'el-icon-upload',
            label: '全部',
            value:'ALL',
          },*/
          {
            icon: "el-icon-menu",
            label: "应用",
            value: 0,
          },
          {
            icon: "el-icon-s-fold",
            label: "组件",
            value: 1,
          },
        ],
      },

      loading: true,
      page: {
        pageSize: 8,
        currentPage: 1,
        total: 0,
        pageSizes: [8, 20, 30, 40, 50, 100],
      },

      activeType: {
        origin: 0,
        type: 0,
        enabled: 1,
      },
      query: {},
      listData: [],

      iconColors: [
        "#409EFF",
        "#67C23A",
        "#E6A23C",
        "#F56C6C",
        "#303133",
        "#606266",
        "#409EFF",
        "#67C23A",
        "#E6A23C",
      ],

      viewTitle: "查看介绍",
      viewTag: false,

      viewProps: {
        title: "title",
        meta: "meta",
        lead: "lead",
        body: "body",
      },
      viewData: {},

      insTitle: "开通配置",
      insTag: false,

      insFormObj: {
        productId: "",
        roleIds: [],
        desktopType: "in",
        parentMenuId: "",
      },
      //insFormObj:{},

      insFormOption: {
        submitBtn: false,
        emptyBtn: false,
        span: 24,
        labelWidth: 110,
        column: [
          {
            label: "productId",
            prop: "productId",
            //display:false,
          },
          {
            label: "使用权限",
            prop: "roleIds",
            formslot: true,
            props: {
              key: "id",
              label: "roleName",
            },
          },
          {
            label: "打开方式",
            prop: "desktopType",
            type: "radio",
            value: "out",
            dicData: [
              {
                label: "系统内打开",
                value: "in",
              },
              {
                label: "新窗口打开",
                value: "out",
              },
            ],
          },
          {
            label: "开通位置",
            prop: "parentMenuId",
            filter: true,
            type: "tree",
            lazy: true,
            props: {
              label: "menuName",
              children: "children",
              // 设置了value后getNode才能通过key获取节点
              value: "id",
            },
            created: true,
            defaultExpandedKeys: [0],
            treeLoad: (node, resolve) => {
              if (node.level === 0) {
                resolve([{ menuName: "系统菜单", id: "0" }]);
                return;
              }
              const parentId = node.data.id;
              getLazyList(parentId).then((res) => {
                resolve(
                  res.data.data.map((item) => {
                    return {
                      ...item,
                      leaf: item.isLeaf === "1",
                    };
                  })
                );
              });
            },
            click: () => {
              scop.$refs.insFormRef.$refs.parentMenuId[0].$refs.temp.created = true;
            },
          },
          {
            label: "",
            //labelWidth:0,
            formslot: true,
            prop: "tipsText",
          },
        ],
      },

      insRoleTitle: "选择角色",
      insRoleTag: false,

      insRoleSelectObj: [],

      isShow: false,
      lsData: {
        handleType: "",
        isApp: false,
        needLast: false,
        params: {},
      },

      LicenseTitle: "更新授权",
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        statusInBtn: this.vaildData(
          this.permission[`sys-appstore-status-in`],
          false
        ),
        statusUnBtn: this.vaildData(
          this.permission[`sys-appstore-status-un`],
          false
        ),
      };
    },
  },
  methods: {
    tabChange(data) {
      const nowType = data.value == "ALL" ? "" : data.value;
      //console.log(nowType);
      this.activeType.type = nowType;
      if (data.value == 1) {
        this.activeType.origin = "";
      } else {
        this.activeType.origin = 0;
      }
      this.page.currentPage = 1;
      this.refreshChange();
    },

    pageChange(current) {
      //console.log(current);
      this.page.currentPage = current;
      this.refreshChange();
    },
    pageSizeChange(size) {
      //console.log(size);
      this.page.currentPage = 1;
      this.page.pageSize = size;
      this.refreshChange();
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    onLoad(page, params = {}) {
      this.loading = true;
      const dataParam = {
        ...params,
        ...this.activeType,
        ...this.query,
        current: page.currentPage,
        size: page.pageSize,
      };

      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.loading = false;
      });
    },

    appTypeText(data) {
      let typeText = "";
      if (data.origin == 0) {
        typeText += "内部";
      } else {
        typeText += "外部";
      }
      if (data.type == 0) {
        typeText += "应用";
      } else {
        typeText += "组件";
      }
      return typeText;
    },

    viewAppInfo(data) {
      //console.log(data);
      this.viewData = {};
      const picArrTemp = [];
      if (data.pic) {
        const picArr = data.pic.split(",");
        picArr.map((item) => {
          picArrTemp.push(`${baseURL}` + item.substring(1));
        });
      }
      data.picArr = picArrTemp;
      this.viewData = data;

      /*let typeText = this.appTypeText(data);

      this.viewData.meta = typeText;
      this.viewData.title = data.name;
      this.viewData.lead = data.desc;*/

      this.viewTag = true;
    },
    viewAppInfoClose() {
      this.viewData = {};
      this.viewTag = false;
    },

    /*updateAiCOSLicense(data){
      //更新AiCOS
      this.LicenseTitle = '更新系统授权';
      this.lsData.handleType = 'updateAiCOS';
      this.lsData.isApp = false;
      this.lsData.needLast = true;
      this.lsData.params = {
      }
      this.isShow = true ;
    },*/

    async updateLicense(data) {
      //开通过需要获取上次的授权信息
      this.LicenseTitle = "应用授权更新";
      this.lsData.handleType = "updateApp";
      this.lsData.isApp = true;
      this.lsData.needLast = true;
      this.lsData.params = {
        ...data,
      };
      this.isShow = true;
    },
    insLicenseApp(data) {
      if (data.systemCode == "aisite") {
        //未开通，不用获取上次的授权信息
        this.LicenseTitle = "应用授权开通";
        this.lsData.handleType = "insApp";
        this.lsData.isApp = true;
        this.lsData.needLast = true;
        this.lsData.params = {
          ...data,
        };
        this.isShow = true;
      } else {
        //console.log(data)
        this.insAppSave({
          handleType: "insApp",
          params: {
            ...data,
          },
        });
      }
    },
    lsSuccessFun(data) {
      //console.log(data.handleType);
      //console.log(data);
      if (data.handleType == "insApp") {
        //console.log('授权成功，继续去安装应用');
        this.insAppSave(data);
      } else if (data.handleType == "updateApp") {
        this.refreshChange();
        this.viewAppInfoClose();
      }
    },

    insApp(data) {
      //console.log('insApp',data);
      this.insFormObj = {
        productId: data.id,
        roleIds: [],
        desktopType: "in",
        parentMenuId: "",
      };

      this.insTag = true;
    },
    unsApp(data) {
      let typeText = this.appTypeText(data);

      const dataParam = {
        productId: data.id,
      };

      this.$confirm(
        "卸载后[ " +
          data.name +
          " (" +
          typeText +
          ") " +
          " ] 将不可使用，您确定要卸载吗?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        uninstallApp(dataParam).then(
          () => {
            this.refreshChange();
            this.viewAppInfoClose();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          },
          (error) => {
            window.console.log(error);
            //loading();
          }
        );
      });
    },

    async insAppSave(data) {
      //console.log(data)
      let dataParam = {};
      let tempRoleIds = this.insFormObj.roleIds;

      if (data.handleType == "insApp") {
        //加授权之后
        dataParam = {
          productId: data.params.id,
          roleIds: [],
          desktopType: "out",
          parentMenuId: "0",
        };
      } else {
        //加授权之前的
        this.insFormObj.roleIds = this.insFormObj.roleIds.map(
          (item) => item.id
        );
        dataParam = {
          ...this.insFormObj,
        };
      }
      //console.log(dataParam);

      await installApp(dataParam).then(
        () => {
          this.$message({
            type: "success",
            message: "开通成功！ 请重新登录账户，以使用此服务。",
          });
          this.refreshChange();
          this.viewAppInfoClose();
          this.insTag = false;
          this.isShow = false;
        },
        (error) => {
          window.console.log(error);
          this.insFormObj.roleIds = tempRoleIds;
          //loading();
        }
      );
    },
    insAppClose() {
      this.insFormObj = {
        productId: "",
        roleIds: [],
        desktopType: "in",
        parentMenuId: "",
      };
      this.insTag = false;
    },

    insRoleSelect() {
      this.insRoleSelectObj = this.insFormObj.roleIds;
      this.insRoleTag = true;
    },

    insRoleSave() {
      const selectedRoleIds = this.insRoleSelectObj.map((item) => {
        return {
          id: item.id,
          roleName: item.roleName,
        };
      });
      //console.log(selectedRoleIds);
      this.insFormObj.roleIds = selectedRoleIds;

      this.insRoleTag = false;
    },
    insRoleClose() {
      this.insRoleTag = false;
    },
    delSelectedRoles(item, index) {
      //console.log(index);
      this.insFormObj.roleIds.splice(index, 1);
    },
    toOpenNewWindow(url) {
      window.open(url);
    },
    /*openPreview(index=0){
      console.log(index)
      console.log(this.viewData.picArr)
      this.$ImagePreview(this.viewData.picArr, index,{
        closeOnClickModal: true,
        click:(data,index)=>{
          //this.$message.success('点击事件'+index)
        },
        beforeClose:()=>{
          //this.$message.success('关闭回调')
        }
      });
    }*/
    calcDate(date) {
      let res =
        '<span><i class="el-icon el-icon-circle-check"  style=" color:#67C23A "  ></i>已开通</span>';
      if (date && date != "0000-00-00") {
        let theDate = date + " 23:59:59";
        let date1 = new Date(theDate).getTime();
        let date2 = new Date().getTime();

        const calcday = calcDate(date2, date1);
        if (calcday.days > 30) {
          res =
            '<span><i class="el-icon el-icon-circle-check"  style=" color:#67C23A "  ></i>已开通</span>';
        } else if (calcday.days <= 30 && calcday.days >= 0) {
          res =
            '<span style=" color:#F56C6C "><i class="el-icon el-icon-warning-outline"></i>剩' +
            calcday.days +
            "天</span>";
        } else if (calcday.days < 0) {
          res =
            '<span style=" color:#F56C6C "><i class="el-icon el-icon-circle-close"></i>授权已过期</span>';
        }
      }

      return res;
    },
  },
  mounted() {
    this.refreshChange();

    /*this.$nextTick(()=>{
      this.$refs.insFormRef.$refs.parentMenuId[0].$refs.temp.created = true;
    })*/
  },
};
</script>

<style lang="scss" scoped>
.app_store {
  position: relative;
  height: 100%;
  .app_store_main {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
  }
  .app_store_li {
    width: 25%;
    min-width: 360px;
    padding-right: 30px;
  }
  /deep/.el-card {
    background-color: transparent;
  }
  .avue-card__item {
    cursor: auto;
    position: relative;
    margin-bottom: 10px;
    margin-top: 20px;
    border-radius: 10px;
    height: auto; /*border-color: #00000017; box-shadow: 0 2px 8px rgba(0,0,0,.09);*/
    overflow: hidden;
  }
  .avue-card__title {
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    font-weight: 500;
    color: #070b2d;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    display: -webkit-box;
  }
  .avue-card__avatar {
    border-radius: 10px;
    width: 90px;
    height: 90px;
    line-height: 90px;
    margin-right: 30px;
  }
  .avue-card__avatar i {
    font-size: 90px;
    color: #409eff;
  }
  .avue-card__info {
    word-break: break-all;
    height: 72px;
    overflow: hidden;
    line-height: 24px;
    font-size: 13px;
    color: #565863;
  }
  .avue-card__menu {
    background-color: transparent;
  }
  .avue-card__body {
    padding: 50px 30px 10px;
  }
  .app_store_type {
    position: absolute;
    top: 10px;
    left: 0px;
    display: flex;
    flex-direction: row-reverse;
  }
  .app_store_type > div {
    width: 80px;
    height: 40px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 80px auto;
  }
  .app_store_type > div:first-child {
    margin-left: -18px;
  }
  .app_store_type > div:last-child {
    margin-left: 0px;
  }
  .app_store_new {
    background-image: url("~@/assets/desk/new.png");
  }
  .app_store_hot {
    background-image: url("~@/assets/desk/hot.png");
  }
  .app_store_menu {
    display: flex;
    justify-content: space-around;
    padding: 10px 20px 20px;
  }
  .app_store_License {
    position: absolute;
    top: 10px;
    right: 15px;
    height: 40px;
    line-height: 40px;
    /deep/.el-icon {
      padding-right: 5px;
    }
  }

  .app_store_view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-height: 700px;
    background-color: #fff;
    z-index: 2;
  }

  /deep/.viewSlide-enter-active,
  /deep/.viewSlide-leave-active {
    transition: transform 0.5s;
  }
  /deep/.viewSlide-enter,
  /deep/.viewSlide-leave-to {
    transform: translateX(100%);
  }

  .app_store_detail {
    padding: 40px 60px;
  }
  .app_store_detail_back {
    display: inline-block;
    padding: 5px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 24px;
    &:hover {
      color: #409eff;
    }
  }

  .app_store_detail_header {
    display: flex;
    border-bottom: 1px solid #eeeeee;
  }
  .app_store_detail_header_icon {
    padding-right: 40px;
    font-size: 160px;
    line-height: 160px;
    padding-bottom: 25px;
  }
  .app_store_detail_header_icon i {
    font-size: 160px;
    color: #409eff;
  }
  .app_store_detail_header_info {
    flex: 1;
    padding-bottom: 25px;
    position: relative;
    h1 {
      margin: 0;
      span:nth-child(1) {
        font-size: 36px;
        color: #070b2d;
      }
      span:nth-child(2) {
        font-size: 16px;
        color: #909399;
        padding: 0 10px;
        font-weight: 500;
        &.hasIns {
          color: #67c23a;
        }
      }
      span:nth-child(3) {
        font-size: 16px;
        color: #565863;
        font-weight: 500;
      }
      & + p {
        font-size: 20px;
        color: #565863;
      }
    }
    .detail-header-tool {
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
  .app_store_detail_content {
    font-size: 18px;
    color: #9597a0;
    line-height: 2em;
    padding: 25px 0;
  }
  .app_store_detail_sc {
    padding-bottom: 30px;
  }
  .app_store_detail_pics {
    padding-right: 60px;

    /deep/.el-carousel__indicator--vertical {
      .el-carousel__button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid #070b2d;
      }
      &.is-active {
        button {
          background: #070b2d;
        }
      }
    }
  }
  /deep/.app_store_detail_pics_list {
    display: flex;
    height: 100%;
    .el-image {
      width: 21%;
      height: 100%;
      margin: 0 2%;
      object-fit: contain;
      background-color: #f5f5f5;
      text-align: center;
    }
    .el-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #f5f5f5;
    }
  }
}
</style>
