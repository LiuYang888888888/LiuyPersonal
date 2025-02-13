<template>
  <div class="optOrgDialog">
    <HuilanDialog
      :title="optTitle"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="optTag"
      :destroy-on-close="true"
    >
      <optOrg ref="optOrgRef" :checkedData="ajaxCheckedData" />
      <template v-slot:footer>
        <el-button
          icon="el-icon-check"
          size="small"
          type="primary"
          @click="optOrgSave"
          >{{ $t("aicosCommon.confirmBtn") }}</el-button
        >
        <el-button icon="el-icon-close" size="small" @click="optOrgClose">{{
          $t("aicosCommon.closeBtn")
        }}</el-button>
      </template>
    </HuilanDialog>

    <div class="selectMain">
      <div class="selectBtn" v-show="!dataView">
        <el-button
          icon="el-icon-circle-plus-outline"
          size="mini"
          type="primary"
          @click.stop="checkeOrg()"
          >{{ $t("system.dept.select") }}</el-button
        >
      </div>

      <div class="selectRes">
        <el-tag
          :closable="!dataView"
          size="small"
          v-for="item in value.user"
          :key="item.id"
          class="user"
          @close="removeSelect('user', item)"
          >{{ item.realName }}
        </el-tag>
        <el-tag
          :closable="!dataView"
          size="small"
          v-for="item in value.dept"
          :key="item.id"
          class="dept"
          @close="removeSelect('dept', item)"
          >{{ item.deptName }}
        </el-tag>
        <el-tag
          :closable="!dataView"
          size="small"
          v-for="item in value.role"
          :key="item.id"
          class="role"
          @close="removeSelect('role', item)"
          >{{ item.roleName }}
        </el-tag>

        <el-tag
          :closable="!dataView"
          size="small"
          class="dyna"
          v-for="item in value.dyna"
          :key="item.prop"
          v-if="item.value"
          @close="removeSelect('dyna', item.prop)"
          >{{ item.label }}</el-tag
        >
      </div>
    </div>
  </div>
</template>

<script>
import optOrg from "./optOrg";
import {
  isNull,
  /*formatOrgDataToNew, formatOrgDataToOld,*/ defaultDynaData,
} from "@/util/qsgCommon.js";

export default {
  name: "OptOrgCommon",
  components: {
    optOrg,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    dataView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optTag: false,
      optTitle: this.$t("system.dept.select"),
      ajaxCheckedData: {},

      defaultDynaData: {},

      // dataView: false,
    };
  },
  methods: {
    checkeOrg() {
      this.optTitle = this.title;

      const dataRes = this.value;
      this.ajaxCheckedData = {
        ...this.ajaxCheckedData,
        ...dataRes,
        type: this.tabs || [],
      };
      this.optTag = true;
    },
    optOrgSave() {
      const resData = this.$refs.optOrgRef.getResData();
      //let rex = "您设置了 "+resData.user.length +'个用户；'+resData.dept.length +'个部门；'+resData.role.length +'个角色；'
      //this.$message.success( rex );

      this.value = resData;

      this.$emit("input", this.value);

      this.optTag = false;
    },
    optOrgClose() {
      //console.log('optOrgClose');
      this.optTag = false;
    },
    removeSelect(type, data) {
      if (type == "dyna") {
        this.value.dyna.map((item) => {
          if (item.prop == data) {
            item.value = false;
          }
        });
      } else if (type == "user") {
        this.value[type] = this.value[type].filter(
          (item) => !(item.id == data.id || item.account == data.account)
        );
      } else {
        this.value[type] = this.value[type].filter(
          (item) => item.id != data.id
        );
      }
    },
    initDynaValue(thprop) {
      let res = false;
      if (this.value && Array.isArray(this.value.dyna)) {
        this.value.dyna.map((item) => {
          if (item.prop == thprop) {
            res = item.value;
          }
        });
      }
      return res;
    },
    initDyna() {
      // console.log(this.value );
      // console.log(typeof this.value );
      if (isNull(this.value)) {
        // console.log('isNull');
        this.value = {}; // 如果this.value不是一个对象，创建一个空对象
      }

      const tempDynaArr = [];
      this.defaultDynaData.map((item) => {
        item.value = this.initDynaValue(item.prop);
        tempDynaArr.push(item);
      });
      this.value.dyna = tempDynaArr;
    },
  },
  mounted() {
    this.defaultDynaData = defaultDynaData;

    this.initDyna();
  },

  created() {},

  watch: {
    /*"value":{
      handler(newVal) {
        //console.log(newVal)
      },
      deep: true
    },
    "tabs":{
      handler(newVal) {
        //console.log(newVal)
      },
      deep: true
    },*/
  },
};
</script>
<style lang="scss" scoped>
.selectMain {
  .selectBtn {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .selectRes {
    display: inline-block;

    /deep/.el-tag {
      margin-right: 8px;
      margin-bottom: 5px;
      height: 28px;
      line-height: 26px;

      &.user {
        background-color: #409eff50;
        border-color: #409eff80;
      }

      &.dept {
        background-color: #90939950;
        border-color: #90939980;
      }

      &.role {
        background-color: #67c23a50;
        border-color: #67c23a80;
      }

      &.dyna {
        background-color: #e6a23c50;
        border-color: #e6a23c80;
      }
    }
  }
}
</style>
