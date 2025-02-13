<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <el-scrollbar>
        <basic-container>
          <avue-tree
            ref="treeRef"
            :option="treeOption"
            :data="treeData"
            @node-click="nodeClick"
          >
            <template v-slot="{ node, data }">
              <div class="custom-tree-node">
                <div>{{ node.label }}</div>
              </div>
            </template>
          </avue-tree>
        </basic-container>
      </el-scrollbar>
    </template>
    <comFormDataMag :magParamsData="magParamsData"> </comFormDataMag>
  </HuilanBasic>
</template>
<script>
//import { mapGetters } from "vuex";
//import { validatenull } from '@/util/validate'
import { getListData, getFromTemplateNewest } from "@/api/system/commonForm";
import comFormDataMag from "./comFormDataMag";
export default {
  name: "表单数据管理",
  components: {
    comFormDataMag,
  },
  computed: {},
  data() {
    return {
      activeType: {
        type: "dynamic",
        status: 1,
      },

      treeData: [],
      treeFirstData: "",
      treeOption: {
        menu: false,
        addBtn: false,
        nodeKey: "id",
        defaultExpandedKeys: [],
        props: {
          label: "name",
          children: "children",
          value: "id",
        },
      },
      magParamsData: {},
    };
  },
  methods: {
    async getTreeData() {
      const dataParam = {
        ...this.activeType,
        current: 1,
        size: 9999,
      };
      await getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.treeData = dataRes.records;
        if (this.treeData.length > 0) {
          this.nodeClick(this.treeData[0]);
          const that = this;
          setTimeout(() => {
            that.$refs.treeRef.setCurrentKey(this.treeData[0].id);
          }, 200);
        }
      });
    },
    async nodeClick(data /*, node*/) {
      //console.log(data, node);
      const dataResFun = await getFromTemplateNewest({
        metaObjName: data.code,
      });
      const dataRes = dataResFun.data.data;

      this.magParamsData = {
        templateId: dataRes.id,
        metObjName: data.code,
        systemCode: data.systemCode,
      };

      console.log(this.magParamsData + '11111111111111')
    },
  },
  async mounted() {
    await this.getTreeData();
  },
};
</script>
<style lang="scss" scoped></style>
