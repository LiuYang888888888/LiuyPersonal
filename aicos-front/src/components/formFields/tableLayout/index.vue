<template>
<div>
  <table class="table-layout" :style="tableStyle">
    <tr
      v-for="(row, rowIndex) in data"
      :key="rowIndex"
    >
      <td
        v-for="(col, colIndex) in row"
        :key="colIndex"
        :colspan="col.colspan"
        :rowspan="col.rowspan"
        :style="getCellStyle(col)"
      >
        <el-form-item
          v-for="(item, itemIndex) in col.children"
          :key="itemIndex"
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules"
          :class="bem('item--'+(item.labelPosition || ''))"
          :label-position="col.labelPosition || formSafe.parentOption.labelPosition"
          :label-width="formSafe.getLabelWidth(item,{})"
        >
<!--          <component :is="validTip(col)?'div':'elTooltip'"-->
<!--                     :disabled="validTip(col)"-->
<!--                     :content="vaildData(col.tip,getPlaceholder(col))"-->
<!--                     :placement="col.tipPlacement">-->

            <form-temp :column="item"
                       :ref="item.prop"
                       :dic="formSafe.DIC[item.prop]"
                       :props="formSafe.parentOption.props"
                       :propsHttp="formSafe.parentOption.propsHttp"
                       v-bind="formSafe.$uploadFun(item)"
                       :disabled="formSafe.getDisabled(item)"
                       :enter="formSafe.parentOption.enter"
                       :size="formSafe.parentOption.size"
                       v-model="formSafe.form[item.prop]"
                       @enter="formSafe.submit"
                       :column-slot="columnSlot"
                       @change="formSafe.propChange({},item)">
            </form-temp>
<!--          </component>-->
        </el-form-item>

      </td>

    </tr>
  </table>
</div>
</template>

<script>
import mixin from "./mixin";
export default {
  name: 'TableLayout',
  mixins: [mixin],
  props: {
    width: {
      type: String
    },
    borderWidth: {
      type: Number,
      default: 1
    },
    borderColor: {
      type: String,
      default: '#333'
    },
    data: {
      type: Array,
      default() {
        return [
          [
            {
              type: 'tableCell',
              colspan:1,
              rowspan: 1,
              width: '',
              height: '',
              children: []
            }
          ]
        ]
      }
    },
    column: {
      type: Object
    }
  },
  inject: ['formSafe'],
  data() {
    return {
      parentOption: {}
    }
  },
  computed: {
    tableStyle() {
      return {
        width: this.width,
        border: `${this.borderWidth}px solid ${this.borderColor}`
      }
    },
    allFields() {
      const list = [];
      this.data.flat().forEach(item=> {
        list.push(...item.children)
      })
      return list;
    },
    dynamicFields() {
      return this.allFields.filter(item=>{
        return item.type == 'dynamic' && this.formSafe.vaildDisplay(item)
      })
    }
  },
  created() {
    // this.parentOption = this.formSafe
    this.$options.components.formTemp = this.formSafe.$options.components.formTemp;
    this.handleLocalDic();
    this.handleRemoteDic();
    this.handleValidate();
  },
  // mounted() {
  //   console.log(this.column)
  //   // debugger
  // },
  methods: {
    bem(str) {
      return `avue-form__${str}`
    },
    getCellStyle(col) {
      return {
        width: col.width,
        height: col.height,
        border: `${this.borderWidth}px solid ${this.borderColor}`
      }
    },
    handleLocalDic() {
      const formSafe = this.formSafe;
      formSafe.handleSetDic(formSafe.DIC, this.loadLocalDic());
    },
    handleRemoteDic() {
      const formSafe = this.formSafe;
      this.loadDic({
        column: this.allFields
      }).then(res => formSafe.handleSetDic(formSafe.DIC, res))
    },
    handleValidate() {
      const me = this;
      const formSafe = this.formSafe;
      if(formSafe.validate.rewriteByTableLayout) {
        return
      }
      formSafe.validate =  function (callback) {
        formSafe.$refs.form.validate((valid, msg) => {
          let dynamicList = [];
          let dynamicName = [];
          let dynamicError = {};
          const allDynamicFieldsList = [
            ...this.dynamicOption,
            ...me.dynamicFields
          ];
          allDynamicFieldsList.forEach(ele => {
            let isForm = ele.children.type === 'form'
            dynamicName.push(ele.prop);
            const fieldRefList = this.$refs[ele.prop];
            let fieldRef
            if(fieldRefList) {
              fieldRef= fieldRefList[0]
            }else {
              fieldRef = me.$refs[ele.prop][0]
            }
            if (isForm) {
              if (!this.validatenull(fieldRef.$refs.temp.$refs.main)) {
                fieldRef.$refs.temp.$refs.main.forEach(ele => {
                  dynamicList.push(ele.validateCellForm());
                })
              }
            } else {
              dynamicList.push(fieldRef.$refs.temp.$refs.main.validateCellForm());
            }
          })
          Promise.all(dynamicList).then(res => {
            // let count = 0;
            res.forEach((error, index) => {
              if (!this.validatenull(error)) {
                dynamicError[dynamicName[index]] = error;
              }
            })
            let result = Object.assign(dynamicError, msg);
            if (this.validatenull(result)) {
              this.show();
              callback(true, this.hide)
            } else {
              callback(false, this.hide, result)
            }

          })
        });
      }
      formSafe.validate.rewriteByTableLayout = true;
    }

  }
}
</script>

<style lang="scss" scoped>
.table-layout {
  border-collapse: collapse;
  table-layout: fixed;

  td {
    //vertical-align: top;
    text-align: center;

    .el-form-item {
      text-align: left;
    }
  }


  /*@media print {

    .el-select,
    .el-input,
    .el-textarea,
    .el-input-number,
    .el-cascader,
    .el-upload,
    .el-switch,
    .avue-ueditor {
      display: none;
    }
  }*/
}
</style>
