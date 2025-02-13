<template>
  <HuilanBasic class="newCss">
    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >{{ $t("aicosCommon.addBtn") }}</el-button
      >
      <el-button
        v-if="permissionList.delBtn"
        type="danger"
        size="small"
        @click="batchDelete"
        >{{ $t("aicosCommon.batchDeleteBtn") }}</el-button
      >
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @search="searchChange"
      @reset="searchReset"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="listOption"
      :table-loading="loading"
      :data="listData"
      ref="listRef"
      v-model="listForm"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      :before-close="beforeClose"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @tab-click="crudUpdateTabClick"
      :upload-after="uploadAfter"
      :upload-before="uploadBefore"
      :upload-error="uploadError"
      :upload-delete="uploadDelete"
      :upload-preview="uploadPreview"
    >
      <template slot-scope="{ row, index, type }" slot="menuForm">
        <el-button
          v-if="listOption.tabsActive > 1"
          type="primary"
          icon="el-icon-back"
          plain
          @click="crudUpdatePrev(type)"
        >
          {{ $t("aicosCommon.backBtn") }}</el-button
        >

        <el-button
          v-if="listOption.tabsActive < listOption.group.length"
          type="primary"
          icon="el-icon-right"
          plain
          @click="crudUpdateNext(type)"
        >
          {{ $t("aicosCommon.nextBtn") }}</el-button
        >
      </template>
      <!-- <template slot="menuLeft">
        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete"
          v-if="permissionList.delBtn"
          @click="batchDelete()"
          >批量删除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          :icon="
            scope.row.enabled == '0'
              ? 'el-icon-video-play'
              : 'el-icon-video-pause'
          "
          v-if="permissionList.enabledBtn"
          @click.stop="changeTag('enabled', scope.row, scope.index)"
          >{{ scope.row.enabled == 0 ? "启用" : "停用" }}
        </el-button>
        <el-button
          type="text"
          size="small"
          :icon="
            scope.row.isHot == '0'
              ? 'el-icon-video-play'
              : 'el-icon-video-pause'
          "
          v-if="permissionList.isHotBtn"
          @click.stop="changeTag('isHot', scope.row, scope.index)"
          >热
        </el-button>
        <el-button
          type="text"
          size="small"
          :icon="
            scope.row.isLatest == '0'
              ? 'el-icon-video-play'
              : 'el-icon-video-pause'
          "
          v-if="permissionList.isLatestBtn"
          @click.stop="changeTag('isLatest', scope.row, scope.index)"
          >新
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
          :limt="4"
        />
      </template>
      <template slot-scope="scope" slot="reservedParamsForm">
        <PlugCrud
          :personalityDisplay="false"
          @chilReData="paramsGetData"
          :requstData="paramsRequstData"
          :addBtn="paramsTag"
          :editBtn="paramsTag"
          :delBtn="paramsTag"
          :title="paramsTitle"
        ></PlugCrud>
      </template>
      <!-- <template slot="descForm">
        <Editor :content="listForm.desc" />
      </template> -->
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
import { getTextWidth } from "@/util/util";
import iconList from "@/config/iconList";
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
import PlugCrud from "@/components/plugCrud";
import Editor from "@/components/editor";
import {
  getListData,
  addListData,
  updateListData,
  delListData
} from "@/api/appStore/manage";
export default {
  name: "ApplicationMarketManagement",
  components: {
    PlugCrud,
    Editor
  },
  data() {
    return {
      tabOption: {
        column: [
          /*{
            icon:'el-icon-s-order',
            label: '全部',
            value:0,
          },*/
          {
            icon: "el-icon-s-grid",
            label: this.$t("appStore.manage.internalApp"),
            value: 2
          },
          {
            icon: "el-icon-s-unfold",
            label: this.$t("appStore.manage.internalCom"),
            value: 4
          },
          {
            icon: "el-icon-s-fold",
            label: this.$t("appStore.manage.externalCom"),
            value: 3
          }
          /*{
            icon:'el-icon-menu',
            label: '外部应用',
            value:1,
          },*/
        ]
      },

      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },

      listForm: {},
      selectionList: [],
      activeType: {
        origin: 0,
        type: 0
      },
      query: {},
      listData: [],
      listOption: {
        header: false,
        tip: false,
        calcHeight: 65,
        searchShow: true,
        searchIndex: 1,
        searchClearable: false,

        // dialogWidth: 800,
        index: true,
        selection: true,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 240,
        menuAlign: "left",
        menuFixed: "right",
        dialogClickModal: false,
        saveBtn: false,
        updateBtn: false,
        //cancelBtn:false,
        span: 24,

        border: true,
        stripe: false,
        // searchIcon: true,
        searchSpan: 4,
        searchMenuSpan: 3,
        searchMenuPosition: "right",
        dialogMenuPosition: "right",
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",

        /*border: false,
        stripe:true,
        searchIcon:false,
        searchBtnText:" ",
        emptyBtnText:" ",
        searchMenuSpan:2,
        searchMenuPosition:"right",
        searchSpan:4,
        searchLabelWidth:"1px",
        dialogMenuPosition:"center",*/
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("appStore.manage.id"),
            prop: "id",
            hide: true,
            disabled: true,
            display: false
          },
          {
            label: this.$t("appStore.manage.appSource"),
            prop: "origin",
            type: "radio",
            hide: true,
            disabled: true,
            display: false,
            dicData: [
              { label: this.$t("appStore.manage.internal"), value: 0 },
              { label: this.$t("appStore.manage.external"), value: 1 }
            ],
            value: 0
          },
          {
            label: this.$t("appStore.manage.appType"),
            prop: "type",
            type: "radio",
            hide: true,
            disabled: true,
            display: false,
            dicData: [
              { label: this.$t("appStore.manage.application"), value: 0 },
              { label: this.$t("appStore.manage.component"), value: 1 }
            ],
            value: 0
            /*control:(val,form)=>{
              if(val===0){
                if( this.activeType.origin == 0 ){

                  console.log(this.listOption.group[1].column);

                  return {
                    name:{label:'应用名称'},
                    specUrl:{label:'使用说明'},
                    desc:{label:'应用说明'},
                    isAuth:{ display:true },
                    isSso:{ display:false },
                    moduleExport:{ display:false },
                    moduleUrl:{ display:false },
                    authModuleExport:{ display:true },
                    authModuleUrl:{ display:true },
                    reservedParams:{ display:true },
                    enabled:{row:true},
                  }
                }else{
                  return {
                    name:{label:'应用名称'},
                    specUrl:{label:'使用说明'},
                    desc:{label:'应用说明'},
                    isAuth:{ display:false },
                    isSso:{ display:true },
                    moduleExport:{ display:false },
                    moduleUrl:{ display:false },
                    authModuleExport:{ display:false },
                    authModuleUrl:{ display:false },
                    reservedParams:{ display:false },
                    enabled:{row:false},
                  }
                }

              }else{
                if( this.activeType.origin == 0 ){
                  return {
                    name:{label:'组件名称'},
                    specUrl:{label:'调用说明'},
                    desc:{label:'组件介绍'},
                    isAuth:{ display:false },
                    isSso:{ display:false },
                    moduleExport:{ display:true },
                    moduleUrl:{ display:true },
                    authModuleExport:{ display:false },
                    authModuleUrl:{ display:false },
                    reservedParams:{ display:true },
                    enabled:{row:true},
                  }

                }else{
                  return {
                    name:{label:'组件名称'},
                    specUrl:{label:'调用说明'},
                    desc:{label:'组件介绍'},
                    isAuth:{ display:false },
                    isSso:{ display:true },
                    moduleExport:{ display:true },
                    moduleUrl:{ display:true },
                    authModuleExport:{ display:false },
                    authModuleUrl:{ display:false },
                    reservedParams:{ display:true },
                    enabled:{row:false},
                  }
                }

              }
            },*/
          },
          {
            label: this.$t("appStore.manage.appName"),
            prop: "name",
            // search: true,
            display: false
          },
          {
            label: this.$t("appStore.manage.systemCode"),
            prop: "systemCode",
            // search: true,
            display: false
          },

          {
            label: this.$t("appStore.manage.enableStatus"),
            prop: "enabled",
            // search: true,
            align: "center",
            type: "radio",
            display: false,
            dicData: [
              { label: this.$t("appStore.manage.notEnabled"), value: 0 },
              { label: this.$t("appStore.manage.enable"), value: 1 }
            ]
          },

          {
            label: this.$t("appStore.manage.applicationHeat"),
            prop: "isHot",
            align: "center",
            type: "radio",
            display: false,
            dicData: [
              { label: "-", value: 0 },
              { label: this.$t("appStore.manage.hot"), value: 1 }
            ]
          },
          {
            label: this.$t("appStore.manage.updates"),
            prop: "isLatest",
            align: "center",
            type: "radio",
            display: false,
            dicData: [
              { label: "-", value: 0 },
              { label: this.$t("appStore.manage.new"), value: 1 }
            ]
          },

          {
            label: this.$t("appStore.manage.openingStatus"),
            prop: "status",
            // search: true,
            align: "center",
            type: "radio",
            display: false,
            dicData: [
              { label: this.$t("appStore.manage.notOpened"), value: 0 },
              { label: this.$t("appStore.manage.open"), value: 1 }
            ]
          },

          {
            label: this.$t("appStore.manage.mallIcon"),
            prop: "appstoreIcon",
            align: "center",
            display: false,
            type: "icon",
            iconList: iconList
          },

          {
            label: this.$t("appStore.manage.updateTime"),
            prop: "updateTime",
            span: 24,
            display: false,
            align: "center",
            width: 200
          },

          {
            label: this.$t("appStore.manage.desktopType"),
            prop: "desktopType",
            hide: true,
            //disabled: true,
            display: false
          },

          {
            label: this.$t("appStore.manage.isDelete"),
            prop: "deleted",
            type: "radio",
            hide: true,
            disabled: true,
            display: false,
            dicData: [
              { label: this.$t("appStore.manage.deleted"), value: 0 },
              { label: this.$t("appStore.manage.notDeleted"), value: 1 }
            ],
            value: 0
          },

          {
            label: this.$t("appStore.manage.menuId"),
            prop: "menuId",
            hide: true,
            //disabled: true,
            display: false
          },
          {
            label: this.$t("appStore.manage.tenantId"),
            prop: "tenantId",
            hide: true,
            //disabled: true,
            display: false
          }
        ],
        tabs: true,
        tabsActive: 1,
        group: [
          {
            icon: "el-icon-document-add",
            label: this.$t("appStore.manage.basicInformation"),
            arrow: true,
            //collapse:false,
            prop: "crudUpdateGroup1",
            column: [
              {
                label: this.$t("appStore.manage.appName"),
                prop: "name",
                span: 12,

                //hide: true,
                //disabled: true,
                display: true,

                maxlength: 50,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("appStore.manage.appName"),
                    trigger: "blur"
                  },
                  ...getRules(["charNumHanUnderline"])
                ]
              },
              {
                label: this.$t("appStore.manage.systemCode"),
                prop: "systemCode",
                span: 12,
                //row:true,
                //searchRow:true,
                //hide: true,
                //disabled: true,
                editDetail: true,
                display: true,

                maxlength: 50,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("appStore.manage.systemCode"),
                    trigger: "blur"
                  },
                  ...getRules(["charNumHanUnderline"])
                ]
              },

              {
                label: this.$t("appStore.manage.routingAddress"),
                prop: "linkUrl",
                span: 12,

                hide: true,
                //disabled: true,
                display: true,
                maxlength: 100,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("appStore.manage.routingAddress"),
                    trigger: "blur"
                  },
                  ...getRules(["expectSpecials"])
                ]
              },
              {
                label: this.$t("appStore.manage.enableStatus"),
                prop: "enabled",
                row: true,
                span: 12,
                align: "center",
                type: "switch",

                //hide: true,
                //disabled: true,
                display: true,
                dicData: [
                  { label: this.$t("appStore.manage.notEnabled"), value: 0 },
                  { label: this.$t("appStore.manage.enable"), value: 1 }
                ],
                value: 1
              },
              {
                label: this.$t("appStore.manage.applicationHeat"),
                prop: "isHot",
                span: 12,
                type: "switch",
                //hide: true,
                //disabled: true,
                display: true,
                dicData: [
                  { label: this.$t("aicosCommon.no"), value: 0 },
                  { label: this.$t("appStore.manage.hottest"), value: 1 }
                ],
                value: 1
              },
              {
                label: this.$t("appStore.manage.updates"),
                prop: "isLatest",
                row: true,
                span: 12,
                type: "switch",
                //hide: true,
                //disabled: true,
                display: true,
                dicData: [
                  { label: this.$t("aicosCommon.no"), value: 0 },
                  { label: this.$t("appStore.manage.newest"), value: 1 }
                ],
                value: 1
              },
              {
                label: this.$t("appStore.manage.desc"),
                prop: "desc",
                hide: true,
                span: 24,
                row: true,
                //disabled: true,
                display: true,
                type: "textarea",
                minRows: 3,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("appStore.manage.desc"),
                    trigger: "blur"
                  }
                  //...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.openingStatus"),
                prop: "status",
                span: 12,
                align: "center",
                type: "radio",

                //hide: true,
                disabled: true,
                display: false,
                dicData: [
                  { label: this.$t("appStore.manage.notOpened"), value: 0 },
                  { label: this.$t("appStore.manage.open"), value: 1 }
                ],
                value: 0
              }
            ]
          },
          {
            icon: "el-icon-document",
            label: this.$t("appStore.manage.appConfiguration"),
            arrow: true,
            //collapse:false,
            prop: "crudUpdateGroup2",
            column: [
              {
                label: this.$t("appStore.manage.sso"),
                prop: "isSso",
                span: 12,
                row: true,
                align: "center",
                type: "switch",
                hide: true,
                //disabled: true,
                display: false,
                dicData: [
                  { label: this.$t("appStore.manage.notEnabled"), value: 0 },
                  { label: this.$t("appStore.manage.enable"), value: 1 }
                ],
                value: 0
              },

              {
                label: this.$t("appStore.manage.mallIcon"),
                prop: "appstoreIcon",
                span: 12,
                row: true,
                align: "center",
                //hide: true,
                //slot: true,
                //disabled: true,
                display: true,
                type: "icon",
                iconList: iconList,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseSelect") +
                      this.$t("appStore.manage.mallIcon"),
                    trigger: "blur"
                  }
                ]
              },
              {
                label: this.$t("appStore.manage.desktopIcon"),
                prop: "desktopIcon",
                span: 12,
                hide: true,
                //disabled: true,
                display: true,
                //slot: true,
                type: "icon",
                iconList: iconList
              },
              {
                label: this.$t("appStore.manage.menuIcon"),
                prop: "imageUrl",
                span: 12,
                row: true,
                hide: true,
                //disabled: true,
                display: true,
                type: "icon",
                iconList: iconList
              },
              {
                label: this.$t("appStore.manage.centralizedAuth"),
                prop: "isAuth",
                span: 24,
                row: true,
                hide: true,
                //disabled: true,
                display: false,
                type: "radio",
                dicData: [
                  { label: this.$t("aicosCommon.no"), value: 0 },
                  { label: this.$t("aicosCommon.yes"), value: 1 }
                ],
                value: 0
                /*control:(val,form)=>{
                  if(val==0){
                    return {
                      authModuleUrl:{ display:false },
                      authModuleExport:{ display:false },

                    }
                  }else if(val==1){
                    return {
                      authModuleUrl:{ display:true },
                      authModuleExport:{ display:true },
                    }

                  }
                },*/
              },
              {
                label: this.$t("appStore.manage.authAddress"),
                prop: "authModuleUrl",
                span: 12,
                hide: true,
                //disabled: true,
                display: false,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleasInput") +
                      this.$t("appStore.manage.authAddress"),
                    trigger: "blur"
                  }
                  //,...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.authVariables"),
                prop: "authModuleExport",
                span: 12,
                hide: true,
                //disabled: true,
                display: false,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleasInput") +
                      this.$t("appStore.manage.authVariables"),
                    trigger: "blur"
                  }
                  //,...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.moduleAddress"),
                prop: "moduleUrl",
                span: 12,
                hide: true,
                //disabled: true,
                display: false,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleasInput") +
                      this.$t("appStore.manage.moduleAddress"),
                    trigger: "blur"
                  }
                  //,...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.moduleVariables"),
                prop: "moduleExport",
                span: 12,
                hide: true,
                //disabled: true,
                display: false,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleasInput") +
                      this.$t("appStore.manage.moduleVariables"),
                    trigger: "blur"
                  }
                  //,...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.reservedParameters"),
                prop: "reservedParams",
                span: 24,
                formslot: true,
                hide: true,
                //disabled: true,
                display: false
                //order:1,
              }
            ]
          },
          {
            icon: "el-icon-document-checked",
            label: this.$t("appStore.manage.appIntroduction"),
            arrow: true,
            //collapse:false,
            prop: "crudUpdateGroup3",
            column: [
              {
                label: this.$t("appStore.manage.dataDownload"),
                prop: "specUrl",
                span: 12,
                //row:true,
                hide: true,
                //disabled: true,
                display: true,
                maxlength: 100,
                showWordLimit: true,
                rules: [
                  //...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.contactManufacturer"),
                prop: "contact",
                span: 12,
                //row:true,
                hide: true,
                //disabled: true,
                display: true,
                maxlength: 100,
                showWordLimit: true,
                rules: [
                  //...getRules(['charNumHanUnderline'])
                ]
              },

              {
                label: this.$t("appStore.manage.appExamples"),
                prop: "pic",
                hide: true,
                type: "upload",
                listType: "picture-card",
                limit: 12,
                accept: "image/*",
                // fileSize: 2048,
                autoUpload: false,
                uploadBefore: this.uploadBefore,
                span: 24,
                data: {
                  fromSystemName: "base"
                },
                propsHttp: {
                  res: "data",
                  url: "newFileName",
                  name: "oldFileName"
                },
                tip: this.$t("appStore.manage.appExamplesTip"),
                action: `${baseURL}api/${serviceList.file}/miniofile/upload`,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("appStore.manage.pleaseUpload") +
                      this.$t("appStore.manage.appExamples"),
                    trigger: "blur"
                  }
                  //...getRules(['charNumHanUnderline'])
                ]
              },
              {
                label: this.$t("appStore.manage.elaborateOn"),
                prop: "note",
                span: 24,
                // type: "textarea",
                hide: true,
                //disabled: true,
                display: true,
                // minRows: 5,
                // maxlength: 200,
                // showWordLimit: true,
                component: "AvueUeditor",
                params: {
                  options: {
                    customConfig: {
                      menus: [
                        "bold", //粗体
                        "fontSize", //字号
                        "fontName", //字体
                        "italic", //斜体
                        "foreColor", //文字颜色
                        "backColor", //背景颜色
                        "link", //插入链接
                        "justify", //对齐
                        "image" //图
                      ]
                    },
                    action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
                    props: {
                      url: "newFileName",
                      res: "data",
                      home: baseURL.replace(/\/$/, "")
                    }
                  }
                },
                rules: [
                  //...getRules(['charNumHanUnderline'])
                ]
              }
            ]
          }
        ]
      },
      searchForm: {
        name: "",
        systemCode: "",
        enabled: "",
        status: ""
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("appStore.manage.appName")
        },
        {
          prop: "systemCode",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("appStore.manage.systemCode")
        },
        {
          type: "select",
          prop: "enabled",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("appStore.manage.enableStatus"),
          dicData: [
            { label: this.$t("appStore.manage.notEnabled"), value: 0 },
            { label: this.$t("appStore.manage.enable"), value: 1 }
          ]
        },
        {
          type: "select",
          prop: "status",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("appStore.manage.openingStatus"),
          dicData: [
            { label: this.$t("appStore.manage.notOpened"), value: 0 },
            { label: this.$t("appStore.manage.open"), value: 1 }
          ]
        }
      ],
      paramsRequstData: [],
      paramsTag: true,
      paramsTitle: " ",
      crudUpdatePrevTag: false,
      crudUpdateNextTag: true
    };
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission[`sys-appstore-add`], false),
        viewBtn: this.vaildData(this.permission[`sys-appstore-view`], false),
        delBtn: this.vaildData(this.permission[`sys-appstore-delete`], false),
        editBtn: this.vaildData(this.permission[`sys-appstore-update`], false),
        isHotBtn: this.vaildData(this.permission[`sys-appstore-isHot`], false),
        enabledBtn: this.vaildData(
          this.permission[`sys-appstore-enabled`],
          false
        ),
        isLatestBtn: this.vaildData(
          this.permission[`sys-appstore-isLatest`],
          false
        )
      };
    }
  },
  methods: {
    // 新增
    handleAdd() {
      this.$refs.listRef.rowAdd();
    },
    // 列显隐
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    getRowActions(row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView"
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        },
        isHotBtn: {
          name: this.$t("appStore.manage.hot"),
          command: "changeTagHot"
        },
        enabledBtn: {
          name:
            row.enabled == 0
              ? this.$t("appStore.manage.enable")
              : this.$t("appStore.manage.deactivate"),
          command: "changeTagEnabled"
        },
        isLatestBtn: {
          name: this.$t("appStore.manage.new"),
          command: "changeTagNew"
        }
      };
      const list = [
        "viewBtn",
        "editBtn",
        "delBtn",
        "enabledBtn",
        "isHotBtn",
        "isLatestBtn"
      ];
      const actions = [];

      list.forEach(item => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      const crud = this.$refs.listRef;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    changeTagHot(row) {
      this.changeTag("isHot", row);
    },
    changeTagEnabled(row) {
      this.changeTag("enabled", row);
    },
    changeTagNew(row) {
      this.changeTag("isLatest", row);
    },
    tabChange(data) {
      //console.log(data.value);
      switch (data.value) {
        /*case 0:
        this.activeType.origin = '';
        this.activeType.type = '';
        break;*/
        case 1:
          this.activeType.origin = 1;
          this.activeType.type = 0;
          break;
        case 2:
          this.activeType.origin = 0;
          this.activeType.type = 0;
          break;
        case 3:
          this.activeType.origin = 1;
          this.activeType.type = 1;
          break;
        case 4:
          this.activeType.origin = 0;
          this.activeType.type = 1;
          break;
        default:
        //console.log('类型有误');
      }

      this.page.currentPage = 1;
      this.refreshChange();
    },
    uploadBefore(file, done, loading) {
      // console.log("uploadBefore", file);
      const isSize = Number(file.size / 1024) < 2048;
      const isType =
        file.type == "image/png" ||
        file.type == "image/jpg" ||
        file.type == "image/jpeg" ||
        file.type == "image/webp";

      if (isSize && isType) {
        done();
      } else if (!isSize) {
        this.$message.error(this.$t("appStore.manage.fileSize"));
        loading();
      } else if (!isType) {
        this.$message.error(this.$t("appStore.manage.errorFileFormat"));
        loading();
      }
    },
    rowSave(row, done, loading) {
      //console.log(this.paramsRequstData);
      row.reservedParams = JSON.stringify(this.paramsRequstData);

      const picArr = [];
      row.pic.map(item => {
        picArr.push("/" + item.value.replace(`${baseURL}`, ""));
      });
      row.pic = picArr.join();

      //console.log(row);
      addListData(row).then(
        () => {
          //this.refreshChange();
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },

    rowUpdate(row, index, done, loading) {
      //console.log(row);
      row.reservedParams = JSON.stringify(this.paramsRequstData);
      console.log(row.pic);

      let picArr = [];
      const picArrTemp = [];
      if (Array.isArray(row.pic)) {
        picArr = row.pic;
        picArr.map(item => {
          picArrTemp.push("/" + item.value.replace(`${baseURL}`, ""));
        });
      } else {
        picArr = row.pic.split(",");
        picArr.map(item => {
          picArrTemp.push("/" + item.replace(`${baseURL}`, ""));
        });
      }

      row.pic = picArrTemp.join();

      updateListData(row).then(
        () => {
          //this.refreshChange();
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },

    rowDel(row) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return delListData([row.id]);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          this.refreshChange();
        });
    },

    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {
        ...this.searchForm
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    selectionChange(list) {
      this.selectionList = list;
    },

    selectionClear() {
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },

    beforeOpen(done, type) {
      this.listOption.labelPosition = this.language == "en" ? "top" : "right";
      if (["add", "edit", "view"].includes(type)) {
        this.initData(type);
      }
      done();
    },
    beforeClose(done /*type*/) {
      this.refreshChange();
      done();
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    initData(type) {
      //console.log(type);
      this.listOption.tabsActive = 1;
      this.listOption.saveBtn = false;
      this.listOption.updateBtn = false;
      //this.listOption.cancelBtn = false;

      this.paramsRequstData = [];
      this.paramsTag = true;

      this.showFormItem();

      if (type == "view" || type == "edit") {
        if (this.listForm.pic) {
          const picArr = this.listForm.pic.split(",");
          const picArrTemp = [];

          picArr.map(item => {
            picArrTemp.push(`${baseURL}` + item.substring(1));
          });
          this.listForm.pic = picArrTemp.join();
        }
      }

      if (type == "add") {
        this.listForm.origin = this.activeType.origin;
        this.listForm.type = this.activeType.type;
      }

      if (type == "edit") {
        //console.log(this.listForm.reservedParams);
        if (this.listForm.reservedParams) {
          this.paramsRequstData = JSON.parse(this.listForm.reservedParams);
        }
      }

      if (type == "view") {
        //console.log(this.listForm.reservedParams);
        if (this.listForm.reservedParams) {
          this.paramsRequstData = JSON.parse(this.listForm.reservedParams);
          this.paramsTag = false;
        }
      }
    },

    onLoad(page, params = {}) {
      this.loading = true;
      const dataParam = {
        ...params,
        ...this.activeType,
        ...this.query,
        current: page.currentPage,
        size: page.pageSize
      };

      getListData(dataParam).then(res => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        if (this.language != "zh") {
          this.listOption.column.forEach(item => {
            let width = getTextWidth(item.label).nodeWidth + 100;
            this.$set(item, "width", width);
          });
        }
        this.loading = false;
        this.selectionClear();
      });
    },

    batchDelete() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: this.$t("aicosCommon.chooseDataTip")
        });
      } else {
        this.$confirm(
          this.$t("appStore.manage.batchDeleteTip") +
            this.selectionList.length +
            this.$t("appStore.manage.countsTip"),
          this.$t("appStore.manage.tip"),
          {
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            type: "warning"
          }
        )
          .then(() => {
            const delIds = this.selectionList.map(item => item.id);
            //console.log(delIds);
            return delListData(delIds);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });

            this.refreshChange();
          });
      }
    },

    paramsGetData(data) {
      this.paramsRequstData = data.requstData;
    },
    changeTag(tagText, row /*index*/) {
      if (row[tagText] == 0) {
        row[tagText] = 1;
        updateListData(row).then(
          () => {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
          },
          error => {
            window.console.log(error);
          }
        );
      } else {
        let tipsText = this.$t("appStore.manage.settingsTip");
        if (tagText == "appStore.manage.enabled") {
          tipsText = this.$t("stopUseTip");
        } else if (tagText == "isHot") {
          tipsText = this.$t("appStore.manage.hotTestTip");
        } else if (tagText == "isLatest") {
          tipsText = this.$t("appStore.manage.newTestTip");
        }
        this.$confirm(tipsText, {
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          type: "warning"
        }).then(() => {
          row[tagText] = 0;
          updateListData(row).then(
            () => {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.successOperate")
              });
              this.refreshChange();
            },
            error => {
              window.console.log(error);
            }
          );
        });
      }
    },

    changeEnabled(row /*index*/) {
      //console.log(row);
      if (row.enabled == 0) {
        row.enabled = 1;
        updateListData(row).then(
          () => {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
          },
          error => {
            window.console.log(error);
          }
        );
      } else {
        this.$confirm(this.$t("appStore.manage.stopTip"), {
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          type: "warning"
        }).then(() => {
          row.enabled = 0;
          updateListData(row).then(
            () => {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.successOperate")
              });
            },
            error => {
              window.console.log(error);
            }
          );
        });
      }
    },
    crudUpdatePrev() {
      if (this.listOption.tabsActive > 1) {
        this.listOption.tabsActive--;
      }
    },
    crudUpdateNext() {
      if (!this.crudUpdateValidate(this.listOption.tabsActive - 1)) {
        this.$message.warning(this.$t("appStore.manage.checkDataTip"));
        //return false
      }

      if (this.listOption.tabsActive < this.listOption.group.length) {
        this.listOption.tabsActive++;
        this.showCrudFormBtn();
      }
    },
    crudUpdateTabClick(tab /*event*/) {
      //console.log(this.$refs.listRef.$refs.dialogForm.$refs.tableForm.$refs.form)

      if (!this.crudUpdateValidate(this.listOption.tabsActive - 1)) {
        this.$message.warning(this.$t("appStore.manage.checkDataTip"));

        // let _this = this;
        // let _tabsActive = this.listOption.tabsActive;
        // setTimeout(()=>{
        //   _this.listOption.tabsActive =  _tabsActive;
        // },10)
      }
      this.listOption.tabsActive = parseInt(tab.index) + 1;
      this.showCrudFormBtn();
    },

    crudUpdateValidate(tabIndex) {
      //this.$refs.listRef.$refs.dialogForm.$refs.tableForm.validate();
      //this.$refs.listRef.$refs.dialogForm.$refs.tableForm.validateField("systemCode");
      let canGo = true;
      const dataGroupColumn = this.listOption.group[tabIndex].column;
      dataGroupColumn.map(item => {
        this.$refs.listRef.$refs.dialogForm.$refs.tableForm.$refs.form.validateField(
          item.prop,
          errorMsg => {
            if (errorMsg) {
              if (canGo) {
                canGo = false;
              }
            }
          }
        );
      });
      return canGo;
    },

    showCrudFormBtn() {
      if (this.listOption.tabsActive == this.listOption.group.length) {
        this.listOption.saveBtn = true;
        this.listOption.updateBtn = true;
        //this.listOption.cancelBtn = true;
      }
    },
    showFormItem() {
      const dataGroupColumn = this.listOption.group[1].column;
      dataGroupColumn.map(item => {
        if (!["appstoreIcon", "desktopIcon", "imageUrl"].includes(item.prop)) {
          item.display = false;
          if (item.prop == "isAuth") {
            item.value = 0;
          }
        }

        if (this.activeType.origin == 1 && this.activeType.type == 0) {
          //console.log("外部应用");
          if (["isSso"].includes(item.prop)) {
            item.display = true;
          }
        } else if (this.activeType.origin == 0 && this.activeType.type == 0) {
          //console.log("内部应用");
          if (
            [
              "isAuth",
              "authModuleExport",
              "authModuleUrl",
              "reservedParams"
            ].includes(item.prop)
          ) {
            item.display = true;
            if (item.prop == "isAuth") {
              item.value = 1;
            }
          }
        } else if (this.activeType.origin == 1 && this.activeType.type == 1) {
          //console.log("外部组件");
          if (
            ["isSso", "moduleExport", "moduleUrl", "reservedParams"].includes(
              item.prop
            )
          ) {
            item.display = true;
          }
        } else if (this.activeType.origin == 0 && this.activeType.type == 1) {
          //console.log("内部组件");
          if (
            ["moduleExport", "moduleUrl", "reservedParams"].includes(item.prop)
          ) {
            item.display = true;
          }
        }
      });

      const dataGroupColumnF = this.listOption.group[0].column;
      dataGroupColumnF.map(item => {
        if (this.activeType.type == 0) {
          if (item.prop == "name") {
            item.label = this.$t("appStore.manage.appName");
          }
          if (item.prop == "desc") {
            item.label = this.$t("appStore.manage.desc");
          }
        } else if (this.activeType.type == 1) {
          if (item.prop == "name") {
            item.label = this.$t("appStore.manage.comName");
          }
          if (item.prop == "desc") {
            item.label = this.$t("appStore.manage.comIntroduction");
          }
        }
      });

      if (this.activeType.type == 0) {
        this.listOption.group[1].label = this.$t(
          "appStore.manage.appConfiguration"
        );
        this.listOption.group[2].label = this.$t(
          "appStore.manage.appIntroduction"
        );
      } else if (this.activeType.type == 1) {
        this.listOption.group[1].label = this.$t(
          "appStore.manage.comConfiguration"
        );
        this.listOption.group[2].label = this.$t(
          "appStore.manage.comIntroduction"
        );
      }
    },
    uploadAfter(res, done /*loading*/) {
      res.newFileName = `${baseURL}` + res.newFileName.substring(1);
      done(res);
    },
    uploadError(error /*column*/) {
      this.$message.error(error);
      this.uploadFileType = "";
    }
  },
  mounted() {},
  watch: {
    "listForm.isAuth": {
      handler(val) {
        //console.log(val);
        //if (!val) return;
        if (val == 1) {
          this.findObject(
            this.listOption.group,
            "authModuleExport"
          ).display = true;
          this.findObject(
            this.listOption.group,
            "authModuleUrl"
          ).display = true;
        } else {
          this.findObject(
            this.listOption.group,
            "authModuleExport"
          ).display = false;
          this.findObject(
            this.listOption.group,
            "authModuleUrl"
          ).display = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.newCss {
  /deep/.avue-crud__search .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.avue-crud__search .avue-form__menu {
    width: 240px;
  }

  /deep/.el-card__body .avue-crud__menu {
    justify-content: flex-end;
  }
}
</style>
