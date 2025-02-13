<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        size="small"
        type="primary"
        @click="addTask"
        v-if="permissionList.saveBtn"
        class="kw-btn-green"
        >{{ $t("knowledgeBatchTest.addTask") }}
      </el-button>
      <el-button
        type="primary"
        size="small"
        class="kw-btn-blue"
        @click="deleteBatchs"
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
        <el-button type="default" @click="configColumn">
          <i class="el-icon-s-operation"></i>
        </el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      :page.sync="page"
      v-model="form"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
      <!-- <template slot="menu" slot-scope="{ row }">
        <el-button type="text" size="small" @click.stop="startClick(row)"
          >立即测试</el-button
        >
        <el-button type="text" size="small" @click.stop="testClick(row)"
          >测试结果</el-button
        >
        <el-button type="text" size="small" @click.stop="testResultClick(row)"
          >测试统计</el-button
        >
        <el-button type="text" size="small" @click="rowUpdate(row)"
          >编辑</el-button
        >
        <el-button type="text" size="small" @click="rowDel(row)"
          >删除</el-button
        >
      </template> -->
    </avue-crud>
    <el-drawer
      :title="
        type === 'add'
          ? $t('knowledgeBatchTest.addTask')
          : $t('knowledgeBatchTest.editTask')
      "
      append-to-body
      :visible.sync="addTaskDialog"
      size="700px"
      custom-class="huilan-drawer-form"
      :wrapperClosable="false"
    >
      <el-form
        ref="taskForm"
        :model="taskForm"
        size="small"
        :label-position="labelPosition"
        labelWidth="110px"
        :rules="rules"
        style="padding: 30px"
      >
        <el-form-item
          :label="$t('knowledgeBatchTest.taskName') + ':'"
          prop="taskName"
        >
          <el-input
            v-model="taskForm.taskName"
            maxlength="50"
            show-word-limit
            :placeholder="
              $t('aicosCommon.pleaseInput') + $t('knowledgeBatchTest.taskName')
            "
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('knowledgeBatchTest.testData') + ':'"
          prop="objectName"
        >
          <el-upload
            class="upload-demo"
            :action="url"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :data="dataObj"
            :on-success="successUpload"
            :limit="1"
            accept=".xls,.xlsx"
            :disabled="type === 'edit'"
            :file-list="fileList"
          >
            <el-button
              size="small"
              type="primary"
              class="el-icon-upload"
              v-if="type === 'add'"
              >{{ $t("knowledgeBatchTest.clickUpload") }}</el-button
            >
            <el-button
              size="small"
              type="text"
              @click.stop="downLoad"
              v-if="type === 'add'"
              >{{ $t("knowledgeBatchTest.downloadTemplate") }}</el-button
            >
            <div slot="tip" class="el-upload__tip" v-if="type === 'add'">
              {{ $t("knowledgeBatchTest.fileFormats") }}
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          :label="$t('knowledgeBatchTest.robotInstance') + ':'"
          prop="robotInstanceId"
        >
          <el-select
            v-model="taskForm.robotInstanceId"
            clearable
            filterable
            :placeholder="
              $t('aicosCommon.pleaseSelect') +
              $t('knowledgeBatchTest.robotInstance')
            "
            style="width: 100%"
            :disabled="type === 'edit'"
          >
            <el-option
              v-for="item in robotList"
              :key="item.id"
              :label="item.robotName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button size="small" @click="addTaskDialog = false">{{
            $t("aicosCommon.cancelBtn")
          }}</el-button>
          <el-button size="small" type="primary" @click="saveTaskClick" :disabled="disable">{{
            $t("aicosCommon.saveBtn")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer
      :title="title"
      append-to-body
      :visible.sync="testResultDialog"
      size="85%"
      custom-class="huilan-drawer-form"
      @close="colseDialog"
    >
      <template
        v-if="
          title === $t('knowledgeBatchTest.testStatistics') && testResultDialog
        "
      >
        <Teststatistics
          :rowData="selectRow"
          style="padding: 20px"
        ></Teststatistics>
      </template>
      <template
        v-if="title === $t('knowledgeBatchTest.testResult') && testResultDialog"
      >
        <Testresult :rowData="selectRow" style="padding: 20px"></Testresult>
      </template>
    </el-drawer>
  </HuilanBasic>
</template>
<script>
import Teststatistics from "./testStatistics";
import Testresult from "./testResult";
import {
  taskList,
  saveTask,
  editTask,
  deleteTask,
  doDetection,
} from "@/api/kwKnowledgeCenter/knowledgeBatchTest/index";
import { getRobotList } from "@/api/kwRobot/kwRobotTrain/index";
import { mapGetters } from "vuex";
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
import { deepClone, getTextWidth } from "@/util/util";

const { knowledge } = serviceList;
export default {
  components: {
    Teststatistics,
    Testresult,
  },
  data() {
    return {
      // 搜索表单
      searchForm: {
        time: [],
        taskName: "",
      },
      disable:false,
      searchFieldList: [
        {
          prop: "time",
          type: "datetimerange",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          format: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: this.$t("knowledgeBatchTest.startTime"),
          endPlaceholder: this.$t("knowledgeBatchTest.endTime"),
        },
        {
          prop: "taskName",
          placeholder: this.$t("knowledgeBatchTest.searchContent"),
        },
      ],
      //表格数据
      data: [],
      selectRow: {},
      loading: false,
      form: {},
      option: {
        header: false,
        select: true,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        viewBtn: false,
        selection: true,
        tip: false,
        menuWidth: 300,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("knowledgeBatchTest.taskName"),
            prop: "taskName",
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("knowledgeBatchTest.testData"),
            prop: "objectName",
            minWidth: 200,
            overHidden: true,
          },
          {
            label: this.$t("knowledgeBatchTest.testRobotExample"),
            prop: "robotInstanceId",
            type: "select",
            dicData: [],
            filterable: true,
            props: {
              label: "robotName",
              value: "id",
            },
            minWidth: 120,
            overHidden: true,
          },
          {
            label: this.$t("knowledgeBatchTest.testRound"),
            prop: "testRound",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.testStatus"),
            prop: "taskStatus",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeBatchTest.toTested"),
                value: 0,
              },
              {
                label: this.$t("knowledgeBatchTest.underTesting"),
                value: 1,
              },
              {
                label: this.$t("knowledgeBatchTest.testsComplete"),
                value: 2,
              },
              {
                label: this.$t("knowledgeBatchTest.testFailed"),
                value: 3,
              },
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          // {
          //   label: "上下文关联测试",
          //   prop: "status",
          //   type: "switch",
          //   dicData: [
          //     {
          //       label: "开启",
          //       value: 1,
          //     },
          //     {
          //       label: "关闭",
          //       value: 0,
          //     },
          //   ],
          // },
          {
            label: this.$t("knowledgeBatchTest.createTime"),
            prop: "createTime",
            minWidth: 100,
            overHidden: true,
          },
        ],
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      // 新增任务弹窗
      type: "",
      addTaskDialog: false,
      taskForm: {
        taskName: "",
        fileName: "",
        objectName: "",
        bucketName: "",
      },
      fileList: [],
      dataObj: {
        fromSystemName: "base",
      },
      url: `${baseURL}api/${serviceList.file}/miniofile/upload`,
      robotList: [],
      rules: {
        taskName: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseInput") +
              this.$t("knowledgeBatchTest.taskName"),
            trigger: "blur",
          },
        ],
        robotInstanceId: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseSelect") +
              this.$t("knowledgeBatchTest.testRobotExample"),
            trigger: "change",
          },
        ],
        objectName: [
          {
            required: true,
            message: this.$t("knowledgeBatchTest.uploadTestData"),
            trigger: "blur",
          },
        ],
      },
      // 立即测试或测试结果弹窗
      testResultDialog: false,
      title: "",
      timer: null,
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["permission", "userInfo", "botObj", "language"]),
    permissionList() {
      return {
        saveBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-saveTask`]
        ),
        testBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-testTask`]
        ),
        resultBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-result`]
        ),
        statisticsBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-statistics`]
        ),
        editBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-updateTask`]
        ),
        delBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-delTask`]
        ),
      };
    },
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  mounted() {
    getRobotList(this.$store.state.user.currentTenantId).then((res) => {
      if (res.data.success) {
        let data = this.findObject(this.option.column, "robotInstanceId");
        data.dicData = res.data.data;
        this.robotList = res.data.data;
      }
    });
    this.timer = setInterval(() => {
      this.onLoad();
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    // 操作栏
    getRowActions() {
      const map = {
        testBtn: {
          name: this.$t("knowledgeBatchTest.testNow"),
          command: "startClick",
        },
        resultBtn: {
          name: this.$t("knowledgeBatchTest.testResult"),
          command: "resultClick",
        },
        statisticsBtn: {
          name: this.$t("knowledgeBatchTest.testStatistics"),
          command: "statisticsClick",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowUpdate",
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
        },
      };
      const list = [
        "testBtn",
        "resultBtn",
        "statisticsBtn",
        "editBtn",
        "delBtn",
      ];
      const actions = [];
      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      this[command](row, index);
    },
    // 删除
    rowDel(row) {
      this.$confirm(this.$t("knowledgeBatchTest.deleteSelectedData"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const delInfo = {
            ids: row.id,
          };
          const result = await deleteTask(delInfo);
          if (result.data.code == 200) {
            this.$message.success(this.$t("aicosCommon.deleteSuccessTip"));
            this.onLoad();
          }
        })
        .catch(() => {
          this.$message.error(this.$t("knowledgeBatchTest.deleteFailed"));
        });
    },
    // 编辑
    rowUpdate(row) {
      this.type = "edit";
      this.taskForm = deepClone(row);
      this.fileList = [
        {
          name: row.objectName,
          url: row.objectName,
        },
      ];
      this.addTaskDialog = true;
    },
    // 上传文件前
    beforeUpload(file) {
      const types = file.name.split(".")[1];
      const fileType = ["xls", "xlsx"].some((item) => item === types);
      if (!fileType) {
        this.$message.error(this.$t("system.asrAndTts.formatErrorTip"));
        return false;
      }
      this.taskForm.fileName = file.name;
      this.taskForm.bucketName = "";
    },
    //上传成功
    successUpload(file) {
      this.taskForm.bucketName = file.data.bucketName;
      this.taskForm.objectName = file.data.objectName;
      this.$refs.taskForm.clearValidate("objectName");
    },
    // 移除上传文件
    handleRemove() {
      this.taskForm.objectName = "";
    },
    // 立即测试
    startClick(row) {
      if (row.taskStatus == 1) {
        this.$message({
          message: this.$t("knowledgeBatchTest.taskCurrently"),
          type: "error",
        });
        return;
      }
      doDetection({ id: row.id }).then((res) => {
        if (res.data.success) {
          this.$message({
            message: this.$t("knowledgeBatchTest.testingProgress"),
            type: "success",
          });
          if (this.validatenull(this.timer)) {
            this.timer = setInterval(() => {
              this.onLoad();
            }, 15000);
          } else {
            this.onLoad();
          }
        }
      });
    },
    colseDialog() {
      this.testResultDialog = false;
      this.onLoad();
    },
    resultClick(row) {
      this.selectRow = row;
      this.title = this.$t("knowledgeBatchTest.testResult");
      this.testResultDialog = true;
    },
    statisticsClick(row) {
      this.selectRow = row;
      this.title = this.$t("knowledgeBatchTest.testStatistics");
      this.testResultDialog = true;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad() {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        taskName: this.searchForm.taskName,
      };
      if (!this.validatenull(this.searchForm.time)) {
        obj.startTime = this.searchForm.time[0];
        obj.endTime = this.searchForm.time[1];
      }
      taskList(obj)
        .then((res) => {
          if (res.data.success) {
            this.page.current = res.data.data.current;
            this.page.total = res.data.data.total;

            this.option.column.forEach((item) => {
              let width = getTextWidth(item.label).nodeWidth + 80;
              if (item.width) {
                if (width < item.width) {
                  return;
                }
                this.$set(item, "width", width);
              } else {
                this.$set(item, "minWidth", width);
              }
            });
            if (this.language != "zh") {
              this.option.menuWidth = 350;
            } else {
              this.option.menuWidth = 300;
            }
            this.data = res.data.data.records;
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
          this.data = [];
        });
    },
    downLoad() {
      window.open(
        `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/download/template`
      );
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    addTask() {
      this.type = "add";
      this.fileList = [];
      this.taskForm = {
        taskName: "",
        robotInstanceId: "",
        objectName: "",
      };
      this.addTaskDialog = true;
      this.$nextTick(() => {
        this.$refs["taskForm"].clearValidate();
      });
    },
    async deleteBatchs() {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("knowledgeBatchTest.selectDeleteTips"));
        return;
      }
      let ids = this.selectionList.map((item) => item.id).join(",");
      const result = await deleteTask({ ids });
      if (result.data.code == 200) {
        this.$message.success(this.$t("aicosCommon.deleteSuccessTip"));
        this.onLoad();
      }
    },
    searchReset() {
      this.searchForm = {
        time: [],
        taskName: "",
      };
      this.onLoad();
    },
    searchChange() {
      this.onLoad();
    },
    // 新增任务保存
    saveTaskClick() {
      let validateFieldList = [];
      this.$refs["taskForm"].validateField(
        ["taskName", "robotInstanceId"],
        (valid) => {
          if (!valid) {
            validateFieldList.push(valid);
            if (
              validateFieldList.length == 2 &&
              validateFieldList.every((item) => item === "")
            ) {
              if (this.validatenull(this.taskForm.objectName)) {
                if (
                  document.getElementsByClassName("el-message").length === 0
                ) {
                  this.$message.error(
                    this.$t("knowledgeBatchTest.uploadTestData")
                  );
                }
                return;
              }
              this.disable =  true
              if (this.type === "add") {
                saveTask(this.taskForm).then((res) => {
                  if (res.data.success) {
                    this.$message.success(
                      this.$t("aicosCommon.saveSuccessTip")
                    );
                    this.addTaskDialog = false;
                    this.disable = false
                    this.onLoad();
                  }
                });
              }
              if (this.type === "edit") {
                editTask({
                  id: this.taskForm.id,
                  taskName: this.taskForm.taskName,
                }).then((res) => {
                  if (res.data.success) {
                    this.$message.success(
                      this.$t("knowledgeBatchTest.modifiedSuccess")
                    );
                    this.addTaskDialog = false;
                    this.disable = false
                    this.onLoad();
                  }
                });
              }
            }
          }
        }
      );
    },
  },
};
</script>
