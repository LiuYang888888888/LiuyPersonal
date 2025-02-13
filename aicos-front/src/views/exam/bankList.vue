<template>
  <HuilanBasic :left-width="250">
    <template v-slot:left>
      <div class="page-view-left">
        <avue-tree
          class="left-tree-main"
          ref="treeRef"
          :key="treeKey"
          :option="treeOption"
          :data="treeData"
          @node-click="treeNodeClick"
          v-model="treeform"
        >
          <template v-slot="{ node, data }">
            <div class="left-tree-node">
              <div class="left-tree-node-label" :title="node.label">
                {{ node.label }}
              </div>
              <div v-if="treeCanHandle">
                <el-button-group class="left-tree-btns">
                  <el-button
                    class="btn"
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    title="新增"
                    v-if="permissionList.treeAddBtn"
                    @click.stop="addTreeNode(node, data)"
                  ></el-button>
                  <el-button
                    class="btn"
                    v-if="data.id !== '0' && permissionList.treeEditBtn"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    title="编辑"
                    @click.stop="updateTreeNode(node, data)"
                  ></el-button>
                  <el-button
                    class="btn"
                    v-if="
                      data.id !== '0' &&
                      data.isLeaf != '0' &&
                      permissionList.treeDelBtn
                    "
                    type="primary"
                    size="mini"
                    icon="el-icon-delete"
                    title="删除"
                    @click.stop="delTreeNode(node, data)"
                  >
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>
        </avue-tree>

        <QSGDrawer
          :title="treeFormTitle"
          :fullscreen="false"
          :size="640"
          append-to-body
          :visible.sync="treeFormTag"
          :wrapperClosable="false"
        >
          <avue-form
            ref="treeFormRef"
            :key="treeFormKey"
            :option="treeFormOption"
            v-model="treeFormData"
          ></avue-form>

          <template v-slot:footer>
            <el-button
              size="small"
              icon="el-icon-circle-check"
              type="primary"
              @click.stop="treeFormSave"
              >确 定</el-button
            >
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click.stop="treeFormClose"
              >取 消</el-button
            >
          </template>
        </QSGDrawer>
      </div>
    </template>
    <div class="inTab">
      <div class="bankList qsgMain">
        <HuilanBasicToolbar>
          <el-button
            type="primary"
            size="small"
            @click.stop="addRow"
            v-if="permissionList.addBtn"
            >新增题目</el-button
          >

          <el-button
            type="primary"
            size="small"
            @click.stop="batchAdd"
            v-if="permissionList.addBthBtn"
            >批量新增</el-button
          >

          <el-button
            type="success"
            size="small"
            @click.stop="batchIn"
            v-if="permissionList.importBtn"
            >导入题库</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click.stop="batchOut"
            v-if="permissionList.exportBtn && treeCurrentNode.id !== '0'"
            >导出题库</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click.stop="batchDelete"
            v-if="permissionList.batchDelBtn"
            >批量删除</el-button
          >
        </HuilanBasicToolbar>

        <HuilanBasicSearchbar
          :model="searchForm"
          :fields="searchFieldList"
          @reset="searchReset"
          @search="searchChange"
        >
          <template v-slot:appendTool>
            <el-button type="default" @click="configColumn"
              ><i class="el-icon-s-operation"></i
            ></el-button>
          </template>
        </HuilanBasicSearchbar>

        <avue-crud
          :option="listOption"
          :table-loading="loading"
          :data="listData"
          ref="listRef"
          v-model="listForm"
          :page.sync="page"
          :permission="permissionList"
          :before-open="beforeOpen"
          :before-close="beforeClose"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
          @tab-click="crudUpdateTabClick"
          :upload-after="uploadAfter"
          :upload-before="uploadBefore"
          :upload-error="uploadError"
          :upload-delete="uploadDelete"
          :upload-preview="uploadPreview"
        >
          <template slot="bankSubjectNameForm">
            <div>
              <div style="text-align: right">
                <el-button
                  size="small"
                  type="text"
                  style="margin-right: 10px"
                  v-if="listForm.subjectType === 4 && type !== 'view'"
                  @click="insertSymbolClick"
                  >插入填空符</el-button
                >
                <el-checkbox
                  v-model="listForm.labelPlus"
                  size="small"
                  v-if="type !== 'view'"
                  >高级模式</el-checkbox
                >
              </div>
              <template v-if="listForm.labelPlus">
                <avue-ueditor
                  ref="labelRef"
                  v-model="listForm.bankSubjectName"
                  :options="ueditorOptions"
                ></avue-ueditor>
              </template>
              <template v-else>
                <el-input
                  size="small"
                  type="textarea"
                  :autosize="{ minRows: 5 }"
                  maxlength="500"
                  show-word-limit
                  v-if="type !== 'view'"
                  @blur="examInputBlur"
                  v-model="listForm.bankSubjectName"
                ></el-input>
                <span v-else>{{ listForm.bankSubjectName }}</span>
              </template>
            </div>
          </template>
          <template slot="optionItemForm">
            <template
              v-if="listForm.subjectType !== 4 && listForm.subjectType !== 5"
            >
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="handleAddFields"
                  v-if="type !== 'view'"
                  >添加选项</el-button
                >
                <li
                  v-for="(item, index) in listForm.optionItem"
                  :key="'dic_' + index"
                  class="selectQutItemLi"
                >
                  <div class="selectQutItemBtn">
                    <div class="left">
                      <el-button
                        title="删除"
                        @click="handleRemoveFields(index)"
                        circle
                        plain
                        v-show="type !== 'view'"
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                      >
                      </el-button>
                    </div>
                    <div class="right">
                      <el-checkbox
                        :key="'labelPlusKey_' + labelPlusKey"
                        @change="
                          (e) => {
                            canLabelPlus(item.value, e);
                          }
                        "
                        :checked="item.labelPlus"
                        >高级</el-checkbox
                      >
                      <el-checkbox
                        :key="'checkboxKey_' + checkboxKey"
                        :checked="item.canChecked"
                        style="margin-right: 0px"
                        :label="item.value"
                        :disabled="type === 'view'"
                        @change="
                          (e) => {
                            checkboxMark(item.value, e);
                          }
                        "
                        v-if="listForm.subjectType === 2"
                        >正确答案</el-checkbox
                      >

                      <el-radio
                        :key="'radioKey_' + new Date().getTime()"
                        v-model="radioMark"
                        style="margin-right: 0px"
                        :disabled="type === 'view'"
                        :label="item.value"
                        v-if="
                          listForm.subjectType == 1 || listForm.subjectType == 3
                        "
                        @click.native.prevent="
                          type === 'view'
                            ? console.log(type)
                            : radioClick(item.value)
                        "
                        >正确答案</el-radio
                      >
                    </div>
                  </div>
                  <avue-ueditor
                    :id="'ueditorKey_' + index"
                    v-if="item.labelPlus"
                    ref="ueditorRef"
                    :key="'ueditorKey_' + index + '_' + new Date().getTime()"
                    v-model="item.label"
                    :options="ueditorOptions"
                  ></avue-ueditor>
                  <el-input
                    v-show="!item.labelPlus"
                    type="textarea"
                    :rows="2"
                    maxlength="200"
                    show-word-limit
                    size="mini"
                    clearable
                    :disabled="type === 'view'"
                    v-model="item.label"
                    placeholder="请输入选项"
                    @blur="handleLabelChange(item.label, index)"
                  ></el-input>
                </li>
              </div>
            </template>
            <template v-if="listForm.subjectType === 4">
              <div>
                <li
                  v-for="(item, index) in listForm.optionItem"
                  :key="'dic_' + index"
                  class="selectQutItemLi"
                >
                  <div class="selectQutItemBtn">
                    <div class="right" style="width: 100%; text-align: right">
                      <el-checkbox
                        :key="'labelPlusKey_' + labelPlusKey"
                        @change="
                          (e) => {
                            canLabelPlus(item.value, e);
                          }
                        "
                        :checked="item.labelPlus"
                        >高级</el-checkbox
                      >
                    </div>
                  </div>
                  <avue-ueditor
                    :id="'ueditorKey_' + index"
                    v-if="item.labelPlus"
                    ref="ueditorRef"
                    :key="'ueditorKey_' + index + '_' + new Date().getTime()"
                    v-model="item.label"
                    :options="ueditorOptions"
                  ></avue-ueditor>
                  <el-input
                    v-show="!item.labelPlus"
                    type="textarea"
                    :rows="2"
                    maxlength="200"
                    show-word-limit
                    size="mini"
                    clearable
                    :readonly="type === 'view'"
                    v-model="item.label"
                    placeholder="请输入选项"
                    @blur="handleLabelChange(item.label, index)"
                  ></el-input>
                </li>
              </div>
            </template>
          </template>
          <template slot="bankSubjectNameLabel">
            <span>问题配置:</span>
          </template>
          <template slot="subjectTypeLabel">
            <span>试题类型</span>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              size="small"
              v-if="permissionList.viewBtn"
              @click.stop="viewRow(scope.row, scope.index)"
              >查看
            </el-button>

            <el-button
              type="text"
              size="small"
              v-if="permissionList.editBtn"
              @click.stop="updateRow(scope.row, scope.index)"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="permissionList.delBtn"
              @click.stop="deleteRow(scope.row, scope.index)"
              >删除
            </el-button>
          </template>
        </avue-crud>
      </div>
    </div>

    <QSGDrawer
      :title="dataInTitle"
      :fullscreen="false"
      :size="600"
      append-to-body
      :visible.sync="dataInTag"
      :wrapperClosable="false"
    >
      <avue-form
        :class="inFormClass"
        :option="inFormOption"
        ref="inFormRef"
        v-model="inFormData"
        :key="dataInTag"
      >
        <template slot-scope="scope" slot="templateFile">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            @click.stop="templateFileDown"
            >数据模板下载</el-button
          >
        </template>
        <template slot-scope="scope" slot="excelFile">
          <el-upload
            class="upload-demo"
            ref="uploadDom"
            v-model="inFormData.excelFile"
            :data="scope.column.data"
            action=""
            :accept="scope.column.accept"
            :with-credentials="true"
            :auto-upload="false"
            :multiple="scope.column.multiple"
            :limit="scope.column.limit"
            :drag="scope.column.dragFile"
            :on-success="inFormUploadAfter"
            :on-error="inFormUploadError"
            :before-upload="inFormUploadBefore"
            :on-remove="inFormUploadRemove"
            :on-exceed="inFormUploadExceed"
            :on-change="inFormUploadChange"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">{{ scope.column.tip }}</div>
          </el-upload>
        </template>

        <template slot-scope="scope" slot="analyseFile">
          <div>
            <div v-html="analyseFileRes"></div>
          </div>
        </template>
      </avue-form>

      <template v-slot:footer>
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click.stop="dataInSave"
          >保 存</el-button
        >
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click.stop="dataInClose"
          >取 消</el-button
        >
      </template>
    </QSGDrawer>

    <QSGDrawer
      :title="addBthTitle"
      :fullscreen="false"
      :size="600"
      append-to-body
      :visible.sync="addBthTag"
      :wrapperClosable="false"
    >
      <div
        v-for="(addForm, index) in addBthFormData"
        :key="'addBthForm_' + addBthFormKey + '_' + index"
        class="addBthFormMain"
      >
        <div class="addBthFormDel" v-if="addBthFormData.length > 1">
          <el-button
            size="small"
            icon="el-icon-delete-solid"
            type="danger"
            circle
            plain
            @click.stop="addBthDelForm(index)"
          ></el-button>
        </div>
        <avue-form
          class="addBthForm"
          :option="listOption"
          ref="addBthFormRef"
          v-model="addBthFormData[index]"
        ></avue-form>
      </div>

      <div class="addBthFormBtn">
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          type="success"
          @click.stop="addBthAddForm"
          >添加题目</el-button
        >
      </div>

      <template v-slot:footer>
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click.stop="addBthSave"
          >保 存</el-button
        >
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click.stop="addBthClose"
          >取 消</el-button
        >
      </template>
    </QSGDrawer>
  </HuilanBasic>
