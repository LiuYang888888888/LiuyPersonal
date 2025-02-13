<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button type="primary" v-if="permission['logs_sends']" size="small" icon="el-icon-upload" @click="send">{{
        $t('system.logs.uploadServer') }}</el-button>
      <el-button type="danger" v-if="permission['logs_delete']" size="small" icon="el-icon-delete" @click="clear">{{
        $t('system.logs.clearLogs') }}</el-button>
    </HuilanBasicToolbar>
    <avue-crud :data="logsList" :option="option">
      <!-- <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload"
          @click="send"
          >上传服务器</el-button
        >
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          @click="clear"
          >清空本地日志</el-button
        >
      </template> -->
      <template slot-scope="scope" slot="type">
        <el-tag type="danger" size="small">{{ scope.label }}</el-tag>
      </template>
      <template slot-scope="props" slot="expand">
        <pre class="code">
        {{ props.row.stack }}
      </pre>
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      option: {
        header: false,
        menu: false,
        addBtn: false,
        page: false,
        border: true,
        expand: true,
        rowKey: "time",
        refreshBtn: false,
        headerAlign: "center",
        columnBtn: false,
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('system.logs.type'),
            prop: "type",
            width: 80,
            align: "center",
            slot: true,
            dicData: [
              {
                label: "bug",
                value: "error",
              },
            ],
          },
          {
            label: this.$t('system.logs.address'),
            width: 200,
            prop: "url",
            overHidden: true,
          },
          {
            label: this.$t('system.logs.content'),
            prop: "message",
            overHidden: true,
          },
          {
            label: this.$t('system.log.errorStack'),
            prop: "stack",
            hide: true,
            overHidden: true,
          },
          {
            label: this.$t('system.logs.time'),
            align: "center",
            prop: "time",
            width: 200,
          },
        ],
      },
    };
  },
  created () { },
  mounted () { },
  computed: {
    ...mapGetters(["logsList", "permission"]),
  },
  props: [],
  methods: {
    send () {
      this.$confirm(this.$t('system.logs.uploadServerTip'), this.$t('system.logs.tip'), {
        confirmButtonText: this.$t('aicosCommon.confirmBtn'),
        cancelButtonText: this.$t('aicosCommon.cancelBtn'),
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("SendLogs").then(() => {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successSentTip"),
            });
          });
        })
        .catch(() => { });
    },
    clear () {
      this.$confirm(this.$t('system.logs.clearLogsTop'), this.$t('system.logs.tip'), {
        confirmButtonText: this.$t('aicosCommon.confirmBtn'),
        cancelButtonText: this.$t('aicosCommon.cancelBtn'),
        type: "warning",
      })
        .then(() => {
          this.$store.commit("CLEAR_LOGS");
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successClearTip"),
          });
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scoped>
.code {
  font-size: 12px;
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}
</style>
