<template>
  <HuilanBasicToolbar>
    <el-form
      ref="form"
      :inline="true"
      size="small"
      :model="model"
      class="Huilan-basic-search-form"
    >
      <el-form-item
        v-for="field in fields"
        :key="field.prop"
        :prop="field.prop"
      >
        <el-select
          v-if="field.type === 'select'"
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
          clearable
        >
          <el-option
            v-for="opt in field.dicData"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-model="model[field.prop]"
          type="date"
          :format="field.format"
          :value-format="field.valueFormat"
          :placeholder="field.placeholder"
          v-else-if="field.type === 'date'"
        >
        </el-date-picker>
        <el-date-picker
          v-model="model[field.prop]"
          type="datetimerange"
          :format="field.format"
          :value-format="field.valueFormat"
          :placeholder="field.placeholder"
          :start-placeholder="field.startPlaceholder"
          :end-placeholder="field.endPlaceholder"
          :default-time="['00:00:00', '23:59:59']"
          v-else-if="field.type === 'datetimerange'"
        >
        </el-date-picker>
        <template v-else-if="field.slot">
          <slot :name="field.prop" :field="field"></slot>
        </template>
        <el-input
          v-else
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
        />
      </el-form-item>
      <el-form-item class="search-from-tool">
        <el-button type="primary" @click="onSubmit"
          ><i class="el-icon-search"></i
        ></el-button>
        <el-button type="default" @click="onReset"
          ><i class="aicosicon aicos-icon-clear"></i
        ></el-button>
        <!--      <el-button type="default" @click="onRefresh"><i class="el-icon-refresh"></i></el-button>-->
        <slot name="appendTool"></slot>
      </el-form-item>
    </el-form>
  </HuilanBasicToolbar>
</template>

<script>
export default {
  name: "HuilanBasicSearchbar",
  props: {
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    onSubmit() {
      this.$emit("search");
    },
    onRefresh() {
      this.$emit("refresh");
    },
    onReset() {
      this.reset();
      this.$emit("reset");
    },
    reset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.Huilan-basic-search-form {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  .search-from-tool {
    margin-right: 0;

    /deep/.el-form-item__content {
      line-height: 1px;
    }

    /deep/.el-button--small {
      padding: 5px;

      i {
        font-size: 20px;
      }
    }
  }
}
</style>
