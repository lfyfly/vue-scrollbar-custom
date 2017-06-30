<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss" scoped>
// 让滚动条不可见----开始
.vue-scrollbar-custom {
  position: relative;
  overflow: hidden;
  .scrollbar-container {
    position: absolute;
    left: 0;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
// 让滚动条不可见----结束

  .content-container {
    float: left; // BFC, 避免父子margin重叠导致高度不一致
  }

  .scroll_bar_container {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
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
.vue-scrollbar-custom(ref="container")
  .scrollbar-container(@scroll="barScroll", ref="innerContainer")
    .content-container(ref="content")
      slot
  .scroll_bar_container(ref="barContainer")(v-if="!isTopBar",
      :style="[barContainerStyle,{background:isHideBar?'rgba(0,0,0,0)':barContainerStyle.background}]",
      @mouseover="barHover",
      @mouseout="timeOutHideBar"
    )
    .scroll_bar(v-drag.dragY="{ondrag:syncContent}",ref="bar", :style="[barStyle,{opacity:isHideBar?0:1}]")
      slot(name="barIn")
  .topBar_container(v-else)
    .topBar(ref="topBar", :style="topBarStyle")
      slot(name="topBarIn")


</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import vDrag from '../v-drag/v-drag.js'

export default {
  name: 'vue-scrollbar-custom',
  data() {
    return {
      msg: 'this is from vue-scrollbar-custom.vue',
      timer: null,
      containerHeight: '',
      contentHeight: '',
      barContainerHeight: ''
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
    barStyle: {
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
      return this.barContainerHeight * this.containerHeight / this.contentHeight
    },
    // 转换系数
    transform() {
      // 容器滚动的高度是滚动条移动的多少倍
      return (this.contentHeight - this.containerHeight) / (this.barContainerHeight - this.barHeight)
    },
  },
  methods: {
    // 容器大于内容时,不需要滚动条
    needScroll() {
      if (this.isTopBar) return
      this.$nextTick(() => {
        this.$refs.bar.parentNode.style.opacity = this.containerHeight >= this.contentHeight ? '0' : '1'
      })
    },
    // 当 容器的高度 或者 内容高度动态变化的时候，需要对滚动条进行重计算
    reCalcu() {
      // 高度动态变化，所以要nextTick
      this.$nextTick(() => {
        this.setContainerHeight()
        this.setContentHeight()
        this.setBarContainerHeight()
        this.setBarHeight()
        this.initContentWidth()
        this.getTransformTop()
        this.syncTopBarWidth()
        this.barScroll()
      })
      this.needScroll()
    },
    setBarContainerHeight() {
      if (this.isTopBar) return
      this.barContainerHeight = this.$refs.bar.parentNode.clientHeight
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
      // **重要 内容宽度等于container clientWidth用户设置宽度
      // *** 禁止对container 使用padding属性
       var paddingWidth = this.$refs.barContainer&&!this.isHideBar ?this.$refs.barContainer.offsetWidth:0
      this.$refs.content.style.width = (this.$refs.container.clientWidth-paddingWidth) + 'px'
      this.$refs.content.style.paddingRight = paddingWidth + 'px'
    },
    // 用户只需要设置外层宽度和内层滚动条宽度，自动居中
    // moubted 中执行
    centerBar() {
      // 顶部滚动条的话 不执行
      if (this.isTopBar) return

      // .bar 在 .barContainer 中居中
      var left = (this.$refs.bar.parentNode.clientWidth - this.$refs.bar.offsetWidth) / 2 + 'px'
      this.$refs.bar.style.left = left
    },
    // innerContainer 的 hover事件
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
      }, 1500)
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
      // 组件scroll事件

      if(e) this.$emit('scroll',e)

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
      this.$refs.bar.style.top = this.$refs.innerContainer.scrollTop / this.transform + 'px'

    },
    // 拖动滚动条,内容区联动
    syncContent() {
      if (this.isTopBar) return
      this.$refs.innerContainer.scrollTop = this.$refs.bar.offsetTop * this.transform
    },
    // 顶部滚动条的宽度同步
    syncTopBarWidth() {
      if (this.isTopBar) this.$refs.topBar.style.width = this.$refs.container.offsetWidth * this.getTransformTop() + 'px'
    }
  },
  // this.isTopBar && this.isHideBar 不能同时为true
  created() {
    if (this.isTopBar && this.isHideBar) throw ('isTopBar and isHideBar can\'t at the same time to true')
  },
  mounted() {
    // 初始化data 中的 containerHeight contentHeight
    this.setContainerHeight()
    this.setContentHeight()
    this.setBarContainerHeight()

    // 需要滚动条吗（内容高度小于容器高度时不显示滚动条）
    this.needScroll()

    // 初始化content宽度
    this.initContentWidth()

    // 居中scroll-bar
    this.centerBar()

    // 初始化滚动条高度
    this.setBarHeight()

    // 让用户自己设置，通过ref属性访问reCalcu方法
    // 如下：有时候窗口变化会影响到容器的宽高
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
