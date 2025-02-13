<template>
    <div>
      <p style="color: #909399">按组优先级降序，并结合组内会话模块应答置信度按降序，取最高分应答</p>
      <el-row>
        <el-col :xs="24" :sm="24" :md="20" :lg="20">
          <avue-crud :option="tableOption"
                     :data="tableData"
                     ref="tableRef"
          >
            <template slot-scope="{row}" slot="sessionModule">
              <el-select size="small" v-model="row.moduleId" multiple placeholder="请选择">
                <el-option
                  v-for="item in sessionDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="20" :lg="20" style="text-align: center;margin-top: 20px;">
          <el-button size="small" type="primary" @click="saveBasic">保存</el-button>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {/*getSessionUrl,*/ saveBasicAndAnswerUrl} from '@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/answerStrategy.js';
export default {
  props: {
    sessionDatas: {
      type: Array,
      default: () => {
        return [];
      }
    },
    editData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      botId: '',
      strategyId: '', // 策略id
      tableData: [
        {
          groupPriority: '高',
          moduleId: []
        },
        {
          groupPriority: '中',
          moduleId: []
        },
        {
          groupPriority: '低',
          moduleId: []
        }
      ],
      tableOption: {
        header: false,
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: false,
        menu: false,
        index: false,
        addBtn: false,
        selection: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 300,
        menuAlign: "center",
        dialogClickModal: false,
        labelWidth: 120,
        column: [
          {
            label: '组优先级',
            prop: 'groupPriority',
            span: 12,
            // search: true,
            width: 280,
            // search:true,
            // maxlength: 50,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: '会话模块',
            prop: 'sessionModule',
            span: 12,
            showWordLimit: true,
            overHidden: true,
          }
        ],
      },
      //sessionDatas: [],
    }
  },
  components: {
    //someComponent
  },
  computed: {
    // 计算属性
    ...mapGetters(['botObj', 'instanceObj'])
  },
  methods: {
    // 方法
    saveBasic () {
      var postData = {
        baseStrategyList: [],
        strategyId: this.strategyId
      };

      postData.baseStrategyList = this.tableData.map((item) => {
        return {
          groupPriority: item.groupPriority,
          moduleId: item.moduleId.join(',')
        }
      });
      saveBasicAndAnswerUrl(postData).then((res) => {
        res = res.data;
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: '保存成功'
          });
        }
      })
    }
  },
  created() {
    this.botId = this.botObj.id;
    this.strategyId = this.instanceObj.id;
  },
  mounted() {
    if (this.editData.length > 0) {
      this.tableData = [];
      this.editData.forEach((item) => {
        item.moduleId = item.moduleId.length > 0 ? item.moduleId.split(',') : [];
        this.tableData.push(item);
      })
    }
  },
  destroyed() {

  }
}
</script>

<style scoped lang="scss">
  /deep/ .avue-crud__menu {
    display: none;
  }
</style>
