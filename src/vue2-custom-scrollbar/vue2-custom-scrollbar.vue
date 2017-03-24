<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue2-custom-scrollbar {
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 400px;
  border: 1px solid;
  .scrollbar-hide {
    position: absolute;
    left: 0;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .content {
    overflow: hidden; // 避免父子margin重叠导致高度不一致
    width: 300px; // 和.vue2-custom-scrollbar宽度一样， 把垂直滚动条顶出去
  }
  .scroll_bar_container {
    // 样式接口
    width: 10px;
    height: 100%;
    position: absolute;
    right: 0;
    background: black; //滚动槽背景色, 默认无色透明
    // 滚动条
    .scroll_bar {
      position: absolute;
      top: 0;
      width: 6px; // height: 10px; // 由内容高度与容器高度比计算而得
      left: 50%;
      margin-left: -3px; // 居中
      background: #ccc;
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue2-custom-scrollbar(ref="container")
  .scrollbar-hide(@scroll="barScroll" ref="innerContainer")
    .content(ref="content")
      slot
  .scroll_bar_container(:style="barContainerStyle")
    .scroll_bar(ref="bar", :style="scrollBarStyle")
    //-.scroll_bar_contaner(v-show="showBar" ,:style="barContainerStyle",ref="barContainer")
      .scroll_bar(ref="oBar", :style="scrollBarStyle")

</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'vue2-custom-scrollbar',
  data() {
    return {
      msg: 'this is from vue2-custom-scrollbar.vue',
      barIsKeyDown: false
    }
  },
  props: {
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    barContainerStyle: {
      type: Object
    },
    scrollBarStyle: {
      type: Object
    },
    alwayShow: {
      type: Boolean
    }
  },
  computed: {
    containerHeight() {
      console.log(this.$refs.innerContainer.offsetHeight)
      return this.$refs.innerContainer.offsetHeight
    },
    contentHeight() {
      return this.$refs.content.offsetHeight
    },
    barHeight() {
      console.log(this.containerHeight, this.containerHeight, this.contentHeight)
      return this.containerHeight * this.containerHeight / this.contentHeight
    },
    // 转换系数
    transform() {
      // 容器滚动的高度是滚动条移动的多少倍
      return (this.contentHeight - this.containerHeight) / (this.containerHeight - this.barHeight)
    },
  },
  methods: {
    // 与其他同类插件相比，不适用wheel事件，使用原生事件
    // 滚动事件，滚动条联动
    setBarHeight() {
      this.$refs.bar.style.height = this.barHeight + 'px'
    },
    barScroll(e) {
      console.log(e.target.scrollTop / this.transform)
      this.$refs.bar.style.top = e.target.scrollTop / this.transform + 'px'
    },
    // 拖动滚动条,内容区联动
    syncContent() {
      console.log(this.barTop);

      this.$refs.innerContainer.scrollTop = this.$refs.bar.offsetTop * this.transform
    },
    drapBar() {
      this.$refs.bar.addEventListener('mousedown', (e) => {
        e.preventDefault()


        // this.barIsKeyDown = true // 滚动条正被鼠标按下

        var disY = e.clientY - e.target.offsetTop
        var mousemoveFn = (e) => {

          e.preventDefault()

          var top = e.clientY - disY

          if (top < 0) {
            top = 0
          }
          else if (top > this.containerHeight - this.barHeight) {

            top = this.containerHeight - this.barHeight
          }
          this.barTop = top
          this.$refs.bar.style.top = top + 'px'

          // 内容区跟随滚动条拖动二滚动
          this.syncContent()

        }
        document.addEventListener('mousemove', mousemoveFn)

        var mouseupFn = function (e) {
          console.log(e)
          document.removeEventListener('mousemove', mousemoveFn)
          document.removeEventListener('mouseup', mouseupFn)
        }

        document.addEventListener('mouseup', mouseupFn)
      })
    },
  },
  mounted() {
    // 初始化滚动条高度
    this.setBarHeight()
    // 滚动条拖动事件
    this.drapBar()
  }
}
</script>
