<template>
  <el-table ref="message" :data="tableData" style="width: 100%" @selection-change="messageSelectionChange">
    <el-table-column type="selection" width="55" :selectable="selectable" />
    <el-table-column prop="name" :label="$t('auditSetting.messageType')" />
    <el-table-column prop="message" :label="$t('auditSetting.textMessage')" width="110">
      <template slot-scope="scope">
        <el-select v-model="scope.row.message" size="small" clearable>
          <el-option v-for="item in messageTplList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="email" :label="$t('auditSetting.mailbox')">
      <template slot-scope="scope">
        <el-select v-model="scope.row.email" size="small" clearable>
          <el-option v-for="item in emailTplList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="internal" :label="$t('auditSetting.mail')">
      <template slot-scope="scope">
        <el-select v-model="scope.row.internal" size="small" clearable>
          <el-option v-for="item in internalTplList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </template>
    </el-table-column>

    <!-- <el-table-column
      prop="smart"
      label="智能语音">
      <template slot-scope="scope">
        <el-select v-model="scope.row.smart" size="small">
          <el-option v-for="item in smartTplList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </template>
    </el-table-column> -->

    <el-table-column prop="qyWeixin" :label="$t('auditSetting.weCom')">
      <template slot-scope="scope">
        <el-select v-model="scope.row.qyWeixin" size="small" clearable>
          <el-option v-for="item in qyWeixinTplList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="custom" :label="$t('auditSetting.custom')">
      <template slot-scope="scope">
        <el-select v-model="scope.row.custom" size="small" clearable>
          <el-option v-for="item in customTplList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getBaseMessageTemplateByType } from "@/api/system/messageTemplate";
export default {
  name: "MessageList",
  props: {
    messageTypeList: {
      type: Array,
      default () {
        return [];
      }
    },
    selectedList: {
      type: Array,
      default () {
        return [];
      }
    },
    curSelectedList: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      // messageTypeList: [],
      // selectedList: [],
      messageTplList: [],
      emailTplList: [],
      internalTplList: [],
      smartTplList: [],
      qyWeixinTplList: [],
      customTplList: []
      // curSelectedList: []
    };
  },
  computed: {
    tableData () {
      return this.messageTypeList.map(item => {
        const res = this.selectedList.find(row => row.type === item.type);
        return {
          ...item,
          ...res,
          disabled: item.disabled
        };
      });
    }
  },
  watch: {
    messageTypeList () {
      this.$nextTick(() => {
        this.handleSelection();
      });
    },
    selectedList: {
      handler () {
        this.$nextTick(() => {
          this.handleSelection();
        });
      },
      immediate: true
    }
  },
  methods: {
    selectable (row) {
      return !row.disabled;
    },
    async getTpl (type) {
      const map = {
        shortmessage: "messageTplList",
        mail: "emailTplList",
        system: "internalTplList",
        robot: "smartTplList",
        qyWeixin: "qyWeixinTplList",
        custom: "customTplList"
      };
      const {
        data: { data }
      } = await getBaseMessageTemplateByType(type);
      // console.log(data)
      this[map[type]] = data;
    },
    handleSelection () {
      const table = this.$refs.message;
      if (table) {
        this.selectedList.forEach(item => {
          const row = this.tableData.find(
            rowItem => rowItem.type === item.type
          );
          if (row) {
            table.toggleRowSelection(row, true);
          }
        });
      }
    },
    messageSelectionChange (list) {
      // this.curSelectedList = list
      this.$emit("update:curSelectedList", list);
    }
  },
  mounted () {
    this.getTpl("shortmessage");
    this.getTpl("mail");
    this.getTpl("system");
    this.getTpl("robot");
    this.getTpl("qyWeixin");
    this.getTpl("custom");
  }
};
</script>

<style scoped></style>
