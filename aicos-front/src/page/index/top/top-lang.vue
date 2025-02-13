<template>
  <el-dropdown trigger="click"
               @command="handleSetLanguage">
    <i class="icon-zhongyingwen"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'"
                        command="zh">中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'"
                        command="en">English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {mapGetters} from "vuex";
import { legalizeSSOToken } from "@/api/system/menu.js";


export default {
  name: "top-lang",
  data() {
    return {};
  },
  created() {
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["language", "tag"])
  },
  props: [],
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.commit("SET_LANGUAGE", lang);
      let tag = this.tag;
      let title = this.$router.$avueRouter.generateTitle(
        tag.label,
        (tag.meta || {}).i18n
      );
        //根据当前的标签也获取label的值动态设置浏览器标题
      this.$router.$avueRouter.setTitle(title);
      
      /*切换语言重写获取token，因后端缓存生效*/
      legalizeSSOToken().then(()=>{
        window.location.reload();
      })
      
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
