<template>
  <div style="background: #f8f9fa; height: 100%; padding: 20px">
    <el-row class="kw-hasLeft-container" style="height: 100%">
      <div class="kw-left-container" style="height: 100%">
        <LeftTree ref="tree" @getNode="getNode" @nodeClick="nodeClick" :classType="classType" :botId="botId"
          :isMine="isMine" :isSetting="isSetting" :name="treeRootName" />
      </div>

      <el-container class="kw-right-container" style="height: 100%; padding: 10px">
        <avue-crud :option="option" :data="data" ref="crudTemplateTable" :page.sync="page" :table-loading="loading"
          @on-load="onLoad">
          <template slot="header">
            <div class="kw-header">
              <div class="kw-button-container" style="margin-bottom: 20px">
                <!-- 新增分类 -->
                <el-button @click="addClassify" class="kw-build-button">{{
                  $t("kwIntentionManage.buildClassify")
                }}</el-button>
                <!-- 批量操作 -->
                <el-dropdown class="kw-batch-button" @command="handleCommand">
                  <el-button type="primary">
                    {{ $t('kwIntentionManage.moreMenu') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 批量移动 -->
                    <el-dropdown-item command="move">{{
                      $t("aicosCommon.batchMove")
                    }}</el-dropdown-item>
                    <!-- 批量删除 -->
                    <el-dropdown-item command="del">{{
                      $t("aicosCommon.batchDeleteBtn")
                    }}</el-dropdown-item>
                    <!-- 批量启用 -->
                    <el-dropdown-item command="start">{{
                      $t("aicosCommon.batchStart")
                    }}</el-dropdown-item>
                    <!-- 批量停用 -->
                    <el-dropdown-item command="pause">{{
                      $t("aicosCommon.batchPause")
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>

          <template slot-scope="scope" slot="menu">
            <!-- 编辑 -->
            <el-button type="text" size="small" @click.stop="handlerEdit(scope.row, scope.index)">{{
              $t("aicosCommon.editBtn") }}</el-button>
            <!-- 上移 -->
            <el-button type="text" size="small" :disabled="scope.index == 0"
              @click.stop="goWhere(true, scope.row, scope.index)">{{ $t("aicosCommon.moveUp") }}</el-button>
            <!-- 下移 -->
            <el-button type="text" size="small" :disabled="scope.index == data.length - 1"
              @click.stop="goWhere(false, scope.row, scope.index)">{{ $t("aicosCommon.moveDown") }}</el-button>
            <!-- 移动 -->
            <el-button type="text" size="small" @click.stop="handlerMove(scope.row, scope.index)">{{
              $t("aicosCommon.move") }}</el-button>
            <!-- 启用 -->
            <el-button type="text" size="small" v-if="scope.row.status != 1"
              @click.stop="changeStatus(true, scope.row, scope.index)">{{ $t("aicosCommon.start") }}</el-button>
            <!-- 停用 -->
            <el-button type="text" size="small" v-if="scope.row.status == 1"
              @click.stop="changeStatus(false, scope.row, scope.index)">{{ $t("aicosCommon.pause") }}</el-button>
            <!-- 删除 -->
            <el-button type="text" size="small" class="kw-del-btn" @click.stop="handlerDel(scope.row, scope.index)">{{
              $t("aicosCommon.delBtn") }}</el-button>
          </template>
          <template slot-scope="scope" slot="status">
            <div v-if="scope.row.status == 1">{{ $t("aicosCommon.start") }}</div>
            <div v-else>{{ $t("aicosCommon.pause") }}</div>
          </template>
        </avue-crud>
        <!-- 新建分类 -->
        <HuilanDialog :title="$t('kwIntentionManage.buildClassifyName')" append-to-body :visible.sync="classifyFlag"
          width="650px">
          <el-form ref="elForm" :label-position="labelPosition" :model="formData" :rules="rules" size="medium" label-width="109px">
            <el-form-item :label="$t('kwIntentionManage.classifyNames') + ':'" prop="classifyName">
              <el-input v-model="formData.classifyName" :placeholder="$t('kwIntentionManage.classifyNameTips')" clearable
                :style="{ width: '100%' }">
              </el-input>
            </el-form-item>
          </el-form>
          <template v-slot:footer>
            <el-button size="small" @click="classifyFlag = false">{{
              $t("aicosCommon.cancelBtn")
            }}</el-button>
            <el-button size="small" type="primary" @click="submitForm">{{
              $t("aicosCommon.saveBtn")
            }}</el-button>
          </template>
        </HuilanDialog>

        <!-- 移动分类 -->
        <HuilanDialog :title="$t('kwIntentionManage.moveTargetClassify')" append-to-body :visible.sync="moveClassifyFlag"
          width="650px">
          <el-form ref="elFormCas" :label-position="labelPosition" v-if="moveClassifyFlag" :model="moveData"
            :rules="rules" size="medium" label-width="109px">
            <el-form-item :label="$t('kwIntentionManage.targetClassify') + ':'" prop="moveInfo">
              <el-cascader :props="props" expandTrigger="hover" clearable
                :placeholder="$t('kwIntentionManage.targetClassifyTips')" v-model="moveData.moveInfo"
                @change="cascaderSelectChange" ref="cascaderRef" popper-class="hiddenRadio"></el-cascader>
            </el-form-item>
          </el-form>
          <template v-slot:footer>
            <el-button size="small" @click="moveClassifyFlag = false">{{
              $t("aicosCommon.cancelBtn")
            }}</el-button>
            <el-button size="small" type="primary" @click="saveMove">{{
              $t("aicosCommon.saveBtn")
            }}</el-button>
          </template>
        </HuilanDialog>
      </el-container>
    </el-row>
  </div>
</template>

<script>
import LeftTree from "@/components/kwLeftTree/index";
import { mapGetters } from "vuex"
import {
  sonList,
  saveOrUpdate,
  changeOrder,
  changeStatus,
  classifyDelete,
  treeList,
  moveNode,
} from "@/api/kwKnowledgeCenter/kwClassifySetting/index";
export default {
  mounted () { },

  props: {
    botId: {
      type: String,
      default: () => {
        return "";
      },
    },
    classType: {
      type: String,
      default: () => {
        return "";
      },
    },
    treeRootName: {
      type: String,
      default: () => {
        return "全部";
      },
    },
  },
  computed: {

    // 计算属性
    ...mapGetters(['language']),
    labelPosition () {
      return this.language != 'zh' ? 'top' : 'right'
    },
  },
  data () {
    return {
      name: "全部",
      isSetting: false,
      cur: {},
      moveClassifyFlag: false,
      props: {
        // multiple: true,
        checkStrictly: true, // 父子不想关联
        // emitPath: false,
        lazy: true,
        lazyLoad: this.lazyLoads,
        value: "id",
        label: "dname",
      },

      isMine: false,
      ancestorsId: "0",
      loading: false,
      classifyFlag: false, //新建分类标识
      moveData: {
        moveInfo: "",
      },
      formData: {
        classifyName: "",
      },
      rules: {
        classifyName: [
          {
            required: true,
            message: this.$t("kwIntentionManage.classifyNameTips"),
            trigger: "blur",
          },
        ],
        // moveInfo: [
        //   {
        //     require: true,
        //     message: this.$t("kwIntentionManage.targetClassifyTips"),
        //     trigger: "blur",
        //   },
        // ],
      },
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      node: "",
      resolve: "",
      option: {
        menuWidth: 300,
        tip: false,
        selection: true,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        column: [
          {
            label: this.$t("kwIntentionManage.nodeName"), //节点名称
            prop: "name",
          },
          {
            label: this.$t("kwIntentionManage.nodeStatus"), //状态
            prop: "status",
          },
        ],
      },
    };
  },
  components: {
    LeftTree,
  },
  methods: {
    //级联懒加载
    lazyLoads (node, resolve) {
      if (node.level == 0) {
        const info = {
          ancestors: 0,
          botId: this.botId,
          classType: this.classType,
          mine: this.isMine,
        };
        treeList(info).then((res) => {
          resolve(
            res.data.data.map((item) => {
              return {
                ...item,
                leaf: item.isLeaf != 0,
              };
            })
          );
        });
      } else {
        var parentId = node.data.id;
        const info = {
          ancestors: parentId,
          botId: this.botId,
          classType: this.classType,
          mine: this.isMine,
        };
        treeList(info).then((res) => {
          resolve(
            res.data.data.map((item) => {
              return {
                ...item,
                leaf: item.isLeaf != 0,
              };
            })
          );
        });
      }
    },
    //级联选中
    cascaderSelectChange () {
      this.$refs.cascaderRef.dropDownVisible = false;
    },
    async onLoad () {
      this.loading = true;
      const info = {
        ancestors: this.ancestorsId,
        classType: this.classType,
        botId: this.botId,
      };
      const result = await sonList(info);
      if (result.data.code == 200) {
        this.data = result.data.data;
        this.loading = false;
      }
    },
    //左侧树节点切换
    nodeClick (data) {
      this.ancestorsId = data;
      this.onLoad();
    },
    //获取树的node和resolve
    getNode (data) {
      this.node = data.node;
      this.resolve = data.resolve;
    },

    submitForm () {
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return;
        const info = {
          dname: this.formData.classifyName,
          ancestors: this.ancestorsId,
          botId: this.botId,
          classType: this.classType,
        };
        const result = await saveOrUpdate(info);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.classifyFlag = false;
          this.$refs.tree.clearNode();
          this.$refs.tree.loadNode(this.node, this.resolve);
          this.onLoad();
        }
      });
    },

    saveMove () {
      this.$refs.elFormCas.validate(async (/*valid*/) => {
        // if (!valid) return;
        if (this.moveData.moveInfo.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("kwIntentionManage.targetClassifyTips"),
          });
          return;
        }
        const moveInfo = {
          fromId: this.cur.id,
          todoId: this.moveData.moveInfo[this.moveData.moveInfo.length - 1],
        };
        const result = await moveNode(moveInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.moveClassifyFlag = false;
          this.$refs.tree.clearNode();
          this.$refs.tree.loadNode(this.node, this.resolve);
          this.onLoad();
        }
      });
    },
    //新建分类
    addClassify () {
      this.classifyFlag = true;
      this.formData.classifyName = "";
    },

    //移动分类
    handlerMove (row/*, index*/) {
      this.cur = row;
      this.moveClassifyFlag = true;
      this.moveData.moveInfo = "";
    },
    //上移下移
    async goWhere (flag, row, index) {
      if (flag) {
        //上移
        const moveInfo = {
          fromId: row.id,
          todoId: this.data[index - 1].id,
        };
        const result = await changeOrder(moveInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.$refs.tree.clearNode();
          this.$refs.tree.loadNode(this.node, this.resolve);
          this.onLoad();
        }
      } else {
        //下移
        const moveInfo = {
          fromId: row.id,
          todoId: this.data[index + 1].id,
        };
        const result = await changeOrder(moveInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.$refs.tree.clearNode();
          this.$refs.tree.loadNode(this.node, this.resolve);
          this.onLoad();
        }
      }
    },

    //启用,停用
    async changeStatus (flag, row/*, index*/) {
      if (flag) {
        //启用
        const statusInfo = {
          id: row.id,
          status: 1,
        };
        const result = await changeStatus(statusInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("kwIntentionManage.successStart"),
          });
          this.$refs.tree.clearNode();
          this.$refs.tree.loadNode(this.node, this.resolve);
          this.onLoad();
        }
      } else {
        //停用
        const statusInfo = {
          id: row.id,
          status: 0,
        };
        const result = await changeStatus(statusInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("kwIntentionManage.successStart"),
          });
          this.$refs.tree.clearNode();
          this.$refs.tree.loadNode(this.node, this.resolve);
          this.onLoad();
        }
      }
    },
    //删除
    handlerDel (row/*, index*/) {
      this.$confirm(this.$t("kwIntentionManage.sureDelClassify"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const info = {
            id: row.id,
          };
          const result = await classifyDelete(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
            this.$refs.tree.clearNode();
            this.$refs.tree.loadNode(this.node, this.resolve);
            this.onLoad();
          }
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scoped>
.hiddenRadio .el-radio__inner {
  top: -18px;
  left: -19px;
  border-radius: 0;
  border: 0;
  width: 170px;
  height: 34px;
  background-color: transparent;
  cursor: pointer;
  box-sizing: border-box;
  position: absolute;
}

.hiddenRadio .el-radio__input.is-checked .el-radio__inner {
  background: transparent;
}
</style>
