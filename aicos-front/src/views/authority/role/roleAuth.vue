<template>
  <div v-loading="loading" class="role-auth-container">
    <!--  <el-tabs v-model="activeName">-->
    <!--    <el-tab-pane label="AiCOS" name="AiCOS">-->
    <!--      <GrantList-->
    <!--        v-if="loadedAicos"-->
    <!--        ref="grantList"-->
    <!--        :data="menuGrantList"-->
    <!--        :defaultCheckedItems="selectedRes"-->
    <!--        :role="role"-->
    <!--      >-->
    <!--        <template v-slot:topmenu>-->
    <!--          <el-button size="mini" @click="managerAiApp">可管理Ai应用</el-button>-->
    <!--        </template>-->
    <!--      </GrantList>-->
    <!--    </el-tab-pane>-->
    <!--    <el-tab-pane-->
    <!--      v-for="item in systemList"-->
    <!--      :key="item.id"-->
    <!--      :label="item.label"-->
    <!--      :name="item.code"-->
    <!--    >-->
    <!--      <component ref="tabCmp" :is="item.cmp"></component>-->
    <!--    </el-tab-pane>-->
    <!--  </el-tabs>-->
    <GrantList v-if="loadedAicos" ref="grantList" :data="menuGrantList" :defaultCheckedItems="selectedRes"
      :defaultCheckedMenus="selectedMenus" :role="role" className="roleDeptTree" @manageraiapp="managerAiApp">
      <template v-slot:topmenu>
        <!-- <el-button size="mini" @click="managerAiApp">可管理Ai应用</el-button> -->
      </template>
    </GrantList>
    <HuilanDialog :title="`${$t('system.role.aiAppTitle')}(${role.roleName})`" append-to-body
      :visible.sync="aiAppDialogVisible" width="900px">
      <RoleAiApp v-if="aiAppDialogVisible" ref="aiApp" v-model="selectedAiApps" :role="role" />

      <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveAiApp">{{ $t("aicosCommon.confirmBtn") }}</el-button>
        <el-button size="small" @click="aiAppDialogVisible = false">{{ $t("aicosCommon.cancelBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import GrantList from '@/components/grant-list';
import RoleAiApp from './RoleAiApp';

// import { createRemoteComponent } from '@/util/util';

import {
  // getOtherRoleAuthComponent,
  getSelectedAiApplication, getSelectedMenu,
  getSelectedResource,
  grant,
  grantTree,
  saveAiApplicationInRole
} from '@/api/system/role';
export default {
  name: 'roleAuth',
  components: {
    GrantList,
    RoleAiApp
  },
  props: {
    role: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      loadedAicos: false,
      menuGrantList: [],
      selectedRes: [],
      aiAppDialogVisible: false,
      selectedAiApps: [],
      systemList: [],
      selectedMenus: []
    }
  },
  async mounted () {
    this.loading = true;
    const p1 = this.getAicosRoleData();
    await Promise.all([p1]);
    this.loading = false
  },
  methods: {
    async getAicosRoleData () {
      this.loadedAicos = false
      const roleId = this.role.id;
      const [grentData, selectedResData, selectedMenuData] = await Promise.all([grantTree(), getSelectedResource(roleId), getSelectedMenu(roleId)]);

      this.menuGrantList = grentData.data.data.menuList;
      this.selectedRes = selectedResData.data.data.map(item => item.id);
      this.selectedMenus = selectedMenuData.data.data.map(item => item.id);
      this.loadedAicos = true;
    },
    async submit () {
      const data = this.$refs.grantList.getSubmitData();
      const postData = {
        ...data,
        roleId: this.role.id
      }
      await grant(postData)
    },
    // async submit() {
    //   const p1 = this.submitAicos();
    //   const plist = [p1];
    //   await Promise.all(plist);
    // },
    async managerAiApp () {
      const { data: { data } } = await getSelectedAiApplication(this.role.id)
      this.selectedAiApps = data
      this.aiAppDialogVisible = true
    },
    async saveAiApp () {
      const params = {
        roleId: this.role.id,
        applicationIds: this.selectedAiApps.map(item => item.id).join()
      }

      const { data } = await saveAiApplicationInRole(params);

      if (data.success) {
        this.$message.success(this.$t("system.role.setAppTip"))
        this.aiAppDialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role-auth-container {
  min-height: 400px;
}
</style>
