<template>
<!--  <div>-->
<!--    <p class="field-setting-tip">将鼠标移动到字段上进行配置</p>-->
<!--    <el-form size="small">-->
<!--      <FieldSettingItem v-for="field in allFields" :key="field.name" :data="field" :type="fieldSetting[field.name]" @change="handdleChange">-->
<!--      </FieldSettingItem>-->
<!--    </el-form>-->
<!--  </div>-->
  <el-table
    :data="allFields"
    size="small"
    style="width: 100%">
    <el-table-column
      prop="displayName"
      label="字段名称"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="操作权限"
      width="270">
      <template slot-scope="scope">
        <el-radio-group v-if="!scope.row.isGroup" v-model="fieldSetting[scope.row.name.startsWith('column_') ? scope.row.columnId: scope.row.name]">
          <el-radio v-if="scope.row.type === ''" label="edit">可编辑</el-radio>
          <el-radio label="visible">仅可见</el-radio>
          <el-radio label="hidden">隐藏</el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import FieldSettingItem from "./fieldSettingItem";
export default {
  name: 'FieldSetting',
  // components: {
  //   FieldSettingItem
  // },
  props: {
    allFields: {
      type: Array
    },
    fieldSetting: {
      type: Object
    }
  },
  methods: {
    // handdleChange(val, field) {
    //   //
    //   // this.fieldSetting[field] = val
    // }
  },
  watch: {
    fieldSetting: {
      handler() {
        // 对于未设置的字段设置默认值
        this.allFields.forEach(item => {
          let name = item.name
          if(name.startsWith('column_')) {
            name = item.columnId
          }

          if(!item.isGroup && !this.fieldSetting[name]) {
            let val = 'edit'
            if(item.type) {
              val = 'visible'
            }
            // this.fieldSetting[item.name] = val

            this.$set(this.fieldSetting, name, val)
          }
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.field-setting-tip {
  margin: 0;
  padding: 5px 0 10px;
  color: #8a979e;
  font-size: 12px;
}
</style>
