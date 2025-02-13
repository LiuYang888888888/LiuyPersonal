<template>
  <div class="mainWarp">
    <div class="wrap">
      <el-row>
        <el-col :span="24" class="topWarp">
          <div class="header">
            <div class="leBox">
              <el-button size="small" type="primary" @click="addApply"
                >添加新应用</el-button
              >
              <!-- <el-button size="small" type="success" @click="centerToPage"
                >体验中心</el-button
              > -->
            </div>
          </div>
          <div class="right">
            <HuilanBasicSearchbar
              :model="seach"
              :fields="appSearchFields"
              @search="querySeach"
            />
            <!--            <div class="box">-->
            <!--              <span class="btn" v-if="category1 !== 'atom'"> 应用分类 </span>-->
            <!--              <span class="input" v-if="category1 !== 'atom'">-->
            <!--                <el-select-->
            <!--                  size="small"-->
            <!--                  v-model="seach.category2"-->
            <!--                  placeholder="请选择应用分类"-->
            <!--                  style="width: 100%"-->
            <!--                  clearable-->
            <!--                >-->
            <!--                  <el-option label="全部" value="0"></el-option>-->
            <!--                  <el-option-->
            <!--                    :label="item.name"-->
            <!--                    :value="item.value"-->
            <!--                    v-for="item of classificationTextData"-->
            <!--                    :key="item.code"-->
            <!--                  ></el-option>-->
            <!--                </el-select>-->
            <!--              </span>-->
            <!--              <span class="input">-->
            <!--                <el-input-->
            <!--                  size="small"-->
            <!--                  v-model="seach.name"-->
            <!--                  placeholder="请输入应用名称"-->
            <!--                ></el-input>-->
            <!--              </span>-->
            <!--              <span class="img">-->
            <!--                <span class="el-icon-search" @click="querySeach"></span>-->
            <!--              </span>-->
            <!--            </div>-->
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="boxScrollbar" :style="clientHeightList">
      <!-- <el-scrollbar> -->
      <el-row class="cotaner">
        <el-col :span="24" v-if="data.length === 0">
          <div class="employe">
            <img class="employeImg" src="@/assets/iconfont/employe.png" alt="" />
            <div>暂无数据</div>
          </div>
        </el-col>
        <el-col :span="8" class="item" v-for="(item, i) of data" :key="i">
          <div class="item-box" :class="{
            ledom: (i + 1) % 3 == 1,
            cen: (i + 1) % 3 == 2,
            ri: (i + 1) % 3 == 0,
          }">
            <div class="header">
              <div class="le">
                <el-image v-if="item.smallIconUrl" class="img" :src="item.smallIconUrl" fit="cover"></el-image>
                <img v-else class="img" src="@/assets/iconfont/moke.svg" alt="" />
                <span :title="item.name" class="text">{{ item.name }} </span>
              </div>
              <div class="status">
                <img v-if="item.status === '1' && compareDate(item.endTime)" class="image"
                  src="@/assets/iconfont/normal.png" alt="" />
                <span v-if="item.status === '0'" class="el-icon-circle-close" style="color: #d6345b"></span>
                <span v-if="item.status === '1' && !compareDate(item.endTime)" class="el-icon-warning"
                  style="color: #9597a0"></span>
                <span :class="{
                  btn:
                    item.status === '1' && compareDate(item.endTime) === true,
                  btnActive: item.status === '0',
                  stop: item.status === '1' && !compareDate(item.endTime),
                }">{{
  item.status === "0"
  ? "已停止"
  : compareDate(item.endTime)
    ? "正常"
    : "已过期"
}}</span>
              </div>
            </div>
            <div class="cenText">
              <!-- <div class="boxDiv">
                <span class="tit">应用编码:</span
                ><span class="txt" :title="item.code">{{ item.code }}</span>
              </div> -->
              <div class="boxDiv">
                <span class="tit">启用状态:</span><span class="txt" :title="item.status">{{
                  item.status === "1" ? "启用" : "停用"
                }}</span>
              </div>
              <div class="boxDiv">
                <span class="tit">到期时间:</span><span class="txt" :title="item.endTime">{{
                  item.endTime
                }}</span>
              </div>
              <!-- <div class="boxDiv" v-if="category1 !== 'atom'">
                <span class="tit">应用分类:</span
                ><span class="txt" :title="item.category2">{{
                  applicationClassification[item.category2]
                }}</span>
              </div> -->
              <div class="boxDiv">
                <span class="tit">应用描述:</span><span class="txt" :title="item.description">{{
                  item.description
                }}</span>
              </div>
            </div>
            <div class="bootto">
              <el-button v-if="permissionList['ai-application-view-detail']" size="small" class="btn view"
                @click="designDialog(item, '2')">查看</el-button>
              <el-button size="small" class="btn serve" @click="designDialog(item, '3')"
                v-if="permissionList['ai-application-new-edit']">编辑</el-button>
              <el-button v-if="permissionList['ai-application-new-experience']" size="small" style="margin-right: 10px"
                class="btn view" @click="experience(item, 1)">体验使用</el-button>
              <el-dropdown>
                <el-button v-if="permissionList['ai-application-my-dele']" size="small" class="btn view">...</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="permissionList['ai-application-interface-doc']"
                    @click.native="manual(item, 2)">接口说明</el-dropdown-item>
                  <el-dropdown-item v-if="permissionList['ai-application-interface-clone']"
                    @click.native="manual(item)">应用克隆</el-dropdown-item>
                  <el-dropdown-item v-if="permissionList['ai-application-my-dele']"
                    @click.native="manual(item, 3)">应用删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-pagination background layout="pager, total" :total="page.total" :page-size="page.size"
        @current-change="currentChange">
      </el-pagination>
      <!-- </el-scrollbar> -->
    </div>

    <AppliServicesManger ref="appliServicesManger" :pagelist="pagelist"></AppliServicesManger>
    <el-drawer :title="titlePra.title" append-to-body size="40%" :visible.sync="addVisible" :before-close="cansell"
      custom-class="addApli">
      <div v-if="category1 === 'atom'">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          size="mini"
          style="padding: 30px"
        >
          <el-form-item
            label="应用名称："
            prop="name"
            :rules="[
              { required: true, message: '请输入应用名称' },
              {
                min: 1,
                max: 50,
                trigger: 'blur',
                message: '请输入1至50区间字符长度',
              },
              {
                pattern: /^\S*$/,
                message: '应用名称不能包含空格',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="form.name" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item v-if="titlePra.applyCode !== '1'" label="app_key：" prop="appKey"
            :rules="[{ required: true, message: '请输入appKey' }]">
            <el-input disabled="disabled" v-model="form.appKey"></el-input>
          </el-form-item>
          <el-form-item v-if="titlePra.applyCode !== '1'" label="app_secret：" prop="appSecret"
            :rules="[{ required: true, message: '请输入appSecret' }]">
            <el-input v-model="form.appSecret" :disabled="titlePra.applyCode !== '1'"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="应用编码："
            prop="code"
            :rules="[
              { required: true, message: '请输入应用编码' },
              {
                min: 1,
                max: 50,
                trigger: 'blur',
                message: '请输入1至50区间字符长度',
              },
              { pattern: /^[A-Za-z0-9]+$/, message: '只能输入英文和数字' },
            ]"
          >
            <el-input
              v-model="form.code"
              :disabled="disabled || titlePra.applyCode === '3'"
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item
            label="能力类别："
            prop="category2"
            :rules="[{ required: true, message: '请选择能力类别' }]"
          >
            <el-select
              v-model="form.category2"
              placeholder="请选择能力类别"
              @change="abbityClass"
              style="width: 100%"
              :disabled="disabled"
            >
              <el-option label="语音" value="voice"></el-option>
              <el-option label="自然语言处理" value="nlp"></el-option>
              <el-option label="机器学习" value="machine"></el-option>
              <el-option label="图像" value="image"></el-option>
              <el-option label="情感" value="emotion"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="能力名称：" prop="abilityId" :rules="[{ required: true, message: '请选择能力名称' }]">
            <el-select v-model="form.abilityId" placeholder="请选择能力名称" style="width: 100%" :disabled="disabled" filterable
              multiple>
              <el-option :label="item.name" :value="item.id" v-for="item of abilytyOptionData" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间：" prop="endTime" :rules="[{ required: true, message: '请选择到期时间' }]">
            <el-date-picker style="width: 100%" v-model="form.endTime" type="datetime" placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled">
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="启用状态：" prop="status" :rules="[{ required: true, message: '请选择启用状态：' }]">
            <el-radio-group v-model="form.status" :disabled="disabled">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="语言"
            prop="language"
            :rules="[{ required: true, message: '请选择语言：' }]"
          >
            <el-select
              v-model="form.language"
              placeholder="请选择语言"
              style="width: 100%"
              :disabled="disabled"
            >
              <el-option
                v-for="item in languageList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="应用描述："
            prop="description"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :rules="[
              {
                min: 1,
                max: 255,
                trigger: 'blur',
                message: '请输入1至255区间字符长度',
              },
            ]"
          >
            <el-input
              type="textarea"
              v-model="form.description"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item label="图标上传：" prop="smallIconUrl" class="uploadImg">
            <el-image @mouseenter="imgMouseenter" v-if="smallIconUrl"
              style="width: 108px; height: 108px; margin-right: 10px" :src="formSmallIconUrl" fit="cover"></el-image>
            <div @mouseout="imgMouseleave">
              <HuilanUploader v-if="!disabled && !form.smallIconUrl" title="上传背景图片" class="img-uploader"
                :action="uploadUrl" :accept="accept" :data="dataImg" :show-file-list="false" :on-success="uploadSuccess">
                <i class="el-icon-plus"></i>
              </HuilanUploader>
              <HuilanUploader v-if="!disabled && imgIsFlag" title="上传背景图片" class="img-uploader changgeImg"
                :action="uploadUrl" :accept="accept" :data="dataImg" :show-file-list="false" :on-success="uploadSuccess">
                <span class="icon">更改图标</span>
              </HuilanUploader>
            </div>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="onSubmit('form')" :disabled="disabled">保存</el-button>
            <el-button @click="cansell">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="category1 !== 'atom'">
        <el-form ref="textForm" :model="textForm" label-width="120px" size="mini" style="padding: 30px">
          <el-form-item label="应用名称：" prop="name" :rules="[
            { required: true, message: '请输入应用名称' },
            {
              min: 1,
              max: 50,
              trigger: 'blur',
              message: '请输入1至50区间字符长度',
            },
            {
              pattern: /^\S*$/,
              message: '应用名称不能包含空格',
              trigger: 'blur',
            },
          ]">
            <el-input v-model="textForm.name" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item v-if="titlePra.applyCode !== '1'" label="app_key：" prop="appKey"
            :rules="[{ required: true, message: '请输入appKey' }]">
            <el-input disabled="disabled" v-model="textForm.appKey"></el-input>
          </el-form-item>
          <el-form-item v-if="titlePra.applyCode !== '1'" label="app_secret：" prop="appSecret"
            :rules="[{ required: true, message: '请输入appSecret' }]">
            <el-input v-model="textForm.appSecret" disabled="disabled"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="应用编码："
            prop="code"
            :rules="[
              { required: true, message: '请输入应用编码' },
              {
                min: 1,
                max: 50,
                trigger: 'blur',
                message: '请输入1至50区间字符长度',
              },
              { pattern: /^[A-Za-z0-9]+$/, message: '只能输入英文和数字' },
            ]"
          >
            <el-input
              v-model="textForm.code"
              :disabled="disabled || titlePra.applyCode === '3'"
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="调用地址：" prop="runUrl" :rules="[{ required: true, message: '请输入调用地址' }]">
            <el-input v-model="textForm.runUrl" :disabled="disabled"></el-input>
          </el-form-item> -->
          <el-form-item label="应用分类：" prop="category2" :rules="[{ required: true, message: '请选择应用分类' }]">
            <el-select v-model="textForm.category2" placeholder="请选择应用分类" style="width: 100%" :disabled="disabled">
              <el-option :label="item.name" :value="item.value" v-for="item of classificationTextData" :key="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用描述：" prop="description" :autosize="{ minRows: 4, maxRows: 4 }" :rules="[
            {
              min: 1,
              max: 255,
              trigger: 'blur',
              message: '请输入1至255区间字符长度',
            },
          ]">
            <el-input type="textarea" v-model="textForm.description" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="应用配置：" prop="configUrl" :rules="[
            {
              min: 1,
              max: 100,
              trigger: 'blur',
              message: '请输入1至100区间字符长度',
            },
          ]">
            <el-input v-model="textForm.configUrl" :disabled="disabled"></el-input>
          </el-form-item>
          <PlugCrud class="plugCrudPar" v-if="addVisible" :personalityDisplay="false" title="参数配置"
            :requstData="requstData" @chilReData="preGetData" :addBtn="viewsFlag" :editBtn="viewsFlag"
            :delBtn="viewsFlag"></PlugCrud>
          <el-form-item label="接口说明：" prop="docUrl" :rules="[
            {
              min: 1,
              max: 100,
              trigger: 'blur',
              message: '请输入1至100区间字符长度',
            },
          ]">
            <el-input v-model="textForm.docUrl" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="体验参数：" prop="testUrl" :rules="[
            {
              min: 1,
              max: 100,
              trigger: 'blur',
              message: '请输入1至100区间字符长度',
            },
          ]">
            <el-input v-model="textForm.testUrl" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="到期时间：" prop="endTime" :rules="[{ required: true, message: '请选择到期时间' }]">
            <el-date-picker style="width: 100%" v-model="textForm.endTime" type="datetime" placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled">
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="启用状态：" prop="status" :rules="[{ required: true, message: '请选择启用状态' }]">
            <el-radio-group v-model="textForm.status" :disabled="disabled">
              <el-radio label="1">已启用</el-radio>
              <el-radio label="0">未启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图标上传：" prop="smallIconUrl" class="uploadImg">
            <el-image @mouseenter="imgMouseenter" v-if="testSmallIconUrl"
              style="width: 108px; height: 108px; margin-right: 10px" :src="textFormSmallIconUrl" fit="cover"></el-image>
            <div @mouseout="imgMouseleave">
              <HuilanUploader v-if="!disabled && !textForm.smallIconUrl" title="上传背景图片" class="img-uploader"
                :action="uploadUrl" :accept="accept" :data="dataImg" :show-file-list="false" :on-success="uploadSuccess">
                <i class="el-icon-plus"></i>
              </HuilanUploader>
              <HuilanUploader v-if="!disabled && imgIsFlag" title="上传背景图片" class="img-uploader changgeImg"
                :action="uploadUrl" :accept="accept" :data="dataImg" :show-file-list="false" :on-success="uploadSuccess">
                <span class="icon">更改图标</span>
              </HuilanUploader>
            </div>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="onSubmit('textForm')" :disabled="disabled">保存</el-button>
            <el-button @click="cansell">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <Details ref="details"></Details>
  </div>
