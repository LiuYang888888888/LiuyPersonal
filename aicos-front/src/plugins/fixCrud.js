/**
 * 解决crud组件列的筛选问题
 */

export default {
  install (Vue) {
    Vue.mixin({
      created () {
        // if(this.$options.name == 'avue-crud') {
        if (this.$options._componentTag == 'avue-crud') {
          if(!this.option.menuAlign) {
            this.$set(this.option, 'menuAlign', 'left');
          }
          const watcher = {
            // 解决列的筛选取消时，内容没有清空
            objectOption (newVal) {
              for (let val of Object.values(newVal)) {
                if (!val.screen) {
                  if (val.screenValue) {
                    val.screenValue = ''
                  }
                }
              }
            },
            /**
             * 解决数据重新加载后，筛选内容没有清空，同时筛选列需要转换，例如：性别,在没有
             * 转换时筛选，列表会显示为空
             */
            data () {
              if (!this.objectOption) {
                return
              }
              const temp = {}
              // 先清空所有screenValue值，让所有项都显示出来
              for (let [key, val] of Object.entries(this.objectOption)) {
                if (val.screen) {
                  if (val.screenValue) {
                    temp[key] = val.screenValue
                    val.screenValue = ''
                  }
                }
              }
              this.$nextTick(() => {
                // 不能直接assign
                for (let [key, val] of Object.entries(temp)) {
                  const prop = this.objectOption[key]
                  if (prop.screen) {
                    prop.screenValue = val
                  }
                }
              })
            }
          }
          this.$watch('objectOption', watcher.objectOption)
          this.$watch('data', watcher.data)

          // 解决crud的语言问题
          if (this.$i18n.locale !== 'zh') {
            this.defaultColumn.forEach(item => {
              item.label = this.$t(`crudDialogColumn.${item.prop}`)
            })
          }
        }
        if (this.$options._componentTag === 'dialog-column') {
          // debugger
          if (this.$i18n.locale !== 'zh') {
            this.$watch('columnBox', (newVal) => {
              if (!newVal) {
                return
              }
              this.$nextTick(() => {
                const cell = this.$el.querySelector('.el-table__header-wrapper .cell')
                if (cell) {
                  cell.innerText = this.$t('crudDialogColumn.label')
                }
              })
            })
          }
        }
      }
    })
  }
}
