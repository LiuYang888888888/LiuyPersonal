<template>
  <HuilanBasic class="appliWrap">
    <el-row :gutter="20" v-if="switchPage === '1'">
      <el-col span="4" class="leftTree">
        <div :style="clientHeight">
          <el-scrollbar>
            <baseLeftTree ref="treeRef" @businesstypeIdSet="businesstypeIdSet" />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col span="20">
        <div class="tables">
          <div class="header">
            <div :class="{ item: true, itemActive: fill === 'atom' }" @click="itemfill('atom')">
              <span :class="{ imgBox: true, active: fill === 'atom' }"><img v-if="fill === 'atom'" class="image"
                  src="@/assets/iconfont/atom2.svg" alt="" />
                <img v-if="fill !== 'atom'" class="image" src="@/assets/iconfont/atom.svg" alt="" />
              </span>
              <span :class="{ text: true, active: fill === 'atom' }">AI原子能力</span>
            </div>
            <!-- <div
              :class="{ item: true, itemActive: fill === 'text' }"
              @click="itemfill('text')"
            >
              <span :class="{ imgBox: true, active: fill === 'text' }">
                <img
                  v-if="fill === 'text'"
                  class="image"
                  src="@/assets/iconfont/text2.svg"
                  alt=""
                />
                <img
                  v-if="fill !== 'text'"
                  class="image"
                  src="@/assets/iconfont/text.svg"
                  alt=""
                />
              </span>
              <span :class="{ text: true, active: fill === 'text' }"
                >文本机器人</span
              >
            </div>
            <div
              :class="{ item: true, itemActive: fill === 'voice' }"
              @click="itemfill('voice')"
            >
              <span :class="{ imgBox: true, active: fill === 'voice' }"
                ><img
                  v-if="fill === 'voice'"
                  class="image"
                  src="@/assets/iconfont/voice2.svg"
                  alt="" />
                <img
                  v-if="fill !== 'voice'"
                  class="image"
                  src="@/assets/iconfont/voice.svg"
                  alt="" /></span
              ><span :class="{ text: true, active: fill === 'voice' }"
                >语音机器人</span
              >
            </div>

            <div
              :class="{ item: true, itemActive: fill === 'digital' }"
              @click="itemfill('digital')"
            >
              <span :class="{ imgBox: true, active: fill === 'digital' }"
                ><img
                  v-if="fill === 'digital'"
                  class="image"
                  src="@/assets/iconfont/num2.svg"
                  alt=""
                />
                <img
                  v-if="fill !== 'digital'"
                  class="image"
                  src="@/assets/iconfont/num.svg"
                  alt=""
                /> </span
              ><span :class="{ text: true, active: fill === 'digital' }"
                >数字人</span
              >
            </div> -->
            <!-- <div
              :class="{ item: true, itemActive: fill === 'custom' }"
              @click="itemfill('custom')"
            >
              <span :class="{ imgBox: true, active: fill === 'custom' }"
                ><img
                  v-if="fill === 'custom'"
                  class="image"
                  src="@/assets/iconfont/apli2.svg"
                  alt="" /><img
                  v-if="fill !== 'custom'"
                  class="image"
                  src="@/assets/iconfont/apli.svg"
                  alt="" /></span
              ><span :class="{ text: true, active: fill === 'custom' }"
                >可构建AI应用</span
              >
            </div> -->
          </div>
          <div class="bodyMyList" :style="clientHeightList">
            <myAppList ref="myAppList" :category1="category1" :businesstypeId="businesstypeId" @showPage="showPage"
              @centerPage="centerPage"></myAppList>
          </div>
        </div>
      </el-col>
    </el-row>
    <NaturalLanguageProcessing v-else-if="switchPage === '2'" ref="naturalLanguageProcessing" :rowData="rowData"
      @naturalLanguageProcessing="naturalLanguageProcessing"></NaturalLanguageProcessing>
    <InterfaceDescription v-else :rowData="rowData" @naturalLanguageProcessing="naturalLanguageProcessing"
      @setpage="setpage"></InterfaceDescription>
  </HuilanBasic>
</template>

<script>
import baseLeftTree from "./baseLeftTree";
// import { mapGetters } from "vuex";
import rightTable from "./rightTable.vue";
import myAppList from "./myAppList.vue";
// import NaturalLanguageProcessing from "@/views/aiCapacityBase/naturalLanguageProcessing.vue";
import NaturalLanguageProcessing from "@/views/aiCapacityBase/abilityExperience.vue";
import InterfaceDescription from "@/views/interfaceDescription/index.vue";
const clientHeight = document.body.clientHeight - 120;
const clientHeightList = document.body.clientHeight - 288;
// import nomal from "@/assets/iconfont/normal.png";
export default {
  name: "leftTree",
  components: {
    baseLeftTree,
    rightTable,
    myAppList,
    NaturalLanguageProcessing,
    InterfaceDescription,
  },
  props: {},
  data() {
    return {
      api: null,
      dictName: "",
      fill: "atom",
      businesstypeId: null,
      switchPage: "1", // 1、显示应用管理；2、显示体验中心
      rowData: {}, //传入到体验中心参数
      clientHeight: `height:${clientHeight}px`,
      clientHeightList: `height:${clientHeightList}px`,
      category1: 'atom'
    };
  },
  computed: {},
  mounted() {
    // this.category1 = this.fill;
  },
  methods: {
    itemfill(index) {
      this.fill = index;
      this.category1 = index;
      this.$refs.myAppList.pagelist({ current: 1 }, {}, index);
    },
    businesstypeIdSet(data) {
      this.businesstypeId = data;
      this.$refs.myAppList.pagelist({ current: 1 }, {}, this.category1, data);
    },
    showPage(data) {
      this.switchPage = data;
    },
    centerPage(data, num) {
      this.rowData = data;
      this.switchPage = num;
      this.$nextTick(() => {
        if (this.$refs.naturalLanguageProcessing) {
          this.$refs.naturalLanguageProcessing.applicationReset(data)
        }
      })
    },
    naturalLanguageProcessing(data, num) {
      this.rowData = data;
      if (num) {
        this.centerPage(data, num)
      }
    },
    setpage(data, num) {
      this.rowData = data;
      this.switchPage = num;
      this.$nextTick(() => {
        if (this.$refs.naturalLanguageProcessing) {
          this.$refs.naturalLanguageProcessing.applicationReset(data)
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.appliWrap {
  /deep/ .basic-container .el-card {
    // background: #f0f2f5;
  }

  .header {
    height: 40px;
    background-color: #ffffff;
    padding-left: 20px;

    .item {
      display: inline-block;
      margin-right: 30px;
      cursor: pointer;
      padding-right: 4px;

      .imgBox {
        display: inline-block;
      }

      .image {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        position: relative;
        top: 3px;
      }

      .text {
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #9597a0;
        line-height: 40px;
      }

      .active {
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        line-height: 40px;
        color: #205ac8;
      }
    }

    .itemActive {
      display: inline-block;
      margin-right: 30px;
      cursor: pointer;
      border-bottom: 1px solid #205ac8;
    }
  }

  .bodyMyList {
    margin-top: 10px;
  }
}
</style>
