<template>
  <HuilanDialog
    title="服务管理"
    append-to-body
    width="1200px"
    :before-close="beforeClose"
    :visible.sync="manageVisible"
  >
    <basic-container>
      <el-transfer
        class="container"
        :props="{
          key: 'id',
          label: 'name',
        }"
        :titles="titles"
        @change="transferSave"
        width="500px"
        v-model="value"
        :data="data"
      ></el-transfer>
    </basic-container>
  </HuilanDialog>
</template>

<script>
// import {mapGetters} from "vuex";
import {
  serviceListByPage,
  applicationGetApplicationServiceRelationListByApplicationId,
  saveHuilanAiApplicationServiceRelationByApplicationId,
} from "@/api/configure/application";
export default {
  name: "appliServicesManger",
  data() {
    return {
      manageVisible: false,
      value: [],
      data: [],
      titles: ["未选则的服务列表", "已选则服务列表"],
      applicationId: null,
    };
  },
  props:{
    pagelist:{
      type:Function,
      default(){
        return {}
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    doLayout() {
      this.$refs.crud && this.$refs.crud.doLayout();
    },
    transferSave(value) {
      const scope = this
      if (this.applicationId) {
        const params = {
          serviceId: value.join(),
          applicationId: this.applicationId,
        };
        saveHuilanAiApplicationServiceRelationByApplicationId(params).then(
          (res) => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              scope.pagelist()
             
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          }
        );
      }
    },
    transferCreat(applicationId) {
      const scope = this;
      const params = {
        size: 100,
        current: 1,
      };
      serviceListByPage(params).then((res) => {
        const data = res.data.data.records;
        scope.data = data;
        applicationGetApplicationServiceRelationListByApplicationId({
          applicationId,
        }).then((res) => {
          const resData = res.data.data;
          const list = [];
          if (resData.length > 0) {
            resData.map((v) => {
              if (v.service) {
                let id = v.service.id
                list.push(id);
              }
            });
          }
          this.value = list;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  /deep/ {
    .el-transfer-panel {
      width: 220px;
      height: 340px;
    }
    .el-transfer-panel__list{
      height: 340px;
    }
  }
}
</style>
