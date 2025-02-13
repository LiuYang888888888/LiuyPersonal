<template>
  <el-form ref="form" :model="formData" size="small">
    <el-collapse v-model="activeNames" class="setting-collapse">
      <el-collapse-item
        :title="$t('kwRobotManage.thresholdOutgoingModule')"
        name="1"
      >
        <p class="tip">
          {{ $t("kwRobotManage.recommendedNumber") }}
        </p>
        <avue-crud :data="thresholdData" :option="thresholdOption">
          <template slot="recommendThreshold" slot-scope="{ row, index }">
            <template v-if="row.type === 1">
              <el-form-item>
                <el-input-number
                  v-model="formData.faqResponseSetting.recommendThreshold"
                  precision="2"
                  :controls="false"
                  :min="0.1"
                  :max="0.7"
                  :step="2"
                ></el-input-number>
              </el-form-item>
            </template>
            <template v-else-if="row.type === 2">
              <el-input-number
                v-model="formData.tableResponseSetting.recommendThreshold"
                precision="2"
                :controls="false"
                :min="0.1"
                :max="0.7"
                :step="2"
              ></el-input-number>
            </template>
            <template v-else-if="row.type === 3">
              <el-input-number
                v-model="formData.docResponseSetting.recommendThreshold"
                precision="2"
                :controls="false"
                :min="0.1"
                :max="0.7"
                :step="2"
              ></el-input-number>
            </template>
            <template v-else-if="row.type === 4">
              <el-input-number
                v-model="formData.flowResponseSetting.recommendThreshold"
                precision="2"
                :controls="false"
                :min="0.1"
                :max="0.7"
                :step="2"
              ></el-input-number>
            </template>
            <template v-else-if="row.type === 5">
              <el-input-number
                v-model="formData.intentResponseSetting.recommendThreshold"
                precision="2"
                :controls="false"
                :min="0.1"
                :max="0.7"
                :step="2"
              ></el-input-number>
            </template>
            <template v-else>
              <el-input-number
                v-model="thresholdData[index].recommendThreshold"
                precision="2"
                :controls="false"
                :min="0.1"
                :max="0.7"
                :step="2"
              ></el-input-number>
            </template>
          </template>
          <template slot="menuRight">
            <el-button
              class="el-icon-plus"
              type="text"
              @click="addConfig(1, thresholdData)"
              >{{ $t("kwRobotManage.addConfiguration") }}</el-button
            >
          </template>
        </avue-crud>
      </el-collapse-item>
      <el-collapse-item
        :title="$t('kwRobotManage.numberOutgoingModule')"
        name="2"
      >
        <p class="tip">
          {{ $t("kwRobotManage.recommendedNumber") }}
        </p>
        <avue-crud :data="recommendData" :option="recommendOption">
          <template slot="recommendSize" slot-scope="{ row, index }">
            <template v-if="row.type === 1">
              <el-form-item>
                <el-select
                  v-model="formData.faqResponseSetting.recommendSize"
                  style="width: 200px !important"
                >
                  <el-option
                    v-for="item in list"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else-if="row.type === 2">
              <el-form-item>
                <el-select
                  v-model="formData.tableResponseSetting.recommendSize"
                  style="width: 200px !important"
                >
                  <el-option
                    v-for="item in list"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else-if="row.type === 3">
              <el-form-item>
                <el-select
                  v-model="formData.docResponseSetting.recommendSize"
                  style="width: 200px !important"
                >
                  <el-option
                    v-for="item in list"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else-if="row.type === 4">
              <el-form-item>
                <el-select
                  v-model="formData.flowResponseSetting.recommendSize"
                  style="width: 200px !important"
                >
                  <el-option
                    v-for="item in list"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else-if="row.type === 5">
              <el-form-item>
                <el-select
                  v-model="formData.intentResponseSetting.recommendSize"
                  style="width: 200px !important"
                >
                  <el-option
                    v-for="item in list"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item>
                <el-select
                  v-model="recommendData[index].recommendSize"
                  style="width: 200px !important"
                >
                  <el-option
                    v-for="item in list"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </template>
          </template>
          <template slot="menuRight">
            <el-button
              class="el-icon-plus"
              type="text"
              @click="addConfig(2, recommendData)"
              >{{ $t("kwRobotManage.addConfiguration") }}</el-button
            >
          </template>
        </avue-crud>
      </el-collapse-item>
    </el-collapse>
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
    <div style="text-align: center">
      <el-button size="small" type="primary" @click="savepolicy">{{
        $t("aicosCommon.saveBtn")
      }}</el-button>
    </div>
  </el-form>
