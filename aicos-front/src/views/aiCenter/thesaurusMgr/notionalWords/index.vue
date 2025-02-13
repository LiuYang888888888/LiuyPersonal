<template>
  <ThesaurusBasic v-model="curAiAppId">
    <el-row class="notionalWordsSy" :gutter="20">
      <div>
        <el-col :span="6">
          <EntityWords :applicationId="curAiAppId" :rowClick="entityWordsRowClick" @setEntityId="setEntityId" />
        </el-col>
        <el-col :span="18">
          <entityInstance :entityId="entityId" :subapplicationId="subapplicationId" />
        </el-col>
      </div>
    </el-row>
  </ThesaurusBasic>
</template>

<script>
import ThesaurusBasic from "../components/thesaurusBasic";
import EntityWords from "./entityWords";
import entityInstance from "./entityInstance";
export default {
  name: "notionalWords",
  components: {
    ThesaurusBasic,
    EntityWords,
    entityInstance,
  },
  data () {
    return {
      entityId: "",
      subapplicationId: '',
      curAiAppId: "",
    };
  },
  methods: {
    entityWordsRowClick (row) {

      this.subapplicationId = row.subapplicationId
      this.entityId = row.id;
    },
    setEntityId () {
      this.entityId = "";
    }
  },
};
</script>

<style scoped lang="scss">
.notionalWordsSy {}
</style>