</template>
<script>
import {
  getTreeData,
  saveTreeData,
  updateTreeData,
  deleteTreeData,
} from "@/api/exam/bankList/tree";
import {
  getList,
  delList,
  batchDelList,
  addList,
  updateList,
  importFile,
} from "@/api/exam/bankList/table";
import { mapGetters } from "vuex";
import QSGSearchBar from "@/components/QSGSearchBar/index";
import QSGDrawer from "@/components/QSGDrawer/index";
import HuilanUploader from "@/components/uploader";
import { isNull, getHtmlPlainText } from "@/util/qsgCommon";

import { baseURL } from "@/api/common";
import { deepClone } from "@/util/util";
import serviceList from "@/config/serviceList";
import { getRules } from "@/util/regx";
import { getToken } from "@/util/auth";

import { makeApiJsonByDomitem, makeFrontJsonByBackJson } from "./examPublic";
export default {
  name: "AicosFrontBankList",
  components: {
    QSGSearchBar,
    QSGDrawer,
    HuilanUploader,
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        treeAddBtn: this.vaildData(this.permission["exam-treeSave"], false),
        treeEditBtn: this.vaildData(this.permission["exam-treeUpdate"], false),
        treeDelBtn: this.vaildData(this.permission["exam-treeDelete"], false),
        addBtn: this.vaildData(this.permission["exam-bank-add"], false),
        editBtn: this.vaildData(this.permission["exam-bank-update"], false),
        delBtn: this.vaildData(this.permission["exam-bank-del"], false),
        batchDelBtn: this.vaildData(
          this.permission["exam-bank-batchDel"],
          false
        ),
        viewBtn: this.vaildData(this.permission["exam-bank-detail"], false),
        importBtn: this.vaildData(this.permission["exam-bank-import"], false),
        exportBtn: this.vaildData(this.permission["exam-bank-export"], false),
      };
    },
  },
  data() {
    return {
      //
      treeNodeIsLeaf: false,
      treeCanHandle: true,
      treeKey: 0,
      treeData: [
        {
          name: "试题分类",
          id: "0",
          active: false,
          children: [],
        },
      ],
      treeOption: {
        filter: true,
        menu: false,
        addBtn: false,
        nodeKey: "id",
        props: {
          label: "name",
          children: "children",
          // 设置了value后getNode才能通过key获取节点
          value: "id",
        },
        defaultExpandedKeys: ["0"],
      },
      treeFormHandleType: "add",
      treeCurrentNode: {
        name: "试题分类",
        id: "0",
        active: false,
        children: [],
      },

      treeFormTag: false,
      treeFormTitle: "树表单",
      treeFormKey: 0,
      treeFormData: {},
      treeFormOption: {
        span: 24,
        menuBtn: false,
        column: [
          {
            label: "id",
            prop: "id",
            display: false,
          },
          {
            label: "父级Id",
            prop: "parentId",
            display: false,
          },
          {
            label: "节点名称",
            prop: "name",
            showWordLimit: true,
            maxlength: 50,
            rules: [
              {
                required: true,
                message: "请输入节点名称",
                trigger: "blur",
              },
              ...getRules(["charNumHan"]),
            ],
          },
        ],
      },
      searchForm: {
        keyWords: "",
        subjectType: "",
      },
      searchFieldList: [
        {
          prop: "keyWords",
          placeholder: this.$t("aicosCommon.pleaseInput"),
        },
        {
          prop: "subjectType",
          type: "select",
          dicData: [
            {
              label: "单选题",
              value: 1,
            },
            {
              label: "多选题",
              value: 2,
            },
            {
              label: "判断题",
              value: 3,
            },
            {
              label: "填空题",
              value: 4,
            },
            {
              label: "问答题",
              value: 5,
            },
          ],
        },
      ],
      //
      addBthFormKey: 0,
      addBthTitle: "批量新增",
      addBthTag: false,
      addBthFormData: [],

      optionsValid: true,
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      handlerType: "",

      listForm: {
        prop: "Fd_" + new Date().getTime(),
      },
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        menuBtn: true,
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        index: true,
        selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        columnBtn: true,

        dialogClickModal: false,
        dialogWidth: "30%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        span: 24,
        // labelWidth: 90,
        menuAlign: "center",

        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: "题目",
            prop: "bankSubjectName",
            overHidden: true,
            search: true,
            type: "textarea",
            minRows: 5,
            maxlength: 500,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入题目",
                trigger: "blur",
              },
              // ...getRules(["notEnSpecials"]),
            ],
          },
          {
            label: "试题分类",
            prop: "categoryId",
            type: "tree",
            span: 24,
            props: {
              label: "name",
              value: "id",
            },
            dicData: [],
            display: true,
            hide: true,
            rules: [
              {
                required: true,
                message: "请选择试题分类",
              },
            ],
          },
          {
            label: "题型",
            prop: "subjectType",
            align: "center",
            width: 160,
            type: "select",
            search: true,
            searchType: "select",
            dicData: [
              {
                label: "单选题",
                value: 1,
              },
              {
                label: "多选题",
                value: 2,
              },
              {
                label: "判断题",
                value: 3,
              },
              {
                label: "填空题",
                value: 4,
              },
              {
                label: "问答题",
                value: 5,
              },
            ],
            value: 1,
            rules: [
              {
                required: true,
                message: "请选择题型",
                trigger: "blur",
              },
            ],
            control: (val, form) => {
              //console.log(111,val,222,form)
              if (val && (form.optionItem || form.referenceAnswer)) {
                if (
                  ["add", "edit", "batchAdd", "view"].includes(
                    this.handlerType
                  ) &&
                  !isNull(val) &&
                  !isNull(form)
                ) {
                  if (val == 1 || val == 2 || val == 3 || val == 4) {
                    return {
                      optionItem: { display: true },
                      referenceAnswer: { display: false },
                    };
                  } else if (val == 5 || val == 6) {
                    return {
                      optionItem: { display: false },
                      referenceAnswer: { display: true },
                    };
                  } else {
                    return {};
                  }
                }
              } else {
                return {};
              }
            },
          },
          {
            label: "答案配置",
            prop: "optionItem",
            type: "array",
            hide: true,
            value: [],
            rules: [
              {
                required: true,
                message: "请输入答案配置",
                trigger: "blur",
              },
            ],
          },
          {
            label: "参考答案",
            prop: "referenceAnswer",
            type: "textarea",
            hide: true,
            minRows: 5,
            rules: [
              {
                required: true,
                message: "请输入参考答案",
                trigger: "blur",
              },
            ],
          },
          {
            width: 180,
            label: "创建人",
            prop: "createUser",
            hide: false,
            display: false,
          },
          {
            label: "创建时间",
            prop: "createTime",
            hide: false,
            display: false,
          },
          {
            label: "题目解析",
            prop: "problemAnalysis",
            span: 24,
            type: "textarea",
            display: true,
            hide: true,
          },
        ],
      },
      ueditorOptions: {
        customConfig: {
          //lineHeights: ['1', '1.15', '1.6', '2', '2.5', '3000'],
          menus: [
            "bold", //粗体
            "fontSize", //字号
            "fontName", //字体
            "italic", //斜体
            "foreColor", //文字颜色
            "backColor", //背景颜色
            "link", //插入链接
            "justify", //对齐
            "image", //图
          ],
        },
        props: {
          home: "/aicos",
          url: "newFileName",
          res: "data",
        },
        oss: "",
        headers: {},
        data: {},
        action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
      },

      dataInTitle: "导入数据",
      dataInTag: false,
      inFormClass: "",
      inFormKey: 0,
      inFormData: {},
      inFormOption: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 120,
        labelPosition: "right",
        column: [
          {
            label: "下载数据模板",
            prop: "templateFile",
            span: 24,
            formslot: true,
          },
          {
            label: "选择文件",
            prop: "excelFile",
            span: 24,
            formslot: true,
            multiple: false,
            type: "upload",
            dragFile: true,
            data: {
              cateId: "0",
            },
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            accept: ".xls,.xlsx",
            //fileSize: 512,
            limit: 1,
            tip: "只能上传格式为xls的EXECL文件",
            action: `${baseURL}api/${serviceList.exam}/examBankAdmin/import`,
            rules: [
              {
                required: true,
                message: "请上传数据文件",
                trigger: "blur",
              },
            ],
          },
          {
            label: "题目概况",
            prop: "analyseFile",
            span: 24,
            display: false,
            formslot: true,
          },
        ],
      },

      analyseFileData: [],
      analyseFileRes: "",
      tempLabel: "",
      radioMark: "",
      labelPlusKey: 0,
      type: "add",
    };
  },
  mounted() {
    this.initTreeData();
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
  },
  methods: {
    //插入填空符
    insertSymbolClick() {
      this.listForm.optionItem = [];
      // let text = document.getElementById("inputHtml").innerHTML
      // console.log(document.getElementById("inputHtml").innerHTML);
      let arr = deepClone(this.listForm.bankSubjectName).split("{{"),
        newArr = [];
      for (let i in arr) {
        if (arr[i].indexOf("}}") > -1) {
          newArr.push(arr[i]);
        }
      }
      let num = newArr.length + 1;
      this.listForm.bankSubjectName += "{{" + num + "}}";
      let abc = newArr.length;
      for (let i = 0; i <= abc; i++) {
        this.listForm.optionItem.push({
          label: "填空",
          score: 0,
          canInput: false,
          labelPlus: false,
          value: "Fd_" + Date.now() + Math.ceil(Math.random() * 99999),
        });
      }
    },
    // 添加选项
    handleAddFields() {
      this.listForm.optionItem.push({
        //label: '选项_'+(this.data.dicData.length+1),
        label: "新增选项" + (this.listForm.optionItem.length + 1),
        value: new Date().getTime(),
        checked: false,
        canInput: false,
        labelPlus: false,
        canChecked: false,
      });
    },
    radioClick(val) {
      val === this.radioMark ? (this.radioMark = "") : (this.radioMark = val);
    },
    handleLabelChange(val, index) {
      if (
        this.validatenull(val) &&
        (this.listForm.subjectType === 1 ||
          this.listForm.subjectType === 2 ||
          this.listForm.subjectType === 3 ||
          this.listForm.subjectType === 4)
      ) {
        this.$message.warning("选项不能为空");
        this.listForm.optionItem[index].label = "新增选项" + (index + 1);
      }
    },
    canLabelPlus(val, e) {
      this.listForm.optionItem.map((item) => {
        if (item.value == val) {
          if (e) {
            item.labelPlus = true;
          } else {
            item.labelPlus = false;
            item.label = getHtmlPlainText(item.label).substring(0, 200);
          }
        }
      });
      this.labelPlusKey++;
    },
    handleRemoveFields(index) {
      this.listForm.optionItem.splice(index, 1);
    },
    // 失去焦点
    examInputBlur() {
      if (this.listForm.subjectType === 4) {
        let arr = deepClone(this.listForm.bankSubjectName).split("{{"),
          newArr = [];
        for (let i in arr) {
          if (arr[i].indexOf("}}") > -1) {
            newArr.push(arr[i]);
          }
        }
        if (newArr.length > this.listForm.optionItem.length) {
          let num = newArr.length - this.listForm.optionItem.length;
          for (let i = 0; i < num; i++) {
            this.listForm.optionItem.push({
              label: "填空",
              score: 0,
              canInput: false,
              labelPlus: false,
              value: "Fd_" + Date.now() + Math.ceil(Math.random() * 99999),
            });
          }
        }
        if (newArr.length === 0) {
          this.listForm.optionItem = [];
        }
        if (newArr.length < this.listForm.optionItem.length) {
          this.listForm.optionItem = deepClone(this.listForm.optionItem).splice(
            this.listForm.optionItem.length - newArr.length
          );
        }
      }
    },
    checkboxMark(val, e) {
      if (!Array.isArray(this.listForm.disChecked)) {
        //console.log( this.data.disChecked);
        this.listForm.disChecked = [];
      }

      this.listForm.optionItem.map((item) => {
        if (item.value == val) {
          if (e) {
            item.canChecked = true;
            this.listForm.disChecked.push(val);
          } else {
            item.canChecked = false;
            this.listForm.disChecked = this.listForm.disChecked.filter(
              (info) => info !== val
            );
          }
        }
      });
      console.log(this.listForm.disChecked);
    },
    successFun() {
      this.$message({
        type: "success",
        message: "操作成功",
      });
    },

    initTreeData() {
      let categoryId = this.findObject(this.listOption.column, "categoryId");
      getTreeData().then((res) => {
        const dataRes = res.data.data;
        this.treeData[0].children = dataRes || [];
        categoryId.dicData = dataRes || [];
        this.treeNodeCurrent();
        // this.treeKey++;
      });
    },
    treeNodeCurrent() {
      if (!isNull(this.treeCurrentNode)) {
        const ancestors = this.treeCurrentNode.ancestors || "0";
        this.treeOption.defaultExpandedKeys = ancestors.split(",");
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(this.treeCurrentNode.id);
        });
      }
    },

    treeNodeClick(data) {
      // console.log("treeNodeClick", data, node, e);
      this.treeCurrentNode = { ...data };
      // console.log("treeNodeClick", this.treeCurrentNode);
      this.onLoad(this.page);
    },
    addTreeNode(node, data) {
      this.treeFormTitle = "新增";
      this.treeFormHandleType = "add";
      this.treeFormKey++;
      this.treeFormTag = true;
      this.treeFormData = {
        parentId: data.id,
        name: "",
        weight: "",
      };
    },
    updateTreeNode(node, data) {
      this.treeFormTitle = "树编辑";
      this.treeFormHandleType = "edit";
      this.treeFormKey++;
      this.treeFormTag = true;
      this.treeFormData = {
        id: data.id,
        parentId: data.parentId,
        name: data.name,
        weight: data.weight,
      };
    },
    delTreeNode(node, data) {
      this.$confirm("确定将选择的节点删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTreeData({ ...data }).then(() => {
            this.treeCurrentNode = {
              id: data.parentId,
              ancestors: data.ancestors,
            };
            this.successFun();
            this.initTreeData();
          });
        })
        .catch(() => {
          window.console.log("操作已取消");
        });
    },

    treeFormSave() {
      this.$refs.treeFormRef.validate((valid, done) => {
        if (valid) {
          const dataParam = {
            ...this.treeFormData,
          };

          const componentFun = (param) => {
            return this.treeFormHandleType == "add"
              ? saveTreeData(param)
              : updateTreeData(param);
          };

          componentFun(dataParam).then((res) => {
            const dataRes = res.data.data;
            this.successFun();
            this.treeCurrentNode = dataRes;
            this.initTreeData();
            this.treeFormClose();
          });
          done();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    treeFormClose() {
      this.treeFormTag = false;
    },
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    viewRow(row, index) {
      this.type = "edit";
      this.$refs.listRef.rowView(row, index);
    },
    addRow(/*row, index*/) {
      this.type = "add";
      this.$refs.listRef.rowAdd();
    },
    updateRow(row, index) {
      this.type = "edit";
      this.$refs.listRef.rowEdit(row, index);
    },
    deleteRow(row /*, index*/) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delList({ id: row.id });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.refreshChange();
        });
    },
    refreshChange() {
      this.onLoad(this.page);
    },
    batchDelete() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要处理的数据",
        });
      } else {
        this.$confirm(
          "确认是否删除 " + this.selectionList.length + " 条数据？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          const selectIds = this.selectionList.map((item) => item.id);

          batchDelList({ ids: selectIds.join(",") }).then(
            (/*res*/) => {
              this.refreshChange();
              this.$message({
                type: "success",
                message: "操作成功",
              });
            },
            (error) => {
              window.console.log(error);
            }
          );
        });
      }
    },
    /*updateStatusRow(row, index){

    },*/
    rowSave(row, done, loading) {
      if (!this.optionsValid) {
        return false;
      }
      delete row.createUser;
      delete row.createTime;
      const itemJson = makeApiJsonByDomitem(row);

      const dataParam = {
        ...row,
        optionNum: itemJson.optionNum,
        editorFrontJson: JSON.stringify(itemJson.frontJson),
        editorBackJson: JSON.stringify(itemJson.backJson),
      };
      addList(dataParam).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.radioMark = "";
          this.refreshChange();
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    async rowUpdate(row, index, done, loading) {
      const itemJson = makeApiJsonByDomitem(row);

      const dataParam = {
        ...row,
        optionNum: itemJson.optionNum,
        editorFrontJson: JSON.stringify(itemJson.frontJson),
        editorBackJson: JSON.stringify(itemJson.backJson),
      };

      await updateList(dataParam).then(
        () => {
          this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.radioMark = "";
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    searchReset() {
      this.query = {};
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange() {
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    selectionChange(list) {
      this.selectionList = list;
    },

    selectionClear() {
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },

    beforeOpen(done, type) {
      this.type = type;
      if (["add", "edit", "view"].includes(type)) {
        this.$set(this.listOption, "menuBtn", true);
        if (type === "add") {
          this.listForm.optionItem = [
            {
              label: "选项一",
              value: "0",
              checked: false,
              canInput: false,
              canChecked: false,
            },
          ];
        }
        this.initData(type);
        if (this.treeCurrentNode.id !== "0") {
          this.listForm.categoryId = this.treeCurrentNode.id;
        }

        this.handlerType = type;
      }
      done();
    },
    // beforeClose(done /*, type*/) {
    //   this.refreshChange();
    //   done();
    // },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    initData(type) {
      if (type == "view" || type == "edit") {
        if (
          this.listForm.subjectType === 1 ||
          this.listForm.subjectType === 3
        ) {
          this.listForm.optionItem.map((item) => {
            if (item.checked) {
              this.radioMark = item.value;
            }
          });
        }
      }
    },

    onLoad(page) {
      this.loading = true;

      const dataParam = {
        ...this.searchForm,
        current: page.currentPage,
        size: page.pageSize,
        categoryId: this.validatenull(this.treeCurrentNode.id)
          ? "0"
          : this.treeCurrentNode.id,
      };

      getList(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records.map((item) => {
          //导入的数据 editorFrontJson 可能为空 需要先转换一下
          if (isNull(item.editorFrontJson)) {
            item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
          }

          if (
            item.subjectType == 1 ||
            item.subjectType == 2 ||
            item.subjectType == 3 ||
            item.subjectType === 4
          ) {
            item.optionItem = this.makeOptionItem(item.editorFrontJson);
            //item.optionNum = item.optionItem.length;
          } else {
            item.optionNum = "-";
          }
          if (item.subjectType === 5) {
            item.referenceAnswer = JSON.parse(
              item.editorFrontJson
            ).referenceAnswer;
          }

          return item;
        });

        this.loading = false;
        this.selectionClear();
      });
    },
    shareRow(row) {
      const dataParam = {
        id: row.id,
      };
      updateList(dataParam).then(
        () => {
          this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    makeOptionItem(data) {
      let res = [];
      let tempJson = JSON.parse(data);
      // console.log(tempJson);
      if (!isNull(tempJson)) {
        if (!isNull(tempJson.dicData)) {
          res = tempJson.dicData;
          // tempJson.dicData.map((item) => {
          //   res.push(item.label);
          // });
        }
      }
      return res;
    },

    batchIn() {
      this.dataInTag = true;
    },
    dataInSave() {
      // console.log(this.$refs.uploadDom.uploadFiles[0].raw);
      if (this.validatenull(this.$refs.uploadDom.uploadFiles[0])) {
        this.$message.warning("请上传文件");
        return false;
      }
      let fileObj = this.$refs.uploadDom.uploadFiles[0].raw;
      let obj = new FormData();
      obj.append("file", fileObj);
      obj.append("cateId", this.treeCurrentNode.id);
      // if (isNull(this.analyseFileData)) {
      //   this.$message.error("文件分析结果内无有效题目，请检查后重新上传！");
      //   return false;
      // }
      importFile(obj).then(
        () => {
          this.dataInClose();
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.onLoad(this.page);
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    dataInClose() {
      this.dataInTag = false;
    },
    analyseFileFun() {
      this.analyseFileData.map((item) => {
        if (isNull(item.editorFrontJson)) {
          item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
        }
        return item;
      });

      let analyseResCount = {
        subjectType_1: {
          label: "单选题",
          value: 0,
        },
        subjectType_2: {
          label: "多选题",
          value: 0,
        },
        subjectType_3: {
          label: "下拉选择题",
          value: 0,
        },
        subjectType_4: {
          label: "单行文本",
          value: 0,
        },
        subjectType_5: {
          label: "多行文本",
          value: 0,
        },
        subjectType_6: {
          label: "自定义",
          value: 0,
        },
      };

      this.analyseFileRes = '<div class="analyseFileRes">';

      for (let key = 1; key < 7; key++) {
        let tempArr = this.analyseFileData.filter(
          (item) => item.subjectType == key
        );
        analyseResCount["subjectType_" + key].value = tempArr.length;
        if (tempArr.length > 0) {
          this.analyseFileRes +=
            "<div>" +
            analyseResCount["subjectType_" + key].label +
            " ( <span>" +
            tempArr.length +
            "</span> )</div>";
        }
      }

      this.analyseFileRes += "</div>";
    },
    dataInReset() {
      const excelFileColumn = this.findObject(
        this.inFormOption.column,
        "excelFile"
      );
      this.$set(excelFileColumn, "data", { bankSubjectType: this.bankType });

      const analyseFileColumn = this.findObject(
        this.inFormOption.column,
        "analyseFile"
      );
      this.$set(analyseFileColumn, "display", false);

      this.analyseFileData = [];
      this.analyseFileRes = "";
    },
    inFormUploadAfter(response /*, file, fileList*/) {
      console.log(response);
      const analyseFileColumn = this.findObject(
        this.inFormOption.column,
        "analyseFile"
      );

      //console.log(response);
      if (response.success) {
        this.$message({
          type: "success",
          message: "成功分析出 " + response.data.length + "条 有效数据!",
        });

        this.$set(analyseFileColumn, "display", true);

        let analyseRes = response.data.map((item) => {
          let backJson = JSON.parse(item.editorBackJson);
          if (!isNull(backJson.dicData)) {
            backJson.dicData = backJson.dicData.filter(
              (info) => !isNull(info.label)
            );
          }

          return {
            ...item,
            optionNum: backJson.dicData.length,
            editorBackJson: JSON.stringify(backJson),
          };
        });

        //console.log(analyseRes);

        this.analyseFileData = analyseRes;

        this.analyseFileFun();

        //this.analyseFileRes = "附件分析结果";
      } else {
        this.$set(analyseFileColumn, "display", false);

        this.dataInReset();

        this.inFormKey++;

        this.$message({
          type: "error",
          message: "数据导入有误，请修正文件！",
        });
      }
    },
    inFormUploadChange(file, fileList) {
      let type = file.name.split(".")[1].toLowerCase();
      if (!["xls", "xlsx"].includes(type)) {
        this.$refs.uploadDom.clearFiles();
        this.$message.error("数据导入有误，请修正文件！");
        return false;
      }
      if (fileList > 0) {
        this.$refs.uploadDom.clearValidate("upload");
      }
    },
    inFormUploadRemove() {
      this.dataInReset();
    },
    inFormUploadExceed() {
      this.$message.error("最多同时上传分析一个文件！");
    },
    inFormUploadBefore(file) {
      console.log(file);
    },
    inFormUploadError(/*err, file, fileList*/) {
      //console.log(err, file, fileList);
      this.$message({
        type: "error",
        message: "上传过程中遇到错误！",
      });
    },
    templateFileDown() {
      window.open(
        `${baseURL}api/${
          serviceList.exam
        }/examBankAdmin/importTemplate?token=${getToken()}`
      );
    },

    batchOut() {
      let urlRes = `${baseURL}api/${
        serviceList.exam
      }/examBankAdmin/export?token=${getToken()}&cateId=${
        this.treeCurrentNode.id
      }&subjectType=${this.searchForm.subjectType}`;
      window.open(urlRes);
      // this.downFile(urlRes /*, fileName*/);

      // const dataParam = {
      //   ...this.searchForm,
      // };
      //let fileName = this.formName+'_' + dateFormat(new Date(), 'ss_mm_hh_dd_MM_yyyy').toString() + '.xlsx';
      // outBankList(dataParam).then(
      //   (res) => {
      //     const urlRes = `${baseURL}` + res.data.data.newFileName.substring(1);
      //     this.downFile(urlRes /*, fileName*/);

      //     this.refreshChange();
      //     this.$message({
      //       type: "success",
      //       message: "操作成功!",
      //     });
      //   },
      //   (error) => {
      //     window.console.log(error);
      //   }
      // );
    },

    optionItemRulesDom(val, arrColumn) {
      //console.log(arrColumn);
      this.optionsValid = true;

      //const arrColumn =this.$refs.listRef.getPropRef('optionItem').$refs.temp.$children;

      arrColumn.map((item, index) => {
        //console.log(item,index)

        if (index % 3 == 1 && val.length == 10) {
          item.$el.className =
            " el-button el-button--primary el-button--small is-circle is-disabled";
          item.$el.disabled = true;
        } else if (index % 3 == 1) {
          item.$el.className =
            " el-button el-button--primary el-button--small is-circle ";
          item.$el.disabled = false;
        } else if (index % 3 == 0) {
          //console.log( item,index );

          /*三句重要*/
          /*item.$children[0].showWordLimit = true;
          item.$children[0].$slots.suffix  = true;
          item.$children[0].$attrs.maxlength = 29;*/

          /*item.$children[0].showWordLimit  = true;
          item.$children[0].$attrs.maxlength = 31;
          item.$children[0].type = 'text' ;
          item.$children[0].inputDisabled = false;
          item.$children[0].readonly  = false;
          item.$children[0].showPassword = false;*/
          if (item.$children.length == 0) {
            return false;
          }
          item.$children[0].value = item.$children[0].value.substring(0, 200);

          let textLength = item.$children[0].value.length;

          if (textLength > 200) {
            item.$el.className =
              "el-tooltip el-input el-input--small textLengthEro ";
            this.optionsValid = this.optionsValid && false;
          } else {
            item.$el.className = "el-tooltip el-input el-input--small";
            this.optionsValid = this.optionsValid && true;
          }

          let preHtml = document.createElement("span");
          preHtml.setAttribute("class", "el-input__suffix");

          let inHtml =
            '<span class="el-input__suffix-inner"><span class="el-input__count"><span class="el-input__count-inner">' +
            textLength +
            "/200</span></span></span>";
          preHtml.innerHTML = inHtml;

          let className = item.$children[0].className + " ";
          if (className.includes("hasSuffix")) {
            item.$el.lastChild.innerHTML = inHtml;
          } else {
            item.$children[0].className =
              "el-tooltip el-input el-input--small hasSuffix";
            item.$el.append(preHtml);
          }
        }
        return item;
      });
    },

    batchAdd() {
      this.addBthFormData = [];
      this.addBthAddForm();
      this.$set(this.listOption, "menuBtn", false);
      this.handlerType = "batchAdd";
      this.addBthTag = true;
      this.addBthFormKey++;
    },
    // addBthSave() {
    //   //console.log(this.addBthFormData);

    //   if (!this.optionsValid) {
    //     return false;
    //   }

    //   // 表单校验
    //   const validateForm = (refName) => {
    //     return new Promise((resolve, reject) => {
    //       refName.validate((valid) => {
    //         if (valid) {
    //           resolve();
    //         } else {
    //           reject(new Error("表单验证错误"));
    //         }
    //       });
    //     });
    //   };

    //   const promiseList = this.$refs.addBthFormRef.map((item) => {
    //     return validateForm(item);
    //   });

    //   Promise.all(promiseList)
    //     .then(() => {
    //       let dataParam = [];
    //       this.addBthFormData.map((item) => {
    //         const itemJson = makeApiJsonByDomitem(item);

    //         dataParam.push({
    //           ...item,
    //           optionNum: itemJson.optionNum,
    //           editorFrontJson: JSON.stringify(itemJson.frontJson),
    //           editorBackJson: JSON.stringify(itemJson.backJson),
    //         });
    //       });

    //       addBthBankList(dataParam).then(
    //         () => {
    //           this.refreshChange();
    //           this.addBthClose();
    //           this.$message({
    //             type: "success",
    //             message: "操作成功",
    //           });
    //         },
    //         (error) => {
    //           window.console.log(error);
    //         }
    //       );
    //     })
    //     .catch(() => {
    //       this.$message.warning("表单验证未通过！");

    //       this.$refs.addBthFormRef.map((item) => {
    //         item.allDisabled = false;
    //       });
    //     });
    // },
    addBthClose() {
      this.$set(this.listOption, "menuBtn", true);
      this.handlerType = "";
      this.addBthTag = false;
      this.addBthFormData = [];
      this.addBthFormKey++;
    },

    addBthAddForm() {
      this.addBthFormData.push({
        bankSubjectName: "",
        subjectType: 1,
        optionItem: ["选项一"],
      });
    },
    addBthDelForm(index) {
      this.addBthFormData.splice(index, 1);
    },
  },
  watch: {
    // "listForm.optionItem": {
    //   handler(val) {
    //     if (
    //       ["add", "edit", "batchAdd"].includes(this.handlerType) &&
    //       !isNull(val) &&
    //       (this.listForm.subjectType == 1 ||
    //         this.listForm.subjectType == 2 ||
    //         this.listForm.subjectType == 3)
    //     ) {
    //       if (val.length > 10) {
    //         val.splice(val.length - 1, 1);
    //       }

    //       this.$nextTick(() => {
    //         //console.log(this.$refs.listRef)
    //         const arrColumn =
    //           this.$refs.listRef.getPropRef("optionItem").$refs.temp.$children;
    //         this.optionItemRulesDom(val, arrColumn);
    //       });
    //     }
    //   },
    //   immediate: true,
    // },
    radioMark: {
      handler(val) {
        this.listForm.value = val;
        this.listForm.disChecked = val;
        if (!this.validatenull(this.listForm.optionItem)) {
          this.listForm.optionItem.map((item) => {
            if (item.value == val) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      },
      immediate: true,
    },
    "listForm.bankSubjectName": {
      handler(val) {
        let maxLabel = 500;
        if (getHtmlPlainText(val).length <= maxLabel - 1) {
          this.tempLabel = val;
        }
        //console.log(this.tempLabel)
        //console.log(this.$refs.labelRef)
        if (getHtmlPlainText(val).length > maxLabel) {
          this.$message.warning("内容长度最大限制为 " + maxLabel);
          this.$nextTick(() => {
            this.listForm.bankSubjectName = this.tempLabel;
          });
        }
      },
      immediate: true,
    },

    addBthFormData: {
      handler(val) {
        if (val.length > 0) {
          val.map((item, index) => {
            //console.log(this.$refs.addBthFormRef[index])

            if (
              ["add", "edit", "batchAdd"].includes(this.handlerType) &&
              !isNull(item.optionItem) &&
              (item.subjectType == 1 ||
                item.subjectType == 2 ||
                item.subjectType == 3 ||
                item.subjectType === 4)
            ) {
              if (item.optionItem.length > 10) {
                item.optionItem.splice(item.optionItem.length - 1, 1);
              }
              this.$nextTick(() => {
                //console.log(this.$refs.addBthFormRef[index])
                const arrColumn =
                  this.$refs.addBthFormRef[index].getPropRef("optionItem").$refs
                    .temp.$children;
                this.optionItemRulesDom(val, arrColumn);
              });
            }

            return item;
          });
        }

        /*this.$nextTick(()=>{
          const arrColumn =this.$refs.listRef.getPropRef('optionItem').$refs.temp.$children;
          this.optionItemRulesDom(val,arrColumn);
        })*/
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.left-tree-main {
  padding-bottom: 30px;
  ::v-deep .avue-tree__filter {
    padding: 20px 20px 0;
  }

  .left-tree-node {
    flex: 1;
    display: flex;
    width: 0;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    > div:first-child {
      flex: 1;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 5px;
    }

    .left-tree-btns {
      display: none;
      padding-right: 5px;
      .btn {
        padding: 3px;
      }
    }
    &:hover {
      .left-tree-btns {
        display: flex;
      }
    }
  }
}

.selectQutItemLi {
  list-style: none;
  .selectQutItemBtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-button {
      padding: 4px;
    }
  }
}

.textLengthEro .el-input__inner,
.textLengthEro.el-input__inner:focus {
  border: 1px solid #f05050;
}
.analyseFileRes {
  padding: 0 10px;
}
.analyseFileRes div {
  font-size: 14px;
  color: #565863;
}
.analyseFileRes div span {
  font-weight: 500;
  color: #f05050;
}

.addBthFormMain {
  position: relative;
  border-top: 2px solid #e4e7ed;
  padding-top: 15px;
}
.addBthFormDel {
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 9999;
}
.addBthFormBtn {
  text-align: center;
  padding: 18px;
  border-top: 2px solid #e4e7ed;
}
</style>
