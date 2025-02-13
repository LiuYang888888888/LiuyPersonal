<template>
  <div
    class="Huilan-taskbar-item"
    :title="data.menuName"
    :class="{active: active}"
    @click.stop="$emit('itemclick')"
  >
    <slot>
      <div class="item-icon" :style="style">
        <i v-if="!isPath" :class="data.imageUrl"></i>
      </div>
    </slot>

  </div>
</template>

<script>
export default {
  name: 'TaskbarItem',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
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
  }
}
</script>

<style lang="scss" scoped>
.Huilan-taskbar-item {
  display: inline-block;
  position: relative;
  padding: 5px;
  margin: 5px 8px 0;
  text-align: center;
  color: #03080b;
  border-radius: 4px;
  //border: 2px solid #d8e0f5;
  vertical-align: top;
  cursor: pointer;
  // 值太大的时候，会遮到弹出层
  z-index: 1000;
  transition: all 0.2s;

  &:hover,&.active{
    //background: #fff;
    &:after {
      content: '';
      position: absolute;
      left: 50%;
      top: 95%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      border-radius: 50%;
      background: #070b2d;
    }
  }
  &.active {
    //padding: 9px;
    padding: 0 5px 8px;
    margin-top: 0;
    transform: scale(1.2);
  }

}
</style>
