<template>
  <div>
    <avue-crud :option="option" :data="data" ref="crud" :table-loading="loading" @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <!-- 定位 -->
        <el-button type="text" size="small" @click.stop="handlerLocal(scope.row, scope.index)">{{
          $t("kwIntentionManage.local") }}</el-button>
      </template>

      <template slot-scope="scope" slot="deepPathName">
        <div v-if="scope.row.deepPathName == ''">--</div>
        <div v-else v-html="scope.row.deepPathName"></div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTextWidth } from "@/util/util";
import { treeSearch } from "@/api/kwKnowledgeCenter/kwClassifySetting/index";
export default {
  props: {
    name: {
      type: String,
      default: () => {
        return "";
      },
    },
    botId: {
      type: String,
      default: () => {
        return "";
      },
    },
    classType: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data () {
    return {
      loading: false,
      data: [],
      option: {
        tip: false,
        height: 300,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        column: [
          {
            label: this.$t("kwIntentionManage.classifyName"), //意图名称
            prop: "dname",
            overHidden: true,
          },
          {
            label: this.$t("kwIntentionManage.classifyPath"), //意图类型
            prop: "deepPathName",
            overHidden: true,
          },
        ],
      },
    };
  },
  computed: {

    // 计算属性
    ...mapGetters(['language']),
  },
  methods: {
    async onLoad () {
      this.loading = true;
      const info = {
        botId: this.botId,
        classType: this.classType,
        name: this.name,
      };
      const result = await treeSearch(info);
      if (result.data.code == 200) {
        this.loading = false;
        this.data = result.data.data;
        if (this.language != 'zh') {
          this.option.column.forEach(item => {
            let width = getTextWidth(item.label).nodeWidth + 80;
            this.$set(item, "width", width)
          })
        }
      }
    },
    handlerLocal (row/*, index*/) {
      this.$emit("localNode", row);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}
</style>