</template>
<script>
import Addconfig from "../addconfig";
import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import { deepClone } from "@/util/util";
import { isNull } from "@/util/qsgCommon";
export default {
  name: "index",
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
    const {
      faqResponseSetting,
      tableResponseSetting,
      docResponseSetting,
      flowResponseSetting,
      intentResponseSetting,
      actionAgentsResponseSetting,
    } = deepClone(this.fatherData);
    const formData = {
      faqResponseSetting: {
        recommendSize: faqResponseSetting.recommendSize,
        recommendThreshold: faqResponseSetting.recommendThreshold,
      },
      tableResponseSetting: {
        recommendSize: tableResponseSetting.recommendSize,
        recommendThreshold: tableResponseSetting.recommendThreshold,
      },
      docResponseSetting: {
        recommendSize: docResponseSetting.recommendSize,
        recommendThreshold: docResponseSetting.recommendThreshold,
      },
      flowResponseSetting: {
        recommendSize: flowResponseSetting.recommendSize,
        recommendThreshold: flowResponseSetting.recommendThreshold,
      },
      intentResponseSetting: {
        recommendSize: !intentResponseSetting
          ? 10
          : intentResponseSetting.recommendSize,
        recommendThreshold: !intentResponseSetting
          ? 0.15
          : intentResponseSetting.recommendThreshold,
      },
      actionAgentsResponseSetting,
    };
    const arr = Array(11)
      .fill(0)
      .map((item, index) => index);
    return {
      activeNames: ["1", "2"],
      list: arr.reverse(),
      formData,
      // 阈值
      thresholdOption: {
        header: true,
        addBtn: false,
        refreshBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        menu: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotManage.outgoingModuleName"),
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
          {
            label: this.$t("kwRobotManage.minimumCredible"),
            prop: "recommendThreshold",
            width: 600,
            align: "center",
          },
        ],
      },
      thresholdData: [],
      // 推荐条数
      recommendData: [],
      recommendOption: {
        header: true,
        addBtn: false,
        refreshBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        menu: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotManage.outgoingModuleName"),
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
          {
            label: this.$t("kwRobotManage.recommendedArticles"),
            prop: "recommendSize",
            width: 600,
            align: "center",
          },
        ],
      },
      // 添加配置
      checkedData: [],
      optTag: false,
      selectType: null,
    };
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
        if (item.isSystem === 1 && item.type !== 4) {
          this.thresholdData.push({
            ...item,
            ...{ recommendThreshold: 0.15, show: false },
          });
          this.recommendData.push({
            ...item,
            ...{ recommendSize: 10, show: false },
          });
        } else {
          item.show = true;
          if (item.type === 4) {
            if (!isNull(this.formData.flowResponseSetting.recommendThreshold)) {
              this.thresholdData.push({
                ...item,
                ...{
                  recommendThreshold:
                    this.formData.flowResponseSetting.recommendThreshold,
                },
              });
            }
            if (!isNull(this.formData.flowResponseSetting.recommendSize)) {
              this.recommendData.push({
                ...item,
                ...{
                  recommendSize:
                    this.formData.flowResponseSetting.recommendSize,
                },
              });
            }
          } else {
            if (this.formData.actionAgentsResponseSetting.length > 0) {
              let index = this.formData.actionAgentsResponseSetting.findIndex(
                (v) => v.id === item.actionAgentId
              );
              if (index > -1) {
                if (
                  !isNull(
                    this.formData.actionAgentsResponseSetting[index]
                      .recommendThreshold
                  )
                ) {
                  this.thresholdData.push({
                    ...item,
                    ...{
                      recommendThreshold:
                        this.formData.actionAgentsResponseSetting[index]
                          .recommendThreshold,
                    },
                  });
                }
                if (
                  !isNull(
                    this.formData.actionAgentsResponseSetting[index]
                      .recommendSize
                  )
                ) {
                  this.recommendData.push({
                    ...item,
                    ...{
                      recommendSize:
                        this.formData.actionAgentsResponseSetting[index]
                          .recommendSize,
                    },
                  });
                }
              }
            }
          }
        }
      });
    });
  },
  methods: {
    // 添加配置
    addConfig(type, data) {
      this.selectType = type;
      this.checkedData = data;
      this.optTag = true;
    },
    // 保存配置
    saveSelectConfig() {
      let data = this.$refs.addconfig.selectData;
      if (this.selectType === 1) {
        this.thresholdData = [];
        data.forEach((item) => {
          if (item.type === 4) {
            this.formData.flowResponseSetting.recommendThreshold = 0.15;
          }
          this.thresholdData.push({ ...item, ...{ recommendThreshold: 0.15 } });
        });
      }
      if (this.selectType === 2) {
        this.recommendData = [];
        data.forEach((item) => {
          if (item.type === 4) {
            this.formData.flowResponseSetting.recommendSize = 10;
          }
          this.recommendData.push({ ...item, ...{ recommendSize: 10 } });
        });
      }
      this.optTag = false;
    },
    savepolicy() {
      if (
        this.validatenull(
          this.formData.faqResponseSetting.recommendThreshold
        ) ||
        this.validatenull(
          this.formData.tableResponseSetting.recommendThreshold
        ) ||
        this.validatenull(
          this.formData.docResponseSetting.recommendThreshold
        ) ||
        this.validatenull(
          this.formData.intentResponseSetting.recommendThreshold
        )
      ) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.error(this.$t('kwRobotManage.inputThresholdValue'));
          return;
        }
      }
      this.thresholdData.forEach((item) => {
        if (item.isSystem === 0) {
          if (!item.recommendThreshold) {
            if (document.getElementsByClassName("el-message").length === 0) {
              this.$message.error(this.$t('kwRobotManage.inputThresholdValue'));
              return;
            }
          }
          let index = this.formData.actionAgentsResponseSetting.findIndex(
            (v) => v.id === item.actionAgentId
          );
          if (index > -1) {
            this.formData.actionAgentsResponseSetting[
              index
            ].recommendThreshold = item.recommendThreshold;
          } else {
            this.formData.actionAgentsResponseSetting.push({
              actionAgentId: item.actionAgentId,
              actionAgentName: item.name,
              recommendThreshold: item.recommendThreshold,
              recommendSize: null,
              answerThreshold: null, //出话模块应答阈值配置>最低可信阈值
              negativeRegexps: null,
              negativeSentences: null,
              priority: null, //出话模块应答优先级配置>优先级
              threshold: null, //出话模块应答阈值配置>最低可信阈值
            });
          }
        }
      });
      this.recommendData.forEach((item) => {
        if (item.isSystem === 0) {
          let index = this.formData.actionAgentsResponseSetting.findIndex(
            (v) => v.id === item.actionAgentId
          );
          if (index > -1) {
            this.formData.actionAgentsResponseSetting[index].recommendSize =
              item.recommendSize;
          } else {
            this.formData.actionAgentsResponseSetting.push({
              actionAgentId: item.actionAgentId,
              actionAgentName: item.name,
              recommendSize: item.recommendSize,
              answerThreshold: null, //出话模块应答阈值配置>最低可信阈值
              negativeRegexps: null,
              negativeSentences: null,
              priority: null, //出话模块应答优先级配置>优先级
              recommendThreshold: null, //出话模块推荐阈值>最低可信阈值
              threshold: null, //出话模块应答阈值配置>最低可信阈值
            });
          }
        }
      });
      // console.log(this.formData);
      this.$emit("fatherEvent", this.formData);
    },
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
</style>
