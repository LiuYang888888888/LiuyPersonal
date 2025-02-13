<template>
  <div>
    <avue-form
      ref="faqBasicFormRef"
      v-model="faqBasicFormData"
      :option="faqBasicFormOption"
    >
      <!-- <template slot="cateName">
        {{ faqBasicFormData.cateName }}
      </template> -->
      <template slot="question">
        <div>
          <div style="display: flex">
            <el-input
              size="small"
              v-model="faqBasicFormData.question"
              :placeholder="$t('table.multipleEntitiesTips')"
              :disabled="faqType === 'view' || faqType === 'version'"
              @blur="onBlur"
            ></el-input>
            <el-popover placement="top" title="" width="330" trigger="hover">
              <div>
                <p>{{ $t("table.knowledgeQuestionTips") }}</p>
                <p>{{ $t("table.multipleKnowledgeTips") }}</p>
              </div>
              <el-button
                slot="reference"
                class="el-icon-warning-outline"
                type="text"
              ></el-button>
            </el-popover>
          </div>
          <div
            style="color: #ff0000"
            v-if="faqType !== 'view' && faqType !== 'version'"
          >
            {{ $t("table.similarKnowledge") }}
            <span style="color: #0099ff">({{ similarityNum }})</span>
          </div>
        </div>
      </template>
      <template slot="extQuestions">
        <el-button
          type="text"
          @click.stop="similarDialogVisible = true"
          v-if="faqType !== 'view' && faqType !== 'version'"
          >{{ $t("table.addFormQuestions") }}</el-button
        >
        <span style="padding-left: 10px"
          >{{ $t("table.added") }} {{ similarQuestionLength }}</span
        >
      </template>
      <template slot="intentionId">
        <div>
          <el-autocomplete
            :disabled="faqType === 'view' || faqType === 'version'"
            class="el-input-border-radius shadowStyle"
            v-model="faqBasicFormData.intentionId"
            clearable
            style="width: calc(100% - 20px)"
            maxlength="200"
            show-word-limit
            :fetch-suggestions="querySearchAsync"
            :placeholder="$t('table.intentionTips')"
          ></el-autocomplete>
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('faq.intentionTip')"
            placement="top"
          >
            <el-button icon="el-icon-question" type="text"></el-button>
          </el-tooltip>
        </div>
      </template>
      <template slot="knowledgeDiname">
        <TreeSelect
          multiple
          :disabled="faqType === 'view' || faqType === 'version'"
          :size="'small'"
          v-model="dimensionId"
          :showValue="dimensionNames"
          :treeOption="treeOption"
        />
      </template>
      <template slot="customQuestion">
        <el-button
          type="text"
          @click.stop="isShowConnectKnowledgeDialog = true"
          v-if="faqType !== 'view' && faqType !== 'version'"
          >{{ $t("table.addRecommendation") }}</el-button
        >
        <span style="padding-left: 10px"
          >{{ $t("table.added") }}:{{
            recommendList.faq.length + recommendList.tab.length
          }}</span
        >
      </template>
    </avue-form>

    <!--添加相似问法-->
    <HuilanDialog
      :title="$t('kwIntentionManage.expandMethod')"
      append-to-body
      :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="similarDialogVisible"
      width="500px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="`${$t(
            'kwIntentionManage.commonAnswer'
          )}${`(${this.frequentlyQuestions.length})`}`"
          name="first"
        >
          <CommonAnswer
            v-if="similarDialogVisible"
            ref="commonQuestion"
            :domainArr="frequentlyQuestions"
            @saveCommonMethod="saveCommonMethod"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="`${$t(
            'kwIntentionManage.regular'
          )}${`(${this.regularArr.length})`}`"
          name="second"
        >
          <Regular
            v-if="similarDialogVisible"
            ref="regularQuestion"
            :regularArr="regularArr"
            @saveRegular="saveRegular"
          />
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="cancelSimilarDialog">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveSimilar">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <!-- 自定义推荐问题 -->
    <HuilanDialog
      :title="$t('kwRobotManage.recommended')"
      :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="isShowConnectKnowledgeDialog"
      append-to-body
      width="55%"
      custom-class="customer-choose-knowledge-dialog"
    >
      <KwSimilar
        ref="kwSimilarRef"
        :faqData="recommendList"
        v-if="isShowConnectKnowledgeDialog"
        :isTab="true"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowConnectKnowledgeDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveCusomerFaq">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import CommonAnswer from "@/components/kwAddInMethod/commonAnswer";
import Regular from "@/components/kwAddInMethod/regular";
import TreeSelect from "@/components/kwTreeSelect";
import KwSimilar from "@/components/kwSimilar/index";
import { similarQa } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
import {
  selectIntentListWithRobot,
  recommendIntent,
  selectList,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import { getLazyList } from "@/api/kwKnowledgeCenter/kwSettings/kwDimensionManage/index";
// import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  components: {
    CommonAnswer,
    Regular,
    TreeSelect,
    KwSimilar,
  },
  props: {
    curTreeNode: {
      type: Object,
      default: () => {
        return {
          data: { dname: "" },
        };
      },
    },
    basicDataObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    faqType: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    let botId = this.$store.getters.botObj.id;
    return {
      botId: botId,
      similarityNum: "0",
      // 自定义推荐问法
      isShowConnectKnowledgeDialog: false,
      recommendList: { faq: [], tab: [] }, //自定义推荐问题
      //
      keywordsArr: [],
      activeName: "first",
      isCloseOnClickModal: false,
      similarDialogVisible: false, // 相似问法弹框
      frequentlyQuestions: [], // 常用问题
      regularArr: [], // 正则问题
      similarQuestionLength: 0, // 相似问题长度
      dimensionId: [], // 维度id
      dimensionNames: [], // 维度名称
      treeOption: {
        // 维度树
        defaultExpandedKeys: ["0"],
        showCheckbox: true,
        checkStrictly: true,
        props: {
          label: "dname",
          isLeaf: "isLeaf",
          // value: 'id'
        },
        lazy: true,
        key: "id",
        // expandOnClickNode: false,
        load: (node, resolve) => {
          let parentId = node.data && node.data.id;
          if (node.level === 0) {
            // parentId = 0
            resolve([{ dname: "全局", id: "0", disabled: true }]);
            return;
          }

          getLazyList(parentId, botId).then((res) => {
            var dataTemp = [];
            res.data.data.map((item) => {
              var itemTemp = {};
              if (item.pid == "0") {
                if (item.isLeaf != 0) {
                  itemTemp = {
                    ...item,
                    isLeaf: item.isLeaf === 0,
                    disabled: true,
                  };
                  dataTemp.push(itemTemp);
                }
              } else {
                itemTemp = {
                  ...item,
                  isLeaf: item.isLeaf === 0,
                };
                dataTemp.push(itemTemp);
              }
            });

            resolve(
              dataTemp.map((item) => {
                return item;
              })
            );
          });
        },
      },
      answerPerspectives: [
        {
          label: "视角1",
          value: "123",
        },
      ],
      faqBasicFormData: {
        cateId: "",
        question: "",
        effectTime: [],
      },
      faqBasicFormOption: {
        column: [
          {
            label: this.$t("table.category"),
            prop: "cateId",
            type: "tree",
            span: 24,
            props: {
              label: "dname",
              value: "id",
            },
            dicData: [],
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("table.category"),
              },
            ],
          },
          {
            label: this.$t("table.knowledgeSubject"),
            prop: "question",
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("table.knowledgeSubject"),
              },
            ],
          },
          {
            type: "input",
            label: this.$t("table.formQuestionMethod"),
            span: 24,
            display: true,
            prop: "extQuestions",
          },
          {
            type: "input",
            label: this.$t("table.relatedIntention"),
            display: true,
            span: 24,
            // tip: this.$t("faq.intentionTip"),
            // dicUrl: `/api/${aiworkorder}/kgcc-label/tree`,
            // props: { label: "title", value: "id" },
            rules: [
              { required: true, message: this.$t("table.intentionTips") },
              // ...getRules(["charNumHan"]),
            ],
            prop: "intentionId",
          },
          {
            label: this.$t("table.knowledgeDimension"),
            prop: "knowledgeDiname",
            span: 24,
          },
          {
            label: this.$t("table.customIssues"),
            prop: "customQuestion",
            span: 24,
          },
          {
            type: "radio",
            label: this.$t("table.validityKnowledge"),
            prop: "availableStatus",
            value: 0,
            dicData: [
              {
                label: this.$t("table.longTerm"),
                value: 0,
              },
              {
                label: this.$t("table.customTime"),
                value: 1,
              },
            ],
            required: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("table.validityKnowledge"),
                trigger: "blur",
              },
            ],
            change: ({ value }) => {
              const endTime = this.findObject(
                this.faqBasicFormOption.column,
                "effectTime"
              );
              if (value === 1) {
                endTime.display = true;
              } else {
                endTime.display = false;
              }
            },
          },
          {
            type: "datetimerange",
            label: "",
            minWidth: 200,
            span: 24,
            display: false,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            prop: "effectTime",
            defaultTime: ["00:00:00", "23:59:59"],
            startPlaceholder: this.$t("doc.startDate"),
            endPlaceholder: this.$t("doc.endDate"),
            // pickerOptions: {
            //   disabledDate(time) {
            //     return time.getTime() < new Date(new Date().getTime());
            //   },
            // },
            required: true,
            rules: [{ required: true, message: this.$t("table.required") }],
          },
        ],
        detail: false,
        span: 16,
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 150,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
      },
    };
  },
  computed: {
    ...mapGetters(["botObj", "userInfo", "language"]),
  },
  watch: {
    language: {
      handler(newVal) {
        // && this.faqType != "view"

        this.faqBasicFormOption.labelPosition =
          newVal != "zh" ? "top" : "right";
      },
      immediate: true,
    },
  },
  mounted() {
    this.faqBasicFormData.question = this.basicDataObj.question;
    if (this.faqType === "add") {
      // this.faqBasicFormData.cateName = this.curTreeNode.data.dname;
      // this.faqBasicFormData.cateId = this.curTreeNode.data.id;
      this.faqBasicFormData.knowledgeStatus = "0";
    }
    if (this.faqType === "view" || this.faqType === "version") {
      this.faqBasicFormOption.detail = true;
    }
    selectList({ classType: "tableQa" }).then((res) => {
      if (res.data.success) {
        const treeData = this.findObject(
          this.faqBasicFormOption.column,
          "cateId"
        );
        treeData.dicData = res.data.data;
      }
    });
    // 意图
    selectIntentListWithRobot(this.botObj.id).then((res) => {
      if (res.data.success) {
        res.data.data.map((item) => {
          this.keywordsArr.push({ value: item });
        });
      }
    });
    if (
      this.faqType === "add" &&
      !this.validatenull(this.faqBasicFormData.question)
    ) {
      this.onBlur();
    }
  },
  methods: {
    onBlur() {
      if (this.faqBasicFormData.question) {
        similarQa({ similarQuestion: this.faqBasicFormData.question }).then(
          (res) => {
            if (res.data.success) {
              this.similarityNum = res.data.data;
            }
          }
        );
        let obj = {
          tenantId: this.$store.state.user.currentTenantId,
          robotId: this.botObj.id,
          question: this.faqBasicFormData.question,
          maxHitSize: 50,
          published: true,
        };
        if (this.faqBasicFormData.question !== "") {
          recommendIntent(obj).then((res) => {
            if (res.data.success) {
              if (res.data.data.items.length > 0) {
                this.faqBasicFormData.intentionId =
                  res.data.data.items[0].displayTag;
              }
            }
          });
        }
      }
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.keywordsArr;
      let results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 设置数据
    setFaqBasicData(faqData) {
      this.basicDataObj = faqData;
      this.faqBasicFormData = { ...faqData };
      let effectTime = this.findObject(
        this.faqBasicFormOption.column,
        "effectTime"
      );

      // 设置分类名称和id
      this.$set(this.curTreeNode, "data", {
        id: faqData.cateId,
        dname: faqData.cateName,
      });
      if (faqData.dimensionId) {
        this.dimensionId = faqData.dimensionId.split(",");
      }
      if (faqData.dimensionName) {
        this.dimensionNames = faqData.dimensionName.split(",");
      }
      if (faqData.availableStatus == 1) {
        this.faqBasicFormData.effectTime = [
          faqData.effectDate,
          faqData.expireDate,
        ];
        effectTime.display = true;
      } else {
        this.faqBasicFormData.effectTime = [];
        effectTime.display = false;
      }
      // faq推荐问法
      if (faqData.knowledgeList) {
        this.recommendList.faq = faqData.knowledgeList;
      }
      // tab推荐问法
      if (faqData.tableQAKnowledgeList) {
        this.recommendList.tab = faqData.tableQAKnowledgeList;
      }
      // 设置相似问法
      if (faqData.similarText) {
        faqData.similarText.forEach((item) => {
          this.frequentlyQuestions.push({
            intentQuestion: item,
          });
        });
      }

      // 设置正则表达式
      if (faqData.similarRegular) {
        faqData.similarRegular.forEach((item) => {
          this.regularArr.push({
            intentQuestion: item,
          });
        });
      }
      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;
    },

    // 保存自定义推荐问题
    saveCusomerFaq() {
      this.recommendList.faq =
        this.$refs.kwSimilarRef.$refs.similarContainerRef.saveSimilarQuesion();
      this.recommendList.tab =
        this.$refs.kwSimilarRef.$refs.similarTabcontainerRef.saveSimilarQuesion();
      // for (let i in recommendList) {
      //   this.recommendList.faq.push({ reTableqaId: recommendList[i].id });
      // }
      this.isShowConnectKnowledgeDialog = false;
    },
    // 常用问题
    saveCommonMethod(res) {
      if (res.flag) {
        this.frequentlyQuestions = res.data;
      }
    },

    // 正则问题
    saveRegular(res) {
      if (res.flag) {
        this.regularArr = res.data;
      }
    },

    // 关闭相似问法弹框
    cancelSimilarDialog() {
      this.similarDialogVisible = false;
    },

    // 保存相似问法库
    saveSimilar() {
      this.$refs.commonQuestion.submitExpand();
      this.$refs.regularQuestion.submitExpand();
      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;

      this.similarDialogVisible = false;
    },

    // 保存faq基础设置
    saveFaqBasic() {
      let basicData = {
        ...this.faqBasicFormData,
        dimensionId: this.dimensionId.join(","),
        similarText: [],
        similarRegular: [],
        knowledgeList: [],
        tableQAKnowledgeList: [],
        botId: this.botId,
      };
      // faq推荐问题
      if (this.recommendList.faq.length > 0) {
        basicData.knowledgeList = this.recommendList.faq;
      }
      // table推荐问题
      if (this.recommendList.tab.length > 0) {
        basicData.tableQAKnowledgeList = this.recommendList.tab;
      }
      // 相似问法
      this.frequentlyQuestions.forEach((item) => {
        basicData.similarText.push(item.intentQuestion);
      });

      // 相似正则
      this.regularArr.forEach((item) => {
        basicData.similarRegular.push(item.intentQuestion);
      });
      if (this.faqBasicFormData.availableStatus === 1) {
        basicData.effectDate = this.faqBasicFormData.effectTime[0];
        basicData.expireDate = this.faqBasicFormData.effectTime[1];
      }
      return basicData;

      /*this.$refs.faqBasicFormRef.validate((flag) => {
        validateFlag = flag;
        debugger
        if (flag) {
          basicData = {
            ...this.faqBasicFormData
          };
        } else {
          basicData = {};
        }

        that.$emit('saveFaqBasicIndex', {
          basicData,
          validateFlag
        })
      });*/
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .choose-perspective-dialog .el-dialog__body {
  padding: 0px 0px 0 20px;
}

/deep/ .add-answer-spective-btn {
  text-align: center;
}

/deep/ .add-answer-spective-wrap {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
}

.answer-perspective-item {
  position: relative;
  margin-bottom: 15px;

  .perspect-list-container {
    position: relative;
    padding-right: 90px;

    .choose-perspect-btn {
      position: absolute;
      right: 0;
      top: 3px;
    }
  }

  .perspect-list-wrap {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    /* height: 32px;*/
    padding-right: 10px;

    .perspect-list-ul {
      padding: 0;
      margin: 0;
      list-style: none;
      /* line-height: 32px;*/
      min-height: 32px;

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
          max-width: 130px;
          display: inline-block;
        }

        .perspect-tag-close {
          color: #909399;
          background-color: #c0c4cc;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          transform: scale(0.8);
          display: inline-block;
          vertical-align: top;
          margin-top: 3px;
        }
      }

      .perspect-tip {
        color: #c0c4cc;
        font-size: 13px;
        padding-left: 15px;
      }
    }
  }

  .delete-answer-btn {
    position: absolute;
    right: -24px;
    top: 0;
  }
}
</style>
