<template>
  <div class="111154245656494848514846">
    <avue-form
      v-model="faqMoreFormData"
      :option="faqMoreFormOption"
      ref="faqMoreFormRef"
    >
      <template slot="knowledgeDiname">
        <TreeSelect
          multiple
          :size="'small'"
          v-model="dimensionIds"
          :showValue="dimensionNames"
          :treeOption="treeOption"
        />
      </template>

      <template slot="customQuestion">
        <el-button type="text" @click.stop="isShowConnectKnowledgeDialog = true"
          >添加/管理推荐问题</el-button
        >
        <span style="padding-left: 10px"
          >已添加：{{ recommendList.faq.length }}</span
        >
      </template>

      <template slot="askQuestions">
        <el-row v-if="faqType == 'add' || faqType == 'edit'"
          ><el-button type="primary" @click="addAskQuestion"
            >新增追问</el-button
          ></el-row
        >
        <el-row
          :style="{
            marginTop: faqType == 'add' || faqType == 'edit' ? '10px' : '0px',
          }"
        >
          <avue-crud
            :option="AskQuestionTableOption"
            :data="AskQuestionTableData"
            ref="AskQuestionTable"
            @on-load="onLoad"
          >
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                @click.stop="editFaqClosely(scope.row, scope.index)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click.stop="deleteFaqClosely(scope.row, scope.index)"
                >删除</el-button
              >
            </template>
          </avue-crud>
        </el-row>
      </template>
    </avue-form>

    <!--新增追问-->
    <HuilanDialog
      :title="isAddOrEditCloselyType == 'add' ? '新增追问' : '编辑追问'"
      append-to-body
      :visible.sync="isShowCloselyQuestion"
      width="600px"
      custom-class="add-closely-question"
    >
      <AddCloselyQuestion
        v-if="isShowCloselyQuestion"
        ref="AddCloselyQuestionRef"
        :type="isAddOrEditCloselyType"
        :curEditFaqObj="curEditFaqObj"
        @saveCloselyEmit="saveCloselyEmit"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowCloselyQuestion = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveCloselyQuestion">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>

    <HuilanDialog
      :title="$t('kwRobotManage.recommended')"
      :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="isShowConnectKnowledgeDialog"
      append-to-body
      width="1200px"
      custom-class="customer-choose-knowledge-dialog"
    >
      <KwSimilar
        ref="kwSimilarRef"
        :faqData="recommendList"
        v-if="isShowConnectKnowledgeDialog"
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
import { getLazyList } from "@/api/kwKnowledgeCenter/kwSettings/kwDimensionManage/index";
// import serviceList from "@/config/serviceList";
// import { baseURL } from "@/api/common";
import TreeSelect from "@/components/kwTreeSelect";
import AddCloselyQuestion from "./addCloselyQuestion";
import KwSimilar from "@/components/kwSimilar/index";

// const { knowledge } = serviceList;

