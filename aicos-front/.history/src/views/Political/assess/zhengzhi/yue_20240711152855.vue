<template>
  <basic-container>
    <avue-crud :option="optionyue" :table-loading="loadingyue" :data="datayue" :page="pageyue" :permission="permissionList"
      :before-open="beforeOpenyue" v-model="formyue" ref="crudyue" @row-update="rowUpdateyue"
      @current-change="currentChangeyue" @size-change="sizeChangeyue" @on-load="onLoadyue">
        <template v-slot:menu="scope">
          <el-button type="text" size="small" @click="yueView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" @click="yueUpdate(scope.row,scope.index)">编辑
          </el-button>
        </template>
      </avue-crud>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getYueLingqu,
  getYueLingquUpdate
} from "@/api/Political/common";
export default {
  data () {
    return {
  }
}
</script>