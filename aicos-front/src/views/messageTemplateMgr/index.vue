<template>
  <HuilanBasic>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="通用模板" name="first">
        <UniversalTemplate />
      </el-tab-pane>
      <el-tab-pane label="邮件模板" name="second" lazy>
        <EmailTemplate />
      </el-tab-pane>
      <el-tab-pane label="短信模板" name="third" lazy>
        <ShortmessageTemplate />
      </el-tab-pane>
      <el-tab-pane label="微信模板" name="fourth" lazy>
        <div style="text-align: right">
          <HuilanBasicToolbar style="margin-top: 0">
            <el-button size="small" type="primary" @click="openSelctDialog"
              >同步指定公众号模板</el-button
            >
            <el-button size="small" type="primary" plain @click="syncWeixinTpl"
              >同步所有公众号模板</el-button
            >
          </HuilanBasicToolbar>
          <!-- <el-button size="small" type="primary" @click="openSelctDialog"
            >同步指定公众号模板</el-button
          >
          <el-button size="small" type="primary" plain @click="syncWeixinTpl"
            >同步所有公众号模板</el-button
          > -->
          <HuilanDialog
            title="公众号选择"
            append-to-body
            :visible.sync="selectDialogVisible"
            width="800px"
          >
            <WeixinChannel
              v-if="selectDialogVisible"
              :selectionChange="selectionChange"
            />
            <template #footer>
              <el-button type="primary" size="small" @click="okHandle"
                >确定</el-button
              >
              <el-button
                type="default"
                size="small"
                @click="selectDialogVisible = false"
                >取消</el-button
              >
            </template>
          </HuilanDialog>
        </div>
        <WeixinTemplate ref="weixinTpl" />
      </el-tab-pane>
      <el-tab-pane label="业务系统模板" name="five" lazy>
        <ThirdTemplate />
      </el-tab-pane>
    </el-tabs>
  </HuilanBasic>
</template>

<script>
import UniversalTemplate from "./universalTemplate";
import EmailTemplate from "./emailTemplate";
import ShortmessageTemplate from "./shortmessageTemplate";
import WeixinTemplate from "./weixinTemplate";
import ThirdTemplate from "./thirdTemplate";
import {
  syncWeixinTemplate,
  syncWeixinTemplateByChannelId,
} from "@/api/messageTemplateMgr";
import WeixinChannel from "./components/weixinChannel";
export default {
  name: "index",
  components: {
    UniversalTemplate,
    EmailTemplate,
    ShortmessageTemplate,
    WeixinTemplate,
    ThirdTemplate,
    WeixinChannel,
  },
  data() {
    return {
      activeTab: "first",
      selectDialogVisible: false,
      selections: [],
    };
  },
  methods: {
    openSelctDialog() {
      this.selectDialogVisible = true;
    },
    selectionChange(rows) {
      this.selections = rows;
    },
    async okHandle() {
      if (this.selections.length == 0) {
        this.$message.error("请选择公众号!");
      }
      const ids = this.selections.map((item) => item.id);
      await syncWeixinTemplateByChannelId(ids.join());
      this.$message.success("同步成功");
      this.$refs.weixinTpl.$refs.baseTpl.refreshChange();
      this.selectDialogVisible = false;
    },
    async syncWeixinTpl() {
      const {
        data: { data },
      } = await syncWeixinTemplate();

      this.$message.success({
        dangerouslyUseHTMLString: true,
        message: `<pre style="margin: 0">${data}</pre>`,
      });
      this.$refs.weixinTpl.$refs.baseTpl.refreshChange();
    },
  },
};
</script>

<style scoped></style>