export default {
  data() {
    var botId = this.$store.getters.botObj.id;
    return {
      isCloseOnClickModal: false,
      isShowCloselyQuestion: false, // 打开追问
      isAddOrEditCloselyType: "add", // 追问是编辑还是新增
      isShowConnectKnowledgeDialog: false, // 打开知识弹框
      curEditFaqObj: {}, // 当前编辑的追问对象
      faqMoreFormData: {},
      dimensionIds: "", // 维度id
      dimensionNames: "", // 维度名称
      recommendList: { faq: [] }, // 相似问
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
        load: function (node, resolve) {
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
      faqMoreFormOption: {
        column: [
          {
            label: "知识维度",
            prop: "knowledgeDiname",
          },
          {
            label: "推荐问题",
            prop: "customQuestion",
          },
          {
            type: "radio",
            label: "知识有效期",
            prop: "validityPeriod",
            value: 0,
            dicData: [
              {
                label: "长期有效",
                value: 0,
              },
              {
                label: "自定义时间",
                value: 1,
              },
            ],
            required: true,
            rules: [{ required: true, message: "请选择知识有效期" }],
            change: ({ value }) => {
              const endTime = this.findObject(
                this.faqMoreFormOption.column,
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
            span: 12,
            display: false,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            prop: "effectTime",
            // pickerOptions: {
            //   disabledDate(time) {
            //     return time.getTime() < new Date(new Date().getTime());
            //   },
            // },
            required: true,
            rules: [{ required: true, message: "必须填写" }],
          },
          {
            label: "追问管理",
            prop: "askQuestions",
            display: true,
          },
        ],
        span: 16,
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 140,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
      },
      AskQuestionTableData: [],
      AskQuestionTableOption: {
        header: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        column: [
          {
            label: "问题",
            prop: "question",
            width: 280,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: "追问答案",
            prop: "answer",
            showWordLimit: true,
            overHidden: true,
          },
        ],
        menuWidth: 100,
        menuAlign: "center",
      },
    };
  },
  props: {
    faqType: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  components: {
    TreeSelect,
    AddCloselyQuestion,
    KwSimilar,
  },
  computed: {
    // 计算属性
  },
  methods: {
    // 设置数据
    setFaqMoreData(faqData) {
      var faqquestion = faqData.faqquestion;
      var faqFollowAsk = faqData.faqFollowAsk;
      var recommendList = faqData.recommendList;
      var effectTime = this.findObject(
        this.faqMoreFormOption.column,
        "effectTime"
      );

      // 设置维度 dimensionName
      this.dimensionIds = [];
      this.dimensionNames = [];
      if (faqquestion.kbDimensionId) {
        faqquestion.kbDimensionId.split(",").forEach((value) => {
          this.dimensionIds.push(value);
        });
      }

      if (faqquestion.dimensionName) {
        faqquestion.dimensionName.split(",").forEach((value) => {
          this.dimensionNames.push(value);
        });
      }
      // this.dimensionIds = faqquestion.kbDimensionId && faqquestion.kbDimensionId.split(',');
      // this.dimensionNames = faqquestion.dimensionName && faqquestion.dimensionName.split(',');

      // 相似问法
      if (recommendList) {
        recommendList.forEach((item) => {
          this.recommendList.faq.push({
            id: item.reContent,
            question: item.recomenName,
          });
        });
      }

      // 有效期
      this.faqMoreFormData.validityPeriod = faqquestion.avaliableStatus;

      if (faqquestion.avaliableStatus == 1) {
        this.faqMoreFormData.effectTime.push(faqquestion.effectDate);
        this.faqMoreFormData.effectTime.push(faqquestion.expireDate);
        effectTime.display = true;
      } else {
        this.faqMoreFormData.effectTime = [];
        effectTime.display = false;
      }

      // 设置追问
      if (faqFollowAsk) {
        faqFollowAsk.forEach((item) => {
          var extquestions = [];
          var regquestion = [];

          if (item.extquestion) {
            item.extquestion.forEach((freqItem) => {
              extquestions.push({
                intentQuestion: freqItem,
              });
            });
          }

          if (item.regquestion) {
            item.regquestion.forEach((freqItem) => {
              regquestion.push({
                intentQuestion: freqItem,
              });
            });
          }

          this.AskQuestionTableData.push({
            id: item.id,
            frontId: item.id,
            question: item.questions,
            answer: item.answer,
            frequentlyQuestions: extquestions,
            regularArr: regquestion,
          });
        });
      }
    },

    // 保存追问触发的方法
    saveCloselyEmit(qaObj) {
      let that = this;
      if (this.isAddOrEditCloselyType == "add") {
        // 新增
        this.AskQuestionTableData.push({ ...qaObj });
      } else {
        // 编辑  frontId
        this.AskQuestionTableData.every((item, index) => {
          if (item.frontId == qaObj.frontId) {
            that.AskQuestionTableData[index] = qaObj;
            this.$set(
              that.AskQuestionTableData,
              index,
              that.AskQuestionTableData[index]
            );
            return false;
          } else {
            return true;
          }
        });
      }

      // 关闭追问弹框
      this.isShowCloselyQuestion = false;
    },
    // 新增追问
    addAskQuestion() {
      this.isAddOrEditCloselyType = "add";
      this.isShowCloselyQuestion = true;
      this.curEditFaqObj = {};
    },

    // 编辑追问
    editFaqClosely(row) {
      this.isAddOrEditCloselyType = "edit";
      this.isShowCloselyQuestion = true;
      this.curEditFaqObj = row;
    },

    // 删除追问
    deleteFaqClosely(row) {
      let that = this;
      this.AskQuestionTableData.every((item, index) => {
        if (item.frontId == row.frontId) {
          that.AskQuestionTableData.splice(index, 1);
          return false;
        } else {
          return true;
        }
      });
    },

    // 保存追问
    saveCloselyQuestion() {
      this.$refs.AddCloselyQuestionRef.saveCloselyQuestion();
    },

    // 保存自定义推荐问题
    saveCusomerFaq() {
      this.recommendList.faq =
        this.$refs.kwSimilarRef.$refs.similarContainerRef.saveSimilarQuesion();
      this.isShowConnectKnowledgeDialog = false;
      console.log(this.recommendList.faq);
    },

    // 保存更多设置
    saveFaqMore() {
      var effectTimeArray = this.faqMoreFormData.effectTime;
      var effectDate = "";
      var expireDate = "";
      var faqMoreData = {
        faqquestion: {},
        recommendList: [],
        faqFollowAsk: [], // 追问
      };

      if (this.faqMoreFormData.validityPeriod == 1) {
        effectDate = effectTimeArray[0];
        expireDate = effectTimeArray[1];
      }

      faqMoreData.faqquestion = {
        kbDimensionId: this.dimensionIds.join(","),
        avaliableStatus: this.faqMoreFormData.validityPeriod, // effectTime
        effectDate: effectDate,
        expireDate: expireDate,
      };

      faqMoreData.recommendList = this.recommendList.faq;

      this.AskQuestionTableData.forEach((item) => {
        var extquestions = [];
        var regquestion = [];

        item.frequentlyQuestions.forEach((freqItem) => {
          extquestions.push(freqItem.intentQuestion);
        });

        item.regularArr.forEach((freqItem) => {
          regquestion.push(freqItem.intentQuestion);
        });

        faqMoreData.faqFollowAsk.push({
          frontId: item.frontId,
          questions: item.question,
          answer: item.answer,
          extquestion: extquestions,
          regquestion: regquestion,
        });
      });

      return faqMoreData;
    },
  },
  created() {},
  mounted() {
    console.log("more");
  },
  destroyed() {},
};
</script>

<style scoped lang="scss">
/deep/ .add-closely-question .el-dialog__body {
  padding: 10px 20px 0;
}
// /deep/ .customer-choose-knowledge-dialog .el-dialog__body {
//   padding: 0px 0px 0 0px;
// }
</style>
