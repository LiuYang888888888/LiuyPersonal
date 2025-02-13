<template>
  <div>
    <avue-crud
      :option="option"
      :data="data"
      :permission="permissionList"
      ref="crudTemplateTable"
      :page.sync="page"
      :table-loading="loading"
      @on-load="onLoad"
      @select="checkboxIsChange"
      @select-all="checkboxIsAllChange"
    >
      <template slot="header">
        <div class="kw-header">
          <div id="kw-form-container">
            <!-- 训练状态 -->
            <el-select
              v-model="intentionStatus"
              clearable
              :placeholder="$t('kwIntentionManage.intentionStatus')"
              class="kw-form-type"
            >
              <el-option>未训练</el-option>
            </el-select>
            <!-- 意图名称 -->
            <el-input
              :placeholder="$t('kwIntentionManage.intentionName')"
              v-model="intentionName"
              clearable
              class="kw-form-type"
            >
            </el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              class="kw-search-btn"
              @click="handlerSearch"
            ></el-button>
            <el-button class="kw-reset-btn" @click="handlerReset"
              ><i class="aicosicon aicos-icon-clear"></i
            ></el-button>
          </div>
        </div>
      </template>

      <template slot-scope="scope" slot="menu">
        <!-- 编辑 -->
        <el-button
          type="text"
          size="small"
          @click.stop="handlerEdit(scope.row, scope.index)"
          >{{ $t("aicosCommon.editBtn") }}</el-button
        >
        <!-- 添加意图 -->
        <el-button
          type="text"
          size="small"
          @click.stop="handlerAddIntention(scope.row, scope.index)"
          >{{ $t("kwIntentionManage.addIntention") }}</el-button
        >
        <!-- 删除 -->
        <el-button
          type="text"
          size="small"
          class="kw-del-btn"
          @click.stop="handlerDel(scope.row, scope.index)"
          >{{ $t("aicosCommon.delBtn") }}</el-button
        >
      </template>
    </avue-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      option: {
        menu: false,
        tip: false,
        selection: true,
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
            label: this.$t("kwIntentionManage.aiRecommend"), //智能问法推荐
            prop: "name",
          },
          {
            label: this.$t("kwIntentionManage.origin"), //来源库
            prop: "type",
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}
</style>
