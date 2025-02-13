<template>
  <el-row :gutter="20">
    <el-col :span="4" class="leftMenu">
      <div></div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#ffffff"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <div class="grid-content-top">
        <basic-container class="basic-container">
          <div>
            <span class="tit">关键词提取</span>
            <el-button
              size="small"
              type="primary"
              class="btnRi"
              @click="rowDel(item.id)"
              >接口说明</el-button
            >
          </div>
          <div class="txt">
            关键词提取把文本中包含信息进行结构化处理，并将提取的信息以统一形式集成在一起。
          </div>
        </basic-container>
      </div>
      <div class="grid-content-cen">
        <basic-container>
          <el-row>
            <el-col :span="20">
              <div>
                <span class="tit">能力体验</span>
                <div class="txt">
                  <span>使用场景</span>
                  <el-select size="small" v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="area">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="textarea"
                  maxlength="500"
                  show-word-limit
                >
                </el-input>
              </div>
              <div class="sele">
                <span class="le">关键词个数</span>
                <el-select size="small" v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="btn">
                <el-button size="small" class="btnRi" @click="rowDel(item.id)"
                  >换一句</el-button
                ><el-button
                  size="small"
                  type="primary"
                  class="btnRi"
                  @click="rowDel(item.id)"
                  >开始分析</el-button
                >
              </div>
              <hr class="hr" />
              <div class="tag">
                <div class="txts">分析结果</div>
                <div>
                  <el-tag type="info" class="el-tags">标签三</el-tag>
                  <el-tag type="info" class="el-tags">标签三</el-tag>
                  <el-tag type="info" class="el-tags">标签三</el-tag>
                  <el-tag type="info" class="el-tags">标签三</el-tag>
                  <el-tag type="info" class="el-tags">标签三</el-tag>
                  <el-tag type="info" class="el-tags">标签三</el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </basic-container>
      </div>
      <div class="grid-content-botto">
        <basic-container>
          <div class="title">使用场景</div>
          <el-row>
            <el-col span="6">
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#ffffff"
                @open="handleOpen"
                @close="handleClose"
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                  </template>
                  <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                  </el-menu-item-group>
                  <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                  </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                  <i class="el-icon-document"></i>
                  <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">导航四</span>
                </el-menu-item>
              </el-menu>
            </el-col>
            <el-col span="12">
              <div class="colu-cen-tit">商品口碑分析</div>
              <div class="colu-cen-txt">
                对商品点评内容进行观点提取和分析，为每个商品和定义点评标签，让购买者和售卖者直观了解商品在用户中的口碑
              </div>
            </el-col>
            <el-col span="6">
              <el-image
                class="img"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                fit="cover"
              ></el-image>
            </el-col>
          </el-row>
        </basic-container>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import {mapGetters} from "vuex";
// import { serviceEnableStatus } from "@/api/configure/application";
// import serviceList from "@/config/serviceList";

export default {
  name: "paramItemList",
  props: {
    // typeId: {
    //   type: String,
    //   default: "",
    // },
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      textarea: null,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.leftMenu {
  /deep/ .el-menu-item-group__title {
    background: white;
  }
}
.basic-container {
  background-color: #ffffff;
  box-shadow: 0px 6px 16px 4px rgba(6, 7, 46, 0.05);
  border-radius: 10px;
  border: solid 1px #eeeeee;
  margin-bottom: 20px;
  padding: 30px 40px;
}
.grid-content-top {
  .tit {
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
  }
  .txt {
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #565863;
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .btnRi {
    float: right;
    // margin-right: 40px;
  }
}
.grid-content-cen {
  .tit {
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
  }
  .txt {
    display: inline-block;
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #565863;
    float: right;
    > span {
      display: inline-block;
      margin-right: 8px;
    }
  }
  .area {
    margin-top: 20px;
  }
  .sele {
    margin-top: 20px;
    .le {
      font-family: SourceHanSansCN-Normal;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #565863;
      display: inline-block;
      margin-right: 20px;
    }
  }
  .btn {
    margin-top: 20px;
  }
  .hr {
    border: none;
    height: 1px;
    background: #eee;
    margin-top: 20px;
  }
  .tag {
    margin-top: 20px;
    .txts {
      margin-bottom: 20px;
    }
    .el-tags {
      margin-right: 8px;
    }
  }
}
.grid-content-botto {
  .title {
    margin-bottom: 20px;
  }
  .colu-cen-tit {
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
  }
  .colu-cen-txt {
    display: inline-block;
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #565863;
    margin-top: 30px;
  }
}
</style>
