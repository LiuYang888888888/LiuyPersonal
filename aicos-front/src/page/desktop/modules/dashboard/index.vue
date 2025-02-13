<template>
<!--  <transition appear>-->
    <el-card class="Huilan-dashboard"  @click.native.stop>
      <div slot="header" class="clearfix">
        <span class="deskTenantName">{{ tenantName }}</span>
        <el-button
          v-if="userInfo.isAdmin === '1'"
          style="float: right; padding: 3px 0;transform: scale(1.5);"
          type="text"
          title="切换"
          @click="switchTenant"
        ><i class="aicosicon aicos-icon-charge-02"></i></el-button>
      </div>
      <List title="最近使用" :data="lastestUsed" @itemclick="handleIconClick"/>
      <List title="最新上架" :data="latestAdd" @itemclick="handleIconClick"/>
      <div class="login-info">
        <div>上次登录: {{ userInfo.lastLoginTime }}</div>
        <div>&nbsp;</div>
      </div>
      <div class="footer">
        <div>
          <img :src="userInfo.avatar"/>
          {{userInfo.account}}
        </div>
        <div>
          <i title="个人信息" class="aicosicon aicos-icon-personal" @click="editUserInfo"></i>
          <i title="退出" class="aicosicon aicos-icon-a-turnoff" @click="logout"></i>
        </div>
      </div>
      <topTenant ref="topTenant"/>
      <ModifyPassword ref="modifyPassword"/>
    </el-card>
<!--  </transition>-->
</template>

<script>
import List from './list'
import topTenant from '@/page/index/top/top-tenant'
import ModifyPassword from '@/page/index/ModifyPassword'
import {mapGetters} from "vuex";
import {resetRouter} from '@/router/router'
import { getUserDeptStr, getRecentUsedMenu, getTopNewMenu } from '@/api/user'

export default {
  name: 'index',
  components: {
    List,
    topTenant,
    ModifyPassword
  },
  inject: ['desktop'],
  computed: {
    ...mapGetters([
      'userInfo',
      'menu'
    ])
  },
  data() {
    return {
      dept: '',
      tenantName: '',
      lastestUsed: [],
      latestAdd: [],
    }
  },
  methods: {
    handleIconClick(data) {
      this.desktop.handleItemClick(data, false)
    },
    switchTenant() {
      this.$refs.topTenant.show();
    },
    editUserInfo() {
      const data = {
        menuName: '用户信息',
        imageUrl: 'iconfont iconicon_principal',
        linkUrl: '/system/userinfo'
      }
      this.$route.query.tab = 'userinfo';
      this.desktop.handleItemClick(data)
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          resetRouter();
          this.$router.push({path: "/login"});
          window.location.reload();
        });
      });
    },
    async getDept() {
      const {data:{data}} = await getUserDeptStr()
      // debugger

      let res = data.replace(/&gt;/g,">");
      this.dept = res.replace(/.*.>/, '')

    },
    async getLatestUsed() {
      const {data: {data}} = await getRecentUsedMenu()

      // const usedIds = data.map(item => item.id)

      const list = []
      data.forEach(item=> {
        const temp = this.menu.find(menu=> {
          return menu.id === item.id
        })
        if(temp) {
          list.push(temp)
        }
      })
      // this.menu.filter(item=> usedIds.includes(item.id))
      this.lastestUsed = list
    },
    async getLatestAdd() {
      const {data: {data}} = await getTopNewMenu()

      // const Ids = data.map(item => item.id)
      //
      // const list = this.menu.filter(item=> Ids.includes(item.id))
      const list = []
      data.forEach(item=> {
        const temp = this.menu.find(menu=> {
          return menu.id === item.id
        })
        if(temp) {
          list.push(temp)
        }
      })

      this.latestAdd = list
    }
  },
  mounted() {

    // console.log('this.$store.state.user', this.$store.state.user.currentTenantAll.tenantName);
    const tenantName = this.$store.state.user.currentTenantAll.tenantName;
    this.tenantName = tenantName;

    this.getDept();
    this.getLatestUsed();
    this.getLatestAdd();
  }

}
</script>

<style lang="scss" scoped>
//.v-enter-active,.v-leave-active{
//  transition: transform .3s;
//}
//.v-enter,.v-leave-to{
//  transform: translate(0, 100%);
//}
.Huilan-dashboard {
  position: absolute;
  left: 0;
  bottom: 10px;
  height: 355px;
  width: 380px;
  background: rgba(255,255,255, 0.8);
  user-select: none;
  z-index: 1000;
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  /deep/.el-card__header {
    border-color: #c7cad3;
  }

  /deep/.el-card__body {
    padding-top: 10px;
    padding-bottom: 0;
  }

  .login-info {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;

    div {
      font-size: 14px;
      color: #565863;
    }
  }

  .footer {
    margin: 0 -20px;
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    box-shadow: 0 -3px 3px 3px rgba(200,200,200,0.2);

    div:first-child {
      line-height: 32px;

      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
        object-fit: contain;
        background: #bbbec4;
      }
    }

    div:last-child {
      i {
        margin-left: 10px;
        font-size: 1.5em;
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }
    }


  }
  .deskTenantName {
    display: inline-block;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
  }
}
</style>
