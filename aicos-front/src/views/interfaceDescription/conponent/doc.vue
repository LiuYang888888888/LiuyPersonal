<template>
  <div class="doc">
    <div class="post">
      <span class="le">POST</span>
      <span class="ri">/aicos-ai/ai/run</span>
    </div>
    <el-row class="requst">
      <el-col class="col1" span="4">请求数据类型</el-col>
      <el-col class="col2" span="6">application/json</el-col>
      <el-col class="col3" span="4">响应数据类型</el-col>
      <el-col class="col4" span="6"> ["*/*"] </el-col>
    </el-row>
    <div class="demo">
      <div class="tit">请求示例</div>
    </div>
    <div>
      <vue-json-editor
        v-model="dataJosn.RequestBody"
        :showBtns="false"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
    </div>
    <div class="parms">
      <div class="tit">请求参数</div>
      <el-table
        :data="dataJosn.RequestBodyTabList"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :border="false"
        :default-expand-all="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="参数名称" width=240> </el-table-column>
        <el-table-column prop="explain" label="参数说明"> </el-table-column>
        <el-table-column prop="type" label="请求类型"> </el-table-column>
        <el-table-column prop="flag" label="是否必须"> </el-table-column>
        <el-table-column prop="dataType" label="数据类型"> </el-table-column>
        <el-table-column prop="schema" label="schema"> </el-table-column>
      </el-table>
    </div>
    <div class="parms">
      <div class="tit">响应状态</div>
      <el-table
        :data="dataJosn.responseStatus"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :border="false"
        :default-expand-all="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="code" label="状态码"> </el-table-column>
        <el-table-column prop="message" label="说明"> </el-table-column>
        <el-table-column prop="schema" label="schema"> </el-table-column>
      </el-table>
    </div>
    <div class="parms">
      <div class="tit">响应参数</div>
      <el-table
        :data="dataJosn.responseParameter"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :border="false"
        :default-expand-all="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="参数名称" width="220">
        </el-table-column>
        <el-table-column prop="message" label="参数说明" width="200">
        </el-table-column>
        <el-table-column prop="type" label="类型"> </el-table-column>
        <el-table-column prop="schema" label="schema"> </el-table-column>
      </el-table>
    </div>
    <div class="parms">
      <div class="tit">响应示例</div>
      <vue-json-editor
        v-model="dataJosn.example"
        :showBtns="false"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
    </div>
  </div>
</template>

<script>
// import vueJsonEditor from "vue-json-editor";
const vueJsonEditor = ()=>import('vue-json-editor');
export default {
  name: "doc",
  props: {
    docDataJson: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch:{
    docDataJson(newName) {
      this.dataJosn = newName
    }
  },
  components: {
    vueJsonEditor,
  },
  data() {
    return {
      text:"",
      dataJosn: {
        RequestBody: {},
        RequestBodyTabList: [],
        responseStatus: [],
        responseParameter: [],
        example: {},
      },
    };
  },
  methods: {
    onJsonChange(value) {
      console.log("value:", value);
    },
    onJsonSave(value) {
      console.log("value:", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.doc {
  /deep/ .jsoneditor-poweredBy{
    display: none;
  }
  /deep/ .jsoneditor-outer{
    height: 250px;
  }
  margin-bottom: 50px;
  /deep/ div.jsoneditor {
    min-height: 250px;
  }
  .post {
    border-color: #49cc90;
    background: rgba(73, 204, 144, 0.1);
    .le {
      display: inline-block;
      background: #49cc90;
      font-size: 14px;
      font-weight: 700;
      min-width: 80px;
      padding: 6px 15px;
      text-align: center;
      border-radius: 3px;
      // text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
      font-family: Titillium Web, sans-serif;
      color: #fff;
    }
    .ri {
      display: inline-block;
      margin-left: 20px;
    }
  }
  .requst {
    height: 45px;
    line-height: 45px;
    .col1 {
      font-size: 14px;
      font-weight: 700;
    }
    .col2 {
      font-size: 14px;
      font-weight: 700;
    }
  }
  .demo {
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 600;
    height: 30px;
    line-height: 30px;
    border-left: 4px solid #00ab6d;
    text-indent: 8px;
    .tit {
    }
  }
  .parms {
    .tit {
      margin-top: 20px;
      margin-bottom: 5px;
      font-size: 16px;
      font-weight: 600;
      height: 30px;
      line-height: 30px;
      border-left: 4px solid #00ab6d;
      text-indent: 8px;
    }
  }
}
</style>
