<template>
  <div class="channel-selector">
    <div class="channel-selector-left">模板设置</div>
    <div class="channel-selector-right">
      <el-tag
        v-for="(tag,index) in tags"
        :key="tag.id"
        size="medium"
        closable
        @close="handleClose(index)"
      >
        {{getTemplateType(tag.channelType)}}：{{tag.name}}
      </el-tag>
      <el-button
        plain
        icon="el-icon-plus"
        size="mini"
        @click="openChannelDialog"
      />
      <HuilanDialog
        title="模板选择"
        append-to-body
        :visible.sync="channelDialogVisible"
        width="900px"
      >
        <avue-crud
          v-if="channelDialogVisible"
          :option="option"
          :search.sync="query"
          :table-loading="loading"
          :data="data"
          ref="crud"
          v-model="form"
          :page.sync="page"
          @selection-change="selectionChange"
          @search-change="searchChange"
          @search-reset="searchReset"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad">
<!--          <template slot-scope="scope" slot="menu">-->
<!--            <el-button-->
<!--              type="text"-->
<!--              icon="el-icon-setting"-->
<!--              size="small"-->
<!--              @click.stop="onLoad(scope.row,scope.index)"-->
<!--            >选择-->
<!--            </el-button>-->
<!--          </template>-->
        </avue-crud>
        <template #footer>
          <el-button
            type="primary"
            size="small"
            @click.stop="okhandle"
          >确定
          </el-button>
          <el-button
            type="default"
            size="small"
            @click.stop="channelDialogVisible = false"
          >取消
          </el-button>
        </template>
      </HuilanDialog>
    </div>
  </div>
</template>

<script>
import { getTemplateByProducerId } from '@/api/messageSourceMgr'
import { getList } from '@/api/messageTemplateMgr'
export default {
  name: "TemplateSelect",
  props: {
    id: String
  },
  data() {
    return {
      channelDialogVisible: false,
      form: {},
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        selection: true,
        menu: false,
        columnBtn: false,
        // 操作按钮
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 80,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "模板编码",
            prop: "id",
            span: 24,
            addDisplay: false,
            editDetail: true
          },
          {
            label: "模板名称",
            prop: "name",
            span: 24,
            search: true,
            searchSpan: 12
          },
          {
            label: "模板类型",
            prop: "channelType",
            span: 24,
            formatter: this.formatChannelType
          },
          {
            label: "状态",
            prop: "status",
            span: 24,
            type: "switch",
            dicData: [
              {
                label: "停用",
                value: '0'
              },
              {
                label: "启用",
                value: '1'
              }
            ],
            value: '1',
          }
        ]
      },
      selections: [],
      tags: [],
      templateMap: {
        universal: '通用',
        shortmessage: '短信',
        mail: '邮件',
        weixin: '微信',
        third: '业务系统',
      }
    }
  },
  computed: {
    selectedIds() {
      const ids = this.tags.map(item=> item.id)
      return ids.join()
    }
  },
  methods: {
    formatChannelType(row, val) {
      return this.getTemplateType(val)
    },
    getTemplateType(type) {
      const res = this.templateMap[type]

      return res || '未知类型'
    },
    openChannelDialog() {
      this.channelDialogVisible = true
    },
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const pageConf = {
        current: page.currentPage,
        size: page.pageSize
      };
      const query = {
        ...this.query,
        status: '1'
      }
      this.loading = true;
      getList(Object.assign(params, query, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    selectionChange(rows) {
      this.selections = rows
    },
    okhandle() {
      if(this.selections.length == 0) {
        this.$message.error('请选择模板')
      }
      const canAdd = this.selections.filter(item=> !this.selectedIds.includes(item.id))
      this.tags.push(...canAdd)
      this.channelDialogVisible = false

    },
    handleClose(index) {
      this.tags.splice(index, 1)
    },
    getVal() {
      return this.selectedIds
    },
    async getSelectedTemplate() {
      const {data: {data}} = await getTemplateByProducerId(this.id)
      this.tags = data.filter(item=> !!item)
    }
  },
  mounted() {
    this.getSelectedTemplate()
  }
}
</script>

<style lang="scss" scoped>
.channel-selector {
  display: flex;
  min-height: 100px;

  .channel-selector-left {
    width: 80px;
    padding-right: 5px;
    text-align: right;
  }
  .channel-selector-right {
    flex: 1;
    padding: 5px;
    border: 1px solid #EBEEF5;

    /deep/ {
      .el-tag {
        margin: 5px;
      }
    }
  }
}
</style>
