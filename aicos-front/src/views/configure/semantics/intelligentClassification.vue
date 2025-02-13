<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <div class="box">
        <el-scrollbar>
          <basic-container>
            <avue-tree placeholder="" ref="menuTree" :option="treeOption" :data="treeData" @node-click="nodeClick"
              :before-open="beforeOpen">
              <template slot="addBtn">
                <el-button type="primary" size="mini" @click="add">添加</el-button>
              </template>
            </avue-tree>
          </basic-container>
        </el-scrollbar>
      </div>
    </template>
    <QSGDrawer :title="dataInTitle" :fullscreen="false" :size="600" append-to-body
      :visible.sync="intelligentClassificationVisible" :wrapperClosable="false" :before-close="beforeClose">
      <avue-form :option="option" ref="form" v-model="form" :upload-preview="uploadPreview" @submit="submit">
      </avue-form>
      <template v-slot:footer>
        <el-button size="small" type="primary" @click.stop="formSave">确 定</el-button>
        <el-button size="small" @click.stop="formClose">取 消</el-button>
      </template>
    </QSGDrawer>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="模型介绍" name="modelIntroduction">
        <ModelIntroduction></ModelIntroduction>
      </el-tab-pane>
      <el-tab-pane label="分类管理" name="classificationManage">

      </el-tab-pane>
      <el-tab-pane label="模型训练" name="modelTraining">

      </el-tab-pane>
    </el-tabs>
  </HuilanBasic>
</template>

<script>
import QSGDrawer from "@/components/QSGDrawer/index";
import ModelIntroduction from "./modelIntroduction";
import { save, list } from "@/api/configure/intelligentClassification";

export default {
  name: "intelligentClassification",
  components: {
    QSGDrawer,
    ModelIntroduction,
  },
  data() {
    return {
      dataInTitle: '智能分类',
      intelligentClassificationVisible: false,
      activeName: 'modelIntroduction',
      treeData: [
      ],
      option: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 90,
        updateBtnIcon: ' ',
        cancelBtnIcon: ' ',
        saveBtnIcon: ' ',
        addBtnIcon: ' ',
        column: [
          {
            label: '分类名称',
            prop: "name",
            span: 24,
            rules: [
              {
                required: true,
                message: '请输入分类名称',
                trigger: "blur",
              },
              {
                min: 2,
                max: 100,
                message: "长度在 1 到 100 个字符",
                trigger: "blur",
              },
            ],
          },
          {
            label: '分类描述',
            prop: "introduce",
            type: 'textarea',
            row: 3,
            span: 24,
            rules: [
              {
                required: true,
                message: '请输入分类描述',
                trigger: "blur",
              },
              {
                min: 2,
                max: 500,
                message: "长度在 1 到 500 个字符",
                trigger: "blur",
              },
            ],
          },
        ]
      }
    };
  },

  watch: {

  },
  computed: {

  },
  mounted() {
    list({}).then(res => {
      const data = res.data.data
      data.map(item => {
        item.label = item.name
        item.id = item.id
      })
      this.treeData = data
    })
  },
  methods: {
    beforeOpen(type) {
      debugger
      console.log(type)
    },
    add() {
      this.intelligentClassificationVisible = true
    },
    formSave() {
      this.$refs.form.submit()
    },
    submit(data, done) {
      save(data).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.intelligentClassificationVisible = false
        }
      })
      done()
    },
    formClose() {
      this.$refs.form.resetForm()
      this.intelligentClassificationVisible = false
    },
    beforeClose(){
      this.$refs.form.resetForm()
    }
  },
};
</script>

<style scope lang="scss"></style>
