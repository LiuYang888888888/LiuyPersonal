<template>
  <HuilanBasic :left-width="300">
    <template v-slot:left>
      <div class="interfaceDescription">
        <div :style="tabclenHei">
          <el-scrollbar>
            <el-menu :default-active="menuId" class="el-menu-vertical-demo" @select="select" @close="handleClose">
              <el-submenu index="1">
                <template slot="title">
                  <!-- <i class="el-icon-microphone"></i> -->
                  <span>AI能力</span>
                </template>
                <template v-for="(v, i) of menuList">
                  <el-tooltip v-if="v.name.length > commonVariable.labelLength" class="item" :key="i" effect="dark"
                    :content="v.name" placement="right">
                    <el-menu-item style="
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      " :index="v.code">{{ v.name }}</el-menu-item>
                  </el-tooltip>
                  <template v-else>
                    <el-menu-item :key="i" style="
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      " :index="v.code">{{ v.name }}</el-menu-item>
                  </template>
                </template>
              </el-submenu>
            </el-menu>
          </el-scrollbar>
        </div>
      </div>
    </template>
    <!-- <basic-container > -->
    <div :style="tabclenHeiRi" class="interfaceDescription">
      <!-- <el-scrollbar> -->
      <div class="btnRi">
        <el-button size="small" type="" v-if="rowData" @click="camcel">返回</el-button>
      </div>
      <el-tabs tab-position="top">
        <el-tab-pane label="文档">
          <div class="box">
            <el-scrollbar>
              <Doc ref="doc" :docDataJson="docDataJson" style="margin-right: 18px"></Doc>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label="调试">
          <div class="box">
            <el-scrollbar>
              <Debugging ref="debugging" :debuggingDataJson="debuggingDataJson" style="margin-right: 18px"></Debugging>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- </el-scrollbar> -->
    </div>
    <!-- </basic-container> -->
  </HuilanBasic>
</template>

