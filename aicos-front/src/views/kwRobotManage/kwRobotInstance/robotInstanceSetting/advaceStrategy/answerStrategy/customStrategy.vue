<template>
  <div>
    <div class="custom-strategy-container clearfix">
      <div class="left-strategy-wrap">
        <div class="left-strategy">
          <h1 class="left-header">
            <el-button size="small" class="kw-btn-green" @click="openAddStrategy">
              {{ $t('kwRobotManage.buildStrategy') }}
            </el-button>
          </h1>
          <div class="strategy-list-wrap">
            <ul class="strategy-list-ul" v-if="leftStrategyData.length > 0">
              <li class="strategy-item" v-for="item in leftStrategyData" :key="item.id">
                <h5 class="strategy-header">
                  <p class="strategy-name">{{ item.strategyName }}</p>
                  <span class="strategy-operation">
                    <el-dropdown @command="handleStrategyCommand($event, item)">
                      <i class="strategy-more el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="edit">{{ $t('aicosCommon.editBtn') }}</el-dropdown-item>
                        <el-dropdown-item command="stop" v-if="item.status == 1">{{ $t('aicosCommon.start')
                        }}</el-dropdown-item>
                        <el-dropdown-item command="enable" v-if="item.status == 0">{{ $t('aicosCommon.pause')
                        }}</el-dropdown-item>
                        <el-dropdown-item command="delete">{{ $t('aicosCommon.delBtn') }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <i class="strategy-up el-icon-arrow-down" @click="expandOrUpRule(item, 'expand')"
                      :title="$t('kwRobotManage.expand')" v-show="!item.expandFlag"></i>
                    <i class="strategy-up el-icon-arrow-up" @click="expandOrUpRule(item, 'up')"
                      :title="$t('kwRobotManage.retract')" v-show="item.expandFlag"></i>
                  </span>
                </h5>
                <div class="strategy-body">
                  <div v-show="item.expandFlag">
                    <p class="strategy-add-rule-wrap">
                      <el-button size="small" class="add-rule-button" @click="addRuleItem(item)">
                        <i class="el-icon-plus"></i>
                        {{ $t('kwRobotManage.addRuleItem') }}
                      </el-button>
                    </p>
                    <dl class="rules-wrap">
                      <dd :class="{ active: curRuleItemId === ruleItem.id }" v-for="(ruleItem, ruleIndex) in item.rules"
                        :key="ruleItem.id" @click="editRule(ruleItem, item)">
                        <span class="rule-number">{{ ruleIndex + 1 }}</span>
                        <p class="rule-name">{{ ruleItem.rulesName }}</p>
                        <i class="el-icon-delete" @click.stop="deleteRule(ruleItem, item)"></i>
                      </dd>
                    </dl>
                  </div>
                  <div class="putAway-wrap" v-show="!item.expandFlag">
                    <p class="putAway-text">{{ $t('kwRobotManage.configuration') }} {{ item.rules.length }} {{
                      $t('kwRobotManage.term') }}</p>
                  </div>
                </div>
              </li>
            </ul>
            <div class="strategy-no-result" v-else>
              <p>{{ $t('kwRobotManage.strategyAvailable') }}</p>
            </div>
          </div>
        </div>

      </div>

      <!--right-->
      <div class="right-rule-form">
        <avue-form v-if="isShowRuleFromFlag" :option="ruleOption" v-model="ruleFormData" ref="ruleFormRef">
          <template slot="priority">
            <el-input type="number" size="small" min="1" v-model="ruleFormData.priority"></el-input>
            <p style="margin: 0;color: #c7cad3;font-size: 12px;">{{ $t('kwRobotManage.highestPriority') }}</p>
          </template>
          <template slot="conditionList">
            <ul class="condition-ul">
              <li v-for="item in conditionList" :key="item.id">
                <span class="condition-number">{{ item.sort }}</span>
                <div class="condition-item clearfix">
                  <b class="rule-only-text">{{ $t('kwRobotManage.equal') }}</b>
                  <div class="only-item">
                    <el-select v-model="item.condition" :placeholder="$t('aicosCommon.pleaseSelect')">
                      <el-option v-for="item in rulesConditionData" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="only-item" v-if="item.condition == '2'">
                    <el-select v-model="item.moduleId"
                      :placeholder="$t('aicosCommon.pleaseSelect') + $t('kwRobotManage.sessionModuleName')">
                      <el-option v-for="item in sessionDatas" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="only-item" v-if="item.condition == '1'">
                    <el-select v-model="item.symbol" :placeholder="$t('aicosCommon.pleaseSelect')">
                      <el-option v-for="item in conditionSymbolUserData" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="only-item" v-if="item.condition == '2'">
                    <el-select v-model="item.symbol" :placeholder="$t('aicosCommon.pleaseSelect')">
                      <el-option v-for="item in conditionSymbolModuleData" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="only-item" v-if="item.symbol.length > 0">
                    <el-input size="small" v-model="item.value"></el-input>
                  </div>
                  <i class="el-icon-delete" @click="removeConditonItem(item)"></i>
                </div>
              </li>
            </ul>
            <p class="add-rule-button-p">
              <el-button type="text" @click="addConditionItem"><i class="el-icon-plus"></i>{{
                $t('kwRobotManage.addConditions') }}</el-button>
            </p>
          </template>
          <template slot="matchType">
            <div class="only-item">
              <el-select v-model="ruleFormData.matchWay" :placeholder="$t('aicosCommon.pleaseSelect')">
                <el-option v-for="item in matchWaySelectData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="only-item" style="width: 250px;" v-if="ruleFormData.matchWay == '3'">
              <el-input size="small" v-model="ruleFormData.customMatch"></el-input>
            </div>
            <div class="only-item" v-if="ruleFormData.matchWay == '3'">
              <el-tooltip placement="top">
                <div slot="content">
                  {{ $t('kwRobotManage.supportedTips') }} <br />
                  {{ $t('kwRobotManage.requirementsTips') }}<br />
                  {{ $t('kwRobotManage.passedTips') }}<br />
                  {{ $t('kwRobotManage.charactersTips') }} <br />
                  {{ $t('kwRobotManage.exampleTips') }}<br />
                  {{ $t('kwRobotManage.conditionTips') }} <br />
                  {{ $t('kwRobotManage.allowedConditionTips') }}
                </div>
                <i class="el-icon-warning-outline" style="cursor: pointer"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot="performAction">
            <el-radio v-model="ruleFormData.performAction" label="1">{{ $t('kwRobotManage.specifySessionModule')
            }}</el-radio>
            <el-radio v-model="ruleFormData.performAction" label="2">{{ $t('kwRobotManage.adjustingSessionOrder')
            }}</el-radio>
            <div class="clearfix" v-show="ruleFormData.performAction == '1'">
              <span style="float: left">{{ $t('kwRobotManage.use') }}</span>
              <div class="only-item">
                <el-select v-model="ruleFormData.useModuleId" :placeholder="$t('aicosCommon.pleaseSelect')">
                  <el-option v-for="item in sessionDatas" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div v-show="ruleFormData.performAction == '2'">
              <avue-crud :option="tableOption" :data="tableData" ref="tableRef">
                <template slot-scope="{row}" slot="sessionModule">
                  <el-select size="small" v-model="row.moduleId" multiple :placeholder="$t('aicosCommon.pleaseSelect')">
                    <el-option v-for="item in sessionDatas" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </avue-crud>
            </div>
          </template>

          <template slot-scope="{size}" slot="menuForm">
            <el-button type="primary" :size="size" @click="saveRuleItem">{{ $t('aicosCommon.saveBtn') }}</el-button>
          </template>
        </avue-form>
        <div class="no-rule-form" v-else>
          <p>{{ $t('aicosCommon.notData') }}</p>
        </div>
      </div>
    </div>

    <HuilanDialog :title="addOrEditTitle" append-to-body :visible.sync="isShowAddflag" width="500px">
      <Add v-if="isShowAddflag" ref="addStrategyRef" :type="isAddOrEditType" :data="curStrategyData" />
      <template v-slot:footer>
        <el-button size="small" @click="isShowAddflag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveStrategy">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import {
  saveCustomStrategyUrl,
  saveRuleUrl,
  deleteStrategyUrl,
  stopOrEnableStrategyUrl,
  getRuleDetailUrl,
  deleteRuleUrl
} from '@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/answerStrategy.js';
import Add from './addStrategy';
import { mapGetters } from "vuex";
export default {
  props: {
    sessionDatas: {
      type: Array,
      default: () => {
        return [];
      }
    },
    editData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data () {
    return {
      zmIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      strategyId: '', // 策略列表的id
      addOrEditTitle: this.$t('kwRobotManage.addPolicy'),
      isShowAddflag: false,
      isAddOrEditType: 'add',
      leftStrategyData: [   // 左侧策略列表
        /*{
            id: 'fdsfsd',
            strategyName: '策略一',
            priority: 23,
            rules: [
              {
                id: 'cfsdfsd',
                rulesName: '规则1'
              }
            ]
          }*/
      ],
      isShowRuleFromFlag: false,
      curStrategyData: {}, // 策略数据
      curRuleItemId: '', // 规则id
      ruleIsAddOrEdit: 'add', // 规则的新增和编辑
      rulesConditionData: [{
        label: this.$t('kwRobotManage.userAsked'),
        value: '1'
      }, {
        label: this.$t('kwRobotManage.confidenceLevel'),
        value: '2'
      }],
      conditionSymbolUserData: [{
        label: this.$t('kwRobotManage.equalTo'),
        value: '1'
      }, {
        label: this.$t('kwRobotManage.notEqualTo'),
        value: '2'
      }, {
        label: this.$t('kwRobotManage.comprise'),
        value: '3'
      }, {
        label: this.$t('kwRobotManage.notContain'),
        value: '4'
      }, {
        label: this.$t('kwRobotManage.regular'),
        value: '5'
      }],
      conditionSymbolModuleData: [{
        label: this.$t('kwRobotManage.equalTo'),
        value: '1'
      }, {
        label: this.$t('kwRobotManage.greaterThan'),
        value: '2'
      }, {
        label: this.$t('kwRobotManage.greaterThanEqual'),
        value: '3'
      }, {
        label: this.$t('kwRobotManage.lessThan'),
        value: '4'
      }, {
        label: this.$t('kwRobotManage.lessThanEqual'),
        value: '5'
      }],
      conditionList: [],
      matchWaySelectData: [
        {
          label: this.$t('kwRobotManage.meetConditions'),
          value: 1
        },
        {
          label: this.$t('kwRobotManage.anyConditions'),
          value: 2
        },
        {
          label: this.$t('kwRobotManage.customConditions'),
          value: 3
        }
      ],
      ruleFormData: {
        priority: '',
        matchWay: '', // 匹配条件
        customMatch: '', // 自定义条件
        performAction: '1',  // 执行动作
        useModuleId: ''  // 执行动作为指定会话模块，存储会话模块id
      },
      ruleOption: {
        labelPosition: 'top',
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: this.$t('kwRobotManage.ruleName'),
            prop: 'rulesName',
            span: 20,
            required: true,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('kwRobotManage.ruleName')
              }
            ]
          },
          {
            label: this.$t('kwRobotManage.rulePriority'),
            prop: 'priority',
            span: 20
          },
          {
            label: this.$t('kwRobotManage.ruleConditions'),
            prop: 'conditionList',
            span: 24
          },
          {
            label: this.$t('kwRobotManage.matchingMethod'),
            prop: 'matchType',
            span: 20
          },
          {
            label: this.$t('kwRobotManage.executeAction'),
            prop: 'performAction',
            span: 20
          }
        ]
      },
      tableData: [
        {
          groupPriority: this.$t('kwRobotManage.height'),
          moduleId: []
        },
        {
          groupPriority: this.$t('kwRobotManage.middle'),
          moduleId: []
        },
        {
          groupPriority: this.$t('kwRobotManage.low'),
          moduleId: []
        }
      ],
      tableOption: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: true,
        menu: false,
        index: false,
        addBtn: false,
        selection: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 300,
        menuAlign: "center",
        dialogClickModal: false,
        labelWidth: 120,
        column: [
          {
            label: this.$t('kwRobotManage.groupPriority'),
            prop: 'groupPriority',
            span: 12,
            // search: true,
            width: 280,
            // search:true,
            // maxlength: 50,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t('kwRobotManage.sessionModuleName'),
            prop: 'sessionModule',
            span: 12,
            showWordLimit: true,
            overHidden: true,
          }
        ],
      }
    }
  },
  components: {
    Add
  },
  computed: {
    // 计算属性
    ...mapGetters(['botObj', 'instanceObj'])
  },
  methods: {
    openAddStrategy () {
      this.isShowAddflag = true;
      this.isAddOrEditType = 'add';
    },
    // 保存策略
    saveStrategy () {
      this.$refs.addStrategyRef.$refs.addFormRef.validate((flag) => {
        var addFormData = this.$refs.addStrategyRef.addForm;
        if (flag) {
          var postData = {
            ...addFormData,
            strategyId: this.strategyId
          };

          saveCustomStrategyUrl(postData).then((res) => {
            res = res.data;
            if (res.code == 200) {
              if (this.isAddOrEditType == 'edit') {
                this.leftStrategyData.every((item) => {
                  if (item.id == addFormData.id) {
                    item.strategyName = addFormData.strategyName;
                    item.priority = addFormData.priority;
                    item.id = addFormData.id;

                    return false;
                  }

                  return true;
                })
              } else {
                this.leftStrategyData.push({
                  ...this.$refs.addStrategyRef.addForm,
                  status: 1,
                  id: res.data,
                  expandFlag: true, // 是否展开
                  rules: []
                });
              }

              this.isShowAddflag = false;
            }
          })
        }
      })
    },

    // 删除策略
    deleteStrategy (curStrategy) {
      this.$confirm(this.$t('kwRobotManage.deletePolicy'), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      }).then(() => {
        let postData = {
          strategyId: curStrategy.id,
          strategyName: curStrategy.strategyName,
          priority: curStrategy.priority
        }
        deleteStrategyUrl(postData).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });

            this.leftStrategyData.every((forItem, index) => {
              if (forItem.id == curStrategy.id) {
                this.leftStrategyData.splice(index, 1);
                return false;
              }

              return true;
            });
          }
        });
      })
    },
    // 启用停用策略
    enableOrStopStrategy (curStrategy, type) {
      var tipStr = this.$t('kwRobotManage.disablePolicy');
      var successStr = '';

      if (type == 1) {
        tipStr = this.$t('kwRobotManage.enablePolicy');
        successStr = this.$t("aicosCommon.enableSuccessTip");
      } else {
        tipStr = this.$t('kwRobotManage.disablePolicy');
        successStr = this.$t("aicosCommon.stopSuccessTip");
      }
      this.$confirm(tipStr, {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      }).then(() => {
        var postData = {
          strategyId: curStrategy.id,
          status: type,
          strategyName: curStrategy.strategyName,
          priority: curStrategy.priority
        }
        stopOrEnableStrategyUrl(postData).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: successStr,
            });

            this.leftStrategyData.every((forItem) => {
              if (forItem.id == curStrategy.id) {
                forItem.status = type;
                return false;
              }

              return true;
            });
          }
        });
      });
    },
    handleStrategyCommand (command, item) {
      if (command == 'edit') {
        this.isShowAddflag = true;
        this.isAddOrEditType = 'edit';
        this.curStrategyData = {
          id: item.id,
          strategyName: item.strategyName,
          priority: item.priority
        };
      } else if (command == 'delete') {
        this.deleteStrategy(item);
      } else if (command == 'stop') {
        this.enableOrStopStrategy(item, 0);
      } else if (command == 'enable') {
        this.enableOrStopStrategy(item, 1);
      }
    },

    // 展开或者收起规则项
    expandOrUpRule (strategyItem, type) {
      if (type == 'expand') {
        strategyItem.expandFlag = true;
      } else {
        strategyItem.expandFlag = false;
      }
    },

    // 添加规则项
    addRuleItem (curStrategy) {
      this.curStrategyData = curStrategy;
      this.isShowRuleFromFlag = true;
      this.curRuleItemId = '';
      this.ruleIsAddOrEdit = 'add';

      // 重置表单数据
      this.ruleFormData = {
        id: '',
        customId: curStrategy.id,
        rulesName: '',
        priority: '',
        matchWay: '', // 匹配条件
        customMatch: '', // 自定义条件
        performAction: '1',  // 执行动作
        useModuleId: ''  // 执行动作为指定会话模块，存储会话模块id
      };
      this.tableData.forEach((item) => {
        item.moduleId = [];
      });
      this.conditionList = [];
    },

    // 编辑规则项
    editRule (ruleItem, strategyItem) {
      this.isShowRuleFromFlag = true;
      this.curRuleItemId = ruleItem.id;
      this.curStrategyData = strategyItem;
      this.ruleIsAddOrEdit = 'edit';

      // 获取数据
      getRuleDetailUrl(ruleItem.id).then((res) => {
        res = res.data;
        if (res.code == 200) {
          let dataResult = res.data;

          dataResult.baseStrategyList.forEach((item) => {
            item.moduleId = item.moduleId.length > 0 ? item.moduleId.split(',') : []
          });
          this.tableData = dataResult.baseStrategyList;
          this.conditionList = dataResult.conditionList;

          this.ruleFormData = {
            id: dataResult.id,
            customId: dataResult.customId,
            rulesName: dataResult.rulesName,
            priority: dataResult.priority,
            matchWay: dataResult.matchWay, // 匹配条件
            customMatch: dataResult.customMatch, // 自定义条件
            performAction: dataResult.performAction,  // 执行动作
            useModuleId: dataResult.useModuleId  // 执行动作为指定会话模块，存储会话模块id
          };
        }
      });
    },

    // 删除规则项
    deleteRule (ruleItem, strategyItem) {
      var curStrategyIndex = 0;
      this.$confirm(this.$t('kwRobotManage.deleteRuleTips'), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      }).then(() => {
        deleteRuleUrl(ruleItem.id).then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip")
            });

            // 更新数据
            this.leftStrategyData.every((item, index) => {
              if (item.id == strategyItem.id) {
                curStrategyIndex = index;
                return false;
              }
              return true;
            });

            this.leftStrategyData[curStrategyIndex].rules.every((item, index) => {
              if (item.id == ruleItem.id) {
                this.leftStrategyData[curStrategyIndex].rules.splice(index, 1);
                return false;
              }
              return true;
            });
          }
        });
      });
    },

    // 添加规则中的条件项
    addConditionItem () {
      this.conditionList.push({
        sort: this.zmIndex[this.conditionList.length],
        id: new Date().getTime(),
        condition: '1',
        moduleId: '',
        symbol: '1',
        value: ''
      });
    },

    // 删除规则项中的条件项
    removeConditonItem (row) {
      this.conditionList.every((item, index) => {
        if (row.id == item.id) {
          this.conditionList.splice(index, 1);
          return false;
        }

        return true;
      });

      this.conditionList.forEach((item, index) => {
        item.sort = this.zmIndex[index];
      });
    },

    // 保存规则项
    saveRuleItem () {
      let that = this;
      let postData = {};
      var strategyIndex = 0;

      if (this.ruleFormData.performAction == '1') {
        // 执行动作
        this.tableData.forEach((item) => {
          item.moduleId = '';
        });
      } else {
        this.ruleFormData.useModuleId = '';
        this.tableData.forEach((item) => {
          item.moduleId = item.moduleId.join(',');
        });
      }

      postData = {
        ...this.ruleFormData,
        customId: this.curStrategyData.id, // 策略id
        baseStrategyList: this.tableData,
        conditionList: this.conditionList
      };

      this.$refs.ruleFormRef.validate((flag) => {
        if (flag) {
          saveRuleUrl(postData).then((res) => {
            res = res.data;
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: this.$t('aicosCommon.saveSuccessTip')
              });

              if (this.ruleIsAddOrEdit == 'add' && this.ruleFormData.id.length <= 0) {
                this.leftStrategyData.every((item) => {
                  if (item.id == that.curStrategyData.id) {
                    item.rules.push({
                      id: res.data,
                      rulesName: that.ruleFormData.rulesName
                    });

                    return false;
                  }

                  return true;
                });

                this.ruleFormData.id = res.data;
              } else {
                // strategyIndex
                this.leftStrategyData.every((item, index) => {
                  if (item.id == that.curStrategyData.id) {
                    strategyIndex = index;
                    return false;
                  }
                  return true;
                });

                this.leftStrategyData[strategyIndex].rules.every((item) => {
                  item.rulesName = that.ruleFormData.rulesName;
                });
              }

              this.$refs.ruleFormRef.allDisabled = false;
            }
          })
        }
      });

    }
  },
  created () {
    this.strategyId = this.instanceObj.id;
  },
  mounted () {
    var that = this;
    if (this.editData.length > 0) {
      this.editData.forEach((item) => {
        var obj = {
          id: item.id,
          strategyName: item.strategyName,
          priority: item.priority,
          status: item.status,
          expandFlag: item.ruleVoList && item.ruleVoList.length > 2 ? false : true,
          rules: item.ruleVoList ? item.ruleVoList : []
        };

        that.leftStrategyData.push(obj);
      })
    }
  },
  destroyed () {

  }
}
</script>

