<template>
  <div>
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
      class="setting-collapse"
    >
      <el-collapse-item
        :title="$t('kwRobotManage.customResponseRules')"
        name="1"
      >
        <el-container class="setting-container">
          <el-aside width="15%">
            <el-button
              size="small"
              class="kw-build-button kw-btn-green"
              style="width: 100%"
              @click="addClick"
            >
              {{ $t("kwRobotManage.addRule") }}
            </el-button>
            <div class="leftContainer">
              <template v-if="leftData.length > 0">
                <div
                  v-for="(item, i) in leftData"
                  :key="item.key + i"
                  class="addModule"
                  :class="item.key === activeKey ? 'active' : ''"
                  @click="handleClick(item)"
                >
                  <div class="title">
                    <div :title="item.nodeName" class="titleStyle">
                      {{ item.nodeName }}
                    </div>
                    <el-dropdown @command="handleCommand($event, i, item)">
                      <span class="el-dropdown-link">
                        <i
                          class="aicosicon aicos-icon-gengduo-shuxiang el-icon--right"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          command="stop"
                          v-if="item.status === 1"
                          >{{ $t("aicosCommon.pause") }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          command="start"
                          v-if="item.status === 0"
                          >{{ $t("aicosCommon.start") }}</el-dropdown-item
                        >
                        <el-dropdown-item command="del">{{
                          $t("aicosCommon.delBtn")
                        }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="status">
                    {{
                      item.status === 1
                        ? $t("kwRobotManage.inEffect")
                        : $t("kwRobotManage.deactivate")
                    }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="empty">
                  <p>{{ $t("aicosCommon.notData") }}</p>
                </div>
              </template>
            </div>
          </el-aside>
          <el-main>
            <template v-if="activeKey !== ''">
              <avue-form :option="option" v-model="formData" ref="form">
                <template slot-scope="{ disabled, size }" slot="channelType">
                  <div style="display: flex">
                    <el-input
                      :disabled="disabled"
                      :size="size"
                      v-model="formData.channelType"
                    ></el-input>
                    <el-popover
                      placement="top"
                      title=""
                      width="300"
                      trigger="hover"
                      :content="$t('kwRobotManage.highestPriority')"
                    >
                      <el-button
                        slot="reference"
                        class="el-icon-warning-outline"
                        type="text"
                      ></el-button>
                    </el-popover>
                  </div>
                </template>
                <template slot-scope="{ disabled, size }" slot="expression">
                  <div style="display: flex">
                    <el-input
                      :disabled="disabled"
                      :size="size"
                      v-model="formData.expression"
                    ></el-input>
                    <el-popover
                      placement="top"
                      title=""
                      width="300"
                      trigger="hover"
                    >
                      <div>
                        <p>{{ $t("kwRobotManage.supportedTips") }}</p>
                        <p>{{ $t("kwRobotManage.requirementsTips") }}</p>
                        <p>{{ $t("kwRobotManage.passedTips") }}</p>
                        <p>{{ $t("kwRobotManage.charactersTips") }}</p>
                        <p>{{ $t("kwRobotManage.exampleTips") }}</p>
                        <p>{{ $t("kwRobotManage.conditionTips") }}</p>
                        <p>{{ $t("kwRobotManage.allowedConditionTips") }}</p>
                      </div>
                      <el-button
                        slot="reference"
                        class="el-icon-warning-outline"
                        type="text"
                      ></el-button>
                    </el-popover>
                  </div>
                </template>
                <template slot-scope="{ disabled, size }" slot="sessionOrder">
                  <avue-crud
                    :data="formData.sessionOrder"
                    :option="tableOption"
                  >
                    <template slot="menuLeft">
                      <div style="color: #767676">
                        {{ $t("kwRobotManage.temporarilyTips") }}
                      </div>
                    </template>
                    <template slot="menuRight">
                      <el-button
                        class="el-icon-plus"
                        type="text"
                        @click="addConfig(formData.sessionOrder)"
                        >{{ $t("kwRobotManage.addConfiguration") }}</el-button
                      >
                    </template>
                    <template
                      slot="menu"
                      slot-scope="{ type, size, row, index }"
                    >
                      <el-button
                        :type="type"
                        v-if="index > 0"
                        @click="sortTable('up', row, index)"
                        >{{ $t("aicosCommon.moveUp") }}</el-button
                      >
                      <el-button
                        :type="type"
                        v-if="index < formData.sessionOrder.length - 1"
                        @click="sortTable('down', row, index)"
                        >{{ $t("aicosCommon.moveDown") }}</el-button
                      >
                    </template>
                  </avue-crud>
                </template>
                <template slot-scope="{ disabled, size }" slot="dialogueTypeId">
                  <div>
                    <div>{{ $t("kwRobotManage.jumpDifferent") }}</div>
                    <div>
                      <p>
                        <strong>{{ $t("kwRobotManage.IMType") }}：</strong
                        ><span style="color: #969696">{{
                          $t("kwRobotManage.supportsAdding")
                        }}</span>
                      </p>
                      <div style="padding-left: 20px">
                        <div>
                          <p v-if="formData.IMSelectValue">
                            {{ formData.IMSelectValue }}
                          </p>
                          <div style="display: flex">
                            <div>{{ $t("kwRobotManage.IMServices") }}：</div>
                            <div
                              style="display: flex; width: calc(100% - 65px)"
                            >
                              <el-select
                                v-model="formData.dialogueTypeIdIM"
                                @change="changeDialogue($event, 'IM')"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                style="margin-right: 10px"
                              >
                                <el-option
                                  v-for="(item, index) in dialogueOptions"
                                  :key="index"
                                  :label="item.categoryName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                              <el-select
                                v-model="formData.dialogueSpeechIdIM"
                                @change="changeDialogueFlow($event, 'IM')"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                style="margin-right: 10px"
                              >
                                <el-option
                                  v-for="(item, index) in dialogueFlowOptionsIM"
                                  :key="index"
                                  :label="item.speechName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                              <el-select
                                v-model="formData.dialogueProcessIdIM"
                                @change="changeFlow($event, 'IM')"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                style="margin-right: 10px"
                              >
                                <el-option
                                  v-for="(item, index) in flowOptionsIM"
                                  :key="index"
                                  :label="item.processName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                              <el-select
                                v-model="formData.dialogueProcessNodeIdIM"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                clearable
                              >
                                <el-option
                                  v-for="(item, index) in nodeOptionsIM"
                                  :key="index"
                                  :label="item.nodeName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                            </div>
                          </div>
                        </div>
                        <div style="margin-top: 10px">
                          <p v-if="formData.IMSelectValueAssist">
                            {{ formData.IMSelectValueAssist }}
                          </p>
                          <div style="display: flex">
                            <div>{{ $t("kwRobotManage.IMAssistance") }}：</div>
                            <div
                              style="display: flex; width: calc(100% - 65px)"
                            >
                              <el-select
                                v-model="formData.dialogueTypeIdIMAssist"
                                @change="changeDialogue($event, 'IM', 'assist')"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                style="margin-right: 10px"
                              >
                                <el-option
                                  v-for="(item, index) in dialogueOptions"
                                  :key="index"
                                  :label="item.categoryName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                              <el-select
                                v-model="formData.dialogueSpeechIdIMAssist"
                                @change="
                                  changeDialogueFlow($event, 'IM', 'assist')
                                "
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                style="margin-right: 10px"
                              >
                                <el-option
                                  v-for="(
                                    item, index
                                  ) in dialogueFlowOptionsIMAssist"
                                  :key="index"
                                  :label="item.speechName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                              <el-select
                                v-model="formData.dialogueProcessIdIMAssist"
                                @change="changeFlow($event, 'IM', 'assist')"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                style="margin-right: 10px"
                              >
                                <el-option
                                  v-for="(item, index) in flowOptionsIMAssist"
                                  :key="index"
                                  :label="item.processName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                              <el-select
                                v-model="formData.dialogueProcessNodeIdIMAssist"
                                :placeholder="$t('aicosCommon.pleaseInput')"
                                clearable
                              >
                                <el-option
                                  v-for="(item, index) in nodeOptionsIMAssist"
                                  :key="index"
                                  :label="item.nodeName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p>
                        <strong>{{ $t("kwRobotManage.phoneType") }}：</strong
                        ><span style="color: #969696">{{
                          $t("kwRobotManage.phoneRelated")
                        }}</span>
                      </p>
                      <div style="padding-left: 20px">
                        <div>
                          <div>
                            <p v-if="formData.callSelectValue">
                              {{ formData.callSelectValue }}
                            </p>
                            <div style="display: flex">
                              <div>
                                {{ $t("kwRobotManage.telephonySupport") }}：
                              </div>
                              <div
                                style="display: flex; width: calc(100% - 70px)"
                              >
                                <el-select
                                  v-model="formData.dialogueTypeIdCall"
                                  @change="changeDialogue($event, 'call')"
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  style="margin-right: 10px"
                                >
                                  <el-option
                                    v-for="(item, index) in dialogueOptions"
                                    :key="index"
                                    :label="item.categoryName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                                <el-select
                                  v-model="formData.dialogueSpeechIdCall"
                                  @change="changeDialogueFlow($event, 'call')"
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  style="margin-right: 10px"
                                >
                                  <el-option
                                    v-for="(item, index) in dialogueFlowOptions"
                                    :key="index"
                                    :label="item.speechName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                                <el-select
                                  v-model="formData.dialogueProcessIdCall"
                                  @change="changeFlow($event, 'call')"
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  style="margin-right: 10px"
                                >
                                  <el-option
                                    v-for="(item, index) in flowOptions"
                                    :key="index"
                                    :label="item.processName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                                <el-select
                                  v-model="formData.dialogueProcessNodeIdCall"
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  clearable
                                >
                                  <el-option
                                    v-for="(item, index) in nodeOptions"
                                    :key="index"
                                    :label="item.nodeName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <div style="margin-top: 10px">
                            <p v-if="formData.callSelectValueAssist">
                              {{ formData.callSelectValueAssist }}
                            </p>
                            <div style="display: flex">
                              <div>
                                {{ $t("kwRobotManage.telephoneAssistance") }}：
                              </div>
                              <div
                                style="display: flex; width: calc(100% - 70px)"
                              >
                                <el-select
                                  v-model="formData.dialogueTypeIdCallAssist"
                                  @change="
                                    changeDialogue($event, 'call', 'assist')
                                  "
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  style="margin-right: 10px"
                                >
                                  <el-option
                                    v-for="(item, index) in dialogueOptions"
                                    :key="index"
                                    :label="item.categoryName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                                <el-select
                                  v-model="formData.dialogueSpeechIdCallAssist"
                                  @change="
                                    changeDialogueFlow($event, 'call', 'assist')
                                  "
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  style="margin-right: 10px"
                                >
                                  <el-option
                                    v-for="(
                                      item, index
                                    ) in dialogueFlowOptionsAssist"
                                    :key="index"
                                    :label="item.speechName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                                <el-select
                                  v-model="formData.dialogueProcessIdCallAssist"
                                  @change="changeFlow($event, 'call', 'assist')"
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  style="margin-right: 10px"
                                >
                                  <el-option
                                    v-for="(item, index) in flowOptionsAssist"
                                    :key="index"
                                    :label="item.processName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                                <el-select
                                  v-model="
                                    formData.dialogueProcessNodeIdCallAssist
                                  "
                                  :placeholder="$t('aicosCommon.pleaseInput')"
                                  clearable
                                >
                                  <el-option
                                    v-for="(item, index) in nodeOptionsAssist"
                                    :key="index"
                                    :label="item.nodeName"
                                    :value="item.id"
                                  ></el-option>
                                </el-select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template slot-scope="scope" slot="name">
                  <div>{{ arr[scope.row["$index"]] }}</div>
                </template>
              </avue-form>
            </template>
            <template v-else>
              <div class="empty">
                <p>{{ $t("kwRobotManage.answerRule") }}</p>
              </div>
            </template>
          </el-main>
        </el-container>
        <div style="text-align: center">
          <el-button type="primary" size="small" @click="saveData">{{
            $t("aicosCommon.saveBtn")
          }}</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <HuilanDialog
      :title="$t('kwRobotManage.addRule')"
      append-to-body
      width="600px"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="addRule"
        :rules="rules"
        :label-position="language != 'zh' ? 'top' : 'right'"
        label-width="120px"
        size="small"
        ref="addRule"
        v-if="dialogVisible"
      >
        <el-form-item :label="$t('kwRobotManage.ruleName')" prop="nodeName">
          <el-input
            v-model="addRule.nodeName"
            :placeholder="
              $t('aicosCommon.pleaseInput') + $t('kwRobotManage.ruleName')
            "
            :maxlength="50"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('kwRobotManage.rulePriority')"
          prop="channelType"
        >
          <el-input v-model="addRule.channelType"></el-input>
          <span style="font-size: 12px; color: #969696">
            {{ $t("kwRobotManage.highestPriority") }}
          </span>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">
          {{ $t("aicosCommon.cancelBtn") }}</el-button
        >
        <el-button type="primary" size="small" @click="saveRule">
          {{ $t("aicosCommon.confirmBtn") }}
        </el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      :title="$t('kwRobotManage.addConfiguration')"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="optTag"
      :destroy-on-close="true"
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
import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import Addconfig from "../addconfig";
import {
  allAiccCategory,
  aiccSpeechListByCategory,
  aiccFlowBySpeechId,
  aiccNodeByFlowId,
} from "@/api/kwKnowledgeCenter/kwIntention/index";
import { deepClone } from "@/util/util";
export default {
  components: {
    Addconfig,
  },
  props: {
    fatherData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const { responseRuleSetting } = deepClone(this.fatherData);
    return {
      responseRuleSetting,
      sessionData: [], //会话数据
      activeNames: ["1"],
      // 左侧数据
      leftData: [],
      activeKey: "", // 当前选中的key
      // 新建规则
      dialogVisible: false,
      addRule: {
        nodeName: "",
        channelType: "",
        status: 1,
      },
      rules: {
        nodeName: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseInput") +
              this.$t("kwRobotManage.ruleName"),
            trigger: "blur",
          },
        ],
        channelType: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseInput") +
              this.$t("kwRobotManage.rulePriority"),
            trigger: "blur",
          },
          {
            pattern: /(^[1-9]\d*$)/,
            message: this.$t("kwRobotManage.positiveInteger"),
            trigger: "blur",
          },
        ],
      },
      // 主表单
      arr: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ],
      option: {
        labelWidth: 100,
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: this.$t("kwRobotManage.ruleName"),
            prop: "nodeName",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("kwRobotManage.ruleName"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("kwRobotManage.rulePriority"),
            prop: "channelType",
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("kwRobotManage.rulePriority"),
                trigger: "blur",
              },
              {
                pattern: /(^[1-9]\d*$)/,
                message: this.$t("kwRobotManage.positiveInteger"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("kwRobotManage.ruleConditions"),
            span: 24,
            prop: "rules",
            type: "dynamic",
            children: {
              align: "center",
              headerAlign: "center",
              index: false,
              type: "form",
              column: [
                {
                  label: "",
                  prop: "name",
                  span: 1,
                  labelWidth: 0,
                },
                {
                  label: this.$t("kwRobotManage.condition"),
                  labelWidth: 60,
                  prop: "condition",
                  // type: "select",
                  readonly: true,
                  value: this.$t("kwRobotManage.userAsked"),
                  span: 5,
                },
                {
                  label: this.$t("kwRobotManage.way"),
                  prop: "operator",
                  type: "select",
                  labelWidth: 60,
                  span: 5,
                  dicData: [
                    {
                      label: this.$t("kwRobotManage.equalTo"),
                      value: "equal",
                    },
                    {
                      label: this.$t("kwRobotManage.notEqualTo"),
                      value: "not_equal",
                    },
                    {
                      label: this.$t("kwRobotManage.comprise"),
                      value: "contain",
                    },
                    {
                      label: this.$t("kwRobotManage.notContain"),
                      value: "not_contain",
                    },
                    {
                      label: this.$t("kwRobotManage.regular"),
                      value: "re_match",
                    },
                  ],
                  rules: [
                    {
                      required: true,
                      message:
                        this.$t("aicosCommon.pleaseSelect") +
                        this.$t("kwRobotManage.ruleBasedApproach"),
                      trigger: "blur",
                    },
                  ],
                },
                {
                  label: this.$t("kwRobotManage.value"),
                  prop: "pattern",
                  span: 13,
                  labelWidth: 45,
                  rules: [
                    {
                      required: true,
                      message:
                        this.$t("aicosCommon.pleaseInput") +
                        this.$t("kwRobotManage.ruleValue"),
                      trigger: "blur",
                    },
                  ],
                },
              ],
            },
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("kwRobotManage.ruleConditions"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("kwRobotManage.ruleBasedApproach"),
            prop: "matchType",
            type: "select",
            dicData: [
              {
                label: this.$t("kwRobotManage.meetConditions"),
                value: "1",
              },
              {
                label: this.$t("kwRobotManage.anyConditions"),
                value: "2",
              },
              {
                label: this.$t("kwRobotManage.customConditions"),
                value: "3",
              },
            ],
            change: ({ value }) => {
              let expression = this.findObject(
                this.option.column,
                "expression"
              );
              if (value === "3") {
                expression.display = true;
              } else {
                expression.display = false;
                this.formData.expression = "";
              }
            },
            rules: [
              {
                required: true,
                message: this.$t("kwRobotManage.matchingMethod"),
                trigger: "change",
              },
            ],
          },
          {
            label: "",
            labelWidth: 0,
            prop: "expression",
            display: false,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("kwRobotManage.customConditions"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("kwRobotManage.executeAction"),
            prop: "action",
            type: "radio",
            span: 20,
            dicData: [
              {
                label: this.$t("kwRobotManage.specifySessionModule"),
                value: 1,
              },
              {
                label: this.$t("kwRobotManage.adjustingSessionOrder"),
                value: 2,
              },
            ],
            value: 1,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("kwRobotManage.executeAction"),
                trigger: "change",
              },
            ],
            change: ({ value }) => {
              let selectorName = this.findObject(
                  this.option.column,
                  "selectorName"
                ),
                sessionOrder = this.findObject(
                  this.option.column,
                  "sessionOrder"
                ),
                dialogueTypeId = this.findObject(
                  this.option.column,
                  "dialogueTypeId"
                );
              if (value === 1) {
                selectorName.display = true;
                sessionOrder.display = false;
                this.formData.sessionOrder = this.copyTableData;
              } else {
                dialogueTypeId.display = false;
                sessionOrder.display = true;
                selectorName.display = false;
                this.formData.selectorName = "";
              }
            },
          },
          {
            label: this.$t("kwRobotManage.sessionModuleName"),
            prop: "selectorName",
            type: "select",
            display: true,
            dicData: [],
            span: 12,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("kwRobotManage.sessionModuleName"),
                trigger: "change",
              },
            ],
            change: ({ value }) => {
              let dialogueTypeId = this.findObject(
                  this.option.column,
                  "dialogueTypeId"
                ),
                immersive = this.findObject(this.option.column, "immersive");
              if (!this.validatenull(value)) {
                if (
                  value !== "flow" &&
                  value !== "faq" &&
                  value !== "doc" &&
                  value !== "table" &&
                  value !== "intention"
                ) {
                  immersive.display = true;
                } else {
                  immersive.display = false;
                  this.formData.immersive = false;
                }
              }
              if (value === "flow") {
                dialogueTypeId.display = true;
              } else {
                dialogueTypeId.display = false;
                this.formData.dialogueTypeIdIM = "";
                this.formData.dialogueSpeechIdIM = "";
                this.formData.dialogueProcessIdIM = "";
                this.formData.dialogueProcessNodeIdIM = "";
                this.formData.dialogueTypeIdCall = "";
                this.formData.dialogueSpeechIdCall = "";
                this.formData.dialogueProcessIdCall = "";
                this.formData.dialogueProcessNodeIdCall = "";
                this.formData.dialogueTypeIdIMAssist = "";
                this.formData.dialogueSpeechIdIMAssist = "";
                this.formData.dialogueProcessIdIMAssist = "";
                this.formData.dialogueProcessNodeIdIMAssist = "";
                this.formData.dialogueTypeIdCallAssist = "";
                this.formData.dialogueSpeechIdCallAssist = "";
                this.formData.dialogueProcessIdCallAssist = "";
                this.formData.dialogueProcessNodeIdCallAssist = "";
              }
            },
          },
          {
            label: "",
            prop: "immersive",
            type: "switch",
            span: 12,
            display: false,
            tip: this.$t("kwRobotManage.tip"),
          },
          {
            label: this.$t("kwRobotManage.dialogueProcess"),
            prop: "dialogueTypeId",
            display: false,
            labelWidth: 90,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("kwRobotManage.dialogueProcess"),
                trigger: "change",
              },
            ],
          },
          {
            label: "",
            prop: "sessionOrder",
            display: false,
            span: 24,
          },
        ],
      },
      formData: {
        nodeName: "",
        channelType: "",
        rules: [],
        matchType: "",
        expression: "",
        action: 1,
        selectorName: "",
        sessionOrder: [],
        dialogueTypeId: "",
        immersive: false,
        dialogueTypeIdIM: "",
        dialogueSpeechIdIM: "",
        dialogueProcessIdIM: "",
        dialogueProcessNodeIdIM: "",
        dialogueTypeIdIMAssist: "",
        dialogueSpeechIdIMAssist: "",
        dialogueProcessIdIMAssist: "",
        dialogueProcessNodeIdIMAssist: "",
        dialogueTypeIdCall: "",
        dialogueSpeechIdCall: "",
        dialogueProcessIdCall: "",
        dialogueProcessNodeIdCall: "",
        dialogueTypeIdCallAssist: "",
        dialogueSpeechIdCallAssist: "",
        dialogueProcessIdCallAssist: "",
        dialogueProcessNodeIdCallAssist: "",
        IMSelectValue: "",
        callSelectValue: "",
        IMSelectValueAssist: "",
        callSelectValueAssist: "",
      },
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
      dialogueOptions: [],
      dialogueFlowOptions: [],
      flowOptions: [],
      nodeOptions: [],
      dialogueFlowOptionsAssist: [],
      flowOptionsAssist: [],
      nodeOptionsAssist: [],
      dialogueFlowOptionsIM: [],
      flowOptionsIM: [],
      nodeOptionsIM: [],
      dialogueFlowOptionsIMAssist: [],
      flowOptionsIMAssist: [],
      nodeOptionsIMAssist: [],
      // 添加配置
      optTag: false,
      checkedData: [],
      copyTableData: [],
    };
  },
  computed: {
    ...mapGetters(["language"]),
  },
  watch: {
    leftData: {
      handler(val) {
        if (val) {
          this.leftData = val;
        }
      },
      deep: true,
    },
    language: {
      handler(newVal) {
        this.option.labelPosition = newVal != "zh" ? "top" : "right";
      },
      immediate: true,
    },
  },

  mounted() {
    const postData = {
      current: 1,
      size: 1000,
      botId: this.$store.getters.botObj.id,
    };
    listData(postData).then((res) => {
      const data = res.data.data.records;
      this.sessionData = data;
      let selectorName = this.findObject(this.option.column, "selectorName");
      data.forEach((val, index) => {
        if (val.isSystem === 1) {
          val.show = false;
          val.priority = index + 1;
          this.formData.sessionOrder.push(val);
        }
      });
      this.copyTableData = deepClone(this.formData.sessionOrder);
      selectorName.dicData = data.map((v) => {
        if (v.isSystem === 0) {
          return {
            label: v.name,
            value: v.id,
          };
        } else {
          if (v.type === 2) {
            return {
              label: v.name,
              value: "table",
            };
          }
          if (v.type === 3) {
            return {
              label: v.name,
              value: "doc",
            };
          }
          if (v.type === 1) {
            return {
              label: v.name,
              value: "faq",
            };
          }
          if (v.type === 4) {
            return {
              label: v.name,
              value: "flow",
            };
          }
          if (v.type === 5) {
            return {
              label: v.name,
              value: "intention",
            };
          }
        }
      });
    });
    allAiccCategory().then((res) => {
      if (res.data.code == 200) {
        this.dialogueOptions = res.data.data;
      }
    });
    if (!this.validatenull(this.responseRuleSetting.rawData)) {
      this.leftData = JSON.parse(this.responseRuleSetting.rawData);
    } else {
      this.leftData = [];
    }
  },

  methods: {
    // 1：IM类型 2：电话类型 3：IM填单 4：电话填单 5：IM辅助 6：电话辅助
    changeDialogue(val, type, flag) {
      this.formData.dialogueTypeId = val;
      aiccSpeechListByCategory({ id: val }).then((res) => {
        if (res.data.code == 200) {
          let data = res.data.data;
          if (data.length > 0) {
            if (type === "call") {
              if (this.validatenull(flag)) {
                this.dialogueFlowOptions = data.filter(
                  (item) => item.type === 2 || item.type === 4
                );
              } else {
                this.dialogueFlowOptionsAssist = data.filter(
                  (item) => item.type === 6
                );
              }
            }
            if (type === "IM") {
              if (this.validatenull(flag)) {
                this.dialogueFlowOptionsIM = data.filter(
                  (item) => item.type === 1 || item.type === 3
                );
              } else {
                this.dialogueFlowOptionsIMAssist = data.filter(
                  (item) => item.type === 5
                );
              }
            }
          }
        }
      });
    },
    changeDialogueFlow(val, type, flag) {
      aiccFlowBySpeechId({ id: val }).then((res) => {
        if (res.data.code == 200) {
          if (type === "IM") {
            if (this.validatenull(flag)) {
              this.flowOptionsIM = res.data.data;
            } else {
              this.flowOptionsIMAssist = res.data.data;
            }
          } else {
            if (this.validatenull(flag)) {
              this.flowOptions = res.data.data;
            } else {
              this.flowOptionsAssist = res.data.data;
            }
          }
        }
      });
    },
    changeFlow(val, type, flag) {
      aiccNodeByFlowId({ id: val }).then((res) => {
        if (res.data.code == 200) {
          if (type === "IM") {
            if (this.validatenull(flag)) {
              this.nodeOptionsIM = res.data.data;
            } else {
              this.nodeOptionsIMAssist = res.data.data;
            }
          } else {
            if (this.validatenull(flag)) {
              this.nodeOptions = res.data.data;
            } else {
              this.nodeOptionsAssist = res.data.data;
            }
          }
        }
      });
    },
    handleClick(item) {
      if (this.activeKey === "") {
        this.formData = { ...this.formData, ...item.formData };
        if (this.formData.selectorName === "flow") {
          if (!this.validatenull(this.formData.dialogueProcessNodeIdIM)) {
            this.changeDialogue(this.formData.dialogueTypeIdIM, "IM");
            this.changeDialogueFlow(this.formData.dialogueSpeechIdIM, "IM");
            this.changeFlow(this.formData.dialogueProcessIdIM, "IM");
          }
          if (!this.validatenull(this.formData.dialogueProcessNodeIdCall)) {
            this.changeDialogue(this.formData.dialogueTypeIdCall, "call");
            this.changeDialogueFlow(this.formData.dialogueSpeechIdCall, "call");
            this.changeFlow(this.formData.dialogueProcessIdCall, "call");
          }
          if (!this.validatenull(this.formData.dialogueProcessNodeIdIMAssist)) {
            this.changeDialogue(
              this.formData.dialogueTypeIdIMAssist,
              "IM",
              "assist"
            );
            this.changeDialogueFlow(
              this.formData.dialogueSpeechIdIMAssist,
              "IM",
              "assist"
            );
            this.changeFlow(
              this.formData.dialogueProcessIdIMAssist,
              "IM",
              "assist"
            );
          }
          if (
            !this.validatenull(this.formData.dialogueProcessNodeIdCallAssist)
          ) {
            this.changeDialogue(
              this.formData.dialogueTypeIdCallAssist,
              "call",
              "assist"
            );
            this.changeDialogueFlow(
              this.formData.dialogueSpeechIdCallAssist,
              "call",
              "assist"
            );
            this.changeFlow(
              this.formData.dialogueProcessIdCallAssist,
              "call",
              "assist"
            );
          }
        }
        this.activeKey = item.key;
      } else {
        this.$refs.form.validate((valid, done, msg) => {
          if (valid) {
            this.leftData.forEach((v) => {
              if (v.key === this.activeKey) {
                let IMSelectValue = deepClone(v.formData.IMSelectValue),
                  IMSelectValueAssist = deepClone(
                    v.formData.IMSelectValueAssist
                  ),
                  callSelectValueAssist = deepClone(
                    v.formData.callSelectValueAssist
                  ),
                  callSelectValue = deepClone(v.formData.callSelectValue);
                v.formData = deepClone({ ...this.formData });
                v.formData.IMSelectValue = IMSelectValue;
                v.formData.callSelectValue = callSelectValue;
                v.formData.IMSelectValueAssist = IMSelectValueAssist;
                v.formData.callSelectValueAssist = callSelectValueAssist;
                v.nodeName = v.formData.nodeName;
                v.channelType = v.formData.channelType;
              }
            });
            this.activeKey = item.key;
            this.formData = {
              ...{
                nodeName: item.formData.nodeName,
                channelType: item.formData.channelType,
                rules: [],
                matchType: "",
                expression: "",
                action: 1,
                selectorName: "",
                immersive: false,
                sessionOrder: this.copyTableData,
              },
              ...item.formData,
            };
            if (this.formData.selectorName === "flow") {
              if (!this.validatenull(this.formData.dialogueProcessNodeIdIM)) {
                this.changeDialogue(this.formData.dialogueTypeIdIM, "IM");
                this.changeDialogueFlow(this.formData.dialogueSpeechIdIM, "IM");
                this.changeFlow(this.formData.dialogueProcessIdIM, "IM");
              }
              if (!this.validatenull(this.formData.dialogueProcessNodeIdCall)) {
                this.changeDialogue(this.formData.dialogueTypeIdCall, "call");
                this.changeDialogueFlow(
                  this.formData.dialogueSpeechIdCall,
                  "call"
                );
                this.changeFlow(this.formData.dialogueProcessIdCall, "call");
              }
              if (
                !this.validatenull(this.formData.dialogueProcessNodeIdIMAssist)
              ) {
                this.changeDialogue(
                  this.formData.dialogueTypeIdIMAssist,
                  "IM",
                  "assist"
                );
                this.changeDialogueFlow(
                  this.formData.dialogueSpeechIdIMAssist,
                  "IM",
                  "assist"
                );
                this.changeFlow(
                  this.formData.dialogueProcessIdIMAssist,
                  "IM",
                  "assist"
                );
              }
              if (
                !this.validatenull(
                  this.formData.dialogueProcessNodeIdCallAssist
                )
              ) {
                this.changeDialogue(
                  this.formData.dialogueTypeIdCallAssist,
                  "call",
                  "assist"
                );
                this.changeDialogueFlow(
                  this.formData.dialogueSpeechIdCallAssist,
                  "call",
                  "assist"
                );
                this.changeFlow(
                  this.formData.dialogueProcessIdCallAssist,
                  "call",
                  "assist"
                );
              }
            }
            done();
          } else {
            console.log(msg);
            return false;
          }
        });
      }
    },
    // 排序
    sortTable(type, row, index) {
      if (type === "up") {
        // console.log("向上");
        [
          this.formData.sessionOrder[index],
          this.formData.sessionOrder[index - 1],
        ] = [
          this.formData.sessionOrder[index - 1],
          this.formData.sessionOrder[index],
        ];
      }
      if (type === "down") {
        // console.log("向下");
        [
          this.formData.sessionOrder[index],
          this.formData.sessionOrder[index + 1],
        ] = [
          this.formData.sessionOrder[index + 1],
          this.formData.sessionOrder[index],
        ];
      }
      this.formData.sessionOrder.sort();
      this.formData.sessionOrder.forEach((item, index) => {
        item.priority = index + 1;
      });
    },
    // 添加配置
    addConfig(data) {
      this.checkedData = data;
      this.optTag = true;
    },
    saveSelectConfig() {
      let data = this.$refs.addconfig.selectData;
      this.formData.sessionOrder = data;
      this.optTag = false;
    },
    handleCommand(type, i, item) {
      if (type === "stop") {
        this.leftData[i].status = 0;
      } else if (type === "start") {
        this.leftData[i].status = 1;
      } else if (type === "del") {
        this.leftData.splice(i, 1);
        if (this.activeKey === item.key) {
          this.activeKey = "";
        }
      }
    },
    addClick() {
      this.dialogVisible = true;
      this.addRule = {
        nodeName: "",
        channelType: "",
        status: 1,
      };
    },
    // 保存规则
    saveRule() {
      this.$refs["addRule"].validate((valid) => {
        if (valid) {
          let index = this.leftData.findIndex(
              (v) => v.nodeName === this.addRule.nodeName
            ),
            i = this.leftData.findIndex(
              (v) => v.channelType === this.addRule.channelType
            );
          if (index > -1) {
            this.$message.warning(this.$t("kwRobotManage.nameDuplicate"));
            return;
          }
          if (i > -1) {
            this.$message.warning(this.$t("kwRobotManage.priorityDuplicate"));
            return;
          }
          this.leftData.push({
            ...this.addRule,
            ...{ key: new Date().getTime(), formData: { ...this.addRule } },
          });
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    updateData() {
      let arr = [],
        flag = true;
      this.leftData.forEach((v) => {
        v.nodeName = v.formData.nodeName;
        v.channelType = v.formData.channelType;
        let obj = { gotoFlowMarks: [], expression: "" };
        if (
          !this.validatenull(v.formData.dialogueProcessNodeIdIM) &&
          !this.validatenull(this.dialogueFlowOptionsIM) &&
          !this.validatenull(this.flowOptionsIM) &&
          !this.validatenull(this.nodeOptionsIM)
        ) {
          let typeName = this.dialogueOptions.find(
              (item) => item.id === v.formData.dialogueTypeIdIM
            ).categoryName,
            speechName = this.dialogueFlowOptionsIM.find(
              (item) => item.id === v.formData.dialogueSpeechIdIM
            ).speechName,
            flowName = this.flowOptionsIM.find(
              (item) => item.id === v.formData.dialogueProcessIdIM
            ).processName,
            nodeName = this.nodeOptionsIM.find(
              (item) => item.id === v.formData.dialogueProcessNodeIdIM
            ).nodeName;
          v.formData.IMSelectValue = `${typeName}_${speechName}_${flowName}_${nodeName}`;
        }
        if (
          !this.validatenull(v.formData.dialogueProcessNodeIdIMAssist) &&
          !this.validatenull(this.dialogueFlowOptionsIMAssist) &&
          !this.validatenull(this.flowOptionsIMAssist) &&
          !this.validatenull(this.nodeOptionsIMAssist)
        ) {
          let typeName = this.dialogueOptions.find(
              (item) => item.id === v.formData.dialogueTypeIdIMAssist
            ).categoryName,
            speechName = this.dialogueFlowOptionsIMAssist.find(
              (item) => item.id === v.formData.dialogueSpeechIdIMAssist
            ).speechName,
            flowName = this.flowOptionsIMAssist.find(
              (item) => item.id === v.formData.dialogueProcessIdIMAssist
            ).processName,
            nodeName = this.nodeOptionsIMAssist.find(
              (item) => item.id === v.formData.dialogueProcessNodeIdIMAssist
            ).nodeName;
          v.formData.IMSelectValueAssist = `${typeName}_${speechName}_${flowName}_${nodeName}`;
        }
        if (
          !this.validatenull(v.formData.dialogueProcessNodeIdCall) &&
          !this.validatenull(this.dialogueFlowOptions) &&
          !this.validatenull(this.flowOptions) &&
          !this.validatenull(this.nodeOptions)
        ) {
          let typeName = this.dialogueOptions.find(
              (item) => item.id === v.formData.dialogueTypeIdCall
            ).categoryName,
            speechName = this.dialogueFlowOptions.find(
              (item) => item.id === v.formData.dialogueSpeechIdCall
            ).speechName,
            flowName = this.flowOptions.find(
              (item) => item.id === v.formData.dialogueProcessIdCall
            ).processName,
            nodeName = this.nodeOptions.find(
              (item) => item.id === v.formData.dialogueProcessNodeIdCall
            ).nodeName;
          v.formData.callSelectValue = `${typeName}_${speechName}_${flowName}_${nodeName}`;
        }
        if (
          !this.validatenull(v.formData.dialogueProcessNodeIdCallAssist) &&
          !this.validatenull(this.dialogueFlowOptionsAssist) &&
          !this.validatenull(this.flowOptionsAssist) &&
          !this.validatenull(this.nodeOptionsAssist)
        ) {
          let typeName = this.dialogueOptions.find(
              (item) => item.id === v.formData.dialogueTypeIdCallAssist
            ).categoryName,
            speechName = this.dialogueFlowOptionsAssist.find(
              (item) => item.id === v.formData.dialogueSpeechIdCallAssist
            ).speechName,
            flowName = this.flowOptionsAssist.find(
              (item) => item.id === v.formData.dialogueProcessIdCallAssist
            ).processName,
            nodeName = this.nodeOptionsAssist.find(
              (item) => item.id === v.formData.dialogueProcessNodeIdCallAssist
            ).nodeName;
          v.formData.callSelectValueAssist = `${typeName}_${speechName}_${flowName}_${nodeName}`;
        }
        if (v.status === 1) {
          let object = {};
          object.channelType = Number(v.channelType);
          object.nodeName = v.nodeName;
          object.templateId = "";
          if (v.formData.selectorName === "flow") {
            if (
              this.validatenull(v.formData.dialogueProcessNodeIdIMAssist) &&
              this.validatenull(v.formData.dialogueProcessNodeIdCallAssist) &&
              this.validatenull(v.formData.dialogueProcessNodeIdIM) &&
              this.validatenull(v.formData.dialogueProcessNodeIdCall)
            ) {
              this.$message.warning(this.$t("kwRobotManage.selectNode"));
              flag = false;
              return false;
            }
            if (!this.validatenull(v.formData.dialogueProcessNodeIdIM)) {
              let templateId =
                v.formData.dialogueTypeIdIM +
                "_" +
                v.formData.dialogueSpeechIdIM +
                "_" +
                v.formData.dialogueProcessIdIM +
                "_" +
                v.formData.dialogueProcessNodeIdIM;
              obj.gotoFlowMarks.push({ ...object, templateId });
            }
            if (!this.validatenull(v.formData.dialogueProcessNodeIdIMAssist)) {
              let templateId =
                v.formData.dialogueTypeIdIMAssist +
                "_" +
                v.formData.dialogueSpeechIdIMAssist +
                "_" +
                v.formData.dialogueProcessIdIMAssist +
                "_" +
                v.formData.dialogueProcessNodeIdIMAssist;
              obj.gotoFlowMarks.push({ ...object, templateId });
            }
            if (!this.validatenull(v.formData.dialogueProcessNodeIdCall)) {
              let templateId =
                v.formData.dialogueTypeIdCall +
                "_" +
                v.formData.dialogueSpeechIdCall +
                "_" +
                v.formData.dialogueProcessIdCall +
                "_" +
                v.formData.dialogueProcessNodeIdCall;
              obj.gotoFlowMarks.push({ ...object, templateId });
            }
            if (
              !this.validatenull(v.formData.dialogueProcessNodeIdCallAssist)
            ) {
              let templateId =
                v.formData.dialogueTypeIdCallAssist +
                "_" +
                v.formData.dialogueSpeechIdCallAssist +
                "_" +
                v.formData.dialogueProcessIdCallAssist +
                "_" +
                v.formData.dialogueProcessNodeIdCallAssist;
              obj.gotoFlowMarks.push({ ...object, templateId });
            }
          } else {
            obj.gotoFlowMarks.push(object);
          }
          obj.immersive = v.formData.immersive;
          obj.rules = v.formData.rules.map((item) => {
            return {
              name: this.arr[item.$index],
              operator: item.operator,
              pattern: item.pattern,
              similar: 0,
            };
          });
          if (v.formData.matchType === "3") {
            obj.expression = v.formData.expression;
          } else {
            let a = v.formData.matchType === "1" ? "and" : "or";
            obj.rules.forEach((item, o) => {
              if (obj.rules.length > 1 && o < obj.rules.length - 1) {
                obj.expression += "${" + item.name + "} " + a + " ";
              } else {
                obj.expression += "${" + item.name + "}";
              }
            });
          }
          if (v.formData.action === 1) {
            obj.selectorName = v.formData.selectorName;
          }
          if (v.formData.action === 2) {
            obj.selectorPriority = {};
            v.formData.sessionOrder.forEach((item) => {
              if (item.isSystem === 0) {
                obj.selectorPriority[item.id] = item.priority;
              } else {
                if (item.name === "表格知识") {
                  obj.selectorPriority.table = item.priority;
                }
                if (item.name === "文档知识") {
                  obj.selectorPriority.doc = item.priority;
                }
                if (item.name === "FAQ知识") {
                  obj.selectorPriority.faq = item.priority;
                }
                if (item.name === "对话流程") {
                  obj.selectorPriority.flow = item.priority;
                }
              }
            });
          }
          arr.push(obj);
        }
      });
      this.responseRuleSetting = {
        rawData: JSON.stringify(this.leftData),
        pipeline: arr,
      };
      // this.leftData = this.leftData;
      if (flag) {
        this.$forceUpdate();
        this.$emit("fatherEvent", {
          responseRuleSetting: this.responseRuleSetting,
        });
      }
    },
    // 保存
    saveData() {
      if (this.leftData.length === 0) {
        this.$message.warning(this.$t("kwRobotManage.pleaseAddRule"));
        return;
      }
      if (this.activeKey !== "") {
        this.$refs.form.validate((valid, done, msg) => {
          if (valid) {
            this.leftData.forEach((v) => {
              if (v.key === this.activeKey) {
                v.formData = { ...this.formData };
              }
            });
            done();
            this.updateData();
          } else {
            console.log(msg);
            return;
          }
        });
      } else {
        let flag = true;
        this.leftData.forEach((v) => {
          if (v.formData.rules === undefined || v.formData.rules.length === 0) {
            flag = false;
            this.$message.warning(this.$t("kwRobotManage.pleaseAddRule"));
            return false;
          }
        });
        if (!flag) return;
        this.updateData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
}

.setting-container {
  .empty {
    text-align: center;
    margin-top: 60px;
    color: #959595;
  }

  .el-aside {
    border-right: 1px solid #ebeef5;
    padding: 10px;

    .leftContainer {
      min-height: 100px;
      max-height: calc(100vh - 365px);
      overflow-y: auto;

      .addModule {
        width: 100%;
        background-color: #f2f2f2;
        padding: 10px;
        margin: 15px 0px;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #f2f2f2;

        .status {
          font-size: 12px;
          color: #969696;
        }

        .title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          .titleStyle {
            font-size: 14px;
            color: #333333;
            font-weight: bold;
            margin-right: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      .addModule:hover {
        border: 1px solid #409eff;
      }

      .active {
        border: 1px solid #409eff;
      }
    }
  }

  .el-main {
    padding: 10px !important;

    .el-form {
      /deep/.el-form-item__content {
        display: flex;
      }
    }
  }
}
</style>
