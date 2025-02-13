<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删除
        </el-button> -->
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permissionList.jiaBtn"
          @click.stop="comFormMagJia()"
          >新 增
        </el-button>
      </template>

      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.detailBtn"
          @click="comFormMagDetail(scope.row)">详情
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.detailBtn"
          @click="comFormMagJia(scope.row)">生成
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editMagBtn"
          @click="handleEdit(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.xiafaBtn"
          @click="handleXiafa(scope.row)">下发
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.huizongBtn"
          @click="handleHuizong(scope.row)">各部门汇总明细
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.mingxiBtn"
          @click="handleMingxi(scope.row)">明细下载
        </el-button>
      </template>
    </avue-crud>

     <!--考勤表单下发新增-->
     <HuilanDialog
      :title="kaoqinTitle"
      :fullscreen="false"
      width="90%"
      append-to-body
      :visible.sync="kaoqinTag"
    >
      <div class="kqtitle">
        <div class="kqtxt">标题：</div>
        <el-input v-model="kqtitle" placeholder="请输入标题内容" :disabled="kqdis"></el-input>
      </div>
      <div class="listadd" v-show="!kqdis"><el-button type="primary" @click="kqadd()">新增</el-button></div>
      <el-table
        :data="tableData"
        height="300"
        border
        style="width: 60%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="处室名称"
          width="180">
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.chushi }}</span>
            <el-input v-show="row.editid" v-model="row.chushi"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="月份"
          >
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.month }}</span>
            <el-input v-show="row.editid" v-model="row.month"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="考核人数"
         >
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.khnum }}</span>
            <el-input v-show="row.editid" v-model="row.khnum"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label='“好”人数'
         >
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.goodnum }}</span>
            <el-input v-show="row.editid" v-model="row.goodnum"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          v-show="!kqdis"
          align="center"
          width="200"
          label="备注">
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.beizhu }}</span>
            <el-input v-show="row.editid" v-model="row.beizhu" style="text-align: center;"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              v-show="!kqdis"
              @click="kaoqindel(row)"
            >
              删除
            </el-button>

            <el-button
              type="primary"
              size="mini"
              v-show="kqdis"
              @click="kaoqinInfo(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer">
        <el-button type="primary" plain @click="savekq" v-show="!kqdis">保存</el-button>
        <el-button plain @click="closekq">取消</el-button>
      </div>
    </HuilanDialog>

    <!--处室详情表-->
    <HuilanDialog
      :title="kaoqinTitle"
      :fullscreen="false"
      width="80%"
      append-to-body
      :visible.sync="csInfo"
    >
      <div class="kqtitle">
        <div class="kqtxt">标题：</div>
        <div >{{ kqtitle }}</div>
      </div>

      <el-table
        :data="tableDatacs"
        border
        style="width: 80%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="处室名称"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.chushi }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="月份"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.month }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="考核用户"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.khnum }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label='主管领导评鉴'
          width="220">
          <template slot-scope="{ row }">
            <span>{{ row.goodnum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="chushiInfo(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer">
        <el-button plain @click="closecs">关闭</el-button>
      </div>
    </HuilanDialog>

     <!--处室个人考勤详情-->
     <HuilanDialog
      :title="csTitle"
      :fullscreen="false"
      width="80%"
      append-to-body
      :visible.sync="chushiDetail"
    >
      <div class="cstitle">{{ csTitle }}</div>
      <div class="csdate">{{ csyear }} 年  {{ csmonth }} 月</div>

      <div style="width: 100%;padding:10px">
        <table align="center" width="100%" class="table xunw_table_form" border="1">
          <tr>
            <td>姓名</td>
            <td>测试1</td>
            <td>性别</td>
            <td>男</td>
            <td>出生年月</td>
            <td>1988.2.10</td>
          </tr>
          <tr>
            <td>处室及职务</td>
            <td colspan="5">政治部副主任</td>
          </tr>
          <tr>
            <td>考核指标</td>
            <td colspan="4">评价要素</td>
            <td>考核结果</td>
          </tr>
          <tr>
            <td>政治品质</td>
            <td colspan="4">讲政治，具有较强的政治意识、大局意识、核心意识、看齐意识，认真贯彻执行党的路线、方针、政策。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>职业道德</td>
            <td colspan="4">忠于职守，服从命令，精通业务，勤勉敬业，遵守公务员职业道德，依法执行公务。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>工作作风</td>
            <td colspan="4">热爱本职工作，敢于担当，积极主动，尽职尽责，求真务实，深入基层，服务企业。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>廉洁自律</td>
            <td colspan="4">严格遵守《廉政准则》、中央八项规定、省委省政府20条意见，无不正之风或违纪违规现象。</td>
            <td>好</td>
          </tr>
          <tr>
            <td>个性指标</td>
            <td colspan="4">工作数量、质量、效率以及所产生的效益和业务能力等。</td>
            <td>好</td>
          </tr>
          <tr>
            <td rowspan="2">出勤情况</td>
            <td>出勤（天）</td>
            <td>事假（天）</td>
            <td>病假（天）</td>
            <td>旷工（天）</td>
            <td></td>
          </tr>
          <tr>
            <td>21</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowspan="2">主管领导评鉴</td>
            <td rowspan="2" colspan="5">
              <div style="float:left;margin-left:50px;width:50px;">较好</div>
              <div style="float:left;margin-left:120px;margin-top:30px;">（签名）</div>
              <input style="float:left;margin-left:10px;margin-top:30px;line-height:40px;border:none;" value="测试1" readonly/>
              <div style="float:right;margin-right:100px;margin-top:30px;">2024年1月11日</div>
            </td>
          </tr>
          <tr>
          </tr>
          <tr>
            <td rowspan="2">政治部审定</td>
            <td rowspan="2" colspan="5">
              <div style="float:left;margin-left:50px;width:50px;">较好</div>
              <div style="float:left;margin-left:120px;margin-top:30px;">（签章）</div>
              <input style="float:left;margin-left:10px;margin-top:30px;line-height:40px;border:none;" readonly/>
              <div style="float:right;margin-right:100px;margin-top:30px;">2024年1月11日</div>
            </td>
          </tr>
          <tr>
          </tr>
        </table>
        <div class="zhushi">注：1.考核结果一栏由主管领导填写“好”、“较好”、“一般”、“较差”；<br/>2.主管领导意见填写评语和考核等次建议。</div>
      </div>

      <div class="csfooter">
        <el-button plain @click="closecsDetail">关闭</el-button>
      </div>
    </HuilanDialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data () {
    return {
      kaoqinTitle:'下发通知',
      kaoqinTag:false,
      kqdis:false,
      kqtitle:'',
      tableData:[],

      csInfo:false,
      tableDatacs:[],

      chushiDetail:false,
      csTitle:'公务员平时考核登记表',
      jidunum1:'1',
      jidunum2:'2',
      jidunum3:'3',
      heji1:'1人',
      heji2:'1人',
      heji3:'1人',
      hzList:[{name:'测试1',job:'政治部主任',jidu1:'好',jidu2:'较好',jidu3:'一般',remark:'测试'}],
      hzJiDu:'2024年第一季度',
      hzJob:'政治部',
      csyear:'2024',
      csmonth:'1',

      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel:'序号',
        indexWidth:100,
        addBtn:false,
        editBtn:false,
        delBtn:false,
        viewBtn: false,
        selection: true,
        column: [
          {
            label: "标题",
            prop: "title",
            display:true,
          },
          {
            label: "发布部门",
            prop: "bumen",
            display:true,
          },
          {
            label: "发布状态",
            prop: "zt",
            display:true,
          },
          {
            label: "发布人",
            prop: "name",
            display:true,
          },
          {
            label: "发布时间",
            prop: "date",
            display:true,
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        jiaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-jia`],
          false
        ),
        xiafaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xiafa`],
          false
        ),
        detailBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-detail`],
          false
        ),
        editMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-edit`],
          false
        ),
        mingxiBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-mingxi`],
          false
        ),
        huizongBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-huizong`],
          false
        ),
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    //考勤新增
    comFormMagJia(){
      this.kaoqinTag = true
      this.kqdis = false
    },
    //保存
    savekq(){
      this.kaoqinTag = false
      this.tableData = []
    },
    //取消
    closekq(){
      this.kaoqinTag = false
      this.tableData = []
    },
    kqadd(){
      let i = this.tableData.length
      let obj = {i:i,chushi:'',month:'',khnum:'',goodnum:'',beizhu:'',editid:true}
      this.tableData.push(obj)
    },
    kaoqindel(row){
      this.$confirm(
        "确认删除该数据？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then( () => {
        this.tableData.splice(row.i,1)
        this.tableData.forEach((item,index) => {
          item.i = index
        })
      })
    },
    kaoqinInfo(row){
      this.csInfo = true
      this.tableDatacs.push({i:0,chushi:'秘书处',month:'1月',khnum:'张三',goodnum:'较好'})
    },
    //详情
    comFormMagDetail(){
      this.kaoqinTag = true
      this.kqdis = true
      this.kqtitle = '下发通知'
      this.tableData.push({i:0,chushi:'秘书处',month:'1月',khnum:'4',goodnum:'2',beizhu:'测试',editid:false})
    },
    //各处室详情
    chushiInfo(row){
      console.log(row)
      this.chushiDetail = true
    },
    closecs(){
      this.csInfo = false
    },
    closecsDetail(){
      this.chushiDetail = false
    },
    //下发
    handleXiafa(){
      this.$confirm(
        "是否确认下发？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then( () => {
        
      })
    },
    rowSave (row, done, loading) {
      add(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad (page, params = {}) {
      this.loading = false;
      this.data = [{title:'测试',bumen:'测试部门',zt:'已发布',date:'2024-05-10',name:'测试人员'}]
      // getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
      //   const data = res.data.data;
      //   this.page.total = data.total;
      //   this.data = data.records;
      //   this.loading = false;
      //   this.selectionClear();
      // });
    }
  }
};
</script>

<style>
.kqtitle{
  display: flex;
  height: 60px;
  width: 500px;
  line-height: 60px;
  margin: 40px auto;
}
.cstitle{
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  margin: 40px auto 0;
  font-size: 18px;
  font-weight: 600;
}
.csdate{
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}
.kqtxt{
  font-size: 18px;
  width: 80px;
}
.listadd{
  width: 60%;
  margin: 0 auto 40px;
  text-align: right;
}
.footer{
  width: 200px;
  margin: 200px auto 0;
  display: flex;
}
.table tr{
  height: 40px;
}
.table tr td{
  line-height: 40px;
  text-align: center;
}
.zhushi{
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
.csfooter{
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}
</style>
