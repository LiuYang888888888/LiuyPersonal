<template>
  <div class="answer-strategy-index">
    <el-form v-model="formData" size="small">
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
        class="setting-collapse"
      >
        <!-- 兜底策略设置 -->
        <el-collapse-item :title="$t('kwRobotManage.strategySetting')" name="4">
          <p class="tip">
            {{ $t("kwRobotManage.strategySettingTip") }}
          </p>
          <el-form-item>
            <el-select
              clearable
              v-model="formData.robotChatId"
              :placeholder="$t('kwRobotManage.selectStrategySetting')"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <!-- 应答优先策略 -->
        <el-collapse-item
          :title="$t('kwRobotManage.priorityStrategy')"
          name="1"
        >
          <p class="tip">
            {{ $t("kwRobotManage.outboundModule") }}
          </p>
          <el-form-item>
            <el-radio
              v-model="formData.priorityOrConfidenceFirst"
              label="confidence"
              style="color: black"
              >{{
                $t("kwRobotManage.confidenceFirst") +
                $t("kwRobotManage.recommend")
              }}</el-radio
            >
            <el-radio
              v-model="formData.priorityOrConfidenceFirst"
              label="priority"
              style="color: black"
              >{{ $t("kwRobotManage.outgoingModule") }}</el-radio
            >
          </el-form-item>
        </el-collapse-item>
        <!-- 优先级配置 -->
        <el-collapse-item
          :title="$t('kwRobotManage.priorityOutgoingModule')"
          name="2"
          v-if="formData.priorityOrConfidenceFirst === 'priority'"
        >
          <p class="tip">
            {{ $t("kwRobotManage.priorityOutgoingModuleTips") }}
          </p>
          <avue-crud :data="tableData" :option="tableOption">
            <template slot="menuRight">
              <el-button
                class="el-icon-plus"
                type="text"
                @click="addConfig(2, tableData)"
              >
                {{ $t("kwRobotManage.addConfiguration") }}</el-button
              >
            </template>
            <template slot="menu" slot-scope="{ type, size, row, index }">
              <template>
                <el-button
                  :type="type"
                  v-if="index > 0"
                  @click="sortTable('up', row, index)"
                  >{{ $t("aicosCommon.moveUp") }}</el-button
                >
                <el-button
                  :type="type"
                  v-if="index < tableData.length - 1"
                  @click="sortTable('down', row, index)"
                  >{{ $t("aicosCommon.moveDown") }}</el-button
                >
              </template>
            </template>
          </avue-crud>
        </el-collapse-item>
        <!-- 应答阈值 -->
        <el-collapse-item
          :title="$t('kwRobotManage.outboundModuleThreshold')"
          name="3"
        >
          <p class="tip">
            {{ $t("kwRobotManage.outboundModuleAnswerTips") }}
          </p>
          <avue-crud :data="answerData" :option="answerOption">
            <template slot="answerThreshold" slot-scope="{ row, index }">
              <!-- FAQ知识 -->
              <template v-if="row.type === 1">
                <el-input-number
                  v-model="formData.faqResponseSetting.answerThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.9"
                  :step="2"
                ></el-input-number>
              </template>
              <!-- 表格知识 -->
              <template v-else-if="row.type === 2">
                <el-input-number
                  v-model="formData.tableResponseSetting.answerThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.9"
                  :step="2"
                ></el-input-number>
              </template>
              <!-- 文档知识 -->
              <template v-else-if="row.type === 3">
                <el-input-number
                  v-model="formData.docResponseSetting.answerThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.9"
                  :step="2"
                ></el-input-number>
              </template>
              <!-- 流程对话 -->
              <template v-else-if="row.type === 4">
                <el-input-number
                  v-model="formData.flowResponseSetting.answerThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.9"
                  :step="2"
                ></el-input-number>
              </template>
              <!-- 意图管理 -->
              <template v-else-if="row.type === 5">
                <el-input-number
                  v-model="formData.intentResponseSetting.answerThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.9"
                  :step="2"
                ></el-input-number>
              </template>
              <template v-else>
                <el-input-number
                  v-model="answerData[index].answerThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.9"
                  :step="2"
                ></el-input-number>
              </template>
            </template>
            <template slot="menuRight">
              <el-button
                class="el-icon-plus"
                type="text"
                @click="addConfig(3, answerData)"
              >
                {{ $t("kwRobotManage.addConfiguration") }}</el-button
              >
            </template>
          </avue-crud>
        </el-collapse-item>
        <!-- 过滤配置 -->
        <el-collapse-item :title="$t('kwRobotManage.sessionModule')" name="4">
          <p class="tip">
            {{ $t("kwRobotManage.sessionModuleAnswerTips") }}
          </p>
          <SessionModule :moduleData="moduleData" ref="sessionModule" />
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div style="text-align: center">
      <el-button size="small" type="primary" @click="savepolicy">{{
        $t("aicosCommon.saveBtn")
      }}</el-button>
    </div>
    <HuilanDialog
      :title="$t('kwRobotManage.addConfiguration')"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="optTag"
    >
      <Addconfig ref="addconfig" :checkedData="checkedData" v-if="optTag" />
      <template v-slot:footer>
        <el-button size="small" @click="optTag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveSelectConfig">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SessionModule from "./sessionModule";
