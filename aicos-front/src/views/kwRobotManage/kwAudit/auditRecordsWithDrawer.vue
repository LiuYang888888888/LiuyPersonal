<template>
  <QSGDrawer :title="auditRecordsTitle" :fullscreen="false" size="50%" append-to-body :visible.sync="auditRecordsTag"
    :wrapperClosable="false">
    <div>
      <AuditRecords :listData="recordParams.recordsData" :kmDataId="recordParams.kmDataId"
        :kmVersion="recordParams.kmVersion" :kmType="recordParams.kmType" :key="auditRecordsKey" />
    </div>

    <template v-slot:footer>
      <el-button size="small" icon="el-icon-circle-close" @click.stop="auditRecordsClose">{{ $t('aicosCommon.closeBtn')
      }}</el-button>
    </template>
  </QSGDrawer>
</template>

<script>
import QSGDrawer from "@/components/QSGDrawer/index";
import AuditRecords from "./auditRecords.vue";

export default {
  name: 'kwAuditIndex',
  components: {
    QSGDrawer,
    AuditRecords,
  },
  props: {
    auditRecordsTitle: {
      type: String,
      default: '审核记录'
    },
    recordParams: {
      type: Object,
      default: () => {
        return {
          recordsData: [],
          kmDataId: '',
          kmVersion: '',
          kmType: '',
        };
      }
    },
  },

  data () {
    return {
      auditRecordsTag: false,
      auditRecordsKey: 0,
    }
  },
  methods: {
    auditRecordsOpen () {
      this.auditRecordsTag = true;
      this.auditRecordsKey++;
    },
    auditRecordsClose () {
      this.auditRecordsTag = false;
      this.recordParams = {};
    },
  }
}
</script>
<style scoped lang="scss"></style>>
