<!--

   <QSGSearchBar
    :formData="searchForm"
    :fields="listOption"
    @search="searchChange"
    @refresh="refreshChange"
    @reset="searchReset"
    ref="searchFormRef"
  >
    <template v-slot:appendTool>
      <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
    </template>
  </QSGSearchBar>

  <script>
      searchChange(params,done) {
      this.query = {
        ...params,
      };
      this.searchForm = this.query;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    searchReset() {
      this.query = {};
      this.searchForm = {};
      this.onLoad(this.page);
    },

    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },

  </script>

-->

<template>
  <div>
    <avue-form 
      ref="formRef"
      :option="formOption"
      v-model="formData"
      class="QSGSearchBar"
    >
    <template  slot="menuForm">
     <div class="QSGSearchBar-btn">
        <el-button type="primary" @click="onSubmit"><i class="el-icon-search"></i></el-button>
        <el-button type="default" @click="onReset"><i class="aicosicon aicos-icon-clear"></i></el-button>
        <slot name="appendTool"></slot>
      </div>
    </template>

    </avue-form>
  </div>
</template>

<script>
export default {
  name: 'QSGSearchBar',
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    fields: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      //formData:{},
      formOption:{
        submitBtn:false,
        emptyBtn:false,
        labelWidth: 0,
        menuSpan:24,
        menuPosition: 'right',
        column: [
        ],
      }
    }
  },
  methods: {
    onSubmit() {
      const done = ()=>{
        this.$refs.formRef.hide();
      }
      const res = {
        ...this.formData
      }

      this.$emit('search',res,done);
    },
    onReset() {
      this.reset();
      this.$emit('reset')
    },
    reset() {
      this.$refs.formRef.resetFields();
    },
    getData(){
      const res = {
        ...this.formData
      }
      return res
    },
    crudToSearchBar(){
      
      const crudColumn = this.fields.column;
      const formColumn = crudColumn.filter(item=> item.search === true);
      
      formColumn.map((item)=>{
        this.formOption.column.push( {
          ...item,
          placeholder: ((item.searchType == 'select')?this.$t('pleaseSelect'):this.$t('pleaseInput')) +' '+ item.label,
          span: 24,
          order: item.searchOrder,
          type: item.searchType,
          rules: [],
          value: null,
          display: true,
        })
      })
      
    }
  },
  mounted(){
    
  },
  created(){

    this.crudToSearchBar();

  },
}
</script>

<style lang="scss" scoped>
.QSGSearchBar {
  /deep/.avue-form__group {
    justify-content: flex-end;
  }
  /deep/.el-row:first-child {
    margin: 0;
  }
  /deep/.el-col {
    margin-bottom: 20px;
    margin-left: -10px;
    .el-input {
      max-width: 170px;
    }
    .avue-date { 
      max-width: 340px;
    }
  }
  /deep/.el-form-item__label {
    display: none;
  }
  /deep/.el-col-md-24 {
    width: auto;
  }
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 12px;
  }
  /deep/.avue-form__menu {
    padding: 0;
  }

  /deep/.el-form-item {
    margin-bottom: 0;
  }
  .QSGSearchBar-btn {
    margin-right: 0;
    margin-left: 10px;

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