</template>

<script>
import Details from "./details.vue";
import { baseURL } from "@/api/common";
import {
  applicationSave,
  applicationByPage,
  applicationDelete,
  getAllAiAbilityList,
  applicationUpdate,
  getDictItemListByDictCode,
  getHuilanAiApplicationAbilityRelationByApplicationId,
  // getAiApplicationById,
} from "@/api/configure/application";
import { getImageUploadAndCreateThumbUrl } from "@/api/common";
import { mapGetters, mapMutations } from "vuex";
import AppliServicesManger from "./appliServicesManger";
import PlugCrud from "@/components/plugCrud";
import HuilanUploader from "@/components/uploader";
import { getCurrentLanguage } from "@/api/system/tenant";
const clientHeightList = document.body.clientHeight - 250;
// import aiInterfaceParama from "@/util/aiInterfaceParama";
// import nomal from "@/assets/iconfont/normal.png";
export default {
  name: "myAppList",
  components: {
    Details,
    AppliServicesManger,
    PlugCrud,
    HuilanUploader,
  },
  props: {
    category1: {
      type: String,
      default: "",
    },
    businesstypeId: {
      type: String,
      default: "",
    },
  },
  watch: {
    category1(newVal) {
      const scopr = this;
      console.log(newVal);
      this.handleSearchFields();
      switch (newVal) {
        case "text":
          scopr.getDictItemList("ai-application-classification-text");
          break;
        case "voice":
          scopr.getDictItemList("ai-application-classification-voice");
          break;
        case "digital":
          scopr.getDictItemList("ai-application-classification-number");
          break;
      }
    },
  },
  data() {
    return {
      imgIsFlag: false,
      clientHeightList: `height:${clientHeightList}px`,
      applicationClassification: {
        voice: "多语音在线机器人",
        intelligence: "智能营销机器人",
        weChart: "微信客服机器人",
        online: "在线客服机器人",
        train: "智能培训机器人",
        quality: "智能质检",
        assistant: "智能助手机器人",
        ivr: "IVR导航机器人",
        answer: "智能接听机器人",
        outbound: "智能外呼机器人",
        video: "视频客服机器人",
        interactive3D: "智能交互数字人3D",
        interactive2D: "智能交互数字人2D",
        broadcast3D: "智能播报数字人3D",
        broadcast2d: "智能播报数字人2D",
      },
      smallIconUrl: null,
      testSmallIconUrl: null,
      formSmallIconUrl: null,
      textFormSmallIconUrl: null,
      uploadUrl: getImageUploadAndCreateThumbUrl(),
      accept: "image/*",
      dataImg: {
        width: 120,
        quality: 1,
      },
      disabled: false,
      viewsFlag: true,
      titlePra: {
        title: "添加新应用",
        applyCode: "1",
      },
      languageList: [],
      form: {
        name: null,
        appKey: null,
        category1: null, // 应用类别
        category2: "voice", // 能力类别
        abilityId: [], // 能力名称
        businesstypeId: null,
        description: null,
        status: "1",
        smallIconUrl: null,
        language: "",
      },
      textForm: {
        name: null,
        appKey: null,
        category1: null, // 应用类别
        category2: "online", // 文本机器人--应用分类
        abilityId: null, // 能力名称
        businesstypeId: null,
        description: null,
        status: "1",
        smallIconUrl: null,
      },
      addVisible: false,
      applyName: "1", //1新增，2编辑
      addForm: {
        status: true,
      },
      page: {
        size: 6,
        pageSizes: [6, 12, 18],
        current: 1,
        total: 0,
        pageCount: 0,
      },
      seach: {
        name: null,
        category2: "0",
      },
      designDialogVisible: false,
      loading: true,
      data: [],
      permissionList: null,
      abilytyOptionData: [],
      classificationTextData: [],
      requstData: [],
      appSearchFields: [
        // {
        //   type: 'select',
        //   prop: 'category2',
        //   placeholder: '请选择应用分类',
        //   dicData: []
        // },
        { placeholder: "请输入应用名称", prop: "name" },
      ],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  mounted() {
    this.pagelist({ current: 1 });
    this.permissionList = this.permission;
    const self = this;
    getAllAiAbilityList({ category1: this.form.category2 }).then((res) => {
      const data = res.data;
      if (data.success) {
        const arr = [];
        data.data.map((v) => {
          // if (v.category1 === "voice") {
          arr.push(v);
          // }
        });
        self.abilytyOptionData = arr;
      }
    });
    getDictItemListByDictCode({
      code: "language",
    }).then((res) => {
      const data = res.data;
      if (data.success) {
        this.languageList = data.data;
      }
    });
    this.getDictItemList("ai-application-classification-text");
    this.handleSearchFields();
  },
  methods: {
    ...mapMutations({
      setCurentRouterPage: 'CURENT_ROUTER_PAGE',
    }),
    handleSearchFields() {
      const firstField = this.appSearchFields[0];
      if (this.category1 !== "atom") {
        // 已经有category2字段不添加
        if (firstField.prop === "category2") {
          return;
        }
        this.appSearchFields.unshift({
          type: "select",
          prop: "category2",
          placeholder: "请选择应用分类",
          dicData: [],
        });
      } else {
        // 删除应用分类
        if (firstField.prop === "category2") {
          this.appSearchFields.shift();
        }
      }
    },
    getDictItemList(key) {
      getDictItemListByDictCode({
        code: key,
      }).then((res) => {
        const data = res.data;
        if (data.success) {
          this.classificationTextData = data.data;
          // 更改查询下拉列表的数据
          const firstField = this.appSearchFields[0];
          if (firstField.prop === "category2") {
            const options = data.data.map((item) => {
              return {
                label: item.name,
                value: item.value,
              };
            });
            firstField.dicData = [{ label: "全部", value: "0" }, ...options];
          }
        }
      });
    },
    compareDate(val) {
      var myDate = new Date();
      var year = myDate.getFullYear(); //获取当前年
      var mon = myDate.getMonth() + 1; //获取当前月
      var date = myDate.getDate(); //获取当前日
      var hours = myDate.getHours(); //获取当前小时
      var minutes = myDate.getMinutes(); //获取当前分钟
      var seconds = myDate.getSeconds(); //获取当前秒
      var now =
        year +
        "-" +
        mon +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      //第一个参数当前时间，第二个过期时间
      return this.timediff(now, val);
    },
    timediff(begin_time, end_time) {
      //年月日时分秒转换为时间戳
      let flag = flag;
      let beginTime = new Date(begin_time).getTime() / 1000;
      let endTime = new Date(end_time).getTime() / 1000;
      // var starttime = "";
      // var endtime = "";
      if (beginTime <= endTime) {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
    pagelist(page, seach, categoryPar, businesstypeIdPar) {
      const scope = this;
      let category1 = null;
      let businesstypeId = null;
      if (categoryPar) {
        category1 = categoryPar;
      } else {
        category1 = scope.category1;
      }
      if (businesstypeIdPar) {
        businesstypeId = businesstypeIdPar;
      } else {
        businesstypeId = scope.businesstypeId;
      }

      if (!businesstypeId || !category1) {
        return;
      }
      let category = {
        businesstypeId,
        category1,
      };
      if (category.businesstypeId === "0") {
        category.businesstypeId = null;
      }
      const parms = {
        ...this.page,
        ...page,
        ...seach,
        ...category,
      };
      applicationByPage({ ...parms }).then((res) => {
        const data = res.data.data;
        scope.data = data.records;
        scope.page.total = data.total;
        // this.page.pageCount = Math.ceil(data.total/6);
        // console.log(Math.ceil(data.total/6))
      });
    },
    currentChange(val) {
      this.page.current = val;
      this.pagelist({ current: val });
    },
    designDialog(row, num) {
      const self = this;
      // getAiApplicationById({ id: row.id }).then((res) => {
      // console.log(res);
      // const data = res.data;
      // row = data.data
      // if (data.success) {

      self.titlePra.applyCode = num;
      if (num === "2") {
        // self.titlePra.title = "查看应用";
        // self.disabled = true;
        // self.viewsFlag = false;
        row.languageName = this.languageList.find(
          (item) => item.value === row.language
        ).name;
        self.$refs.details.detailVisible = true;
        self.$refs.details.form = row;
      } else if (num === "3") {
        self.titlePra.title = "编辑应用";
        self.disabled = false;
        self.viewsFlag = true;
        self.addVisible = true;
      } else {
        self.addVisible = true;
      }
      self.form = row;
      self.textForm = row;
      if (self.category1 === "atom") {
        self.form.category2 = row.abiCategory;
        // self.form.name = row.name;
        self.smallIconUrl = row.smallIconUrl;
        self.formSmallIconUrl = row.smallIconUrl;
        if (row.abilityIds) {
          self.form.abilityIds = row.abilityIds.split(",");
        }
        if (num === "2") {
          const applicationId = row.id;
          getHuilanAiApplicationAbilityRelationByApplicationId({
            applicationId,
          }).then((res) => {
            const data = res.data;
            if (data.success) {
              const arr = [];
              data.data.map((v) => {
                arr.push(v.name);
              });
              self.$refs.details.form.abilityId = arr;
            }
          });
        }
        if (num === "3") {
          const applicationId = row.id;
          getHuilanAiApplicationAbilityRelationByApplicationId({
            applicationId,
          }).then((res) => {
            const data = res.data;
            if (data.success) {
              const arr = [];
              data.data.map((v) => {
                arr.push(v.id);
              });
              self.form.abilityId = arr;
            }
          });
        }
      } else {
        self.form.category2 = row.category2;
        self.testSmallIconUrl = row.smallIconUrl;
        self.textFormSmallIconUrl = row.smallIconUrl;
      }
      if (row.jsonValue) {
        self.requstData = JSON.parse(row.jsonValue);
      }
      // }
      // });
    },
    querySeach() {
      let category2 = null;
      if (this.seach.category2 === "0") {
        category2 = "";
      } else {
        category2 = this.seach.category2;
      }
      this.pagelist({}, { ...this.seach, category2 });
    },
    serveManager(applicationId) {
      setTimeout(() => {
        this.$refs.appliServicesManger.manageVisible = true;
      }, 800);
      this.$refs.appliServicesManger.applicationId = applicationId;
      // this.$refs.appliServicesManger.transferCreat(applicationId);
    },
    // abbityClass(val) {
    //   const self = this;
    //   getAllAiAbilityList({ category1: val }).then((res) => {
    //     const data = res.data;
    //     if (data.success) {
    //       const arr = [];
    //       data.data.map((v) => {
    //         if (v.category1 === val) {
    //           arr.push(v);
    //         }
    //       });
    //       self.abilytyOptionData = arr;
    //       self.form.abilityId = "";
    //     }
    //   });
    // },
    // abbityClassEdit(val) {
    //   getAllAiAbilityList({ category1: val }).then((res) => {
    //     const data = res.data;
    //     if (data.success) {
    //       const arr = [];
    //       data.data.map((v) => {
    //         if (v.category1 === val) {
    //           arr.push(v);
    //         }
    //       });
    //       this.abilytyOptionData = arr;
    //     }
    //   });
    // },
    onSubmit(formName) {
      const scope = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            category1: scope.category1,
            businesstypeId: scope.businesstypeId,
          };
          if (scope.category1 === "atom") {
            param = {
              ...this.form,
              abilityIds: this.form.abilityId.join(","),
              ...param,
            };
            delete param.category2;
            delete param.abilityId;
            // delete param.category2;
          } else {
            let jsonValue = null;
            if (scope.requstData.length > 0) {
              jsonValue = JSON.stringify(scope.requstData);
            }
            param = {
              ...this.textForm,
              jsonValue,
              ...param,
            };
          }
          if (this.titlePra.applyCode === "1") {
            applicationSave({ ...param }).then(
              (res) => {
                // this.onLoad(this.page);
                if (res.data.success) {
                  scope.$message({
                    type: "success",
                    message: "操作成功!",
                  });
                  scope.addVisible = false;
                  scope.pagelist();
                } else {
                  scope.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                }
              },
              (error) => {
                window.console.log(error);
              }
            );
          } else {
            applicationUpdate({ ...param }).then(
              (res) => {
                // this.onLoad(this.page);
                if (res.data.success) {
                  scope.$message({
                    type: "success",
                    message: "操作成功!",
                  });
                  scope.addVisible = false;
                  scope.pagelist();
                } else {
                  scope.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                }
              },
              (error) => {
                window.console.log(error);
              }
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addApply() {
      this.addVisible = true;
      this.titlePra.title = "添加新应用";
      this.titlePra.applyCode = "1";
      // this.$refs["form"].resetFields();
      // this.form = {}
      // this.abilytyOptionData = [];
      // this.classificationTextData = [],
      this.requstData = [];
      this.clear();
      // this.abbityClass("voice");
      this.disabled = false;
      this.smallIconUrl = null;
      this.testSmallIconUrl = null;
      this.formSmallIconUrl = null;
      this.textFormSmallIconUrl = null;
      getCurrentLanguage().then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            this.form.language = res.data.data;
          });
        }
      });
    },
    cansell() {
      this.addVisible = false;
      this.clear();
      this.pagelist();
    },
    clear() {
      this.form = {
        status: "1",
        abilityId: [],
        language: "",
      };
      this.textForm = {
        status: "1",
        abilityId: "",
      };
      this.form.category2 = "voice";
      if (this.category1 === "atom") {
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
      } else {
        this.$refs["textForm"].resetFields();
      }
    },
    preGetData(data) {
      this.requstData = data.requstData;
    },
    centerToPage() {
      this.$emit("showPage", "2");
    },
    experience(row, index, pageHeader) {
      const self = this;
      if (row.category1 === "atom") {
        const params = {
          appKey: row.appKey,
          appSecret: row.appSecret,
          abilityCode: row.code,
          pageHeader, //判断是不是接口说明跳转过来的
        };
        if (index === 1) {
          //1、跳到体验页面；2、跳到接口页面
          //headerTitle判断体验页面是什么方式跳转的
          this.$emit(
            "centerPage",
            { ...row, ...params, headerTitle: "apply" },
            "2"
          );
          this.setCurentRouterPage('apply')
        } else {
          this.$emit(
            "centerPage",
            { ...row, ...params, headerTitle: "接口说明" },
            "3"
          );
          this.setCurentRouterPage('interFace')
        }
      } else {
        let abilityCode = null;
        if (index === 1) {
          abilityCode = row.testUrl;
        } else {
          abilityCode = row.docUrl;
        }
        const params = {
          appKey: row.appKey,
          appSecret: row.appSecret,
          abilityCode,
          pageHeader, //判断是不是接口说明跳转过来的
        };
        if (index === 1) {
          //1、跳到体验页面；2、跳到接口页面
          self.$emit(
            "centerPage",
            { testUrl: abilityCode, ...params, headerTitle: "应用管理" },
            "2"
          );
        } else {
          this.$emit(
            "centerPage",
            { testUrl: abilityCode, ...params, headerTitle: "接口说明" },
            "3"
          );
        }
      }
      // this.$emit('showPage','2')
    },
    // testUseInterface(key) {
    //   let flag = false;
    //   aiInterfaceParama.params.dataJson.map((v) => {
    //     if (v[key]) {
    //       flag = true;
    //     }
    //   });
    //   return flag;
    // },
    manual(item, index) {
      const self = this;
      // item.name = null;
      if (index === 2) {
        self.experience(item, index, "接口说明");
      } else if (index === 3) {
        self
          .$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            applicationDelete({ id: item.id }).then(() => {
              self.$message({
                type: "success",
                message: "操作成功!",
              });
              self.pagelist();
            });
          });
      } else {
        self.addVisible = true;
        self.titlePra.applyCode = "1";
        self.titlePra.title = "应用克隆";
        self.disabled = false;
        self.viewsFlag = false;
        if (self.category1 === "atom") {
          self.form = {
            businesstypeId: item.businesstypeId,
            category1: item.category1,
            category2: item.abiCategory,
            code: item.code,
            description: item.description,
            endTime: item.endTime,
            name: null,
            status: item.status,
            smallIconUrl: item.smallIconUrl,
            abilityId: item.abilityId,
          };
          self.smallIconUrl = item.smallIconUrl;
          self.formSmallIconUrl = item.smallIconUrl;
          const applicationId = item.id;
          getHuilanAiApplicationAbilityRelationByApplicationId({
            applicationId,
          }).then((res) => {
            const data = res.data;
            if (data.success) {
              const arr = [];
              data.data.map((v) => {
                arr.push(v.id);
              });
              self.form.abilityId = arr;
            }
          });
          // self.abbityClassEdit(item.abiCategory);
        } else {
          self.textForm = {
            businesstypeId: item.businesstypeId,
            category1: item.abilityId,
            category2: item.category2,
            configUrl: item.configUrl,
            description: item.description,
            docUrl: item.docUrl,
            endTime: item.endTime,
            jsonValue: item.jsonValue,
            name: null,
            runUrl: item.runUrl,
            status: item.status,
            testUrl: item.testUrl,
            smallIconUrl: item.smallIconUrl,
          };
          self.testSmallIconUrl = item.smallIconUrl;
          self.textFormSmallIconUrl = item.smallIconUrl;
        }
        if (item.jsonValue) {
          self.requstData = JSON.parse(item.jsonValue);
        }
      }
    },
    async uploadSuccess(response /*, file, fileList*/) {
      const { data, success, msg } = response;
      if (!success) {
        this.$message.error(msg);
        return;
      }
      // const postData = {
      //   url: data.newFileName,
      //   thumbUrl: data.thumbPath
      // }
      if (this.category1 === "atom") {
        const base = baseURL.substr(0, baseURL.length - 1);
        this.smallIconUrl = `${base}${data.newFileName}`;
        this.form.smallIconUrl = `${base}${data.newFileName}`;
        this.formSmallIconUrl = `${base}${data.newFileName}`;
      } else {
        this.testSmallIconUrl = `${data.newFileName}`;
        this.textForm.smallIconUrl = `${data.newFileName}`;
        this.textFormSmallIconUrl = `${data.newFileName}`;
      }

      // await add(postData)
      // this.list.push(data.thumbPath)
      // this.getImgList()
    },
    imgMouseenter() {
      this.imgIsFlag = true;
    },
    imgMouseleave() {
      this.imgIsFlag = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.mainWarp {
  .boxScrollbar {}

  .wrap {
    height: 80px;
    background-color: #ffffff;
    box-shadow: 0px 6px 16px 4px rgba(6, 7, 46, 0.05);
    border-radius: 10px 10px 0px 0px;
  }

  .topWarp {
    // margin-top: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header {
      margin-left: 20px;
      display: inline-block;

      .leBox {
        font-family: SourceHanSansCN-Bold;
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 36px;
        letter-spacing: 0px;
        color: #070b2d;
      }

      .txt {
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #565863;
        margin-left: 8px;
      }

      .status {
        // justify-content: flex-end
      }
    }

    .right {
      // display: flex;
      // float: right;
      // margin-right: 30px;

      .box {
        display: flex;
        height: 0;

        .btn {
          font-family: SourceHanSansCN-Normal;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #070b2d;
          line-height: 30px;
        }
      }

      /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: white;
        color: #205ac8;
        font-family: SourceHanSansCN-Normal;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
      }

      /deep/ .el-pagination.is-background .el-pager li {
        background: white;
        color: #9597a0;
        font-family: SourceHanSansCN-Normal;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
      }

      /deep/ .el-pagination .btn-prev {
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #9597a0;
      }

      /deep/ .el-pagination .btn-next {
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #9597a0;
      }
    }

    .input {
      display: inline-block;
      margin-left: 20px;
    }

    .img {
      display: inline-block;
      margin-left: 8px;
      margin-right: 12px;
      width: 32px;
      height: 32px;
      background-color: #205ac8;
      border-radius: 4px;
      text-align: center;

      //.el-icon-search {
      //  font-size: 26px !important;
      //  color: white;
      //  cursor: pointer;
      //}
    }
  }

  .cotaner {
    // margin-left: 10px;
    // margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 2px;

    .item {
      // background: #f0f2f5 !important;

      // border-radius: 10px;
      // border: solid 1px #eeeeee;
      &-box {
        background-color: #ffffff;
        border-radius: 10px;
        border: solid 1px #eeeeee;
      }

      .ledom {
        margin-right: 10px;
      }

      .cen {
        margin: 0 5px;
      }

      .ri {
        margin-left: 10px;
      }
    }

    .header {
      // display: inline-block;
      margin-top: 20px;
    }

    .le {
      display: flex;
    }

    .img {
      margin-left: 20px;
      width: 60px;
      height: 60px;
      // box-shadow: 0px 4px 8px 1px rgba(7, 11, 45, 0.15);
      // border-radius: 10px;
    }

    .status {
      // width: 21px;
      // height: 21px;
      float: right;
      margin-right: 40px;
      margin-top: -50px;

      .image {
        width: 22px;
        height: 22px;
        display: block;
        margin-left: 3px;
        margin: auto;
      }

      //.icon-stop {
      //  display: block;
      //  font-size: 24px !important;
      //  text-align: center;
      //  color: #d6345b;
      //}
      //.el-icon-circle-check,
      .el-icon-circle-close,
      .el-icon-warning {
        display: block;
        font-size: 20px;
      }

      //.icon-unable {
      //  display: block;
      //  font-size: 20px !important;
      //  text-align: center;
      //}

      .btn {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        // line-height: 36px;
        letter-spacing: 0px;
        color: #94c932;
      }

      .btnActive {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #d6345b;
      }

      .stop {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #9597a0;
      }
    }

    .text {
      // display: inline-block;
      margin-left: 20px;
      align-items: center;
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 36px;
      letter-spacing: 0px;
      color: #070b2d;
      margin-top: 10px;
      // word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      margin-right: 10px;
      width: 250px;
      text-overflow: ellipsis;
    }

    .cenText {
      margin-top: 24px;

      .boxDiv {
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
      }

      .tit {
        display: inline-block;
        width: 112px;
        text-align: right;
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 36px;
        letter-spacing: 0px;
        color: #070b2d;
      }

      .txt {
        display: inline-block;
        margin-left: 20px;
        font-family: SourceHanSansCN-Normal;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 36px;
        letter-spacing: 0px;
        color: #565863;
        margin-bottom: -12px;
        width: 280px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .bootto {
      text-align: right;
      margin-top: 20px;
      margin-bottom: 20px;
      padding-right: 26px;

      .btn {}

      /deep/ .view {
        // margin-right: 20px;
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #205ac8;
        font-family: SourceHanSansCN-Normal;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #205ac8;
      }

      /deep/ .serve {
        // margin-right: 26px;
        background-color: #205ac8;
        border-radius: 4px;
        border: solid 1px #c7cad3;
        font-family: SourceHanSansCN-Normal;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #ffffff;
      }

      /deep/ .dele {
        min-width: 80px;
        // margin-right: 26px;
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #c7cad3;
        font-family: SourceHanSansCN-Normal;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #9597a0;
      }
    }
  }

  .addApli {
    .switch {
      margin-left: 8px;
      position: relative;
      top: -1px;
    }
  }

  .avue-view-class {
    overflow-y: hidden;
  }
}

/deep/ .img-uploader {
  width: 108px;
  height: 108px;
  flex-shrink: 0;
  list-style-type: none;
  //overflow: hidden;
  cursor: pointer;
  display: inline-block;
  border: 1px dashed #d9d9d9;
  text-align: center;

  .el-icon-plus {
    line-height: 7;
    width: 100px;
  }
}

.changgeImg {
  position: absolute;
  left: 0;
  opacity: 0.5;
  background: #565863;
  cursor: pointer;

  .icon {
    line-height: 97px;
    color: white;
  }
}

.uploadImg {

  // display: flex;
  /deep/ .el-form-item__content {
    display: flex;
  }
}

.el-pagination {
  background: white;
  padding: 14px 0;
  border-radius: 8px;
  text-align: right;
  padding-right: 20px;
}

.employe {
  padding: 40px 0;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  border: solid 1px #eeeeee;

  .employeImg {
    width: 250px;
    width: 250px;
  }
}

/deep/ .el-pager {
  float: right;
}
</style>
