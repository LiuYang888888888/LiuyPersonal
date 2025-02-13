<template>
  <HuilanBasic :left-width="250">
    <template v-slot:left>
      <div
        class="fag-manage-tree"
        :style="
          allWindowTopBodyHeight && { height: allWindowTopBodyHeight + 'px' }
        "
      >
        <basic-container>
          <LeftTree
            ref="tree"
            @getNode="getNode"
            @nodeClick="nodeClick"
            :defaultExpandNodes="curNodeDeepPath"
            :classType="classType"
            :botId="botId"
            :ckEditFlag="ckEditFlag"
            @openSetting="openSetting"
            :name="$t('file.documentClass')"
          />
        </basic-container>
      </div>
    </template>
    <div class="file-manage-container" v-if="fileManageType == 'mangelist'">
      <div
        :style="
          allWindowTopBodyHeight && {
            height:
              ckEditFlag == 'ckEdit' ? '100%' : allWindowTopBodyHeight + 'px',
          }
        "
        class="fag-manage-content"
      >
        <div class="file-table-header">
          <div class="file-search-header-wrap clearfix">
            <div class="file-operation-btns" v-if="ckEditFlag != 'ckEdit'">
              <el-button
                type="success"
                class="kw-build-button kw-btn-green"
                size="small"
                v-if="
                  curTreeNodeId != '0' &&
                  curTreeNodeId != 'mine' &&
                  curTreeNodeId != '' &&
                  permission[`${prefix}file-add`]
                "
                @click="openFileAddDialog('add')"
                >{{ $t("file.addFile") }}</el-button
              >
              <el-dropdown
                v-if="permission[`${prefix}file-deleteMore`]"
                @command="batchOperation"
              >
                <el-button
                  type="primary"
                  class="kw-build-button kw-btn-blue"
                  size="small"
                >
                  {{ $t("aicosCommon.batchOperate")
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item command="download">批量下载</el-dropdown-item> -->
                  <el-dropdown-item command="del">{{
                    $t("aicosCommon.batchDeleteBtn")
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div
              class="file-search-input-wrap clearfix"
              :style="{ marginTop: ckEditFlag == 'ckEdit' ? '0' : '20px' }"
            >
              <div class="file-search-input-row">
                <div class="file-search-select">
                  <el-select
                    size="small"
                    v-model="queryObj.fileType"
                    clearable
                    :placeholder="$t('file.fileType')"
                  >
                    <el-option :label="$t('file.text')" value="TXT"></el-option>
                    <el-option
                      :label="$t('file.picture')"
                      value="IMAGE"
                    ></el-option>
                    <el-option
                      :label="$t('file.audio')"
                      value="VOICE"
                    ></el-option>
                    <el-option
                      :label="$t('file.video')"
                      value="VIDEO"
                    ></el-option>
                    <el-option
                      :label="$t('file.other')"
                      value="OTHER"
                    ></el-option>
                  </el-select>
                </div>
                <div class="file-search-value">
                  <div class="file-search-input" style="padding-right: 80px">
                    <el-input
                      :placeholder="$t('file.searchContentTips')"
                      size="small"
                      v-model="queryObj.content"
                    ></el-input>
                    <div class="file-search-buttons">
                      <el-button
                        type="primary"
                        size="small"
                        class="kw-search-btn"
                        @click="searchChange"
                      >
                        <i class="el-icon-search"></i>
                      </el-button>
                      <el-button
                        size="small"
                        class="kw-reset-btn"
                        @click="searchReset"
                      >
                        <i class="aicosicon aicos-icon-clear"></i>
                      </el-button>
                      <!-- <el-button
                        size="small"
                        class="kw-reset-btn"
                        @click="expandOrPutUpSearch"
                      >
                        <i class="aicosicon aicos-icon-gaojisousuo"></i>
                      </el-button> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="file-dismension-search-wrap"></div>
          </div>
        </div>
        <avue-crud
          :option="fileTableOption"
          :table-loading="loading"
          :data="fileTableData"
          :page.sync="fileTablePage"
          ref="fileTable"
          :permission="permissionList"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @on-load="onLoad"
        >
          <template slot-scope="scope" slot="status">
            <span v-if="scope.row.status == 0"> {{ $t("file.text") }} </span>
            <span v-else-if="scope.row.status == 1"
              >{{ $t("file.picture") }}
            </span>
            <span v-else-if="scope.row.status == 2"
              >{{ $t("file.video") }}
            </span>
            <span v-else-if="scope.row.status == 3"
              >{{ $t("file.audio") }}
            </span>
            <span v-else-if="scope.row.status == 4"
              >{{ $t("file.other") }}
            </span>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              size="small"
              v-if="permission[`${prefix}file-download`]"
              @click.stop="downLoadFile(scope.row, scope.index)"
            >
              {{ $t("file.download") }}
            </el-button>
            <!-- <el-button
              type="text"
              size="small"
              @click.stop="openEditFile(scope.row, scope.index)"
            >
              编辑
            </el-button> -->
            <el-button
              type="text"
              size="small"
              v-if="permission[`${prefix}file-delete`]"
              @click.stop="delFile(scope.row, scope.index, 'only')"
            >
              {{ $t("aicosCommon.delBtn") }}
            </el-button>
          </template>
        </avue-crud>
      </div>
    </div>
    <!-- 新增文件 -->
    <HuilanDialog
      append-to-body
      :visible.sync="isShowAddFileDialog"
      width="600px"
      trigger="click"
    >
      <AddFile
        v-if="isShowAddFileDialog"
        :nodeDeepPath="curNodeDeepPath"
        :curTreeNode="curTreeNode"
        :curTreeNodeName="curTreeNodeName"
        :fileType="'add'"
        :fileUpdataObj="fileUpdataData"
        @addOrEditEmitEvent="addOrEditEmitEvent"
        ref="addEditFile"
        :robotId="robotId"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowAddFileDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveAddUpdataFile"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <!-- 编辑文件 -->
    <HuilanDialog
      append-to-body
      :visible.sync="isShowEditFileDialog"
      width="600px"
      trigger="click"
    >
      <AddFile
        v-if="isShowEditFileDialog"
        :nodeDeepPath="curNodeDeepPath"
        :curTreeNode="curTreeNode"
        :curTreeNodeName="curTreeNodeName"
        :fileId="fileId"
        :fileType="'edit'"
        :fileUpdataObj="fileUpdataData"
        @addOrEditEmitEvent="addOrEditEmitEvent"
        ref="addEditFile"
        :robotId="robotId"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowEditFileDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveAddUpdataFile"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <!-- 左侧树设置 -->
    <el-drawer
      :title="$t('kwIntentionManage.classifySetting')"
      :visible.sync="settingDrawer"
      append-to-body
      show-close
      @close="treeSettingClose"
      size="89%"
    >
      <TreeSetting
        :botId="botId"
        :classType="classType"
        v-if="settingDrawer"
        :treeRootName="$t('file.generalClass')"
      />
      <template v-slot:footer>
        <el-button size="small" @click="settingDrawer = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveExpand">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </el-drawer>
  </HuilanBasic>
</template>

<script>
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
import { mapGetters } from "vuex";
import LeftTree from "@/components/kwLeftTree/index";
import TreeSetting from "@/components/kwLeftTree/treeSetting";
import AddFile from "./addFile.vue";
import {
  loadFileListUrl,
  delFileUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFileManagement/index.js";
export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  props: {
    ckEditFlag: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      disable: false,
      allWindowTopBodyHeight: 0, // 窗口内容的高度
      botId: "", // 机器人id
      fileManageType: "mangelist",
      classType: "file", // 树的类型
      node: "", // 分类树的节点
      resolve: "", // 分类树的resolve
      curSelectedTreeNode: {}, // 当前点击的树的节点
      curTreeNodeId: "", // 当前节点的id
      curTreeNodeSelectName: "", //当前节点名称
      settingDrawer: false,
      isExpandOrPutUp: "putup",
      isFirstExpandFlag: true, // 是否第一次展开
      fileId: "",
      fileUpdataData: {}, //编辑携带数据
      isShowAddFileDialog: false, //新增文件
      isShowEditFileDialog: false, //编辑文件
      loading: false,
      queryObj: {
        fileType: "",
        content: "",
      },
      fileTablePage: {
        pageSize: 10,
        currentPage: 1,
        total: 1,
      },
      fileTableData: [
        {
          question: "问题一",
          answer: "问题一答案",
        },
      ],
      fileTableOption: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: false,
        index: false,
        addBtn: false,
        selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menu: this.ckEditFlag == "ckEdit" ? false : true,
        menuWidth: 150,
        menuAlign: "center",
        dialogClickModal: false,
        emptyText: this.$t("aicosCommon.notData"),
        labelWidth: 120,
        column: [
          {
            label: this.$t("file.fileName"),
            prop: "fileOrginlName",
            span: 12,
            // search: true,
            width: 280,
            // search:true,
            // maxlength: 50,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("file.fileType"),
            prop: "fileType",
            span: 12,
            // width: 280,
            showWordLimit: true,
            overHidden: true,
            dicData: [
              {
                label: this.$t("file.text"),
                value: "TXT",
              },
              {
                label: this.$t("file.picture"),
                value: "IMAGE",
              },
              {
                label: this.$t("file.video"),
                value: "VIDEO",
              },
              {
                label: this.$t("file.audio"),
                value: "VOICE",
              },
              {
                label: this.$t("file.other"),
                value: "OTHER",
              },
            ],
          },
          // {
          //   label: '备注',
          //   prop: 'marks',
          //   span: 12,
          //   // search: true,
          //   // width: 280,
          //   // search:true,
          //   // maxlength: 50,
          //   showWordLimit: true,
          //   overHidden: true,
          // },
          {
            label: this.$t("faq.createTime"),
            prop: "createTime",
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("file.updateTime"),
            prop: "updateTime",
            // width: 80,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("file.updatedBy"),
            prop: "userName",
            // width: 80,
            showWordLimit: true,
            overHidden: true,
          },
        ],
      },
      selectionList: [],
      vesionRecordIsShow: false,
      curVesionRecordRow: {}, // 当前的file
      curNodeDeepPath: ["0"], // 当前点击节点的路径
    };
  },
  components: {
    AddFile,
    LeftTree,
    TreeSetting,
  },
  computed: {
    prefix() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    // 计算属性
    ...mapGetters(["botObj", "permission"]),
  },
  methods: {
    // 窗口改变，动态改变高度
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },
    // 子组件的触发
    addOrEditEmitEvent(params) {
      this.onLoad();
      this.curNodeDeepPath = [];
      params.nodeDeepPath.forEach((item) => {
        this.curNodeDeepPath.push(item);
      });
      this.fileManageType = params.type;
      this.isShowAddFileDialog = false;
      this.isShowEditFileDialog = false;
    },

    // 找到所有的父级节点id
    getCurNodeParentIds(curNode) {
      var that = this;
      var prevNode = {};

      if (curNode && curNode.data.id == "0") {
        //that.curNodeDeepPath.push(curNode.parent.data.id);
        return false;
      }

      if (curNode && curNode.parent && curNode.parent.data) {
        prevNode = curNode.parent;
        that.curNodeDeepPath.push(prevNode.data.id);

        that.getCurNodeParentIds(prevNode);
      }
    },

    //获取树的node和resolve
    getNode(data) {
      this.node = data.node;
      this.resolve = data.resolve;
    },
    //左侧树节点点击,右侧区域响应
    nodeClick(nodeId) {
      var tree = this.$refs.tree.$refs.tree;
      var curNode = tree.getNode(nodeId);

      this.curNodeDeepPath = []; // 清空path

      // 查找当前节点的所有父级
      this.$nextTick(() => {
        this.getCurNodeParentIds(curNode);
        this.curNodeDeepPath.reverse().push(nodeId);

        this.curSelectedTreeNode = curNode;
        if (curNode != "" && curNode != null) {
          this.curTreeNodeId = curNode.data.id;
          this.curTreeNodeSelectName = curNode.data.dname;
        }
        this.onLoad();
      });
    },

    // 打开树的设置
    openSetting() {
      this.settingDrawer = true;
    },

    // 关闭通用分类的设置弹框
    treeSettingClose() {
      this.$refs.tree.clearNode();
      this.$refs.tree.loadNode(this.node, this.resolve);
    },

    onLoad() {
      var cateid = this.curTreeNodeId == 0 ? "" : this.curTreeNodeId;
      this.loading = true;
      loadFileListUrl(
        cateid,
        this.fileTablePage.currentPage,
        this.fileTablePage.pageSize,
        this.queryObj.fileType,
        this.queryObj.content,
        this.botObj.id
      ).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          this.fileTableData = resData.data.records;
          this.fileTablePage.total = resData.data.total;
          this.loading = false;
        }
      });
    },

    // 搜索
    searchChange() {
      this.fileTablePage.currentPage = 1;
      this.onLoad();
    },

    // 重置
    searchReset() {
      this.choosedDismensionData = [];
      this.queryObj = {
        fileType: "",
        content: "",
      };
      this.onLoad();
    },

    //新增文件
    openFileAddDialog() {
      this.curTreeNodeName = this.curTreeNodeSelectName;
      this.curTreeNode = this.curTreeNodeId;
      this.fileType = "add";
      this.isShowAddFileDialog = true;
      this.fileUpdataData = {};
      this.robotId = this.botId;
    },

    // 编辑文件
    openEditFile(row) {
      this.fileType = "edit";
      this.curTreeNodeName = this.curTreeNodeSelectName;
      this.curTreeNode = this.curTreeNodeId;
      this.fileId = row.id;
      this.fileUpdataData = row;
      this.robotId = this.botId;
      this.isShowEditFileDialog = true;
    },

    saveAddUpdataFile() {
      this.disable = true;
      this.$refs.addEditFile.submit();
      setTimeout(() => {
        this.disable = false;
      }, 3000);
    },

    // 删除文件
    delFile(row, index, type) {
      var ids = [];
      var isOnlyStr = "";
      if (type == "only") {
        ids.push(row.id);
        isOnlyStr = this.$t("file.should");
      } else {
        if (this.selectionList.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("file.selectFileTips"),
          });
          return false;
        }
        this.selectionList.forEach((item) => {
          ids.push(item.id);
        });
        isOnlyStr = this.$t("file.these");
      }
      this.$confirm(
        `${this.$t("file.deletionTips")} ${isOnlyStr} ${this.$t("file.file")}?`,
        {
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          return delFileUrl(ids);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip"),
          });
          this.onLoad();
        });
    },

    //下载文件
    downLoadFile(row) {
      window.open(
        `${baseURL}api/${serviceList.file}/miniofile/download/${row.tenantId}/${row.objectName}`
      );
    },

    // 批量操作
    batchOperation(command) {
      if (command == "del") {
        this.delFile(null, 0, "batch");
      }
    },

    selectionChange(list) {
      this.selectionList = list;
    },
    getDocument() {
      this.$emit("getDocumentList", this.selectionList);
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.fileTablePage.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.fileTablePage.pageSize = pageSize;
    },
  },
  created() {
    this.botId = this.botObj.id;
  },
  mounted() {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    // 获取机器人id
    // let botObj = {
    //   id: "1234",
    // };
    // this.$store.commit("SET_BOTOBJ", botObj);
    // this.botId = this.botObj.id;

    // this.botId = botObj.id;
    if (this.desktopWindow) {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;

      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
  },
  beforeDestroy() {
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.file-manage-container {
  position: relative;
  // padding-left: 250px;

  .fag-manage-tree {
    position: absolute;
    left: 0;
    width: 250px;
    background-color: #fff;
    margin: 0 -7px;
  }

  .fag-manage-content {
    background-color: #fff;
    // margin-left: 25px;
    padding: 10px 0;
    overflow-y: auto;
  }
}

/deep/ .choose-perspective-dialog {
  .el-dialog__body {
    padding: 0px 0px 0 20px;
  }
}

/deep/ .avue-crud__menu {
  display: none;
}

/deep/ .choose-dismension-dialog {
  border-radius: 10px;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0px 0px 10px;
  }
}

/deep/ .el-table__row {
  p {
    margin: 0;
    padding: 0;
  }
}

.file-table-header {
  .file-search-header-wrap {
    /*position: relative;
      padding-left: 120px;
      padding-right: 315px;*/

    .file-search-select {
      position: absolute;
      left: 0;
      top: 0;
      width: 110px;
    }

    .file-search-value {
      position: relative;

      .file-search-input {
        /*width: 80%;*/
        min-width: 250px;
        display: inline-block;
        padding-right: 126px;
        position: relative;
      }

      .file-search-buttons {
        position: absolute;
        right: 0;
        top: 0;

        .kw-search-btn {
          padding: 5px;

          i {
            font-size: 20px;
          }
        }

        .kw-reset-btn {
          padding: 5px;

          i {
            font-size: 20px;
          }
        }
      }
    }

    .file-search-input-wrap {
      /*display: flex;
        justify-content: end;
        align-items: center;*/
      margin-top: 20px;

      .file-search-input-row {
        float: right;
        position: relative;
        padding-left: 120px;
      }
    }

    .file-operation-btns {
      /* position: absolute;
        right: 0;
        top: 0;*/
      text-align: right;

      .el-dropdown {
        margin-left: 10px;
      }
    }
  }

  .file-dismension-search-wrap {
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #f3f5f8;

    .dismension-search-wrap {
      margin-bottom: 20px;
      border-bottom: 1px solid #f3f5f8;

      .dismension-dl {
        padding-left: 160px;
        list-style: none;
        border-top: 1px solid #f3f5f8;
        height: 47px;
        position: relative;
        margin: 0;
        display: none;

        dt {
          position: absolute;
          left: 0;
          top: 0;
          width: 160px;
          background-color: #f7f9fb;
          line-height: 47px;
          color: #070b2d;
          text-align: center;
          padding: 0 10px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        dd {
          margin: 0 40px;
          padding: 0;

          .second-dismension-ul {
            display: flex;
            padding: 0;
            margin: 0;
            list-style: none;
            height: 47px;
            overflow: hidden;

            li {
              padding-right: 18px;
              position: relative;
              margin: 0;
              line-height: 47px;
              max-width: 160px;
              margin-right: 20px;

              .dismension-more-icon {
                position: absolute;
                right: 0;
                top: 0;
                height: 47px;
                line-height: 47px;
                cursor: pointer;
              }

              .dismension-name {
                font-size: 14px;
                color: #565863;
                display: block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                cursor: pointer;
              }

              .selected-dismension-name {
                color: #0045c8;
              }
            }
          }

          .dismension-more {
            display: none;
          }
        }

        @media screen and (max-width: 1306px) {
          dd {
            margin: 0 20px;
          }
        }

        .dismension-more-dd-wrap {
          margin-top: 7px;
        }

        .second-dismension-dd-more {
          padding-right: 30px;
          position: relative;

          .dismension-more {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            line-height: 47px;
            padding-right: 0;
            width: inherit;
            cursor: pointer;
          }
        }
      }

      .dismension-more-dl {
        height: inherit;
        display: block;
      }

      .search-other-item {
        width: 180px;
        margin-right: 10px;
        float: left;
        margin-bottom: 6px;
      }
    }
  }

  .choose-dismension {
    .choose-dismen-ul {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;
      flex-flow: row wrap;

      li {
        margin: 0 8px 10px 0;
        border: 1px solid #308dee;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        border-radius: 5px;
        font-size: 14px;

        span {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .first-text {
          max-width: 100px;
        }

        .delimiter-text {
          vertical-align: top;
          margin-top: 5px;
          font-style: normal;
        }

        .last-text {
          color: #308dee;
          max-width: 120px;
        }

        .choose-del-icon {
          color: #308dee;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
          vertical-align: top;
          margin-top: 8px;
        }
      }
    }
  }
}

.perspect-list-container {
  position: relative;
  width: 210px;
}

.perspect-list-wrap {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  /* height: 32px;*/
  padding-right: 20px;
  position: relative;

  .perspect-list-ul {
    padding: 0;
    margin: 0;
    list-style: none;
    /* line-height: 32px;*/
    min-height: 30px;

    .perspect-item {
      display: inline-block;
      vertical-align: top;
      background-color: #f4f4f5;
      color: #909399;
      margin: 3px 0 2px 6px;
      max-width: 100%;
      align-items: center;
      height: 24px;
      padding: 0 8px;
      line-height: 22px;
      border: 1px solid #e9e9eb;
      border-radius: 4px;
      white-space: nowrap;
      font-size: 12px;

      .perspect-tag-text {
        overflow: hidden;
        text-overflow: ellipsis;
        color: #909399;
        line-height: 22px;
        font-size: 12px;
        white-space: nowrap;
        max-width: 100px;
        display: inline-block;
        vertical-align: middle;
      }

      .perspect-tag-close {
        color: #909399;
        background-color: #c0c4cc;
        border-radius: 50%;
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 12px;
        height: 16px;
        width: 16px;
        line-height: 16px;
        vertical-align: middle;
        top: -1px;
        right: -5px;
        transform: scale(0.8);
      }
    }

    .perspect-tip {
      color: #c0c4cc;
      font-size: 13px;
      padding-left: 15px;
      padding-top: 7px;
    }
  }

  .perspect-select-icon {
    position: absolute;
    right: 0;
    top: -4px;
  }
}
</style>
