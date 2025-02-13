<template>
  <HuilanBasic hasTab>
<!--  <div v-loading="loading" class="role-container">-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="AiCOS" name="AiCOS">
        <RoleManage/>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in systemList"
        :key="item.id"
        :label="item.label"
        :name="item.code"
        :lazy="true"
      >
        <component ref="tabCmp" :is="item.cmp"></component>
      </el-tab-pane>
    </el-tabs>
<!--  </div>-->
  </HuilanBasic>
</template>

<script>
import '@/styles/qsgCommon.scss';

import RoleManage from './roleManage';

import { createRemoteComponent } from '@/util/util';

import { getOtherRoleAuthComponent } from '@/api/system/role';
export default {
  name: 'roleAuth',
  components: {
    RoleManage
  },
  props: {
    role: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      activeName: 'AiCOS',
      loadedAicos: false,
      menuGrantList: [],
      selectedRes: [],
      aiAppDialogVisible: false,
      selectedAiApps: [],
      systemList: []
    }
  },
  mounted() {
    this.getRemoteCmps();
  },
  methods: {
    async getRemoteCmps() {
      const params = {
        type:0,
        origin:0,
        isAuth:1,
        current: 1,
        size: 10
      }
      const {data:{data}} = await getOtherRoleAuthComponent(params);

      this.systemList = this.loadAuthCmp(data);
    },
    loadAuthCmp(list) {
      const res = [];
      for(let item of list) {
        const params = {
          moduleUrl: item.authModuleUrl,
          moduleExport: item.authModuleExport
        }
        const cmp = createRemoteComponent(params);
        res.push({
          id: item.id,
          label: item.name,
          code: item.systemCode,
          cmp
        });
      }
      return res;
    }
  }
}
</script>

<style lang="scss" scoped>
.role-container {
  //min-height: 400px;
}
</style>
