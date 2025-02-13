<template>
  <div class="channel-selector">
    <div class="channel-selector-left">通道设置</div>
    <div class="channel-selector-right">
      <el-tag
        v-for="(tag,index) in tags"
        :key="tag.id"
        size="medium"
        closable
        @close="handleClose(index)"
      >
        {{getChannelType(tag.type)}}：{{tag.name}}
      </el-tag>
      <el-button
        plain
        icon="el-icon-plus"
        size="mini"
        @click="openChannelDialog"
      />
      <HuilanDialog
        title="通道选择"
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
import { getChannelByProducerId } from '@/api/messageSourceMgr'
import { getList } from '@/api/messageChannelMgr'
export default {
  name: "ChannelSelect",
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
        menu: false,
        columnBtn: false,
        selection: true,
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
            label: "通道编码",
            prop: "id",
            span: 24,
            addDisplay: false,
            editDetail: true
          },
          {
            label: "通道名称",
            prop: "name",
            span: 24,
            search: true,
            searchSpan: 12
          },
          {
            label: "通道类型",
            prop: "type",
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
      channelMap: {
        shortmessage: '短信',
        mail: '邮件',
        weixin: '微信',
        third: '业务系统',
        telephone: '电话',
        qyweixin: '企业微信',
        custom: '自定义',
      }
    }
  },
  computed: {
    selectedIds() {
      const ids = this.tags.map(item=> item.id)
      return ids
    }
  },
  methods: {
    formatChannelType(row, val) {
      return this.getChannelType(val)
    },
    getChannelType(type) {
      const res = this.channelMap[type]

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
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then(res => {
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
        this.$message.error('请选择通道')
      }
      const canAdd = this.selections.filter(item=> !this.selectedIds.includes(item.id))
      this.tags.push(...canAdd)
      this.channelDialogVisible = false

    },
    handleClose(index) {
      this.tags.splice(index, 1)
    },
    getVal() {
      return this.selectedIds.join()
    },
    async getSelectedChannel() {
      const {data: {data}} = await getChannelByProducerId(this.id)
      this.tags = data.filter(item=> !!item)
    }
  },
  mounted() {
    this.getSelectedChannel()
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
