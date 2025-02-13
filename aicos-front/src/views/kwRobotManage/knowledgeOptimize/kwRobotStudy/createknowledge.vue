<template>
  <div>
    {{ $t('knowledgeTest.knowledgeType') }}:
    <el-select v-model="value" :placeholder="$t('aicosCommon.pleaseSelect')" size="small">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      options: [
        {
          label: this.$t('kwAudit.fqaKnowledge'),
          value: 'faq'
        },
        {
          label: this.$t('kwAudit.tableKnowledge'),
          value: 'table'
        },
        {
          label: this.$t('kwAudit.userIntent'),
          value: 'intention'
        },
        {
          label: this.$t('kwAudit.chattingKnowledge'),
          value: 'chat'
        }
      ]
    };
  },

  mounted () { },

  methods: {},
};
</script>
