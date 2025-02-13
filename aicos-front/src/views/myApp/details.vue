<template>
  <HuilanDialog
    title="应用详情"
    append-to-body
    width="680px"
    :visible.sync="detailVisible"
    :before-close="cansell"
    class="addApli"
  >
    <div class="dirlog">
      <div class="detail">
        <el-row>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">应用名称：</span>
              <span class="texts">
                {{ form.name }}
              </span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">appkey：</span>
              <span class="texts"
                >{{ form.appKey
                }}<i
                  style="
                    text-align: left;
                    display: block;
                    margin-left: 20px;
                    margin-top: 4px;
                    cursor: pointer;
                    font-size: 20px;
                    display: inline-block;
                  "
                  class="el-icon-copy-document"
                  type="primary"
                  v-clipboard:copy="form.appKey"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                </i
              ></span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">appSecret：</span>
              <span class="texts"
                >{{ form.appSecret
                }}<i
                  style="
                    text-align: left;
                    display: block;
                    margin-left: 20px;
                    margin-top: 4px;
                    cursor: pointer;
                    font-size: 20px;
                    display: inline-block;
                  "
                  class="el-icon-copy-document"
                  type="primary"
                  v-clipboard:copy="form.appSecret"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                ></i
              ></span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">能力名称：</span>
              <span style="width: 500px; display: inline-block">
                <el-tag
                  v-for="v of form.abilityId"
                  :key="v"
                  size="small"
                  style="
                    margin-right: 8px;
                    margin-bottom: 10px;
                    margin-top: 8px;
                  "
                  >{{ v }}</el-tag
                >
              </span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">到期时间：</span>
              <span class="texts">{{ form.createTime }}</span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">启用状态：</span>
              <span class="texts">
                {{ showFlag(form.status) }}
              </span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">语言：</span>
              <span class="texts">
                {{ form.languageName }}
              </span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">应用描述：</span>
              <span class="texts" :title="form.description">{{
                form.description
              }}</span>
            </div>
          </el-col>
          <el-col :span="24" class="col" v-if="form.category1 !== 'atom'">
            <div class="item">
              <span class="titles">应用配置：</span>
              <span class="texts" :title="form.configUrl">{{
                form.configUrl
              }}</span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item" v-if="form.category1 !== 'atom'">
              <PlugCrud
                class="plugCrudPar"
                :personalityDisplay="false"
                :requstData="requstDataToJson(form.jsonValue)"
                title="参数配置"
                :addBtn="viewsFlag"
                :editBtn="viewsFlag"
                :delBtn="viewsFlag"
              ></PlugCrud>
            </div>
          </el-col>
          <el-col :span="24" class="col" v-if="form.category1 !== 'atom'">
            <div class="item">
              <span class="titles">接口说明：</span>
              <span class="texts" :title="form.docUrl">{{ form.docUrl }}</span>
            </div>
          </el-col>
          <el-col :span="24" class="col" v-if="form.category1 !== 'atom'">
            <div class="item">
              <span class="titles">体验参数：</span>
              <span class="texts" :title="form.testUrl">{{
                form.testUrl
              }}</span>
            </div>
          </el-col>
          <el-col :span="24" class="col">
            <div class="item">
              <span class="titles">图标：</span>
              <el-image
                v-if="form.smallIconUrl"
                style="
                  width: 108px;
                  height: 108px;
                  margin-right: 10px;
                  margin-top: 14px;
                "
                :src="form.smallIconUrl"
                fit="cover"
              ></el-image>
              <img
                v-else
                style="
                  width: 108px;
                  height: 108px;
                  margin-right: 10px;
                  margin-top: 14px;
                "
                src="@/assets/iconfont/moke.svg"
                alt=""
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <template slot="footer">
      <div class="item" style="text-align: right">
        <el-button size="mini" @click="cansell">关闭</el-button>
      </div>
    </template>
  </HuilanDialog>
</template>

<script>
import { mapGetters } from "vuex";
import PlugCrud from "@/components/plugCrud";
// import serviceList from "@/config/serviceList";
export default {
  name: "paramItemList",
  components: {
    PlugCrud,
  },
  props: {},
  data() {
    return {
      detailVisible: false,
      viewsFlag: false,
      form: {
        abilityId: [],
      },
      loading: true,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  created() {},
  methods: {
    showFlag(key) {
      let tit = "";
      if (key === "1") {
        tit = "已启用";
      } else {
        tit = "未启用";
      }
      return tit;
    },
    cansell() {
      this.detailVisible = false;
    },
    requstDataToJson(data) {
      let para = [];
      if (data) {
        para = JSON.parse(data);
      }
      return para;
    },
    onCopy() {
      this.$message.success("内容已复制到剪切板！");
    },
    // 复制失败时的回调函数
    onError() {
      this.$message.error("抱歉，复制失败！");
    },
  },
};
</script>

<style lang="scss" scoped>
.dirlog {
  .detail {
    // border-bottom: 1px solid #eeeeee;
    .tit {
      list-style: none;
      margin-top: 12px;
      margin-left: 80px;
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #070b2d;
    }

    .item {
      display: block;
    }

    //.icon-edit {
    //  width: 19px;
    //  height: 19px;
    //  position: relative;
    //  top: 3px;
    //  font-size: 24px !important;
    //  cursor: pointer;
    //}

    .titles {
      width: 120px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .texts {
      width: 120px;
      text-align: left;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 370px;
      /*定义块元素的宽度*/
      white-space: nowrap;
      /*内容超宽后禁止换行显示*/
      overflow: hidden;
      /*超出部分隐藏*/
      text-overflow: ellipsis;
    }

    .elInput {
      width: 260px;
      margin-left: 20px;
      margin-right: 20px;
    }

    .switch {
      position: relative;
      bottom: 2px;
    }

    .col {
      // margin-top: 51px;
    }
  }

  .serve {
    .serRow {
      margin-left: 64px !important;
      margin-right: 64px !important;
    }

    .tit {
      margin-left: 80px;
      margin-top: 47px;
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #070b2d;
      margin-bottom: 26px;
    }

    .grid-content {
      background-color: #ffffff;
      box-shadow: 0px 6px 16px 4px rgba(6, 7, 46, 0.05);
      border-radius: 10px;
      border: solid 1px #eeeeee;

      .heaTit {
        margin-left: 30px;
        margin-top: 30px;
        font-family: SourceHanSansCN-Medium;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #205ac8;
      }

      .url {
        .ri {
          width: 200px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .le {
        display: inline-block;
        margin-top: 20px;
        margin-left: 30px;
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #070b2d;
      }

      .ri {
        display: inline-block;
        margin-left: 18px;
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #565863;
      }
    }
  }

  .footer {
    margin-top: 40px;
    text-align: center;

    .server {
      margin-right: 30px;
      background: #205ac8;
      color: #ffffff;
    }

    .inter {
      background-color: #ffffff;
      color: #205ac8;
    }

    margin-bottom: 18px;
  }

  /deep/ .avue-crud__menu {
    display: none;
  }
}

.serverModel {
  .titles {
    display: inline-block;
    width: 170px;
    text-align: right;
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
    margin-bottom: 30px;
  }

  .texts {
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 36px;
    letter-spacing: 0px;
    color: #565863;
    margin-left: 20px;
    margin-right: 20px;
  }
}
</style>
