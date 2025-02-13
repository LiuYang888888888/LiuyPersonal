<template>
  <div class="desk-item" :title="data.menuName" @click="handleClick">
    <div class="desk-item-icon" :style="style">
      <i v-if="!isPath" :class="data.imageUrl"></i>
    </div>
    <h3>{{ data.menuName }}</h3>
  </div>
</template>

<script>

export default {
  name: 'DesktopItem',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  inject: ['dataview'],
  computed: {
    // icon() {
    //   return this.data.desktopIcon || this.data.imageUrl
    // },
    isPath() {
      const reg = /\//
      return reg.test(this.data.imageUrl)
    },
    style() {
      let res = {}
      if(this.isPath) {
        res = {
          backgroundImage: `url('${this.data.imageUrl}')`
        }
      }

      return res
    }
  },
  methods: {
    handleClick() {
      this.dataview.$emit('itemclick', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.desk-item {
  //width: 76px;
  //height: 89px;
  padding: 5px 0;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255,255,255, 0.4);
    border: 1px solid rgba(255,255,255, 0.6);
    border-radius: 3px;
  }

  .desk-item-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    line-height: 64px;
    background-position: center;
    background-repeat: no-repeat;
    //box-shadow: 0 4px 10px 12px rgba(7,11, 45, 0.1);

    i {
      color: #21a8ef;
      font-size: 64px;
    }
  }
  h3 {
    margin: 10px 0 0;
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-shadow: 0 2px 8px rgba(7,11, 45, 0.3);
  }
}
</style>
