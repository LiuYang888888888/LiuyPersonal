<template>
  <div>
    <avue-form
      ref="faqBasicFormRef"
      v-model="faqBasicFormData"
      :option="faqBasicFormOption"
    >
      <!-- <template slot="caName">
        <span>{{ curTreeNode.data.dname !== undefined ? curTreeNode.data.dname :''}}</span>
      </template> -->
      <!-- <template slot="cateId">
        <span>{{ curTreeNode.data.id }}</span>
      </template> -->
      <template slot="question">
        <el-input
          type="input"
          :placeholder="
            $t('aicosCommon.pleaseInput') + $t('smalltalk.standardIssues')
          "
          v-model="faqBasicFormData.question"
          @blur="onBlurQuestion"
          :disabled="faqType === 'view' || faqType === 'version'"
        ></el-input>
      </template>
      <template slot="extQuestions">
        <el-button
          type="text"
          @click.stop="similarDialogVisible = true"
          v-if="faqType !== 'view' && faqType !== 'version'"
          >{{ $t("smalltalk.addQuestions") }}</el-button
        >
        <span style="padding-left: 10px"
          >{{ $t("smalltalk.added") }}：：{{ this.similarQuestionLength }}</span
        >
      </template>
      <template slot="formAnswers">
        <div
          class="answer-perspective-item"
          v-for="(formAnswerItem, answerIndex) in faqBasicFormData.formAnswers"
          :key="answerIndex"
        >
          <!-- <el-form-item label="答案视角"> -->
          <div class="perspect-list-container" v-if="answerIndex > 0">
            <div class="perspect-list-wrap">
              <ul class="perspect-list-ul">
                <li
                  class="perspect-item"
                  :key="perspectIndex"
                  v-for="(
                    onlyPerspectvie, perspectIndex
                  ) in formAnswerItem.perspectives"
                >
                  <span
                    class="perspect-tag-text"
                    :title="
                      onlyPerspectvie.cateName + '：' + onlyPerspectvie.name
                    "
                    >{{ onlyPerspectvie.cateName }}：{{
                      onlyPerspectvie.name
                    }}</span
                  >
                  <i
                    class="perspect-tag-close el-icon-close"
                    @click="deletePersItem(onlyPerspectvie, answerIndex)"
                  ></i>
                </li>
                <!--<li class="perspect-tip" v-if="formAnswerItem.perspectives.length == 0">不选择则默认为“通用”视角</li>-->
              </ul>
            </div>
            <el-button
              size="mini"
              type="primary"
              class="choose-perspect-btn"
              @click="choosePerspectDialog(answerIndex)"
              >{{ $t("smalltalk.chooseAPerspective") }}</el-button
            >
          </div>
          <div class="perspect-list-container" v-else>
            <p style="margin: 0">{{ $t("smalltalk.universalPerspective") }}</p>
          </div>
          <div style="margin-top: 8px">
            <knowledge-editor
              v-model="formAnswerItem.answers"
            ></knowledge-editor>
          </div>
          <!-- </el-form-item> -->
          <el-button
            v-if="faqBasicFormData.formAnswers.length > 1 && answerIndex !== 0"
            icon="el-icon-delete"
            @click="deleteAnswer(answerIndex)"
            class="delete-answer-btn"
            type="text"
            title="删除"
          >
          </el-button>
        </div>
      </template>
      <!-- <template slot="addAnswerSpectiveBtn">
        <el-button icon="el-icon-plus" type="text" @click="addAnswer"
          >新建答案</el-button
        >
      </template> -->
      <template slot="intentGroup">
        <div>
          <el-autocomplete
            class="el-input-border-radius shadowStyle"
            v-model="faqBasicFormData.intentGroup"
            clearable
            style="width: calc(100% - 20px)"
            maxlength="200"
            show-word-limit
            :fetch-suggestions="querySearchAsync"
            :placeholder="$t('smalltalk.intentionTips')"
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

    <!--选择答案视角-->
    <HuilanDialog
      :title="$t('smalltalk.chooseAPerspective')"
      :close-on-click-modal="isCloseOnClickModal"
      append-to-body
      :visible.sync="choosePerspectVisible"
      width="60%"
      custom-class="choose-perspective-dialog"
    >
      <el-tabs v-model="angleActiveName" @tab-click="handleClick">
        <el-tab-pane :label="$t('smalltalk.channelPerspective')" name="one">
          <ChooseChannel
            v-if="choosePerspectVisible"
            ref="chooseChannelRef"
            :choosedPerspects="chooseChannelDatas"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('smalltalk.customPerspective')" name="two">
          <ChoosePerspect
            v-if="choosePerspectVisible"
            ref="choosePerspectRef"
            :choosedPerspects="choosedPerspectDatas"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('smalltalk.customerPerspective')" name="three">
          <ChooseClient
            v-if="choosePerspectVisible"
            ref="chooseClientRef"
            :choosedPerspects="chooseClientDatas"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="客户情绪" name="four">
          <ChooseEmotion
            v-if="choosePerspectVisible"
            ref="chooseEmotionRef"
            :choosedPerspects="chooseEmotionDatas"
          />
        </el-tab-pane> -->
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="closeChoosePerspectDialog">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveChoosePerspectDialog"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import CommonAnswer from "@/components/kwAddInMethod/commonAnswer";
import Regular from "@/components/kwAddInMethod/regular";
import ChoosePerspect from "@/components/kwAddInMethod/choosePerspect";
import ChooseChannel from "@/components/kwAddInMethod/chooseChannel";
import ChooseClient from "@/components/kwAddInMethod/chooseClient";
import ChooseEmotion from "@/components/kwAddInMethod/chooseEmotion";
import {
  selectIntentListWithRobot,
  recommendIntent,
  selectList,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
// import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  components: {
    CommonAnswer,
    Regular,
    ChoosePerspect,
    ChooseChannel,
    ChooseClient,
    ChooseEmotion,
  },
  props: {
    curTreeNode: {
      type: Object,
      default: () => {
        return {};
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
      default: "",
    },
  },
  data() {
    return {
      keywordsArr: [],
      isCloseOnClickModal: false,
      activeName: "first",
      similarDialogVisible: false, // 相似问法弹框
      frequentlyQuestions: [], // 常用问题
      regularArr: [], // 正则问题
      similarQuestionLength: 0, // 相似问题长度
      choosePerspectVisible: false, // 选择视角弹框
      choosedPerspectDatas: [], // 反显视角
      chooseChannelDatas: [], // 渠道视角
      chooseClientDatas: [], // 客户视角
      // chooseEmotionDatas: [], // 客户情绪
      curEditPerspectAnserIndex: 0, // 当前选择的视角的答案
      faqBasicFormData: {
        caName: "",
        caId: "",
        question: "",
        formAnswers: [
          {
            perspectives: [],
            answers: "",
          },
        ],
      },
      faqBasicFormOption: {
        column: [
          {
            label: this.$t("smalltalk.category"),
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
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("smalltalk.category"),
              },
            ],
          },
          {
            label: this.$t("smalltalk.standardIssues"),
            prop: "question",
            required: true,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("smalltalk.standardIssues"),
              },
            ],
          },
          {
            type: "input",
            label: this.$t("smalltalk.similarityQuestion"),
            display: true,
            span: 24,
            prop: "extQuestions",
          },
          {
            type: "input",
            label: this.$t("smalltalk.relatedIntention"),
            display: true,
            span: 24,
            // tip:this.$t("faq.intentionTip"),
            // dicUrl: `/api/${aiworkorder}/kgcc-label/tree`,
            // props: { label: "title", value: "id" },
            rules: [
              { required: true, message: this.$t("smalltalk.intentionTips") },
              // ...getRules(["charNumHan"]),
            ],
            prop: "intentGroup",
          },
          {
            label: this.$t("smalltalk.answerPerspective"),
            // labelWidth: "0",
            display: true,
            span: 22,
            prop: "formAnswers",
            className: "add-answer-spective-wrap",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("faq.answerPerspective"),
              },
            ],
          },
          {
            label: "",
            prop: "addAnswerSpectiveBtn",
            className: "add-answer-spective-btn",
            span: 24,
            // display:
            //   this.faqType == "add" || this.faqType == "edit" ? true : false,
            display: false,
          },
        ],
        detail: false,
        span: 16,
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 100,
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
    // console.log(this.faqType);
    this.faqBasicFormData.question = this.basicDataObj.question;
    if (this.faqType === "view" || this.faqType === "version") {
      this.faqBasicFormOption.detail = true;
    }
    // if (this.faqType === "add") {
    //   this.faqBasicFormData.caName = this.curTreeNode.data.dname;
    //   this.faqBasicFormData.caId = this.curTreeNode.data.id;
    // }
    selectList({ classType: "gossip" }).then((res) => {
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
      this.onBlurQuestion();
    }
  },
  methods: {
    onBlurQuestion() {
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
              this.faqBasicFormData.intentGroup =
                res.data.data.items[0].displayTag;
            }
          }
        });
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
      let faqquestion = this.basicDataObj.gossipQuestion;
      let extquestion = this.basicDataObj.extquestion; // 相似问法
      let regquestion = this.basicDataObj.regquestion; // 正则
      let faqanswer = this.basicDataObj.gossipAnswer; // 答案
      // let inteList = this.basicDataObj.inteList; // 意图
      // let formAnswers = [];
      // 设置分类名称和id
      this.$set(this.curTreeNode, "data", {
        id: faqquestion.cateId,
        dname: this.basicDataObj.cateName,
      });
      // 设置问题和答案
      this.faqBasicFormData.caName = this.curTreeNode.data.dname;
      this.faqBasicFormData.question = faqquestion.content;
      this.faqBasicFormData.intentGroup = faqquestion.intentGroup;
      this.faqBasicFormData.id = faqquestion.id;

      // 答案
      this.faqBasicFormData.formAnswers = [];
      faqanswer.forEach((item) => {
        let perspectives = [],
          channel = [],
          customer = [],
          // emotion = [],
          perspects = [];
        if (item.angleList) {
          item.angleList.forEach((spectives) => {
            if (spectives.type == "channel") {
              spectives.ids = this.getIds(spectives);
              channel.push(spectives);
            }
            // if (spectives.type == "emotion") {
            //   spectives.ids = this.getIds(spectives)
            //   emotion.push(spectives);
            // }
            if (spectives.type == "selfDefined") {
              spectives.ids = this.getIds(spectives);
              perspects.push(spectives);
            }
            if (spectives.type == "customer") {
              spectives.ids = this.getIds(spectives);
              customer.push(spectives);
            }
            perspectives.push({
              cateId: spectives.cateid,
              cateName: spectives.cateName,
              id: spectives.id,
              ids: this.getIds(spectives),
              name: spectives.name,
              type: spectives.type,
            });
          });
        }
        this.faqBasicFormData.formAnswers.push({
          perspectives,
          answers: item.content,
          channel,
          customer,
          // emotion,
          perspects,
        });
      });

      // 设置相似问法
      if (extquestion) {
        extquestion.forEach((item) => {
          this.frequentlyQuestions.push({
            intentQuestion: item,
          });
        });
      }

      // 设置正则表达式
      if (regquestion) {
        regquestion.forEach((item) => {
          this.regularArr.push({
            intentQuestion: item,
          });
        });
      }
      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;
    },
    getIds(spectives) {
      if (spectives.type == "channel") {
        return spectives.id + "_1";
      }
      if (spectives.type == "selfDefined") {
        return spectives.id + "_2";
      }
      if (spectives.type == "customer") {
        return spectives.id + "_3";
      }
      if (spectives.type == "emotion") {
        return spectives.id + "_4";
      }
    },
    // 添加答案视角
    addAnswer() {
      this.faqBasicFormData.formAnswers.push({
        perspectives: [],
        answers: "",
      });
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

    // 打开视角答案
    choosePerspectDialog(answerIndex) {
      this.choosePerspectVisible = true;
      this.angleActiveName = "one";
      this.choosedPerspectDatas =
        this.faqBasicFormData.formAnswers[answerIndex].perspects;
      this.chooseChannelDatas =
        this.faqBasicFormData.formAnswers[answerIndex].channel;
      this.chooseClientDatas =
        this.faqBasicFormData.formAnswers[answerIndex].customer;
      // this.chooseEmotionDatas =
      //   this.faqBasicFormData.formAnswers[answerIndex].emotion;
      this.curEditPerspectAnserIndex = answerIndex;
    },

    // 关闭视角
    closeChoosePerspectDialog() {
      this.choosePerspectVisible = false;
    },

    // 保存视角
    saveChoosePerspectDialog() {
      var perspects = [],
        channel = [],
        customer = [];
      // emotion = [];
      var that = this;

      // 自定义视角
      perspects = this.$refs.choosePerspectRef.savePerspects();
      // 渠道视角
      channel = this.$refs.chooseChannelRef.savePerspects();
      // 客户端视角
      customer = this.$refs.chooseClientRef.savePerspects();
      // 情绪视角
      // emotion = this.$refs.chooseEmotionRef.savePerspects();
      // console.log("自定义视角:", perspects);
      // console.log("渠道视角:", channel);
      // console.log("客户端视角:", customer);
      // console.log("情绪视角:", emotion);
      that.faqBasicFormData.formAnswers[
        that.curEditPerspectAnserIndex
      ].perspectives = [];
      if (channel.length > 0) {
        channel.forEach((item) => {
          that.faqBasicFormData.formAnswers[
            that.curEditPerspectAnserIndex
          ].perspectives.push(item);
        });
      }
      if (perspects.length > 0) {
        perspects.forEach((item) => {
          that.faqBasicFormData.formAnswers[
            that.curEditPerspectAnserIndex
          ].perspectives.push(item);
        });
      }
      if (customer.length > 0) {
        customer.forEach((item) => {
          that.faqBasicFormData.formAnswers[
            that.curEditPerspectAnserIndex
          ].perspectives.push(item);
        });
      }
      // if (emotion.length > 0) {
      //   emotion.forEach((item) => {
      //     that.faqBasicFormData.formAnswers[
      //       that.curEditPerspectAnserIndex
      //     ].perspectives.push(item);
      //   });
      // }
      that.faqBasicFormData.formAnswers[
        that.curEditPerspectAnserIndex
      ].perspects = perspects;
      that.faqBasicFormData.formAnswers[
        that.curEditPerspectAnserIndex
      ].channel = channel;
      that.faqBasicFormData.formAnswers[
        that.curEditPerspectAnserIndex
      ].customer = customer;
      // that.faqBasicFormData.formAnswers[
      //   that.curEditPerspectAnserIndex
      // ].emotion = emotion;

      this.choosePerspectVisible = false;
    },

    // 删除一个视角
    deletePersItem(onlyPerspectvie, answerIndex) {
      let id = onlyPerspectvie.id,
        type = onlyPerspectvie.type,
        that = this;
      // 删除渠道视角
      if (type === "channel") {
        that.faqBasicFormData.formAnswers[answerIndex].channel.every(
          (item, index) => {
            if (item.id == id) {
              that.faqBasicFormData.formAnswers[answerIndex].channel.splice(
                index,
                1
              );
              return false;
            } else {
              return true;
            }
          }
        );
      }
      // 删除自定义视角
      if (type === "selfDefined") {
        that.faqBasicFormData.formAnswers[answerIndex].perspects.every(
          (item, index) => {
            if (item.id == id) {
              that.faqBasicFormData.formAnswers[answerIndex].perspects.splice(
                index,
                1
              );
              return false;
            } else {
              return true;
            }
          }
        );
      }
      // 删除客户视角
      if (type === "customer") {
        that.faqBasicFormData.formAnswers[answerIndex].customer.every(
          (item, index) => {
            if (item.id == id) {
              that.faqBasicFormData.formAnswers[answerIndex].customer.splice(
                index,
                1
              );
              return false;
            } else {
              return true;
            }
          }
        );
      }
      that.faqBasicFormData.formAnswers[answerIndex].perspectives.every(
        (item, index) => {
          if (item.id == id) {
            that.faqBasicFormData.formAnswers[answerIndex].perspectives.splice(
              index,
              1
            );
            return false;
          } else {
            return true;
          }
        }
      );
    },

    // 删除答案
    deleteAnswer(answerIndex) {
      this.faqBasicFormData.formAnswers.splice(answerIndex, 1);
    },

    // 保存faq基础设置
    saveFaqBasic() {
      let basicData = {
          faqquestion: {
            cateId: "", // 分类id
            content: "", // 问题
            id: "",
          },
          extquestion: [],
          regquestion: [],
          inteList: [],
          faqanswer: [],
        },
        flag = false,
        arr = [];

      // 相似问法
      this.frequentlyQuestions.forEach((item) => {
        basicData.extquestion.push(item.intentQuestion);
      });

      // 相似正则
      this.regularArr.forEach((item) => {
        basicData.regquestion.push(item.intentQuestion);
      });

      // 关联意图
      basicData.inteList = []; // 存放意图id

      // 视角答案
      this.faqBasicFormData.formAnswers.forEach((item, index) => {
        if (index === 0) {
          if (item.answers === "") {
            this.$message({
              type: "warning",
              message: "请填写答案",
            });
            flag = true;
          }
        } else {
          if (item.answers === "" && item.perspectives.length === 0) {
            flag = true;
            if (document.getElementsByClassName("el-message").length === 0) {
              this.$message({
                type: "warning",
                message: "请填写答案或视角",
              });
            }
          } else {
            if (item.answers === "") {
              flag = true;
              if (document.getElementsByClassName("el-message").length === 0) {
                this.$message({
                  type: "warning",
                  message: "请填写答案",
                });
              }
            }
            if (item.perspectives.length === 0) {
              flag = true;
              if (document.getElementsByClassName("el-message").length === 0) {
                this.$message({
                  type: "warning",
                  message: "请选择视角",
                });
              }
            }
          }
        }
        let curAngleIds = [],
          selfDefinedCateId = "";
        item.perspectives.forEach((perItem) => {
          curAngleIds.push(perItem.ids);
        });
        if (index !== 0) {
          arr.push({ id: curAngleIds.join(";") });
        }
        if (item.perspects && item.perspects.length > 0) {
          selfDefinedCateId = item.perspects[0].cateid;
        }
        basicData.faqanswer.push({
          selfDefinedCateId,
          content: item.answers,
          angleId: curAngleIds.join(","),
        });
      });
      // 判断是否有相同的视角
      const newListLength = new Set(arr.map((item) => item.id)).size;
      const listLength = arr.length;
      if (listLength > newListLength) {
        this.$message.warning("视角组合不能重复");
        flag = true;
      }

      // 问题内容
      basicData.faqquestion = {
        content: this.faqBasicFormData.question,
        cateId: this.faqBasicFormData.cateId,
        intentGroup: this.faqBasicFormData.intentGroup,
        id: this.faqBasicFormData.id,
      };
      if (!flag) {
        return basicData;
      } else {
        return false;
      }

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
