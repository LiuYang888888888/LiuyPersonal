<template>
  <div>
    <avue-form
      :option="option"
      ref="form"
      v-model="form"
      :upload-preview="uploadPreview"
      @submit="submit"
    >
      <template slot-scope="{}" slot="answerVisualAngle">
        <div class="answer-perspective-item">
          <div class="perspect-list-container" :style="paddingRight">
            <div class="perspect-list-wrap">
              <ul class="perspect-list-ul">
                <li
                  class="perspect-item"
                  :key="perspectIndex"
                  v-for="(onlyPerspectvie, perspectIndex) in angleData"
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
                    @click="deletePersItem(onlyPerspectvie, perspectIndex)"
                  ></i>
                </li>
              </ul>
            </div>
            <el-button
              size="mini"
              type="primary"
              v-if="title !== $t('aicosCommon.viewBtn')"
              class="choose-perspect-btn"
              @click="choosePerspectDialog(perspectIndex)"
              >{{ $t("table.chooseAPerspective") }}</el-button
            >
          </div>
        </div>
      </template>
    </avue-form>
    <!--选择答案视角-->
    <HuilanDialog
      :title="$t('table.chooseAPerspective')"
      :close-on-click-modal="isCloseOnClickModal"
      append-to-body
      :visible.sync="choosePerspectVisible"
      width="60%"
      custom-class="choose-perspective-dialog"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('table.channelPerspective')" name="first">
          <ChooseChannel
            v-if="choosePerspectVisible"
            ref="chooseChannelRef"
            :choosedPerspects="chooseChannelDatas"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('table.customPerspective')" name="second">
          <ChoosePerspect
            v-if="choosePerspectVisible"
            ref="choosePerspectRef"
            :choosedPerspects="choosedPerspectDatas"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('table.customerPerspective')" name="third">
          <ChooseClient
            v-if="choosePerspectVisible"
            ref="chooseClientRef"
            :choosedPerspects="chooseClientDatas"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="客户情绪" name="fourth">
          <ChooseEmotion
            v-if="choosePerspectVisible"
            ref="chooseEmotionRef"
            :choosedPerspects="chooseEmotionDatas"
          />
        </el-tab-pane> -->
      </el-tabs>

      <template v-slot:footer>
        <el-button size="small" @click="choosePerspectVisible = false">{{
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
import {
  // getForestTree,
  getTableSetting,
  getDetail,
  getEmptyAngle,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/answersetting";
import serviceList from "@/config/serviceList";
import ChoosePerspect from "@/components/kwAddInMethod/choosePerspect";
import ChooseChannel from "@/components/kwAddInMethod/chooseChannel";
import ChooseClient from "@/components/kwAddInMethod/chooseClient";
import ChooseEmotion from "@/components/kwAddInMethod/chooseEmotion";
import { deepClone } from "@/util/util";
import { baseURL } from "@/api/common";
import { mapGetters } from "vuex";
export default {
  components: {
    ChoosePerspect,
    ChooseChannel,
    ChooseClient,
    ChooseEmotion,
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    selectData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeName: "first",
      choosePerspectVisible: false, // 选择视角弹框
      angleData: [], // 选中的视角的数据
      choosedPerspectDatas: [], // 自定义视角
      chooseChannelDatas: [], // 渠道视角
      chooseClientDatas: [], // 客户视角
      // chooseEmotionDatas: [], // 客户情绪

      curEditPerspectAnserIndex: 0, // 当前选择的视角的答案
      option: {
        column: [
          {
            label: this.$t("table.answerPerspective"),
            span: 24,
            display: true,
            prop: "answerVisualAngle",
            required: true,
            // rules: [{ required: true, message: "请选择答案视角" }],
          },
          {
            type: "input",
            label: this.$t("table.dimension"),
            span: 24,
            display: true,
            detail: true,
            prop: "dimensionName",
          },
        ],
        detail: false,
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 200,
        gutter: 0,
        menuBtn: false,
        submitBtn: true,
        submitText: this.$t("table.submitText"),
        emptyBtn: true,
        emptyText: this.$t("table.emptyText"),
        menuPosition: "center",
      },
      form: {
        formAnswers: [],
      },
      obj: {
        tableQaId: this.validatenull(this.selectData)
          ? this.rowData.id
          : this.selectData.tableQaId,
        dimensionId: [],
        tableQaQuestion: "",
      },
      textareaUploadName: [],
      arrayData: [],

      richTextArr: [],
      isEmptyAngle: false,
      list: [],
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "language"]),
    paddingRight() {
      return {
        paddingRight: this.language != "zh" ? "165px" : "90px",
      };
    },
  },
  mounted() {
    // getForestTree(this.botObj.id).then((res) => {
    //   if (res.data.success) {
    //     const data = this.findObject(this.option.column, "answerVisualAngle");
    //     data.dicData = res.data.data;
    //   }
    // });
    // console.log(this.selectData);
    this.list = deepClone(this.selectData.angleList);
    // true 有空 false无空
    getEmptyAngle({
      tableQaId: this.validatenull(this.selectData)
        ? this.rowData.id
        : this.selectData.tableQaId,
    }).then((res) => {
      if (res.data.success) {
        this.isEmptyAngle = res.data.data;
      }
    });
    this.getFormSetting();
    if (this.title === this.$t("aicosCommon.viewBtn")) {
      // this.option.detail = true;
    } else {
      this.option.detail = false;
    }
  },
  methods: {
    // 打开视角答案
    choosePerspectDialog(index) {
      this.choosePerspectVisible = true;

      this.activeName = "first";
      this.curEditPerspectAnserIndex = index;
    },
    // 删除一个视角
    deletePersItem(onlyPerspectvie, index) {
      // console.log(onlyPerspectvie);
      let type = onlyPerspectvie.angleType,
        that = this,
        id = onlyPerspectvie.angleId;
      this.angleData.splice(index, 1);
      // 删除渠道视角
      if (type === 1) {
        that.chooseChannelDatas.every((item, index) => {
          if (item.angleId == id) {
            that.chooseChannelDatas.splice(index, 1);
            return false;
          } else {
            return true;
          }
        });
      }
      // 删除自定义视角
      if (type === 2) {
        this.choosedPerspectDatas.every((item, index) => {
          if (item.angleId == id) {
            this.choosedPerspectDatas.splice(index, 1);
            return false;
          } else {
            return true;
          }
        });
      }
      // 删除客户视角
      if (type === 3) {
        this.chooseClientDatas.every((item, index) => {
          if (item.angleId == id) {
            this.chooseClientDatas.splice(index, 1);
            return false;
          } else {
            return true;
          }
        });
      }
    },
    // 保存视角
    saveChoosePerspectDialog() {
      var perspects = [],
        channel = [],
        customer = [];
      // emotion = [];

      // 自定义视角
      perspects = this.$refs.choosePerspectRef.savePerspects();
      // 渠道视角
      channel = this.$refs.chooseChannelRef.savePerspects();
      // 客户端视角
      customer = this.$refs.chooseClientRef.savePerspects();
      // 情绪视角
      // emotion = this.$refs.chooseEmotionRef.savePerspects();
      if (this.validatenull(channel)) {
        this.$message.warning(this.$t("faq.channelTip"));
        return false;
      }
      this.angleData = [];
      if (channel.length > 0) {
        channel.forEach((item) => {
          item.angleType = 1;
          item.angleId = item.id;
          this.angleData.push(item);
        });
      }
      if (perspects.length > 0) {
        perspects.forEach((item) => {
          item.angleType = 2;
          item.angleId = item.id;
          this.angleData.push(item);
        });
      }
      if (customer.length > 0) {
        customer.forEach((item) => {
          item.angleType = 3;
          this.angleData.push(item);
        });
      }
      // if (emotion.length > 0) {
      //   emotion.forEach((item) => {
      //     item.angleType = 4;
      //     this.angleData.push(item);
      //   });
      // }

      this.choosedPerspectDatas = perspects;
      this.chooseChannelDatas = channel;
      this.chooseClientDatas = customer;
      // this.chooseEmotionDatas = emotion;
      // console.log(this.angleData);
      this.choosePerspectVisible = false;
    },

    getFormSetting() {
      let id = this.validatenull(this.selectData)
        ? this.rowData.id
        : this.selectData.tableQaId;
      getTableSetting(id).then((res) => {
        let a = [],
          data = res.data.data;
        data.huilanKmTableSettingContentVos.map((item) => {
          if (item.displayTypeContent !== null) {
            item.displayTypeContent = JSON.parse(item.displayTypeContent);
          }
          let b = { rules: [] },
            c = { rules: [] },
            dicData = [];
          b.label = item.nameZh;
          b.prop = item.nameEn;
          b.span = 24;
          if (item.nameEn === "itemName") {
            b.detail = true;
          }
          if (this.title === this.$t("aicosCommon.viewBtn")) {
            b.readonly = true;
            if (item.displayType === 8 || item.displayType === 9) {
              b.detail = true;
            }
          }

          b.type = this.type(item.displayType);
          if (item.displayType === 3) {
            this.textareaUploadName.push(item.nameEn);
            c.label = item.nameZh + this.$t("table.annex");
            c.prop = item.nameEn + "File";
            c.span = 24;
            c.type = "upload";
            c.action = `${baseURL}api/${serviceList.file}/miniofile/upload`;
            c.propsHttp = {
              home: "",
              url: "newFileName",
              name: "objectName",
              res: "data",
              fileName: "file",
            };
            c.multiple = true;
            c.uploadAfter = (res, show) => {
              const base = baseURL.replace(/\/$/, "");
              res.newFileName = base + res.newFileName;
              show(res);
            };
            c.data = {
              fromSystemName: "base",
            };
            c.limit = 20;

            if (item.ifRequired === 1) {
              c.required = true;
              c.rules.push({
                required: true,
                message: item.nameZh + this.$t("table.notEmptyTips"),
              });
            }
          }
          if (item.displayType === 8 || item.displayType === 9) {
            b.action = `${baseURL}api/${serviceList.file}/miniofile/upload`;
            b.propsHttp = {
              home: "",
              url: "newFileName",
              name: "objectName",
              res: "data",
              fileName: "file",
            };
            b.multiple = true;
            b.uploadAfter = (res, show) => {
              const base = baseURL.replace(/\/$/, "");
              res.newFileName = base + res.newFileName;
              show(res);
            };
            b.data = {
              fromSystemName: "base",
            };
            b.limit = 20;
            if (item.displayType === 9) {
              b.accept = ".jpg,.jpeg,.png";
              b.listType = "picture-card";
            } else {
              b.fileType = "";
            }
          }
          if (
            item.displayType === 4 ||
            item.displayType === 5 ||
            item.displayType === 6
          ) {
            b.dicData = [];
            dicData = item.displayTypeContent.content.split("#####");
            for (let i in dicData) {
              b.dicData.push({ label: dicData[i], value: dicData[i] });
            }
          }
          if (item.displayType === 7) {
            b.format = "yyyy-MM-dd";
            b.valueFormat = "yyyy-MM-dd";
          }
          if (item.displayType === 10) {
            this.richTextArr.push(item.nameEn);
            // b.component = "avueUeditor";
            b.component = "KnowledgeEditor";
            b.params = {
              options: {
                action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
                props: {
                  url: "newFileName",
                  res: "data",
                  home: baseURL.replace(/\/$/, ""),
                },
              },
            };
          }
          if (item.displayTypeContent !== null) {
            if (
              item.displayTypeContent.dateType === 1 ||
              item.displayTypeContent.dateType === 2
            ) {
              b.type = "number";
            }
            if (item.displayTypeContent.dateType === 1) {
              b.rules.push({
                pattern: /^(-)?[0-9]*$/,
                message: this.$t("table.numberTips"),
              });
            } else {
              b.precision = 2;
            }
          }
          if (item.ifRequired === 1) {
            b.required = true;
            b.rules.push({
              required: true,
              message: item.nameZh + this.$t("table.notEmptyTips"),
            });
          }
          b.minlength =
            item.minimumCharacters === null ? 0 : item.minimumCharacters;
          b.maxlength = item.maximumCharacters;
          b.showWordLimit = true;
          if (item.checkType !== 0) {
            b.rules.push(this.formRules(item.checkType));
          }
          if (
            item.displayType === 6 ||
            item.displayType === 8 ||
            item.displayType === 9
          ) {
            this.arrayData.push(item.nameEn);
          }
          a.push(b);
          if (item.displayType === 3) {
            a.push(c);
          }
        });
        this.option.column = [...this.option.column, ...a];
        this.obj.tableQaQuestion = data.question;
        this.form.itemName = data.question;
        if (data.dimension !== null) {
          data.dimension.map((item) => {
            this.form.dimensionName += item.dname + "/";
            this.obj.dimensionId.push(item.id);
          });
        }
        if (
          this.title === this.$t("aicosCommon.editBtn") ||
          this.title === this.$t("aicosCommon.viewBtn")
        ) {
          this.getFormDetail();
        }
      });
    },
    getFormDetail() {
      getDetail(this.selectData.id).then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          for (let i in this.arrayData) {
            if (data[this.arrayData[i]] !== null) {
              data[this.arrayData[i]] = JSON.parse(data[this.arrayData[i]]);
            }
          }
          if (this.textareaUploadName.length > 0) {
            this.textareaUploadName.map((item) => {
              if (data[item] !== null) {
                let obj = JSON.parse(data[item]);
                data[item] = obj.name;
                data[item + "File"] = obj.file;
              }
            });
          }
          this.form = { ...data, ...this.form };
          this.angleData = data.huilanKmRelatedAngleList;
          data.huilanKmRelatedAngleList.map((item) => {
            if (item.angleType === 1) {
              this.chooseChannelDatas.push(item);
            }
            if (item.angleType === 2) {
              // console.log(item);
              item.cateid = item.selfDefinedCateId;
              this.choosedPerspectDatas.push(item);
            }
            if (item.angleType === 3) {
              // console.log(item);
              item.cateid = deepClone(item.angleId).split("_")[0];
              this.chooseClientDatas.push(item);
            }
            // if (item.angleType === 4) {
            //   this.chooseEmotionDatas.push(item);
            // }
          });
          this.form.answerVisualAngle = data.answerVisualAngle;
        }
      });
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
    uploadPreview(file, column, done) {
      if (column.listType === "picture-card") {
        done();
      }
    },
    type(val) {
      if (val === 0 || val === 1) {
        return "input";
      }
      if (val === 2 || val === 3) {
        return "textarea";
      }
      if (val === 4) {
        return "select";
      }
      if (val === 5) {
        return "radio";
      }
      if (val === 6) {
        return "checkbox";
      }
      if (val === 7) {
        return "date";
      }
      if (val === 8 || val === 9) {
        return "upload";
      }
      // if (val === 10) {
      //   return "ueditor";
      // }
    },
    formRules(val) {
      let a = [];
      if (val === 1) {
        a.push({
          pattern: /^1[0-9]{10}$/,
          message: this.$t("table.phoneTips"),
        });
        return a;
      }
      if (val === 2) {
        a.push({
          pattern: /^([0-9]{3,4}-)?[0-9]{7,8}$/,
          message: this.$t("table.landlineTip"),
        });
        return a;
      }
      if (val === 3) {
        a.push({
          pattern: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
          message: this.$t("table.iDCardTips"),
        });
        return a;
      }
      if (val === 4) {
        a.push({
          pattern:
            /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
          message: this.$t("table.emailTips"),
        });
        return a;
      }
      if (val === 5) {
        a.push({
          pattern: /^[0-9]*$/,
          message: this.$t("table.numberTips"),
        });
        return a;
      }
      if (val === 6) {
        a.push({
          pattern: /[^a-zA-Z]/g,
          message: this.$t("table.letterTips"),
        });
        return a;
      }
      if (val === 8) {
        a.push({
          pattern: /^(-)?[0-9]*$/,
          message: this.$t("table.integerTips"),
        });
        return a;
      }
    },
    submit() {
      let arr = [],
        ids = [],
        flag = false;
      if (this.angleData.length > 0) {
        this.angleData.map((item) => {
          if (item.angleType === 1) {
            flag = true;
          }
          let obj = {};
          obj.name = item.name;
          obj.angleId = item.angleId;
          obj.angleType = item.angleType;
          obj.cateName = item.cateName;
          ids.push(item.id);
          if (item.angleType === 2) {
            obj.selfDefinedCateId = item.cateid;
          }
          arr.push(obj);
        });
      }
      let obj = { ...this.form, ...this.obj };
      obj.dimensionId = obj.dimensionId.join(",");
      obj.huilanKmRelatedAngleList = arr;
      obj.answerVisualAngle = ids.join(",");
      if (this.textareaUploadName.length > 0) {
        this.textareaUploadName.map((item) => {
          obj[item] = JSON.stringify({
            name: obj[item],
            file: obj[item + "File"],
          });
        });
      }
      if (!flag && this.isEmptyAngle && !this.validatenull(this.list)) {
        this.$message.warning(this.$t("faq.channelTip"));
        return {};
      }
      if (!this.validatenull(this.richTextArr)) {
        for (let i in this.richTextArr) {
          if (
            !this.validatenull(obj[this.richTextArr[i]]) &&
            obj[this.richTextArr[i]].length > 2000
          ) {
            this.$message.error(this.$t("faq.overlength"));
            return {};
          }
        }
      }
      for (let i in this.arrayData) {
        if (obj[this.arrayData[i]] !== undefined) {
          obj[this.arrayData[i]] = JSON.stringify(obj[this.arrayData[i]]);
        }
      }
      return obj;
    },
  },
};
</script>
<style lang="scss" scoped>
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
