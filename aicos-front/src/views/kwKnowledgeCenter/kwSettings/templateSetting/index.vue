<template>
  <div class="kw-base-container" style="background: #f8f9fa;padding: 20px!important;">
    <div class="kw-header">
      <!-- 新建模板 -->
      <div class="kw-button-container">
        <el-button
          v-if="permission['template_setting_save']"
          class="kw-build-button kw-btn-green"
          @click.stop="addTemplateBtn"
        >{{ $t("kwTemplateSetting.addTemplate") }}</el-button>
      </div>
      <div id="kw-form-container">
        <div class="kw-form-form">
          <el-select size="small" v-model="templateType" :placeholder="$t('kwTemplateSetting.templateTypeTip')" clearable>
            <el-option :label="$t('kwTemplateSetting.faq')" value="1"></el-option>
            <el-option :label="$t('kwTemplateSetting.dialogueProcess')" value="2"></el-option>
          </el-select>
        </div>
        <div class="kw-form-form" style="margin-left: 10px">
          <el-input
            :placeholder="$t('kwTemplateSetting.templateNameTip')"
            v-model="templateName"
            size="small"
            clearable
            class="kw-form-type"
          >
          </el-input>
        </div>
        <div class="kw-form-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            class="kw-search-btn"
            @click="handlerSearch"
            size="small"
          ></el-button>
          <el-button
            icon="el-icon-refresh"
            class="kw-reset-btn"
            @click="handlerReset"
            size="small"
          ></el-button>
        </div>
      </div>
    </div>
    <div class="template-container">
      <el-row
        :gutter="20"
        style="background: none"
        v-show="data.length > 0"
      >
        <el-col
          :span="6"
          v-for="(item, index) in data"
          :key="index"
          style="margin-bottom: 20px"
        >
          <div class="card-container">
            <div class="card-top">
              <el-image
                fit="scale-down"
                :src="item.tenantId ? src+JSON.parse(item.templatePicture).filePath.substring(1) : baseURL + JSON.parse(item.templatePicture).filePath"
              ></el-image>
              <div class="card-type-btn">
                <span class="templateSetting-type">{{item.templateType=='1'?$t('kwTemplateSetting.faq'):$t('kwTemplateSetting.dialogueProcess')}}</span>
                <div class="templateSetting-btn">
                  <el-button v-if="permission['template_setting_delete']"  size="small" icon="el-icon-delete" circle @click="deleteTemplateBtn(item.id)"></el-button>
                  <el-button v-if="permission['template_setting_update']"  size="small" icon="el-icon-edit" circle @click="editTemplateBtn(item.id)"></el-button>
                </div>
              </div>
            </div>
            <div class="card-bottom">
              <span class="templateSetting-name">{{item.templateName}}</span>
              <span class="templateSetting-time">{{item.createTime}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="data.length == 0" class="tempSet-noData" >
        <avue-empty></avue-empty>
      </div>
<!--      <div class="noData" v-show="data.length == 0">-->
<!--        <img src="./image/empty.png" alt="" />-->
<!--        <el-empty-->
<!--          description="描述"-->
<!--          image="./image/empty.png"-->
<!--          style="z-index: 999"-->
<!--        ></el-empty>-->
<!--      </div>-->
    </div>
    <div class="page-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="prev"
        @next-click="next"
        page-size="8"
        layout="total,prev, pager, next,jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>
    <!--添加模板-->
    <HuilanDialog
      :title="addOrEdit=='add'?$t('kwTemplateSetting.addTemplate'):$t('kwTemplateSetting.editTemplate')"
      append-to-body
      :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="templateDialogVisible"
      width="640px"
    >
      <AddTemplate
        ref="addTemplateRef"
        :addOrEdit="addOrEdit"
        v-if="templateDialogVisible"
        :templateId="templateId"
        @closeTemplateDialog="closeTemplateDialog"
      />
      <template v-slot:footer>
        <el-button size="small" @click="cancelTemplateDialog">{{
            $t("aicosCommon.cancelBtn")
          }}</el-button>
        <el-button size="small" type="primary" @click="addTemplateDialog">{{
            $t("aicosCommon.saveBtn")
          }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import { baseURL } from "@/api/common";
import AddTemplate from './addTemplate'
import { mapGetters } from "vuex";
import {
  showTemplateList,
  deleteTemplate,
} from "@/api/kwKnowledgeCenter/kwSettings/templateSetting/index";
export default {
  data() {
    return {
      baseURL: baseURL,
      addOrEdit: 'add',
      isShow: false,
      businessData: [],
      data: [],
      businessType: "",
      robotInstanceType: "manageList",
      isCloseOnClickModal: false,
      templateDialogVisible: false,
      templateId: '',
      templateType: '',
      templateName: "",
      src: '',
      page: {
        current: 1,
        size: 8,
        total: 0,
      },
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["permission"]),
  },
  components: {
    AddTemplate
  },
  async mounted() {
    this.src = baseURL;
    this.getTemplateList()
  },
  methods: {
    //获取列表信息
    async getTemplateList() {
      const info = {
        size: this.page.size, //每页几条
        current: this.page.current, //第几页开始
        templateName: this.templateName, //名字
        templateType: this.templateType == ''?this.templateType: parseInt(this.templateType), //业务类型
      };
      const result = await showTemplateList(info.current,info.size,info.templateName,info.templateType);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.data = Data.records;
        this.page.total = Data.total;
        if (Data.total > 0) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
        if (this.data.length == 0 && this.page.current != 1) {
          this.page.current = this.page.current - 1;
          this.getTemplateList();
        }
      }
    },

    // 关闭模板弹框
    cancelTemplateDialog() {
      this.addOrEdit = 'add'
      this.isCloseOnClickModal = false;
      this.templateDialogVisible = false;
    },

    // 保存模板
    addTemplateDialog() {
      this.$refs.addTemplateRef.submitTemplate()
    },

    //关闭模板弹框
    closeTemplateDialog() {
      this.addOrEdit = 'add'
      this.isCloseOnClickModal = false;
      this.templateDialogVisible = false;
      this.getTemplateList()
    },

    //新增模板
    addTemplateBtn() {
      this.templateId = ''
      this.addOrEdit = 'add'
      this.templateDialogVisible = true
    },

    //编辑模板
    editTemplateBtn(id) {
      this.templateId = id
      this.addOrEdit = 'edit'
      this.templateDialogVisible = true
    },

    //删除模板
    deleteTemplateBtn(id) {
      this.$confirm(this.$t("kwTemplateSetting.delTip"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const result = await deleteTemplate(id);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
            this.getTemplateList();
          }
        })
        .catch(() => {});
    },

    //查询
    handlerSearch() {
      this.getTemplateList();
    },

    //重置
    handlerReset() {
      this.templateName = "";
      this.templateType = "";
      this.getTemplateList();
    },

    //分页相关
    handleSizeChange(size) {
      this.page.size = size;
      this.getTemplateList();
    },
    handleCurrentChange(current) {
      this.page.current = current;
      this.getTemplateList();
    },
    prev(current) {
      this.page.current = current;
      this.getTemplateList();
    },
    next(current) {
      this.page.current = current;
      this.getTemplateList();
    },
  }
}
</script>
<style lang="scss" scoped>
.template-container {
  height: calc(100% - 140px);
//overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  .noData {
    font-size: 42px;
    font-weight: 700;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -50px;
    transform: translateX(-84px);
  }
  .card-container:hover {
    .templateSetting-type {
      background-color: rgba(2,79,255,0.8) !important;
    }
    .templateSetting-btn {
      display: inline-block !important;
      position: absolute;
      right: 20px;
      top: 10px;
      /deep/ button {
        border: none;
        background-color: transparent;
      }
    }
    .card-type-btn {
      background: linear-gradient(to bottom, #474747, transparent) !important;
    }
  }
  .card-container {
    cursor: pointer;
    height: 260px;
    background: rgb(246, 248, 252);
    border-radius: 25px;
    border-width: 1px;
    border-color: rgb(241, 244, 250);
    border-style: solid;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-bottom: 10px;
    .card-top {
      position: relative;
      width: 100%;
      height: 215px;
      background: rgb(246, 248, 252);
      border-radius: 25px 25px 0 0;
      /deep/ .el-image {
        width: 100%;
        height: 215px;
      }
      .card-type-btn {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 65px;
        border-radius: 10px 10px 0 0;
        .templateSetting-type {
          position: absolute;
          width: 75px;
          height: 25px;
          display: inline-block;
          left: 20px;
          top: 10px;
          font-size: 14px;
          background-color: rgba(98,98,100,0.8);
          color: #fff;
          border-radius: 5px;
          text-align: center;
          line-height: 25px;
        }
        .templateSetting-btn {
          display: none;
          position: absolute;
          right: 20px;
          top: 10px;
          /deep/ button {
            border: none;
            background-color: transparent;
            color: #fff !important;
          }
        }
      }
    }
    .card-bottom {
      width: 100%;
      background: rgb(246, 248, 252);
      padding: 0 20px;
      border-radius: 0 0 25px 25px;
      /deep/ .el-row {
        background: rgb(246, 248, 252);
      }
      .templateSetting-name {
        text-align: left;
        font-size: 20px;
        font-family: "SourceHanSansCN";
        color: rgb(7, 11, 45);
        line-height: 1.8;
        z-index: 43;
      }
      .templateSetting-time {
        float: right;
        font-size: 14px;
        font-family: "SourceHanSansCN";
        color: rgb(86, 88, 99);
        line-height: 2.571;
        z-index: 44;
      }
    }

  }
}
.page-container {
  text-align: end;
}
.tempSet-noData {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
