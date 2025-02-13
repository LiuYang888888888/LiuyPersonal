<template>
  <avue-form :option="option" v-model="addForm" ref="addFormRef"> </avue-form>
</template>

<script>
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String,
      required: true,
      default: "add",
    },
    curDimension: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["language"]),
  },



  data () {
    return {
      addForm: {},
      option: {
        column: [
          {
            type: "input",
            label: this.$t("dimensionManage.dnameText"),
            span: 24,
            display: true,
            prop: "dname",
            maxlength: 50,
            showWordLimit: true,
            required: true,
            rules: [
              {
                required: true,
                message: this.$t("dimensionManage.dnameRequiredText"),
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            type: "textarea",
            label: this.$t("dimensionManage.remarks"),
            span: 24,
            display: true,
            prop: "remarks",
            showWordLimit: true,
            maxlength: 150,
            detail: false,
          },
        ],
        labelPosition: 'right',
        labelSuffix: "：",
        labelWidth: 100,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
        menuPosition: "center",
        tabs: false,
        detail: false,
      },
    };
  },
  mounted () {
    this.option.labelPosition = this.language != 'zh' ? 'top' : 'right'
    if (this.type == "edit") {
      this.addForm = {
        dname: this.curDimension.dname,
        remarks: this.curDimension.remarks,
        id: this.curDimension.id,
      };
    }
  },
};
</script>

<style></style>
