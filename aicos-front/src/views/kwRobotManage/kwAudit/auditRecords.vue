<template>
  <div class="listClass">
    <avue-crud
      :option="listOption"
      :table-loading="loading"
      :data="listData"
      ref="listRef"
      v-model="listForm"
      :page.sync="page"
    >
    </avue-crud>
  </div>
</template>

<script>
import { isNull } from "@/util/qsgCommon.js";
import { getKwAuditHistoryList } from "@/api/kwKnowledgeCenter/kwAudit/index.js";
import { mapGetters } from "vuex";
import { getTextWidth } from "@/util/util";
export default {
  name: "auditRecords",
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    kmDataId: {
      type: String,
      default: "",
    },
    kmVersion: {
      type: String,
      default: "",
    },
    kmType: {
      type: String,
      default: "",
    },
  },
  computed: {
    // 计算属性
    ...mapGetters(["language"]),
  },
  data() {
    return {
      loading: false,
      listOption: {
        menuBtn: true,
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        index: false,
        menu: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: this.$t("faq.operator"),
            prop: "handlerUserId",
            overHidden: true,
            align: "center",
            width: 120,
          },
          {
            label: this.$t("faq.operatingMode"),
            prop: "passStatus",
            overHidden: true,
            align: "center",
            width: 120,
            dicData: [
              {
                label: this.$t("faq.submitReview"),
                value: "auditing",
              },
              //暂时待定submit和auditing一样，提交审核
              {
                label: this.$t("faq.submitReview"),
                value: "submit",
              },
              {
                label: this.$t("faq.reject"),
                value: "reject",
              },
              {
                label: this.$t("faq.disagree"),
                value: "disagree",
              },
              {
                label: this.$t("faq.finish"),
                value: "finish",
              },
              {
                label: this.$t("faq.withdraw"),
                value: "withdraw",
              },
              {
                label: this.$t("faq.passThrough"),
                value: "agree",
              },
            ],
          },
          {
            label: this.$t("faq.reviewComments"),
            prop: "comment",
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("faq.createTime"),
            prop: "passTime",
            display: false,
            align: "center",
            width: 160,
          },
        ],
      },
    };
  },
  created() {
    if (
      isNull(this.listData) &&
      !isNull(this.kmDataId) &&
      !isNull(this.kmVersion) &&
      !isNull(this.kmType)
    ) {
      this.getListData();
    } else {
      // console.log('listData',this.listData);
    }
  },
  methods: {
    getListData() {
      this.loading = true;
      const dataParam = {
        kmDataId: this.kmDataId,
        kmType: this.kmType,
        kmVersion: this.kmVersion,
      };

      getKwAuditHistoryList(dataParam).then((res) => {
        const dataRes = res.data.data;
        if (this.language != "zh") {
          this.listOption.column.forEach((item) => {
            let width = getTextWidth(item.label).nodeWidth + 80;
            this.$set(item, "width", width);
          });
        }
        this.listData = dataRes || [];
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.listClass {
  padding: 10px 20px;
}
</style>
