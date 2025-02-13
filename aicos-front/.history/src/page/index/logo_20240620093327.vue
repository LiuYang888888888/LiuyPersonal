<template>
  <div class="avue-logo">
<!--    <transition name="fade">-->
<!--      <div v-if="keyCollapse"-->
<!--            class="avue-logo_subtitle"-->
<!--            key="0">-->
<!--        <img :src="website.logo"/>-->
<!--      </div>-->
<!--    </transition>-->
<!--    <transition-group name="fade">-->
<!--      <template v-if="!keyCollapse">-->
        <div class="avue-logo_title">
<!--          <img :src="website.logo"/>-->
<!--          <transition v-if="!keyCollapse" name="fade">-->
            <div style="line-height: 68px;">{{website.indexTitle}}</div>
<!--          </transition>-->
        </div>
<!--      </template>-->
<!--    </transition-group>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(["website", "keyCollapse"])
  },
  methods: {}
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 104px;
  padding-top: 15px;
  line-height: 0;
  background-color: #2c2e3e;
  font-size: 0;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;

  img {
    width: 48px;
  }

  &_title {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 20px;

    div {
      font-size: 20px;
      line-height: 1.5em;
    }
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
