<template>
  <div v-loading="loading" className="remote-module">
    <Page403 v-if="!token"/>
    <slot v-if="success"></slot>
  </div>
</template>

<script>
import Page403 from '@/components/error-page/403'
// import {legalizeSSOToken} from '@/api/system/menu'
import {getToken} from "@/util/auth";
import store from '@/store'
// import QusnList from '@/views/questionnaire/qusnList';
import {getRuntime} from "@/util/runtime";
import i18n from "@/lang";

// const token = getToken()

export default {
  name: 'ExposeWrapper',
  store,
  i18n,
  components: {
    Page403
  },
  data() {
    return {
      token: getToken(),
      loading: false,
      success: false
    }
  },
  created() {
    const router = getRuntime('router');
    router.parentProjectRouter = this.$router;
    this.loadStore()
  },
  methods: {
    async loadStore() {
      this.loading = true;
      store.commit('SET_MODE', 'sso');
      await store.dispatch('handleSSO', this.token)
      this.loading = false;
      this.success = true;
    }
  }
}
</script>

<style scoped>
.remote-module {
  height: 100%;
}
</style>
