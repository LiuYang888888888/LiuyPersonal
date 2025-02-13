<template>
  <div>
    <template v-if="active === 1">
      <avue-crud
        :option="option"
        :table-loading="loading"
        :data="data"
        ref="crud"
        v-model="form"
        @on-load="onLoad"
        :span-method="spanMethod"
      >
        <template slot="menuLeft" slot-scope="{ row }">
          <div class="warningNum">
            <i class="el-icon-warning"></i
            >{{ $t("knowledgeTest.findingsScan") }} {{ warningNum }}
            {{ $t("knowledgeTest.pendingItems") }}
          </div>
        </template>
        <template slot="menuRight" slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="finshClick"
            class="kw-btn-blue"
          >
            {{ $t("knowledgeTest.finish") }}
          </el-button>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <template v-if="row.detectionType !== 3">
            <template v-if="row.abnNum > 0">
              <el-button
                type="danger"
                round
                @click="resultChange(row)"
                size="small"
              >
                {{ row.abnNum }}
                <i class="el-icon-magic-stick el-icon--right"></i>
              </el-button>
            </template>
            <template v-else>
              <span>0</span>
            </template>
          </template>
          <template v-else>
            <el-button
              type="success"
              round
              size="small"
              :disable="modelDisable"
              @click="drillKnowledge"
            >
              {{ $t("knowledgeTest.clickNewKnowledge") }}
            </el-button>
          </template>
        </template>
      </avue-crud>
    </template>
    <!-- 末级意图未关联推荐响应 2-->
    <!-- 未配置意图引导展示名称 8-->
    <template v-if="active === 2">
      <avue-crud
        :option="intentionOption"
        :table-loading="intentionLoading"
        :data="intentionData"
        ref="intentionCrud"
        v-model="intentionForm"
        @on-load="intentionOnLoad"
      >
        <template slot="menuLeft" slot-scope="{ row }">
          <div style="font-weight: 600">
            <template v-if="active === 2">
              {{ $t("knowledgeTest.endIntention") }}
            </template>
            <!-- <template v-if="active === 8">
              {{ $t("knowledgeTest.notConfigured") }}
            </template> -->
          </div>
        </template>
        <template slot="menuRight" slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="goBack"
            class="kw-btn-blue"
          >
            {{ $t("knowledgeTest.return") }}
          </el-button>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <el-button type="text" size="small" @click="goDispose(row, 2)">{{
            $t("knowledgeTest.goToHandle")
          }}</el-button>
        </template>
      </avue-crud>
    </template>
    <!-- 答案中链接已失效 -->
    <template v-if="active === 3">
      <avue-crud
        :option="answerOption"
        :table-loading="answerLoading"
        :data="answerData"
        v-model="answerForm"
        @on-load="answerOnLoad"
        ref="answerCrud"
      >
        <template slot="menuLeft" slot-scope="{ row }">
          <div style="font-weight: 600">
            {{ $t("knowledgeTest.linkExpired") }}
          </div>
        </template>
        <template slot="menuRight" slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="goBack"
            class="kw-btn-blue"
          >
            {{ $t("knowledgeTest.return") }}
          </el-button>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <el-button type="text" size="small" @click="goDispose(row, 3)">{{
            $t("knowledgeTest.goToHandle")
          }}</el-button>
        </template>
      </avue-crud>
    </template>
    <!-- 表单配置中未设置答案展示字段 -->
    <template v-if="active === 4">
      <avue-crud
        :option="formOption"
        :data="formData"
        :table-loading="formLoading"
        v-model="formForm"
        @on-load="formOnLoad"
        ref="formCrud"
      >
        <template slot="menuLeft">
          <div style="font-weight: 600">
            {{ $t("knowledgeTest.formConfiguration") }}
          </div>
        </template>
        <template slot="menuRight" slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="goBack"
            class="kw-btn-blue"
          >
            {{ $t("knowledgeTest.return") }}
          </el-button>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <el-button type="text" size="small" @click="goDispose(row, 4)">{{
            $t("knowledgeTest.goToHandle")
          }}</el-button>
        </template>
      </avue-crud>
    </template>
    <!-- 存在已失效答案视角 -->
    <template v-if="active === 5">
      <avue-crud
        :option="answerAngleOption"
        :table-loading="answerAngleLoading"
        :data="answerAngleData"
        v-model="answerAngleForm"
        @on-load="answerAngleOnLoad"
        ref="answerAngleCrud"
      >
        <template slot="menuLeft">
          <div style="font-weight: 600">
            {{ $t("knowledgeTest.answerPerspectives") }}
          </div>
        </template>
        <template slot="menuRight" slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="goBack"
            class="kw-btn-blue"
          >
            {{ $t("knowledgeTest.return") }}
          </el-button>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <el-button type="text" size="small" @click="goDispose(row, 5)">{{
            $t("knowledgeTest.goToHandle")
          }}</el-button>
        </template>
      </avue-crud>
    </template>
    <!-- 存在未发布知识 -->
    <template v-if="active === 6">
      <avue-crud
        :option="knowledgeOption"
        :table-loading="knowledgeLoading"
        :data="knowledgeData"
        v-model="knowledgeForm"
        @on-load="knowledgeOnLoad"
        ref="knowledgeCrud"
      >
        <template slot="menuLeft">
          <div style="font-weight: 600">
            {{ $t("knowledgeTest.unpublishedKnowledge") }}
          </div>
        </template>
        <template slot="menuRight" slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="goBack"
            class="kw-btn-blue"
          >
            {{ $t("knowledgeTest.return") }}
          </el-button>
        </template>
        <template slot="menu" slot-scope="{ row }">
          <!-- faq知识 -->
          <template v-if="row.type === 1">
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              v-if="!faqIsAudit"
              >{{ $t("knowledgeTest.publish") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              :disabled="row.auditStatus === 'auditing'"
              v-if="faqIsAudit"
              >{{ $t("knowledgeTest.submitReview") }}</el-button
            >
          </template>
          <!-- 闲聊知识 -->
          <template v-if="row.type === 2">
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              v-if="!chatIsAudit"
              >{{ $t("knowledgeTest.publish") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="chatIsAudit"
              @click="publish(row)"
              :disabled="row.auditStatus === 'auditing'"
              >{{ $t("knowledgeTest.submitReview") }}</el-button
            >
          </template>
          <!-- 文档知识 -->
          <template v-if="row.type === 3">
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              v-if="!docIsAudit"
              >{{ $t("knowledgeTest.publish") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              v-if="docIsAudit"
              :disabled="row.auditStatus === 'auditing'"
              >{{ $t("knowledgeTest.submitReview") }}</el-button
            >
          </template>
          <!-- 表格知识 -->
          <template v-if="row.type === 4">
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              v-if="!tabIsAudit"
              >{{ $t("knowledgeTest.publish") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="publish(row)"
              v-if="tabIsAudit"
              :disabled="row.auditStatus === 'auditing'"
              >{{ $t("knowledgeTest.submitReview") }}</el-button
            >
          </template>
        </template>
      </avue-crud>
    </template>
    <!-- 意图问法重复 -->
    <template v-if="active === 9">
      <div style="font-weight: 600">
        {{ $t("knowledgeTest.intentionAskRepetition") }}
      </div>
      <div>
        <div style="display: flex; align-items: flex-start">
          <div style="margin-right: 20px; width: 300px">
            <h5>{{ $t("knowledgeTest.selectStandard") }}</h5>
            <div
              v-for="(item, i) in treeData"
              :key="i"
              @click="treeClick(item)"
              :class="item.active ? 'activeTab' : ''"
              style="line-height: 40px; cursor: pointer"
            >
              <avue-text-ellipsis
                :key="item.name"
                :text="item.name"
                :height="40"
                :width="290"
                use-tooltip
                placement="top"
              >
                <template #more>
                  <small>...</small>
                </template>
              </avue-text-ellipsis>
            </div>
          </div>
          <avue-crud
            style="width: calc(100% - 300px)"
            :option="intentionAskOption"
            :table-loading="intentionAskLoading"
            :data="intentionAskData"
            ref="crud"
            v-model="intentionAskForm"
            @on-load="intentionAskOnLoad"
            :span-method="intentionAskSpanMethod"
          >
            <!-- <template slot="menuLeft">
            <div style="font-weight: 600">意图问法重复</div>
          </template> -->
            <template slot="menuRight" slot-scope="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="goBack"
                class="kw-btn-blue"
              >
                {{ $t("knowledgeTest.return") }}
              </el-button>
            </template>
            <template slot="menu" slot-scope="{ row }">
              <el-button type="text" size="small" @click="goDispose(row, 2)">{{
                $t("knowledgeTest.goToHandle")
              }}</el-button>
            </template>
          </avue-crud>
        </div>
      </div>
    </template>
    <!-- 意图处理 -->
    <HuilanDialog
      :title="intentDialogTitle"
      append-to-body
      :visible.sync="intentionDialogVisible"
      width="65%">
      <Addintention
        @back="back"
        :botId="botId"
        classifyId="0"
        :cur="selectRow"
        :isEdit="true"
        v-if="intentionDialogVisible"
      />
    </HuilanDialog>
    <el-drawer
      :title="$t('knowledgeTest.exception')"
      :visible.sync="abnormalDialogVisible"
      append-to-body
      show-close
      @close="addOrEditEmitEvent"
      size="75%"
    >
      <template v-if="selectRow.type === 1 && abnormalDialogVisible">
        <!-- faq知识 -->
        <AddFaq
          nodeDeepPath="['0']"
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <!-- 闲聊知识 -->
      <template v-if="selectRow.type === 2 && abnormalDialogVisible">
        <Addsmalltalk
          nodeDeepPath="['0']"
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <!-- 文档知识：知识标注 -->
      <template v-if="selectRow.type === 3 && abnormalDialogVisible">
        <Filemark :rowData="selectRow" @close="addOrEditEmitEvent" />
      </template>
      <!-- 表格知识 -->
      <template v-if="selectRow.type === 4 && abnormalDialogVisible">
        <AnswerSetting
          :rowData="selectRow"
          nodeDeepPath="['0']"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
    </el-drawer>
    <el-drawer
      title=""
      :visible.sync="noShownDialogVisible"
      append-to-body
      show-close
      @close="(noShownDialogVisible = false), getNoShown()"
      size="85%"
    >
      <Formsetting v-if="noShownDialogVisible" :rowData="selectRow" />
    </el-drawer>
    <el-drawer
      title=""
      :visible.sync="modelDialogVisible"
      append-to-body
      show-close
      @close="modelDialogVisible = false"
      size="85%"
    >
      <Modelsetting v-if="modelDialogVisible" />
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  detectionResult,
  intentLeafNodeNoneBoundKm,
  invalidLink,
  noShown,
  invalidAngle,
  noPublish,
  noDisplayName,
  intentQuestionRepeat,
} from "@/api/kwRobot/knowledgeTest/index";
import { publishFaqUrl } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import { publishFaqUrl as publishChatUrl } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/index";
import {
  update as publishDocUrl,
  detail,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import { publishFaqUrl as publishTabUrl } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
import Modelsetting from "@/views/kwKnowledgeCenter/kwCompetence/sessionModel/index";
import Addintention from "@/views/kwKnowledgeCenter/kwIntentionManage/add";
import AddFaq from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/addFaq";
import Addsmalltalk from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/addFaq";
import Filemark from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/filemark";
import AnswerSetting from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/answerSetting";
import Formsetting from "@/views/kwKnowledgeCenter/kwSettings/formsetting";
import { robotTrainStart } from "@/api/kwRobot/kwRobotTrain/index";
import { randomLenNum } from "@/util/util";
import {
  getAuditSetting,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
export default {
  props: {
    warningNum: {
      type: Number,
      default: 0,
    },
    ids: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Addintention,
    AddFaq,
    Addsmalltalk,
    Filemark,
    AnswerSetting,
    Formsetting,
    Modelsetting,
  },
  data() {
    return {
      modelDisable: false,
      intentDialogTitle: "",
      selectRow: {},
      botId: "",
      loading: false,
      data: [],
      form: {},
      option: {
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        menuTitle: this.$t("knowledgeTest.pendingItem"),
        column: [
          {
            label: this.$t("knowledgeTest.detectRange"),
            prop: "detectionType",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeTest.intentLibrary"),
                value: 1,
              },
              {
                label: this.$t("knowledgeTest.knowledgeBase"),
                value: 2,
              },
              {
                label: this.$t("knowledgeTest.semanticModel"),
                value: 3,
              },
            ],
          },
          {
            label: this.$t("knowledgeTest.detectionItems"),
            prop: "detectionItem",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeTest.endIntention"),
                value: 1,
              },
              {
                label: this.$t("knowledgeTest.linkExpired"),
                value: 2,
              },
              {
                label: this.$t("knowledgeTest.formConfiguration"),
                value: 3,
              },
              {
                label: this.$t("knowledgeTest.answerPerspectives"),
                value: 4,
              },
              {
                label: this.$t("knowledgeTest.unpublishedKnowledge"),
                value: 5,
              },
              {
                label: this.$t("knowledgeTest.timelyManner"),
                value: 6,
              },
              // {
              //   label: this.$t("knowledgeTest.notConfigured"),
              //   value: 7,
              // },
              {
                label: this.$t("knowledgeTest.questionRepetition"),
                value: 8,
              },
            ],
          },
        ],
      },
      spanArr: [
        {
          prop: "detectionType",
          span: [],
        },
      ],
      active: 1,
      // 末级意图未关联推荐响应
      intentionLoading: false,
      intentionData: [],
      intentionForm: {},
      intentionOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("knowledgeTest.lastIntentionName"),
            prop: "intentName",
          },
          {
            label: this.$t("knowledgeTest.parentIntentName"),
            prop: "rootIntentName",
            hide: true,
          },
          {
            label: this.$t("knowledgeTest.createTime"),
            prop: "createTime",
          },
        ],
      },
      intentionDialogVisible: false,
      // 答案中链接已失效
      answerLoading: false,
      answerData: [],
      answerForm: {},
      answerOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("knowledgeTest.knowledgeName"),
            prop: "name",
          },
          {
            label: this.$t("knowledgeTest.knowledgeType"),
            prop: "type",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeTest.fqaKnowledge"),
                value: 1,
              },
              {
                label: this.$t("knowledgeTest.chattingKnowledge"),
                value: 2,
              },
              {
                label: this.$t("knowledgeTest.documentKnowledge"),
                value: 3,
              },
              {
                label: this.$t("knowledgeTest.tableKnowledge."),
                value: 4,
              },
            ],
          },
          {
            label: this.$t("knowledgeTest.createTime"),
            prop: "createTime",
          },
        ],
      },
      // 表单配置中未设置答案展示字段
      formLoading: false,
      formData: [],
      formForm: {},
      formOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("knowledgeTest.formName"),
            prop: "name",
          },
        ],
      },
      // 存在已失效答案视角
      answerAngleLoading: false,
      answerAngleData: [],
      answerAngleForm: {},
      answerAngleOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        refreshBtn: false,
        column: [
          {
            label: this.$t("knowledgeTest.knowledgeName"),
            prop: "name",
          },
          {
            label: this.$t("knowledgeTest.knowledgeType"),
            prop: "type",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeTest.fqaKnowledge"),
                value: 1,
              },

              {
                label: this.$t("knowledgeTest.tableKnowledge"),
                value: 4,
              },
            ],
          },
          {
            label: this.$t("knowledgeTest.createTime"),
            prop: "createTime",
          },
        ],
      },
      // 存在未发布知识
      knowledgeLoading: false,
      knowledgeData: [],
      knowledgeForm: {},
      knowledgeOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("knowledgeTest.knowledgeName"),
            prop: "name",
          },
          {
            label: this.$t("knowledgeTest.knowledgeType"),
            prop: "type",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeTest.fqaKnowledge"),
                value: 1,
              },
              {
                label: this.$t("knowledgeTest.chattingKnowledge"),
                value: 2,
              },
              {
                label: this.$t("knowledgeTest.documentKnowledge"),
                value: 3,
              },
              {
                label: this.$t("knowledgeTest.tableKnowledge"),
                value: 4,
              },
            ],
          },
          {
            label: this.$t("smalltalk.auditStatus"),
            prop: "auditStatus",
            type: "select",
            minWidth: 100,
            align: "center",
            dicData: [
              {
                label: this.$t("smalltalk.auditing"),
                value: "auditing",
              },
              {
                label: this.$t("smalltalk.reject"),
                value: "reject",
              },
              {
                label: this.$t("smalltalk.disagree"),
                value: "disagree",
              },
              {
                label: this.$t("smalltalk.finish"),
                value: "finish",
              },
              {
                label: this.$t("smalltalk.withdraw"),
                value: "withdraw",
              },
              // {
              //   label: "通过",
              //   value: "agree",
              // },
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeTest.createTime"),
            prop: "createTime",
          },
        ],
      },
      // 意图问法重复
      intentionAskLoading: false,
      intentionAskData: [],
      intentionAskForm: {},
      treeData: [],
      intentionAskOption: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        refreshBtn: false,
        column: [
          {
            label: this.$t("knowledgeTest.intentionName"),
            prop: "intentName",
          },
          {
            label: this.$t("knowledgeTest.createTime"),
            prop: "createTime",
          },
        ],
      },

      auditSetting: {}, // 审核设置
      isAudit: false, // 是否审核
      faqIsAudit: false, // faq是否审核
      chatIsAudit: false, // 闲聊是否审核
      docIsAudit: false, // 文档是否审核
      tabIsAudit: false, // 标签是否审核
      // 异常处理
      abnormalDialogVisible: false,
      noShownDialogVisible: false,
      modelDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "botObj"]),
  },
  mounted() {
    this.botId = this.$store.getters.botObj.id;
    this.getList();
    // faq是否审核
    this.getAuditConfig(1);
    // 闲聊是否审核
    this.getAuditConfig(3);
    // 文档是否审核
    this.getAuditConfig(2);
    // 表格是否审核
    this.getAuditConfig(4);
  },

  methods: {
    // 一键训练模型
    drillKnowledge() {
      robotTrainStart({ botId: this.botObj.id })
        .then(() => {
          this.modelDisable = true;
          this.$store.commit("SET_ROBOTSTATE", true);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getList() {
      this.loading = true;
      detectionResult({
        ids: this.ids.join(","),
      })
        .then((res) => {
          if (res.data.success) {
            this.loading = false;
            this.data = res.data.data;
            this.rowSort();
            this.rowCalc();
          }
        })
        .catch(() => {
          this.loading = false;
          this.data = [];
        });
    },
    // 完成
    finshClick() {
      this.$emit("finsh");
    },
    // 前往处理弹窗
    async goDispose(row, type) {
      this.selectRow = row;
      if (type === 2) {
        this.intentionDialogVisible = true;
        this.intentDialogTitle = this.$t(
          "knowledgeTest.endIntentionProcessing"
        );
        if (this.active === 8) {
          this.intentDialogTitle = this.$t("knowledgeTest.intentNotConfigured");
        }
        if (this.active === 9) {
          this.intentDialogTitle = this.$t("knowledgeTest.repeatedIntentional");
        }
      }
      if (type === 3 || type === 5) {
        if (type === 3 && row.type === 3) {
          await detail(row.id).then((res) => {
            if (res.data.success) {
              let data = res.data.data;
              if (!this.validatenull(data)) {
                this.selectRow = data;
                this.selectRow.type = 3;
              }
            }
          });
        }
        this.abnormalDialogVisible = true;
      }
      if (type === 4) {
        this.noShownDialogVisible = true;
      }
    },
    addOrEditEmitEvent() {
      this.abnormalDialogVisible = false;
      if (this.active === 3) {
        this.getInvalidLink();
      }
      if (this.active === 5) {
        this.getInvalidAngle();
      }
    },
    back() {
      this.intentionDialogVisible = false;
      this.getintentionLeafNodeNoneBoundKm();
    },
    // 返回
    goBack() {
      this.active = 1;
    },
    // 不同处理页面
    resultChange(row) {
      if (row.detectionItem !== 6) {
        this.active = Number(row.detectionItem) + 1;
        let parent = this.findObject(
            this.intentionOption.column,
            "rootIntentName"
          ),
          intentName = this.findObject(
            this.intentionOption.column,
            "intentName"
          );
        if (this.active === 2) {
          this.getintentionLeafNodeNoneBoundKm();
          parent.hide = false;
          intentName.label = this.$t("knowledgeTest.lastIntentionName");
        }
        if (this.active === 3) {
          this.getInvalidLink();
        }
        if (this.active === 4) {
          this.getNoShown();
        }
        if (this.active === 5) {
          this.getInvalidAngle();
        }
        if (this.active === 6) {
          this.getNoPublish();
        }
        if (this.active === 8) {
          this.getintentionLeafNodeNoneBoundKm();
          parent.hide = true;
          intentName.label = this.$t("knowledgeTest.intentionName");
        }
        if (this.active === 9) {
          this.getIntentionAsk();
        }
      } else {
        this.modelDialogVisible = true;
      }
    },
    rowCalc() {
      this.spanArr.forEach((ele, index) => {
        let parent;
        if (index !== 0) parent = this.spanArr[ele.parent || index - 1].span;
        ele.span = this.rowSpan(ele.prop, parent);
      });
    },
    rowSort() {
      this.spanArr.forEach((ele, index) => {
        let key = ele.prop;
        this.data = this.data.sort((a, b) => {
          let flag = true;
          for (let i = 0; i < index; i++) {
            let prop = this.spanArr[i].prop;
            flag = flag && a[prop] == b[prop];
          }
          if (flag) {
            if (a[key] < b[key]) {
              return 1;
            } else if (a[key] > b[key]) {
              return -1;
            }
            return 0;
          }
          return 0;
        });
      });
    },
    rowSpan(key, parent) {
      let list = [];
      let position = 0;
      this.data.forEach((item, index) => {
        if (index === 0) {
          list.push(1);
          position = 0;
        } else {
          if (this.data[index][key] === this.data[index - 1][key]) {
            if (parent && parent[index] !== 0) {
              list.push(1);
              position = index;
            } else {
              list[position] += 1;
              list.push(0);
            }
          } else {
            list.push(1);
            position = index;
          }
        }
      });
      return list;
    },
    spanMethod({ column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        for (let i = 0; i < this.spanArr.length; i++) {
          const ele = this.spanArr[i];
          if (column.property == ele.prop) {
            const _row = ele.span[rowIndex];
            const _col = _row > 0 ? 1 : 0;
            return {
              rowspan: _row,
              colspan: _col,
            };
          }
        }
      }
    },
    // 末级意图未关联推荐响应
    getintentionLeafNodeNoneBoundKm() {
      this.intentionLoading = true;
      this.intentionData = [];
      if (this.active === 2) {
        intentLeafNodeNoneBoundKm({
          tenantId: this.$store.state.user.currentTenantId,
        }).then((res) => {
          if (res.data.success) {
            this.intentionData = res.data.data;
          }
          this.intentionLoading = false;
        });
      }
      if (this.active === 8) {
        noDisplayName({
          tenantId: this.$store.state.user.currentTenantId,
        }).then((res) => {
          if (res.data.success) {
            this.intentionData = res.data.data;
          }
          this.intentionLoading = false;
        });
      }
    },
    getIntentionAsk() {
      this.treeData = [];
      intentQuestionRepeat({
        tenantId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          for (let i in data) {
            let obj = {};
            obj.name = i;
            obj.active = false;
            obj.id = randomLenNum(4, true);
            obj.list = data[i];
            this.treeData.push(obj);
          }
        }
      });
    },
    treeClick(data) {
      for (let i in this.treeData) {
        if (data.id === this.treeData[i].id) {
          this.treeData[i].active = true;
        } else {
          this.treeData[i].active = false;
        }
      }
      this.intentionAskLoading = true;
      this.intentionAskData = [];
      this.$nextTick(() => {
        this.intentionAskLoading = false;
        this.intentionAskData = data.list;
      });
    },
    // 答案中链接已失效
    getInvalidLink() {
      this.answerLoading = true;
      this.answerData = [];
      invalidLink({
        tenantId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.success) {
          this.answerData = res.data.data;
        }
        this.answerLoading = false;
      });
    },
    // 表单配置中未设置答案展示字段
    getNoShown() {
      this.formLoading = true;
      this.formData = [];
      noShown({
        tenantId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.success) {
          this.formData = res.data.data;
        }
        this.formLoading = false;
      });
    },
    // 存在已失效答案视角
    getInvalidAngle() {
      this.answerAngleLoading = true;
      this.answerAngleData = [];
      invalidAngle({
        tenantId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.success) {
          this.answerAngleData = res.data.data;
        }
        this.answerAngleLoading = false;
      });
    },
    // 存在未发布知识
    getNoPublish() {
      this.knowledgeLoading = true;
      this.knowledgeData = [];
      noPublish({
        tenantId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.success) {
          this.knowledgeData = res.data.data;
        }
        this.knowledgeLoading = false;
      });
    },
    // 未发布知识处理
    async publish(row) {
      // faq发布
      if (row.type === 1) {
        await this.getAuditConfig(1);
        if (this.isAudit) {
          // await publishFaqUrl(row.id, "0").then(async () => {
          await kmAuditStart(row, 1, this.auditSetting.processDefineId);
          // });
        } else {
          await publishFaqUrl(row.id, "1").then((resData) => {
            resData = resData.data;
            if (resData.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("knowledgeTest.publishedSuccess"),
              });
            }
          });
        }
      }
      // 闲聊知识发布
      if (row.type === 2) {
        await this.getAuditConfig(3);
        if (this.isAudit) {
          // await publishChatUrl(row.id, "0").then(async () => {
          await kmAuditStart(row, 3, this.auditSetting.processDefineId);
          // });
        } else {
          await publishChatUrl(row.id, "1").then((resData) => {
            resData = resData.data;
            if (resData.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("knowledgeTest.publishedSuccess"),
              });
            }
          });
        }
      }
      // 文档知识发布
      if (row.type === 3) {
        await this.getAuditConfig(2);
        if (this.isAudit) {
          await detail(row.id).then(async (res) => {
            if (res.data.success) {
              let data = res.data.data;
              data.knowledgeStatus = 0;
              // publishDocUrl(data).then(async () => {
              // 开启审核流程
              await kmAuditStart(data, 2, this.auditSetting.processDefineId);
              // });
            }
          });
        } else {
          await detail(row.id).then((res) => {
            if (res.data.success) {
              let data = res.data.data;
              data.knowledgeStatus = 1;
              publishDocUrl(data).then((res) => {
                if (res.data.success) {
                  this.$message.success(
                    this.$t("knowledgeTest.publishedSuccess")
                  );
                }
              });
            }
          });
        }
      }
      // 表格知识发布
      if (row.type === 4) {
        await this.getAuditConfig(4);
        if (this.isAudit) {
          // await publishTabUrl(row.id, 0).then(async () => {
          //开启审核流程
          await kmAuditStart(row, 4, this.auditSetting.processDefineId);
          // });
        } else {
          await publishTabUrl(row.id, 1).then((resData) => {
            resData = resData.data;
            if (resData.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("knowledgeTest.publishedSuccess"),
              });
            }
          });
        }
      }
      this.getNoPublish();
    },
    async getAuditConfig(kmType) {
      const dataParam = {
        kmType,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
      if (kmType === 1) {
        this.faqIsAudit = this.isAudit;
      }
      if (kmType === 2) {
        this.docIsAudit = this.isAudit;
      }
      if (kmType === 3) {
        this.chatIsAudit = this.isAudit;
      }
      if (kmType === 4) {
        this.tabIsAudit = this.isAudit;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.warningNum {
  color: red;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
}

.activeTab {
  color: blue;
}
</style>
