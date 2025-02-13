<template>
  <HuilanBasic>
    <!-- <ThesaurusBasic v-model="curAiAppId"> -->
    <el-row :gutter="30">
      <el-col :span="8">
        <EntityWords :applicationId="curAiAppId" :rowClick="entityWordsRowClick" />
      </el-col>
      <el-col :span="16">
        <entityInstance :entityId="entityId" />
      </el-col>
    </el-row>
    <!-- </ThesaurusBasic> -->
  </HuilanBasic>
</template>

<script>
import ThesaurusBasic from "../components/thesaurusBasic";
import EntityWords from "./entityWords";
import entityInstance from "./entityInstance";
export default {
  name: "plug",
  components: {
    ThesaurusBasic,
    EntityWords,
    entityInstance,
  },
  data() {
    return {
      entityId: "",
      // curAiAppId: "",
    };
  },
  methods: {
    entityWordsRowClick(row) {
      this.entityId = row.id;
    },
  },
};
</script>

<style scoped></style>
