<template>
  <div class="fileMark kw-hasLeft-container">
    <div style="text-align: right">
      <!-- <el-button type="primary" size="small">保存</el-button> -->
      <el-button
        size="small"
        @click="close"
        class="el-icon-close"
        type="text"
      ></el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form
          :label-position="labelPosition"
          :model="form"
          label-width="100px"
          ref="form"
        >
          <el-form-item :label="$t('doc.documentName') + '：'">
            {{ form.fileName }}
          </el-form-item>
          <el-form-item :label="this.$t('doc.annotateDocument') + '：'">
            <el-radio-group v-model="form.type" @input="changeType">
              <el-radio label="0">{{ $t("doc.fqaKnowledge") }}</el-radio>
              <el-radio label="1">{{ $t("doc.proprietaryWords") }}</el-radio>
              <el-radio label="2">{{ $t("doc.sensitive") }}</el-radio>
              <el-radio label="3">{{ $t("doc.notionalWords") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="this.$t('doc.documentContent') + '：'">
            <div>
              <div
                style="white-space: pre-wrap"
                v-if="form.type === '0'"
                v-html="faqHtml"
                class="fileContent"
                id="fileContent"
                ref="fileContent"
                @mouseup="mouseup($event)"
              ></div>
              <div
                style="white-space: pre-wrap"
                v-if="form.type === '1'"
                v-html="glossaryHtml"
                class="fileContent"
                id="fileContent"
                ref="fileContent"
                @mouseup="mouseup($event)"
              ></div>
              <div
                style="white-space: pre-wrap"
                v-if="form.type === '2'"
                v-html="sensitivitywordHtml"
                class="fileContent"
                id="fileContent"
                ref="fileContent"
                @mouseup="mouseup($event)"
              ></div>
              <div
                style="white-space: pre-wrap"
                v-if="form.type === '3'"
                v-html="entitywordHtml"
                class="fileContent"
                id="fileContent"
                ref="fileContent"
                contenteditable="true"
                @mouseup="mouseup($event)"
              ></div>
            </div>
          </el-form-item>
        </el-form>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          "
        >
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <div style="margin-right: 10px">
              <i class="blue"></i>
              <span>{{ markName }}</span>
            </div>
            <div v-if="form.type === '0'">
              <i class="green"></i>
              <span>{{ $t("doc.answer") }}</span>
            </div>
          </div>
          <el-button v-if="form.type === '1'" size="mini" @click="handelReslut"
            >{{ $t('kwRobotAnswer.participleResult') }}</el-button
          >
        </div>
        <div class="menu" id="markMenu">
          <div @click="menuClick(1)">{{ $t("doc.standardIssues") }}</div>
          <div @click="menuClick(2)">{{ $t("doc.answer") }}</div>
          <!-- <div @click="menuClick(3)">相似问法</div> -->
        </div>
      </el-col>
      <el-col :span="12">
        <p>{{ $t("doc.annotationResults") }}</p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('doc.fqaKnowledge')" name="first">
            <Faqmark
              :markForm="rowData"
              :key="activeName"
              :text="form.text"
              ref="faqmark"
              @handelReslut="handelFaqmark"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('doc.proprietaryWords')" name="second">
            <Glossary
              :markForm="rowData"
              :key="activeName"
              :text="form.text"
              ref="glossary"
              @handelReslut="handelGlossary"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('doc.sensitive')" name="third">
            <Sensitivityword
              :markForm="rowData"
              :key="activeName"
              :text="form.text"
              ref="sensitivityword"
              @handelReslut="handelSensitivityword"
            />
          </el-tab-pane>
          <el-tab-pane :label="$t('doc.notionalWords')" name="fourth">
            <Entityword
              :markForm="rowData"
              :key="activeName"
              ref="entityword"
              :text="form.text"
              @handelReslut="handelEntityword"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- <HuilanDialog
      title="新增FAQ知识"
      append-to-body
      :visible.sync="qaDialog"
      width="40%"
      :modal="false"
      :close-on-press-escape="false"
      :close-on-click-modal='false'
    >
      <Faqadd :markForm="markObj" :key="new Date().getTime()" tool="add" />
      <template v-slot:footer>
        <el-button size="small" @click="qaDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSave">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog> -->
    <!-- 新增faq标注 -->
    <div class="faqBox" id="faqBox" v-if="qaDialog">
      <div class="faqBoxHeader" @mousedown="draggableFun('faqBox')">
        <div>
          <div>{{ $t("doc.addFAQknowledge") }}</div>
          <el-button
            class="el-icon-close"
            type="text"
            @click="qaDialog = false"
          ></el-button>
        </div>
      </div>
      <Faqadd
        :markForm="markObj"
        tool="add"
        :key="new Date().getTime()"
        ref="faqadd"
      />
      <div
        style="
          text-align: right;
          border-top: 1px solid #f0f0f0;
          line-height: 50px;
        "
      >
        <div style="padding: 0px 10px">
          <!-- <el-button size="small" @click="qaDialog = false">{{
            $t("aicosCommon.cancelBtn")
          }}</el-button> -->
          <el-button
            size="small"
            type="primary"
            @click="handlerSave(0)"
            :disabled="disable"
            >{{ $t("aicosCommon.saveBtn") }}</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="!isAudit"
            @click="handlerSave(1)"
            :disabled="disable"
          >
            {{ $t("doc.saveAndPublish") }}
          </el-button>
          <el-button
            v-if="isAudit"
            size="small"
            type="primary"
            :disabled="disable"
            @click="handlerSave(0, true)"
            >{{ $t("faq.saveAndPublish") }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="faqBox" id="resultBox" v-if="resultDialog">
      <div class="faqBoxHeader" @mousedown="draggableFun('resultBox')">
        <div>
          <div>{{ $t("doc.viewSegmentationResults") }}</div>
          <el-button
            class="el-icon-close"
            type="text"
            @click="resultDialog = false"
          ></el-button>
        </div>
      </div>
      <div
        style="
          padding: 20px;
          height: 500px;
          overflow-y: auto;
          overflow-x: hidden;
        "
      >
        {{ resultDialogData }}
      </div>
    </div>
    <HuilanDialog
      :title="$t('doc.addProprietaryWords')"
      append-to-body
      :visible.sync="glossaryDialog"
      width="40%"
    >
      <Glossaryadd
        :markForm="markObj"
        ref="glossaryadd"
        :key="new Date().getTime()"
        tool="add"
      />
      <template v-slot:footer>
        <el-button size="small" @click="glossaryDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerSaveGlossary"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <HuilanDialog
      :title="$t('doc.addSensitiveWords')"
      append-to-body
      :visible.sync="sensitivitywordDialog"
      width="40%"
    >
      <Sensitivitywordadd
        :markForm="markObj"
        :key="new Date().getTime()"
        tool="add"
        ref="sensitivitywordadd"
      />
      <template v-slot:footer>
        <el-button size="small" @click="sensitivitywordDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerSaveSensitivityword"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <HuilanDialog
      :title="$t('doc.addAnInstance')"
      append-to-body
      :visible.sync="entitywordDialog"
      width="40%"
    >
      <Entityworddadd
        :markForm="markObj"
        ref="entitywordadd"
        tool="add"
        :key="new Date().getTime()"
      />
      <template v-slot:footer>
        <el-button size="small" @click="entitywordDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerEntityword"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import { deepClone } from "@/util/util";
import {
  saveProper,
  saveSensitive,
  saveEntityWord,
  fileKnowledgeSplit,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import { savefaqUrl } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import Faqadd from "./faqadd";
import Faqmark from "./faqmark";
import Entityword from "./entityword";
import Glossary from "./glossary";
import Sensitivityword from "./sensitivityword";
import Glossaryadd from "./glossaryadd";
import Sensitivitywordadd from "./sensitivitywordadd";
import Entityworddadd from "./entityworddadd";
import {
  getAuditSetting,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
import { mapGetters } from "vuex";
export default {
  props: ["rowData"],
  components: {
    Faqadd,
    Faqmark,
    Entityword,
    Glossary,
    Sensitivityword,
    Glossaryadd,
    Sensitivitywordadd,
    Entityworddadd,
  },
  data() {
    return {
      resultDialog: false,
      resultDialogData: "",
      disable: false,
      form: { type: "0" },
      activeName: "first",
      isFlag: false,
      qaDialog: false,
      glossaryDialog: false,
      sensitivitywordDialog: false,
      entitywordDialog: false,
      markObj: {},
      markName: this.$t("doc.standardIssues"),
      selectText: "",
      anchorOffset: 0,
      start: 0,
      lastEditRange: null,
      faqHtml: "",
      glossaryHtml: "",
      sensitivitywordHtml: "",
      entitywordHtml: "",
      text: "",
      question: {
        tag: "1",
        questionStart: "0",
        questionEnd: "0",
      },
      answer: {
        tag: "2",
        answerStart: "0",
        answerEnd: "0",
      },

      auditSetting: {}, // 审核设置
      isAudit: false, // 是否审核
    };
  },
  computed: {
    ...mapGetters(["userInfo", "language"]),
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  mounted() {
    this.form = { ...this.rowData, ...this.form };
    this.form.text = deepClone(this.form.fileContent);
    this.text = deepClone(this.form.fileContent);
    // this.faqHtml = deepClone(this.form.fileContent)
    // this.glossaryHtml = deepClone(this.form.fileContent)
    // this.sensitivitywordHtml = deepClone(this.form.fileContent)
    // this.entitywordHtml = deepClone(this.form.fileContent)
    document.addEventListener("click", (e) => {
      if (e.target.id != "markMenu" && e.target.id != "fileContent") {
        let ele = document.getElementById("markMenu");
        if (ele !== null) {
          ele.style.display = "none";
        }
      }
    });
    this.getAuditConfig();
  },
  methods: {
    async getAuditConfig() {
      const dataParam = {
        kmType: 1,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
    handelReslut() {
      let obj = {
        applicationId: this.$store.state.user.currentTenantId,
        text: this.text,
      };
      fileKnowledgeSplit(obj).then((res) => {
        if (res.data.success) {
          this.resultDialogData = res.data.data.splitSentences[0];
          this.resultDialog = true;
        }
      });
    },
    // 获取鼠标选中的文本
    mouseup(e) {
      const selectText = window.getSelection().toString();
      this.selectText = selectText;
      const pos = this.getDivPosition(
        document.getElementById("fileContent"),
        this.form.text,
        this.form.text.length
      );
      this.start = Number(pos) - Number(selectText.length);
      if (selectText !== "") {
        if (this.qaDialog) {
          this.markObj = {
            rowId: this.rowData.id,
            text: selectText,
            ...this.markObj,
          };
          this.markObj.text = selectText;
        } else {
          this.markObj = { rowId: this.rowData.id, text: selectText };
        }
        if (this.form.type === "0") {
          let ele = document.getElementById("markMenu");
          ele.style.display = "block";
          ele.style.left = e.clientX + "px";
          ele.style.top = Number(e.clientY + 20) + "px";
        }
        if (this.form.type === "1") {
          this.glossaryDialog = true;
        }
        if (this.form.type === "2") {
          this.sensitivitywordDialog = true;
        }
        if (this.form.type === "3") {
          this.entitywordDialog = true;
        }
      }
    },
    getCurPos(doc) {
      var curCurPos = "";
      var all_range = "";
      console.log(doc.id);
      if (navigator.userAgent.indexOf("MSIE") > -1) {
        //IE
        if (doc.id == "fileContent") {
          // 根据body创建textRange
          all_range = document.body.createTextRange(); // 让textRange范围包含元素里所有内容
          all_range.moveToElementText(doc);
        } else {
          // 根据当前输入元素类型创建textRange
          all_range = doc.createTextRange();
        } // 输入元素获取焦点

        doc.focus(); // 获取当前的textRange,如果当前的textRange是一个具体位置而不是范围,textRange的范围从start到end.此时start等于end

        var cur_range = document.selection.createRange(); // 将当前的textRange的end向前移"选中的文本.length"个单位.保证start=end

        cur_range.moveEnd("character", -cur_range.text.length); // 将当前textRange的start移动到之前创建的textRange的start处, 此时当前textRange范围变为整个内容的start处到当前范围end处

        cur_range.setEndPoint("StartToStart", all_range); // 此时当前textRange的Start到End的长度,就是光标的位置

        curCurPos = cur_range.text.length;
      } else {
        // 文本框获取焦点
        doc.focus(); // 获取当前元素光标位置
        curCurPos = doc.selectionStart;
      } // 返回光标位置
      return curCurPos;
    },
    getDivPosition(element) {
      var caretOffset = 0;
      var doc = element.ownerDocument || element.document;
      var win = doc.defaultView || doc.parentWindow;
      var sel;
      // 谷歌、火狐
      if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        // 选中的区域
        if (sel.rangeCount > 0) {
          var range = win.getSelection().getRangeAt(0);
          // 克隆一个选中区域
          var preCaretRange = range.cloneRange();
          // 设置选中区域的节点内容为当前节点
          preCaretRange.selectNodeContents(element);
          // 重置选中区域的结束位置
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        }
        // IE
      } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset;
    },
    menuClick(type) {
      if (type === 1 || type === 2) {
        if (!this.qaDialog) {
          this.qaDialog = true;
        }
        this.markObj.type = type;
        let ele = document.getElementById("markMenu");
        ele.style.display = "none";
        if (type === 1) {
          this.markObj.question = this.markObj.text;
          this.question.questionStart = this.start;
          this.question.questionEnd =
            Number(this.start) + Number(this.selectText.length);
        }
        if (type === 2) {
          this.markObj.answer = this.markObj.text;
          this.answer.answerStart = this.start;
          this.answer.answerEnd =
            Number(this.start) + Number(this.selectText.length);
        }
      }
      this.$forceUpdate();
    },
    changeType(type) {
      let ele = document.getElementById("markMenu");
      ele.style.display = "none";
      if (type === "0") {
        this.markName = this.$t("doc.standardIssues");
        this.text = this.faqHtml;
        this.activeName = "first";
      }
      if (type === "1") {
        this.markName = this.$t("doc.proprietaryWords");
        this.text = deepClone(this.glossaryHtml);
        this.activeName = "second";
      }
      if (type === "2") {
        this.markName = this.$t("doc.sensitive");
        this.text = deepClone(this.sensitivitywordHtml);
        this.activeName = "third";
      }
      if (type === "3") {
        this.markName = this.$t("doc.notionalWords");
        this.text = deepClone(this.entitywordHtml);
        this.activeName = "fourth";
      }
    },
    handleClick() {
      if (this.activeName === "first") {
        this.form.type = "0";
        this.markName = this.$t("doc.standardIssues");
        this.text = this.faqHtml;
      }
      if (this.activeName === "second") {
        this.form.type = "1";
        this.markName = this.$t("doc.proprietaryWords");
        this.text = deepClone(this.glossaryHtml);
      }
      if (this.activeName === "third") {
        this.form.type = "2";
        this.markName = this.$t("doc.sensitive");
        this.text = deepClone(this.sensitivitywordHtml);
      }
      if (this.activeName === "fourth") {
        this.form.type = "3";
        this.markName = this.$t("doc.notionalWords");
        this.text = deepClone(this.entitywordHtml);
      }
    },
    close() {
      this.$emit("close", true);
    },
    // 鼠标拖拽faq盒子
    draggableFun(idName) {
      let div = document.getElementById(idName);
      let dragFlag = false;
      let x, y;

      div.onmousedown = function (e) {
        dragFlag = true;
        e = e || window.event;
        // 获取鼠标在元素上的位置（鼠标按下时在元素上得位置）
        x = e.clientX - div.offsetLeft;
        y = e.clientY - div.offsetTop;
      };

      div.onmousemove = function (e) {
        if (dragFlag) {
          e = e || window.event;
          div.style.left = e.clientX - x + "px";
          div.style.top = e.clientY - y + "px";
        }
      };
      // 鼠标抬起事件
      div.onmouseup = function () {
        dragFlag = false;
      };
    },
    // faq新增
    handlerSave(status, startAudit = false) {
      const faqBasicForm = this.$refs.faqadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.faqadd.saveFaqBasic();
            data.questionDetail = { ...this.question };
            data.answerDetail = { ...this.answer };
            data.faqquestion.finalVeriyfStatus = status;
            data.submitApprovalStatus = startAudit;
            this.disable = true;
            savefaqUrl(data)
              .then(async (res) => {
                //开启审核流程
                if (startAudit) {
                  await kmAuditStart(
                    res.data.data,
                    1,
                    this.auditSetting.processDefineId
                  );
                }
              })
              .then(() => {
                if (!startAudit) {
                  this.$message.success(this.$t("doc.addedSuccessTips"));
                }
                this.qaDialog = false;
                this.disable = false;
                this.$refs.faqmark.getList();
              })
              .catch(() => {
                this.disable = false;
              });
            resolve();
          }
        });
      });
    },
    // faq标注
    async handelFaqmark(listData) {
      let copyContent = deepClone(this.form.text);
      if (listData.length > 0) {
        copyContent = this.faqrepp(listData, copyContent);
      }
      this.faqHtml = copyContent;
    },
    faqrepp(listData, text) {
      let textList = text.split("");
      for (let i in listData) {
        if (
          listData[i].questionDetail.tag === "1" &&
          listData[i].questionDetail.questionEnd !== "0"
        ) {
          let startNum = listData[i].questionDetail.questionStart,
            endNum = listData[i].questionDetail.questionEnd;
          if (Number(startNum) == Number(endNum) - 1) {
            textList[
              Number(startNum)
            ] = `<span style="color:white; background-color: #1e90ff">${
              textList[Number(startNum)]
            }</span>`;
          } else {
            textList[
              Number(startNum)
            ] = `<span style="color:white; background-color: #1e90ff">${
              textList[Number(startNum)]
            }`;
            textList[Number(endNum) - 1] = `${
              textList[Number(endNum) - 1]
            }</span>`;
          }
        }
        if (
          listData[i].answerDetail.tag === "2" &&
          listData[i].answerDetail.answerEnd !== "0"
        ) {
          let startNum = listData[i].answerDetail.answerStart,
            endNum = listData[i].answerDetail.answerEnd;
          if (Number(startNum) == Number(endNum) - 1) {
            textList[
              Number(startNum)
            ] = `<span style="color:white; background-color: #b0d272">${
              textList[Number(startNum)]
            }</span>`;
          } else {
            textList[
              Number(startNum)
            ] = `<span style="color:white; background-color: #b0d272">${
              textList[Number(startNum)]
            }`;
            textList[Number(endNum) - 1] = `${
              textList[Number(endNum) - 1]
            }</span>`;
          }
        }
      }
      return textList.join("");
    },
    // 新增专有词
    handlerSaveGlossary() {
      const faqBasicForm = this.$refs.glossaryadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.glossaryadd.saveFaqBasic();
            data.start = this.start;
            data.end = Number(this.start) + Number(this.selectText.length);
            data.tag = "3";
            this.disable = true;
            saveProper(data)
              .then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("doc.addedProprietaryTips"));
                  this.glossaryDialog = false;
                  this.disable = false;
                  this.$refs.glossary.getList();
                }
              })
              .catch(() => {
                this.disable = false;
              });
            resolve();
          }
        });
      });
    },
    // 专有词标注
    async handelGlossary(listData) {
      let copyContent = deepClone(this.form.text);
      if (listData.length > 0) {
        copyContent = await this.repp(listData, copyContent);
      }
      this.glossaryHtml = copyContent;
    },
    repp(listData, text) {
      let textList = text.split("");
      for (let i in listData) {
        let startNum = listData[i].start,
          endNum = listData[i].end;
        if (listData[i].end !== "0") {
          if (Number(startNum) == Number(endNum) - 1) {
            textList[
              Number(startNum)
            ] = `<span style="color:white; background-color: #1e90ff">${
              textList[Number(startNum)]
            }</span>`;
          } else {
            textList[
              Number(startNum)
            ] = `<span style="color:white; background-color: #1e90ff">${
              textList[Number(startNum)]
            }`;
            textList[Number(endNum) - 1] = `${
              textList[Number(endNum) - 1]
            }</span>`;
          }
        }
      }
      return textList.join("");
    },
    // 新增敏感词
    handlerSaveSensitivityword() {
      const faqBasicForm = this.$refs.sensitivitywordadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.sensitivitywordadd.saveFaqBasic();
            data.start = this.start;
            data.end = Number(this.start) + Number(this.selectText.length);
            data.tag = "3";
            this.disable = true;
            saveSensitive(data)
              .then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("doc.addedSensitiveTips"));
                  this.sensitivitywordDialog = false;
                  this.disable = false;
                  this.$refs.sensitivityword.getList();
                }
              })
              .catch(() => {
                this.disable = false;
              });
            resolve();
          }
        });
      });
    },
    // 敏感词标注
    async handelSensitivityword(listData) {
      let copyContent = deepClone(this.form.text);
      if (listData.length > 0) {
        copyContent = await this.repp(listData, copyContent);
      }
      this.sensitivitywordHtml = copyContent;
    },
    // 保存实例
    handlerEntityword() {
      const faqBasicForm = this.$refs.entitywordadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.entitywordadd.saveFaqBasic();
            data.start = this.start;
            data.end = Number(this.start) + Number(this.selectText.length);
            data.tag = "3";
            this.disable = true;
            saveEntityWord(data)
              .then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("doc.addedEntityTips"));
                  this.entitywordDialog = false;
                  this.disable = false;
                  this.$refs.entityword.getList();
                }
              })
              .catch(() => {
                this.disable = false;
              });
            resolve();
          }
        });
      });
    },
    // 实例标注
    async handelEntityword(listData) {
      let copyContent = deepClone(this.form.text);
      if (listData.length > 0) {
        copyContent = await this.repp(listData, copyContent);
      }
      this.entitywordHtml = copyContent;
    },
  },
};
</script>
<style lang="scss" scoped>
/* webkit, opera, IE9 （谷歌浏览器）*/
::selection {
  background: rgb(205, 205, 205);
}

/* mozilla firefox（火狐浏览器） */
::-moz-selection {
  background: rgb(205, 205, 205);
}

.fileMark {
  margin: 0px !important;
  padding: 10px;

  .fileContent {
    height: 450px;
    padding: 10px;
    background-color: #eee;
    border-radius: 5px;
    overflow: auto;
  }

  .menu {
    position: fixed;
    top: 0px;
    left: 0px;
    display: none;
    width: 110px;
    background-color: white;
    border-radius: 3px;

    div {
      text-align: center;
      line-height: 36px;
      cursor: pointer;
    }

    div:hover {
      background-color: #dfe8d8;
    }
  }

  .blue {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 1px;
    background-color: #1e90ff;
    margin-right: 5px;
  }

  .green {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 1px;
    background-color: #b0d272;
    margin-right: 5px;
  }

  .faqBox {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 800px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 15px 0px;
    box-shadow: 0px 1px 5px 2px #d7d7d7;
    z-index: 2;

    .faqBoxHeader {
      line-height: 50px;
      border-bottom: 1px solid #f0f0f0;

      div {
        padding: 0px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .faqBoxHeader:hover {
      cursor: move;
    }
  }
}
</style>