import Addconfig from "../addconfig";
import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import { deepClone } from "@/util/util";
import { isNull } from "@/util/qsgCommon";
import { listData as moduleData } from "@/api/kwRobot/kwRobotTrain/index";
export default {
  name: "",
  props: {
    fatherData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const {
      priorityOrConfidenceFirst,
      docResponseSetting,
      flowResponseSetting,
      faqResponseSetting,
      tableResponseSetting,
      intentResponseSetting,
      actionAgentsResponseSetting,
      robotChatId,
    } = deepClone(this.fatherData);
    const formData = {
      priorityOrConfidenceFirst,
      docResponseSetting: {
        answerThreshold: docResponseSetting.answerThreshold,
        negativeRegexps: docResponseSetting.negativeRegexps,
        negativeSentences: docResponseSetting.negativeSentences,
        priority: docResponseSetting.priority,
        threshold: docResponseSetting.threshold,
      },
      flowResponseSetting: {
        answerThreshold: flowResponseSetting.answerThreshold,
        negativeRegexps: flowResponseSetting.negativeRegexps,
        negativeSentences: flowResponseSetting.negativeSentences,
        priority: flowResponseSetting.priority,
        threshold: flowResponseSetting.threshold,
      },
      faqResponseSetting: {
        answerThreshold: faqResponseSetting.answerThreshold,
        negativeRegexps: faqResponseSetting.negativeRegexps,
        negativeSentences: faqResponseSetting.negativeSentences,
        priority: faqResponseSetting.priority,
        threshold: faqResponseSetting.threshold,
      },
      tableResponseSetting: {
        answerThreshold: tableResponseSetting.answerThreshold,
        negativeRegexps: tableResponseSetting.negativeRegexps,
        negativeSentences: tableResponseSetting.negativeSentences,
        priority: tableResponseSetting.priority,
        threshold: tableResponseSetting.threshold,
      },
      intentResponseSetting: {
        answerThreshold: !intentResponseSetting
          ? 0.7
          : intentResponseSetting.answerThreshold,
        negativeRegexps: !intentResponseSetting
          ? []
          : intentResponseSetting.negativeRegexps,
        negativeSentences: !intentResponseSetting
          ? []
          : intentResponseSetting.negativeSentences,
        priority: !intentResponseSetting ? 1 : intentResponseSetting.priority,
        threshold: !intentResponseSetting
          ? 0.7
          : intentResponseSetting.threshold,
      },
      actionAgentsResponseSetting,
      robotChatId: this.validatenull(robotChatId) ? "" : robotChatId,
    };
    return {
      moduleData: [],
      selectType: null,
      optTag: false,
      botId: "",
      strategyId: "",
      activeNames: ["1", "2", "3", "4"],
      tableOption: {
        index: true,
        indexLabel: this.$t("kwRobotManage.priority"),
        indexWidth: 120,
        header: true,
        addBtn: false,
        refreshBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotManage.sessionModuleName"),
            prop: "name",
          },
          {
            label: this.$t("kwRobotManage.state"),
            prop: "isUse",
            type: "select",
            dicData: [
              {
                label: this.$t("aicosCommon.start"),
                value: 1,
              },
              {
                label: this.$t("aicosCommon.pause"),
                value: 0,
              },
            ],
          },
        ],
      },
      tableData: [],
      answerData: [],
      answerOption: {
        header: true,
        addBtn: false,
        refreshBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        menu: false,
        align: "center",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotManage.outgoingModuleName"),
            prop: "name",
            width: 200,
          },
          {
            label: this.$t("kwRobotManage.state"),
            prop: "isUse",
            type: "select",
            dicData: [
              {
                label: this.$t("aicosCommon.start"),
                value: 1,
              },
              {
                label: this.$t("aicosCommon.pause"),
                value: 0,
              },
            ],
          },
          {
            label: this.$t("kwRobotManage.minimumCredibleThreshold"),
            prop: "answerThreshold",
          },
        ],
      },
      formData,
      checkedData: [],
      options: [],
    };
  },
  components: {
    SessionModule,
    Addconfig,
  },
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "instanceObj"]),
  },
  methods: {
    // 保存配置
    saveSelectConfig() {
      let data = this.$refs.addconfig.selectData;
      if (this.selectType === 2) {
        this.tableData = data;
      }
      if (this.selectType === 3) {
        this.answerData = [];
        data.forEach((item) => {
          this.answerData.push({ ...item, ...{ answerThreshold: 0.7 } });
        });
      }
      this.optTag = false;
    },
    // 排序
    sortTable(type, row, index) {
      if (type === "up") {
        // console.log("向上");
        [this.tableData[index], this.tableData[index - 1]] = [
          this.tableData[index - 1],
          this.tableData[index],
        ];
      }
      if (type === "down") {
        // console.log("向下");
        [this.tableData[index], this.tableData[index + 1]] = [
          this.tableData[index + 1],
          this.tableData[index],
        ];
      }
      this.tableData.sort();
      this.tableData.forEach((item, index) => {
        item.priority = index + 1;
      });
    },
    // 添加配置
    addConfig(type, data) {
      this.selectType = type;
      this.checkedData = data;
      this.optTag = true;
    },
    // 保存策略
    savepolicy() {
      if (this.formData.priorityOrConfidenceFirst === "priority") {
        if (
          !this.formData.faqResponseSetting.answerThreshold ||
          !this.formData.tableResponseSetting.answerThreshold ||
          !this.formData.docResponseSetting.answerThreshold ||
          !this.formData.flowResponseSetting.answerThreshold ||
          !this.formData.intentResponseSetting.answerThreshold
        ) {
          if (document.getElementsByClassName("el-message").length === 0) {
            this.$message.error(this.$t("kwRobotManage.thresholdTips"));
            return;
          }
        }
        const sessionData = this.$refs.sessionModule.tableData;
        sessionData.forEach((item) => {
          if (item.isSystem === 1) {
            if (item.type === 1) {
              this.formData.faqResponseSetting.negativeRegexps =
                item.negativeRegexps;
              this.formData.faqResponseSetting.negativeSentences =
                item.negativeSentences;
            }
            if (item.type === 3) {
              this.formData.docResponseSetting.negativeRegexps =
                item.negativeRegexps;
              this.formData.docResponseSetting.negativeSentences =
                item.negativeSentences;
            }
            if (item.type === 2) {
              this.formData.tableResponseSetting.negativeRegexps =
                item.negativeRegexps;
              this.formData.tableResponseSetting.negativeSentences =
                item.negativeSentences;
            }
            if (item.type === 4) {
              this.formData.flowResponseSetting.negativeRegexps =
                item.negativeRegexps;
              this.formData.flowResponseSetting.negativeSentences =
                item.negativeSentences;
            }
            if (item.type === 5) {
              this.formData.intentResponseSetting.negativeRegexps =
                item.negativeRegexps;
              this.formData.intentResponseSetting.negativeSentences =
                item.negativeSentences;
            }
          } else {
            let index = this.formData.actionAgentsResponseSetting.findIndex(
              (e) => e.actionAgentId === item.id
            );
            if (index > -1) {
              this.formData.actionAgentsResponseSetting[index].negativeRegexps =
                item.negativeRegexps;
              this.formData.actionAgentsResponseSetting[
                index
              ].negativeSentences = item.negativeSentences;
            } else {
              this.formData.actionAgentsResponseSetting.push({
                actionAgentId: item.id,
                actionAgentName: item.name,
                negativeRegexps: item.negativeRegexps,
                negativeSentences: item.negativeSentences,
                priority: null, //出话模块应答优先级配置>优先级
                recommendSize: null, //出话模块推荐条数>最大推荐条数
                recommendThreshold: null, //出话模块推荐阈值>最低可信阈值
                threshold: null, //出话模块应答阈值配置>最低可信阈值
                answerThreshold: null,
              });
            }
          }
        });
        this.tableData.forEach((item) => {
          if (item.isSystem === 1) {
            if (item.type === 1) {
              this.formData.faqResponseSetting.priority = item.priority;
            }
            if (item.type === 2) {
              this.formData.tableResponseSetting.priority = item.priority;
            }
            if (item.type === 3) {
              this.formData.docResponseSetting.priority = item.priority;
            }
            if (item.type === 4) {
              this.formData.flowResponseSetting.priority = item.priority;
            }
            if (item.type === 5) {
              this.formData.intentResponseSetting.priority = item.priority;
            }
          } else {
            let index = this.formData.actionAgentsResponseSetting.findIndex(
              (e) => e.actionAgentId === item.id
            );
            if (index > -1) {
              this.formData.actionAgentsResponseSetting[index].priority =
                item.priority;
            } else {
              this.formData.actionAgentsResponseSetting.push({
                actionAgentId: item.id,
                actionAgentName: item.name,
                priority: item["$index"] + 1,
                negativeRegexps: null,
                negativeSentences: null,
                recommendSize: null, //出话模块推荐条数>最大推荐条数
                recommendThreshold: null, //出话模块推荐阈值>最低可信阈值
                threshold: null, //出话模块应答阈值配置>最低可信阈值
                answerThreshold: null,
              });
            }
          }
        });
        this.answerData.forEach((item) => {
          if (item.isSystem === 0) {
            if (!item.answerThreshold) {
              if (document.getElementsByClassName("el-message").length === 0) {
                this.$message.error(this.$t("kwRobotManage.thresholdTips"));
                return;
              }
            }
            let index = this.formData.actionAgentsResponseSetting.findIndex(
              (e) => e.actionAgentId === item.id
            );
            if (index > -1) {
              this.formData.actionAgentsResponseSetting[index].answerThreshold =
                item.answerThreshold;
              this.formData.actionAgentsResponseSetting[index].threshold =
                item.answerThreshold;
            } else {
              this.formData.actionAgentsResponseSetting.push({
                actionAgentId: item.id,
                actionAgentName: item.name,
                answerThreshold: item.answerThreshold,
                threshold: item.answerThreshold,
                negativeRegexps: null,
                negativeSentences: null,
                priority: null, //出话模块应答优先级配置>优先级
                recommendSize: null, //出话模块推荐条数>最大推荐条数
                recommendThreshold: null, //出话模块推荐阈值>最低可信阈值
              });
            }
          }
        });
        this.formData.faqResponseSetting.threshold =
          this.formData.faqResponseSetting.answerThreshold;
        this.formData.tableResponseSetting.threshold =
          this.formData.tableResponseSetting.answerThreshold;
        this.formData.docResponseSetting.threshold =
          this.formData.docResponseSetting.answerThreshold;
        this.formData.flowResponseSetting.threshold =
          this.formData.flowResponseSetting.answerThreshold;
        this.formData.intentResponseSetting.threshold =
          this.formData.intentResponseSetting.answerThreshold;
      }

      // console.log(this.formData);
      this.$emit("fatherEvent", this.formData);
    },
    // 优先级
    handlePriority(type) {
      if (type === 1) {
        return this.formData.faqResponseSetting.priority;
      }
      if (type === 2) {
        return this.formData.tableResponseSetting.priority;
      }
      if (type === 3) {
        return this.formData.docResponseSetting.priority;
      }
      if (type === 4) {
        return this.formData.flowResponseSetting.priority;
      }
      if (type === 5) {
        return this.formData.intentResponseSetting.priority;
      }
    },
    // 应答阈值配置
    handleThreshold(type) {
      if (type === 1) {
        return this.formData.faqResponseSetting.answerThreshold;
      }
      if (type === 2) {
        return this.formData.tableResponseSetting.answerThreshold;
      }
      if (type === 3) {
        return this.formData.docResponseSetting.answerThreshold;
      }
      if (type === 4) {
        return this.formData.flowResponseSetting.answerThreshold;
      }
      if (type === 5) {
        return this.formData.intentResponseSetting.answerThreshold;
      }
    },
  },
  created() {
    this.botId = this.botObj.id;
    this.strategyId = this.instanceObj.id;
  },
  mounted() {
    const postData = {
      current: 1,
      size: 1000,
      botId: this.$store.getters.botObj.id,
    };
    listData(postData).then((res) => {
      const data = res.data.data.records;
      data.forEach((item) => {
        if (item.isSystem === 1) {
          let priority = this.handlePriority(item.type),
            answerThreshold = this.handleThreshold(item.type);
          // if (item.type === 5) {
          this.tableData.push({ ...item, ...{ priority, show: false } });
          // } else {
          //   this.tableData.unshift({ ...item, ...{ priority, show: false } });
          // }
          this.answerData.push({
            ...item,
            ...{
              answerThreshold: this.validatenull(answerThreshold)
                ? 0.7
                : answerThreshold,
              show: false,
            },
          });
          let negativeSentences = [],
            negativeRegexps = [];
          if (item.type !== 4) {
            if (item.type === 1) {
              negativeRegexps =
                this.formData.faqResponseSetting.negativeRegexps;
              negativeSentences =
                this.formData.faqResponseSetting.negativeSentences;
            }
            if (item.type === 2) {
              negativeRegexps =
                this.formData.tableResponseSetting.negativeRegexps;
              negativeSentences =
                this.formData.tableResponseSetting.negativeSentences;
            }
            if (item.type === 3) {
              negativeRegexps =
                this.formData.docResponseSetting.negativeRegexps;
              negativeSentences =
                this.formData.docResponseSetting.negativeSentences;
            }
            if (item.type === 5) {
              negativeRegexps = this.validatenull(
                this.formData.intentResponseSetting.negativeRegexps
              )
                ? []
                : this.formData.intentResponseSetting.negativeRegexps;
              negativeSentences = this.validatenull(
                this.formData.intentResponseSetting.negativeSentences
              )
                ? []
                : this.formData.intentResponseSetting.negativeSentences;
            }
            this.moduleData.push({
              ...item,
              ...{
                count: negativeSentences.length,
                regExp: negativeRegexps.length,
                negativeSentences,
                negativeRegexps,
                show: false,
              },
            });
          } else {
            if (
              !this.validatenull(
                this.formData.flowResponseSetting.negativeRegexps
              ) &&
              !this.validatenull(
                this.formData.flowResponseSetting.negativeSentences
              )
            ) {
              negativeRegexps =
                this.formData.flowResponseSetting.negativeRegexps;
              negativeSentences =
                this.formData.flowResponseSetting.negativeSentences;
              this.moduleData.push({
                ...item,
                ...{
                  count: negativeSentences.length,
                  regExp: negativeRegexps.length,
                  negativeSentences,
                  negativeRegexps,
                  show: true,
                },
              });
            }
          }
        } else {
          // console.log(item);
          item.show = true;
          // if (
          //   item.name === "对话流程" &&
          //   this.formData.flowResponseSetting.negativeRegexps !== null &&
          //   this.formData.flowResponseSetting.negativeRegexps !== undefined &&
          //   this.formData.flowResponseSetting.negativeSentences !== null &&
          //   this.formData.flowResponseSetting.negativeSentences !== undefined
          // ) {
          //   let negativeRegexps =
          //       this.formData.flowResponseSetting.negativeRegexps,
          //     negativeSentences =
          //       this.formData.flowResponseSetting.negativeSentences;
          //   this.moduleData.push({
          //     ...item,
          //     ...{
          //       count: negativeSentences.length,
          //       regExp: negativeRegexps.length,
          //       negativeSentences,
          //       negativeRegexps,
          //     },
          //   });
          //   console.log(this.moduleData);
          // } else {
          if (this.formData.actionAgentsResponseSetting.length > 0) {
            let index = this.formData.actionAgentsResponseSetting.findIndex(
              (e) => e.actionAgentId === item.id
            );
            if (index > -1) {
              if (
                !isNull(
                  this.formData.actionAgentsResponseSetting[index]
                    .answerThreshold
                )
              ) {
                item.answerThreshold =
                  this.formData.actionAgentsResponseSetting[
                    index
                  ].answerThreshold;
                this.answerData.push(item);
              }
              if (
                !isNull(
                  this.formData.actionAgentsResponseSetting[index].priority
                )
              ) {
                item.priority =
                  this.formData.actionAgentsResponseSetting[index].priority;
                this.tableData.push(item);
              }
              if (
                this.formData.actionAgentsResponseSetting[index]
                  .negativeRegexps !== null &&
                this.formData.actionAgentsResponseSetting[index]
                  .negativeSentences !== null
              ) {
                item.negativeRegexps =
                  this.formData.actionAgentsResponseSetting[
                    index
                  ].negativeRegexps;
                item.negativeSentences =
                  this.formData.actionAgentsResponseSetting[
                    index
                  ].negativeSentences;
                item.count = item.negativeSentences.length;
                item.regExp = item.negativeRegexps.length;
                this.moduleData.push(item);
              }
            }
          }
          // }
        }
      });
      this.tableData.sort((a, b) => {
        return a.priority > b.priority ? 1 : -1;
      });
    });
    let flag = false;
    moduleData({ ...postData, moduleType: "1,2" }).then((res) => {
      this.options = res.data.data.records;
      this.options.map(item=>{
        if(item.id === this.formData.robotChatId){
          flag = true
        }
      })
      if(!flag){
        this.formData.robotChatId = ''
      }
    });
  },
};
</script>

<style scoped lang="scss">
.setting-collapse {
  margin-top: 20px;
  margin-left: 20px;
  border-top-color: transparent;

  /deep/.el-collapse-item__wrap {
    border-bottom-color: transparent;
  }

  /deep/.el-collapse-item__header {
    font-size: 16px;
    padding-left: 18px;

    &.is-active {
      border-bottom-color: #ebeef5;
    }
  }

  /deep/.el-collapse-item__content {
    padding-left: 50px;
  }
}

.tip {
  color: #666666;
}

.answer-strategy-index {
  padding: 0 30px;
}

.strategy-body {
  padding: 0 30px;
}
</style>
