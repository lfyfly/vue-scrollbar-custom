<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue2-custom-scrollbar {
  position: relative;
  overflow: hidden;
  // border: 1px solid red;
  .scrollbar-hide {
    position: absolute;
    left: 0;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .content {
    float: left; // BFC, 避免父子margin重叠导致高度不一致
  }
  .scroll_bar_container {
    // 样式接口
    height: 100%;
    position: absolute;
    right: 0;
    background: black; //滚动槽背景色, 默认无色透明
    // 滚动条
    .scroll_bar {
      position: absolute;
      top: 0;
      transition: opacity 1s;
      height: 100%;
    }
  }
  .topBar_container {
    position: absolute;
    top: 0;
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue2-custom-scrollbar(ref="container",:style="{width:width,height:height}")
  .scrollbar-hide(@scroll="barScroll", ref="innerContainer")
    .content(ref="content")
      slot
  .scroll_bar_container(v-if="!isTopBar",
      :style="[barContainerStyle,{background:isHideBar?'rgba(0,0,0,0)':barContainerStyle.bacground}]",
      @mouseover="barHover",
      @mouseout="timeOutHideBar"
    )
    .scroll_bar(v-drag.dragY="{ondrag:syncContent}",ref="bar", :style="[scrollBarStyle,{opacity:isHideBar?0:1}]")
  .topBar_container(v-else)
    .topBar(ref="topBar", :style="topBarStyle")


</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import vDrag from '../v-drag/v-drag.js'

export default {
  name: 'vue2-custom-scrollbar',
  data() {
    return {
      msg: 'this is from vue2-custom-scrollbar.vue',
      timer: null,
      containerHeight: '',
      contentHeight: ''
    }
  },
  props: {
    isTopBar: {
      type: Boolean,
      default: false
    },
    isHideBar: {
      type: Boolean,
      default: false
    },
    // 容器宽度
    width: {
      type: String,
      default: '100%'
    },
    // 容器高度
    height: {
      type: String,
      default: '400px'
    },
    // 滚动条容器样式
    barContainerStyle: {
      type: Object,
      default: function () {
        return {
          width: '8px',
        }
      }
    },
    // 滚动条样式
    scrollBarStyle: {
      type: Object,
      default: function () {
        return {
          width: '6px',
          borderRadius: this.isHideBar ? '3px' : '',
          background: '#ccc'

        }
      }
    },
    // 顶部滚动条样式
    topBarStyle: {
      type: Object,
      default: function () {
        return {
          height: '3px',
          backgroundColor: '#17ce28'
        }
      }
    }
    // 外加一个从计算的方法 reCalcu ，同过组件的ref访问到
  },
  computed: {
    // 获取barHeight
    barHeight() {
      return this.containerHeight * this.containerHeight / this.contentHeight
    },
    // 转换系数
    transform() {
      // 容器滚动的高度是滚动条移动的多少倍
      return (this.contentHeight - this.containerHeight) / (this.containerHeight - this.barHeight)
    },
  },
  methods: {
    // 容器大于内容时,不需要滚动条
    needScroll() {
      if (this.isTopBar) return
      this.$nextTick(() => {
        this.$refs.bar.parentNode.style.display = this.containerHeight >= this.contentHeight ? 'none' : 'block'
      })
    },
    // 当 容器的高度 或者 内容高度动态变化的时候，需要对滚动条进行重计算
    reCalcu() {
      // 高度动态变化，所以要nextTick
      this.$nextTick(() => {
        this.setContainerHeight()
        this.setContentHeight()
        this.setBarHeight()
        this.initContentWidth()
        this.getTransformTop()
        this.syncTopBarWidth()
      })
      this.needScroll()
    },
    // 设置 data：this.containerHeight
    setContainerHeight() {
      this.containerHeight = this.$refs.innerContainer.offsetHeight
    },
    // 设置 data：this.contentHeight
    setContentHeight() {
      this.contentHeight = this.$refs.content.offsetHeight
    },
    // 初始化.content的宽度, 把.innerContainer滚动条顶出去
    // moubted 中执行
    initContentWidth() {
      this.$refs.content.style.width = this.$refs.container.offsetWidth + 'px'
    },
    // 用户只需要设置外层宽度和内层滚动条宽度，自动居中
    // moubted 中执行
    centerBar() {
      // 顶部滚动条的话 不执行
      if (this.isTopBar) return

      // .bar 在 .barContainer 中居中
      var left = (parseInt(this.barContainerStyle.width) - parseInt(this.scrollBarStyle.width)) / 2 + 'px'
      this.$refs.bar.style.left = left
    },
    // .innerContainer 的 hover事件
    barHover() {

      this.clearTimer()
      this.showBar()
    },
    showBar() {
      if (!this.isHideBar) return
      this.$refs.bar.style.opacity = "1"
    },
    // 延迟显示
    timeOutHideBar() {
      if (!this.isHideBar) return

      this.timer = setTimeout(() => {
        this.$refs.bar.style.opacity = "0"
      }, 2000)
    },
    // 清除定时器
    clearTimer() {
      // isHideBar 才会生效
      if (!this.isHideBar) return

      if (this.timer) clearTimeout(this.timer)
    },
    getTransformTop() {
      // 容器滚动的高度是滚动条移动的多少倍
      return this.$refs.innerContainer.scrollTop / (this.contentHeight - this.containerHeight)
    },
    // 与其他同类插件相比，不适用wheel事件，使用原生事件
    // 滚动事件，滚动条联动
    setBarHeight() {
      if (this.isTopBar) return
      this.$refs.bar.style.height = this.barHeight + 'px'
    },
    // scroll事件
    barScroll(e) {
      // 隐藏滚动条的情况下执行
      this.clearTimer()
      this.showBar()
      this.timeOutHideBar()

      // 顶部滚动条
      if (this.isTopBar) {
        this.syncTopBarWidth()
        return
      }
      // 右边滚动条样式同步
      this.$refs.bar.style.top = e.target.scrollTop / this.transform + 'px'

    },
    // 拖动滚动条,内容区联动
    syncContent() {
      if (this.isTopBar) return
      this.$refs.innerContainer.scrollTop = this.$refs.bar.offsetTop * this.transform
    },
    // 顶部滚动条的宽度同步
    syncTopBarWidth() {
      if (this.isTopBar) this.$refs.topBar.style.width = this.$refs.innerContainer.offsetWidth * this.getTransformTop() + 'px'
    }
  },
  // this.isTopBar && this.isHideBar 不能同时为true
  created() {
    if (this.isTopBar && this.isHideBar) throw ('isTopBar and isHideBar can\'t at the same time to true')
  },
  mounted() {
    // 需要徐然滚动条吗
    this.needScroll()
    // 初始化,content宽度
    this.initContentWidth()
    // 居中bar
    this.centerBar()
    // 初始化滚动条高度
    this.setBarHeight()

    // 让用户自己设置，通过ref属性访问reCalcu方法

    // window.addEventListener('resize', () => {
    //   this.reCalcu()
    // })
  },
  // 滚动条拖拽指令
  directives: {
    drag: vDrag
  }
}
</script>