<style scoped lang="scss">
.custom-strategy-container {
  border: 1px solid #F1F1F1;
  width: 80%;
  min-width: 500px;
  padding-left: 250px;
  position: relative;

  h1,
  h2,
  h5,
  p,
  ul,
  li,
  dl,
  dd {
    margin: 0;
    padding: 0;
    font-size: 14px;
  }

  .left-strategy-wrap {
    width: 250px;
    position: absolute;
    left: 0;
    top: 0;

    .left-strategy {
      border-right: 1px solid #f1f1f1;
      height: 600px;
      padding: 10px 10px 0;

      .left-header {
        text-align: left;

        .kw-btn-green {
          color: #fff;
          padding: 8px 15px;
        }
      }

      .strategy-list-wrap {
        margin-top: 10px;

        .strategy-list-ul {
          list-style: none;

          .strategy-item {
            background-color: #FAFAFA;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;

            .strategy-header {
              padding-right: 50px;
              position: relative;

              .strategy-name {
                font-weight: normal;
              }

              .strategy-operation {
                position: absolute;
                right: 0;
                top: 0;

                i {
                  cursor: pointer;
                }

                .strategy-more {
                  padding: 0 10px;
                }
              }
            }

            .strategy-body {
              .strategy-add-rule-wrap {
                margin: 5px 0;

                .add-rule-button {
                  width: 100%;
                  padding: 4px 10px;
                }
              }

              .rules-wrap {
                padding-right: 10px;

                dd {
                  padding: 0 15px 0 30px;
                  position: relative;
                  color: #494848;
                  font-size: 12px;

                  .rule-name {
                    font-size: 12px;
                    cursor: pointer;
                  }

                  .rule-number {
                    position: absolute;
                    left: 0;
                    top: 0px;
                    width: 20px;
                    text-align: right;
                  }

                  .el-icon-delete {
                    position: absolute;
                    right: 0;
                    top: 5px;
                    color: #ff0000;
                    cursor: pointer;
                  }
                }

                dd.active {
                  .rule-name {
                    color: #409EFF;
                  }
                }
              }

              .putAway-wrap {
                padding: 15px 10px 0 10px;
                text-align: center;

                .putAway-text {
                  color: #ABABAB;
                  font-size: 12px;
                }
              }
            }

          }
        }
      }

      .strategy-no-result {
        text-align: center;
        padding: 50px 0;

        p {
          color: #c7cad3;
        }
      }
    }
  }

  .right-rule-form {
    height: 600px;
    overflow-y: auto;

    .no-rule-form {
      text-align: center;
      padding: 98px 0;

      p {
        color: #c7cad3;
      }
    }

    /deep/ .el-form-item__label {
      padding-bottom: 0;
    }

    /deep/ .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    .only-item {
      float: left;
      width: 150px;
      margin-left: 10px;
    }

    .condition-ul {
      li {
        padding-left: 20px;
        padding-right: 20px;
        position: relative;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;

        .condition-number {
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #EFF3F8;
        }

        .el-icon-delete {
          float: left;
          margin-left: 10px;
          margin-top: 13px;
          cursor: pointer;
        }

        .condition-item {
          padding-left: 10px;
          margin-top: 10px;

          .rule-only-text {
            float: left;
          }
        }
      }
    }
  }
}
</style>
