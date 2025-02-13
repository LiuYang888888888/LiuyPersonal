<template>
  <div style="padding: 10px 0">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-form-item label="表单" prop="formName">
        <el-input v-model="form.formName">
          <el-button slot="append" icon="el-icon-search" @click="showFormList"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-dialog
      title="表单选择"
      v-loading="loading"
      :visible.sync="formDialogVisible"
      append-to-body
      width="800px"
    >
      <el-table
        size="small"
        :data="formList"
      >
        <el-table-column prop="name" label="表单名称"/>
        <el-table-column prop="version" label="版本"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="selectForm(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--        style="margin-top: 15px;"-->
<!--        background-->
<!--        :page-sizes="[10, 20, 30, 40, 50, 100]"-->
<!--        :page-size="page.pageSize"-->
<!--        layout="->, total, sizes, prev, pager, next, jumper"-->
<!--        :total="page.total"-->
<!--        :current-page="page.currentPage"-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--      >-->
<!--      </el-pagination>-->
    </el-dialog>
  </div>
</template>

<script>
import {getByMaxFormTemplateVersion} from '@/api/system/form'
export default {
  name: 'SelectPublishedForm',
  data() {
    return {
      form: {
        formName: ''
      },
      rules: {
        formName: [
          {required: true, message: '请选择表单'}
        ]
      },
      formDialogVisible: true,
      formList: [],
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  methods: {
    showFormList() {
      this.formDialogVisible = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.loadFormData()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.loadFormData()
    },
    selectForm(row) {
      var newVal = `${row.name}(版本：${row.version})`
      if(newVal !== this.form.formName) {
        this.form.formName = newVal
        // this.form.formId = row.id
        // this.form.formTemplateJson = JSON.parse(row.formTemplateJson)
        // this.form.formFieldList = JSON.parse(row.formTemplateFlatJson)
        const data = {
          formId: row.id,
          formTemplateJson: JSON.parse(row.formTemplateJson),
          formTemplateFlatJson: JSON.parse(row.formTemplateFlatJson)
        }
        this.$emit('change', data)
      }
      this.formDialogVisible = false
    },
    loadFormData(params = {}) {
      const pageConf = {
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      this.loading = true;
      getByMaxFormTemplateVersion(Object.assign(params, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.formList = data;
        // this.page.total = data.total;
      });
    }
  },
  mounted() {
    this.loadFormData()
  }
}
</script>

<style scoped>

</style>
