<template>
  <div class="newCss">
    <!-- <div class="menuTitle">表单：{{data.name}}</div> -->
    <avue-crud 
      :option="listOption" 
      :table-loading="loading" 
      :data="listData" 
      ref="listRef" 
      v-model="listForm" 
      :permission="permissionList" 
      :before-open="beforeOpen" 
      :before-close="beforeClose" 
      @row-del="rowDel" 
      @row-update="rowUpdate" 
      @row-save="rowSave"  
      @on-load="onLoad"
      @row-click="crudRowClick"
      >
      <template slot-scope="{row,index}" slot="menu">
        <el-button
          type="text"
          v-if="!(row.id && !row.enabled) && (!row.isBuiltin)"
          size="small"
          :icon="((row.$cellEdit)?'el-icon-circle-plus-outline':'el-icon-edit')"
          @click.stop="rowCell(row,index)"
          >{{row.$cellEdit?'保 存':'编 辑'}}</el-button>
        <el-button 
          v-if="row.$cellEdit && (!row.isBuiltin)"
          type="text"
          icon="el-icon-circle-close"
          size="small"
          @click.stop="rowCancel(row,index)"
        >取 消</el-button>
      </template>
    </avue-crud>
  </div>
</template>
<script>
//import { mapGetters } from "vuex";
//import { getRules } from "@/util/regx";

//import { baseURL } from '@/api/common';
//import serviceList from "@/config/serviceList";

import {
  customFormList,
  //customFormAdd,
  customFormUpdate,
  //customFormDel,
} from "@/api/system/commonFormSet";

export default {
  name: 'comFormSetForm',
  components: {

  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data() {
    return {

      loading: true,
      page: {
        "layout": '',
      },

      listForm: {},
      selectionList: [],
      activeType: {},
      query: {},
      listData: [],
      listOption: {
        tip: false,
        calcHeight: 65,
        searchShow: false,
        searchIndex: 1,
        searchClearable: false,

        dialogWidth: 800,
        index: false,
        selection: false,

        menuWidth: 150,
        menuAlign: 'center',
        menuFixed: 'right',
        dialogClickModal: false,
        //saveBtn: false,
        updateBtn: false,
        span: 24,

        border: true,
        stripe: false,
        searchIcon: true,
        searchSpan: 4,
        searchMenuSpan: 3,
        searchMenuPosition: "right",
        dialogMenuPosition: "right",

        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        addRowBtn: false,
        cellBtn: false,
        cancelBtn: false,

        column: [
          {
            label: '表单页类型',
            prop: 'type',
            width: 120,
            type: 'select',
            dicData: [
              { label: '匿名录入', value: 1 },
              { label: '数据管理', value: 2 },
              { label: '新增', value: 3 },
              { label: '编辑 | 审核', value: 4 },
              { label: '查看', value: 5 },
            ],
            value: 1,
          },
          {
            label: '表单页地址',
            prop: 'value',
            cell: true,
            maxlength: 200,
            showWordLimit: true,
            rules: [
            //...getRules(['onlyNumber'])
            ]
          },
        ],

      },
      nowEditRow: {},
      nowEditRowIndex: 0,
    }
  },
  computed: {

  },
  methods: {

    async crudRowClick(row, /*event, column*/ ) {

      this.getRowEdit();

      if (this.nowEditRow.$cellEdit) {
        //console.log('有在编辑的行');
        if (row.$index == this.nowEditRow.$index) {
          //console.log('点击了正在编辑的行');
          return false;
        } else {
          await this.$refs.listRef.rowCellUpdate(this.nowEditRow, this.nowEditRowIndex);
        }

      } else {
        this.$refs.listRef.rowCellEdit(row, row.$index);
      }

    },

    getRowEdit() {
      this.listData.map(item => {
        if (item.$cellEdit) {
          this.nowEditRow = item;
          this.nowEditRowIndex = item.$index;
        }
      })
    },
    async rowCell(row, index) {
      //console.log('点击右侧编辑按钮');

      this.getRowEdit();

      if (this.nowEditRow.$cellEdit) {
        //console.log('有在编辑的行');
        await this.$refs.listRef.rowCellUpdate(this.nowEditRow, this.nowEditRowIndex);

      } else {

        this.$refs.listRef.rowCell(row, index);
      }

    },
    rowCancel(row, index) {
      this.$refs.listRef.rowCancel(row, index);
      this.nowEditRow = {};
      this.nowEditRowIndex = 0;
    },

    /*rowSave(row, done, loading) {
      
      //console.log(row);
      const dataParam = {
        templateId:this.data.id,
        ...row
      }
      
      customFormAdd(dataParam).then(() => {
        //this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
          });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },*/

    async rowUpdate(row, index, done, loading) {
      //console.log(row);
      /*const dataParam = {
        templateId:this.data.id,
        ...row
      }*/
      await customFormUpdate(row).then(() => {
        //this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },

    /*rowDel(row) {
      //console.log(row);

      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return  customFormDel([row.id]);
      }).then(() => {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.refreshChange();
      })
    },*/

    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    selectionChange(list) {
      this.selectionList = list;
    },

    selectionClear() {
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },

    beforeOpen(done, type) {

      if (["add", "edit", "view"].includes(type)) {
        this.initData(type);
      }
      done();
    },
    beforeClose(done, /*type*/ ) {
      this.refreshChange();
      done();
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    initData( /*type*/ ) {
      //console.log(type);
    },

    onLoad(/*page, params = {}*/) {
      this.loading = true;
      const dataParam = {
        templateId: this.data.id,
      }
      customFormList(dataParam).then(res => {
        const dataRes = res.data.data;
        this.listData = dataRes;
        this.loading = false;
        this.selectionClear();
      });
    },

  },
  mounted() {

  },
  watch: {

  }
}

</script>
<style lang="scss" scoped>
.newCss {
  position: relative;
  height: 100%;

  .menuTitle {
    position: absolute;
    top: 30px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }

  /deep/.avue-crud__search .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.avue-crud__search .avue-form__menu {
    width: 240px;
  }

  /deep/.el-card__body .avue-crud__menu {
    justify-content: flex-end;
  }

  .com_form_set {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-height: 875px;
    background-color: #fff;
    z-index: 4;
  }

  /deep/.comFormSlide-enter-active,
  /deep/.comFormSlide-leave-active {
    transition: transform .5s;
  }

  /deep/.comFormSlide-enter,
  /deep/.comFormSlide-leave-to {
    transform: translateX(100%);
  }

  /deep/.el-card__body .el-form .el-table__body td .el-switch__label {
    display: none;
  }

  /deep/.el-card__body .el-form .el-table__body td .avue-input-number {
    max-width: 220px;
  }

  /deep/.set_enabledrow {
    background-color: #F2F6FC !important;
    cursor: not-allowed;
  }

  /deep/.set_enabledrow.hover-row td {
    background-color: initial !important;
  }

  /deep/.set_initrow {
    background-color: #EBEEF5 !important;
    cursor: not-allowed;
  }

  /deep/.set_initrow.hover-row td {
    background-color: initial !important;
  }

}

</style>