<script>
import Doc from "./conponent/doc.vue";
import Debugging from "./conponent/debugging.vue";
// import { extractKeywordsFromTxt } from "@/api/configure/aiAbility";
import {
  getAllAiAbilityList,
  getHuilanAiApplicationAbilityRelationByApplicationId,
} from "@/api/configure/application";
import aiInterfaceParama from "@/util/aiInterfaceParama";
import commonVariable from "@/util/commonVariable";
const tabclenHei = document.body.clientHeight - 170;
const tabclenHeiRi = document.body.clientHeight - 170;
import { mapState } from 'vuex'
export default {
  name: "interfaceDescription",
  components: {
    Doc,
    Debugging,
  },
  props: {
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      tabclenHei: `height:${tabclenHei}px`,
      tabclenHeiRi: `height:${tabclenHeiRi}px`,
      commonVariable,
      menuList: [],
      menuId: "",
      dataJson: aiInterfaceParama.params.dataJson,
      docDataJson: {},
      debuggingDataJson: {},
      abilityCode: null,
      headerTitle: '',
    };
  },
  computed: {
    ...mapState({
      curentRouterPage(state) {
        return state.aiMagement.curentRouterPage
      },
    }),
  },
  watch: {
    rowData(newName, oldName) {
      console.log(newName, oldName);
    }
  },
  mounted() {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    const scope = this;
    // let abilityCode = null;
    if (scope.rowData) {
      // abilityCode = scope.rowData.testUrl;
      scope.abilityCode = scope.rowData.testUrl;
      this.rowData = scope.rowData
    }
    getAllAiAbilityList().then(
      (res) => {
        if (res.data.success) {
          const arr = [];
          res.data.data.map((v) => {
            if (
              // v.code !== "recordingFileAsrWithAliyun" &&
              v.code !== "recordingFileAsrCallbackWithAliyun"
            ) {
              arr.push(v);
            }
          });
          if (scope.rowData) {
            const headerTitle = scope.rowData.headerTitle;
            this.headerTitle = scope.rowData.headerTitle
            if (headerTitle === "apply") {
              let code = scope.rowData.cunrentLeftTreeRow.code;
              scope.menuList = scope.rowData.menuList;
              scope.menuId = code;
              scope.dataset(code);
            } else if (headerTitle === "接口说明") {
              scope.requstMenuList(scope.rowData.id, arr);
            } else {
              const arrSource = [];
              arr.map((v) => {
                if (v.category1 === scope.rowData.category1) {
                  arrSource.push(v);
                }
              });
              scope.menuList = arrSource;
              scope.menuId = scope.rowData.testUrl;
              scope.dataset(scope.rowData.testUrl);
            }
          } else {
            scope.menuList = arr;
            scope.menuId = arr[0].code;
            scope.dataset(arr[0].code);
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
          // loading();
        }
      },
      (error) => {
        window.console.log(error);
        // loading();
      }
    );
  },
  methods: {
    requstMenuList(applicationId, menuList) {
      const scope = this;
      if (applicationId) {
        getHuilanAiApplicationAbilityRelationByApplicationId({
          applicationId,
        }).then((res) => {
          const data = res.data;
          if (data.success) {
            const arr = [];
            data.data.map((v) => {
              if (
                v.code !== "recordingFileAsrCallbackWithAliyun" &&
                v.code !== "recordingFileAsrCallbackWithAliyunLocal" &&
                v.code !== "recordingFileAsrCallbackWithAliyun"
              ) {
                arr.push(v);
              }
            });
            scope.menuList = arr;
            scope.dataset(arr[0].testUrl);
          }
        });
      } else {
        const arr = [];
        menuList.map((v) => {
          console.log(v.testUrl);
          console.log(scope.rowData.testUrl);
          if (v.testUrl === scope.rowData.testUrl) {
            arr.push(v);
          }
        });
        scope.menuList = arr;
        scope.dataset(arr[0].code);
      }
    },
    select(index) {
      const scope = this;
      this.dataJson.map((v) => {
        if (Object.keys(v)[0] === index) {
          //请求参数动态改变值
          let child = v[Object.keys(v)[0]].RequestBodyTabList[0].children;
          const arr = [];
          child.map((v, i) => {
            if (i < 3) {
              arr.push(v);
            }
          });
          arr.push(aiInterfaceParama.params.RequestBodyTabListChils[index]);
          v[Object.keys(v)[0]].RequestBodyTabList[0].children = arr;
          scope.docDataJson = v[Object.keys(v)[0]];
          let parms = v[index].RequestBody;
          if (scope.rowDat && scope.rowData.appKey) {
            delete parms.abilityCode;
            delete parms.ifTest;
            parms = {
              ...parms,
              appKey: scope.rowData.appKey,
              appSecret: scope.rowData.appSecret,
              // abilityCode: abilityCode,
            };
          }
          scope.debuggingDataJson = {
            RequestUrl: v[Object.keys(v)[0]].RequestUrl,
            RequestBody: parms,
          };
          scope.abilityCode = v[index].RequestBody.abilityCode;
        }
      });
    },
    camcel() {
      let rowData = this.rowData
      if (this.rowData.headerTitle) {
        if (
          this.rowData.category1 === "machine" ||
          this.rowData.category1 === "nlp" || this.rowData.category1 === 'voice' || this.rowData.category1 === 'image' || this.rowData.category1 === 'emotion' || this.curentRouterPage === 'ability'
        ) {
          this.$emit("nplHandl", this.rowData, "2");
        } else {
          if (this.curentRouterPage === 'apply') {
            this.$emit("setpage", rowData, "2");
          } else {
            this.$parent.switchPage = "1";
          }
        }
      } else {
        if (
          this.rowData.category1 === "machine" ||
          this.rowData.category1 === "nlp" || this.rowData.category1 === 'gpt' || this.rowData.category1 === 'voice' || this.rowData.category1 === 'image' || this.rowData.category1 === 'emotion'
        ) {
          this.$emit("nplHandl", this.rowData, "2");
        } else {
          rowData = { ...rowData, testUrl: this.abilityCode }
          this.$emit("setpage", rowData, "2");
        }
      }
      if (this.$parent.rowData) {
        this.$parent.rowData.testUrl = this.abilityCode;
      }
    },
    dataset(abilityCode) {
      const scope = this;
      scope.dataJson.map((v) => {
        let parms = null;
        if (Object.keys(v)[0] === abilityCode) {
          let child = v[abilityCode].RequestBodyTabList[0].children;
          const arr = [];
          child.map((p, i) => {
            if (i < 3) {
              arr.push(p);
            }
          });
          arr.push(
            aiInterfaceParama.params.RequestBodyTabListChils[abilityCode]
          );
          v[abilityCode].RequestBodyTabList[0].children = arr;
          v[abilityCode].testUrl = abilityCode;
          scope.docDataJson = v[abilityCode];
          parms = v[abilityCode].RequestBody;
          if (scope.rowData && scope.rowData.appKey) {
            // delete parms.abilityCode;
            delete parms.ifTest;
            parms = {
              ...parms,
              appKey: scope.rowData.appKey,
              appSecret: scope.rowData.appSecret,
              abilityCode,
            };
          }
          scope.debuggingDataJson = {
            abilityCode,
            RequestUrl: v[abilityCode].RequestUrl,
            RequestBody: parms,
          };
          v[abilityCode].RequestBody = parms;
        }
      });
      this.menuId = abilityCode;
    },
  },
};
</script>

<style lang="scss" scoped>
.btnRi {
  margin-bottom: 20px;
  text-align: right;
  margin-right: 20px;
}

.interfaceDescription {
  .el-menu-item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

/deep/ .el-tabs__item {
  width: 70px;
  text-align: center;
}

/deep/ .el-submenu .el-menu-item {
  padding-right: 0;
}

/deep/ .el-tabs__header {
  margin-right: 18px;
}
</style>
