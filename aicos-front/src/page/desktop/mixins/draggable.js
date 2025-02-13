/**
 * desk window 的拖动
 */
export default {
  data() {
    return {
      startMovePos: {
        x: 0,
        y: 0
      },
      endMovePos: {
        x: 0,
        y: 0
      },
      pos: {
        left: 0,
        top: 0,
      }
    }
  },
  computed: {
    style() {
      let res = {
        width: this.width,
        height: this.height,
        left: `${this.pos.left}px`,
        top: `${this.pos.top}px`
      }
      if(this.isMax) {
        res = {
          width: '100%',
          height: '100%',
          left: '0px',
          top: '0px'
        }
      }
      return res
    }
  },
  methods: {
    handleDragStart(event) {
      this.startMovePos = {
        x: event.pageX,
        y: event.pageY
      }
    },
    handleDragEnd(event) {
      this.endMovePos = {
        x: event.pageX,
        y: event.pageY
      }
      const move = {
        x: event.pageX - this.startMovePos.x,
        y: event.pageY - this.startMovePos.y
      }
      // const el = this.$el
      let top = this.pos.top + move.y
      if (top < 0) {
        top = 0
      }
      this.pos = {
        left: this.pos.left + move.x,
        top
      }
    },
    // getstyle() {
    //   const el = this.$el
    //   let left = '50%'
    //   let top = '50%'
    //   if(el) {
    //     left = el.offsetLeft + (this.endMovePos.x - this.startMovePos.x) + 'px'
    //     top = el.offsetTop + (this.endMovePos.y - this.startMovePos.y) + 'px'
    //   }
    //   if(top < 0) {
    //     top = 0
    //   }
    //   const style = {
    //     width: this.isMax ? '100%': this.width,
    //     height: this.isMax ? '100%': this.height,
    //     left,
    //     top
    //   }
    //
    //   // this.style = style
    // },
    // center() {
    //
    // }
    initPos() {
      const parent = this.$el.parentElement
      let lastWidth = parent.offsetWidth - this.$el.offsetWidth
      let lastHeight = parent.offsetHeight - this.$el.offsetHeight
      if(lastWidth < 0) {
        lastWidth = 0
      }
      if(lastHeight < 0) {
        lastHeight = 0
      }
      this.pos = {
        left: lastWidth / 2,
        top: lastHeight / 2
      }
    }
  },
  mounted() {
    this.initPos()
  }
}
