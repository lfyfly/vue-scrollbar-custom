<template lang="pug">
#app
  h1.document-title vue-custom-scroll demo
  :markdown-it(linkify langPrefix='highlight-')
    ## 1.默认样式
    ```html

      <v-scrollbar class="vScrollbar1">
        <h1 v-for="n in 30">default</h1>
      </v-scrollbar>

    ```
  v-scrollbar.vScrollbar1(@scroll="scrollFn")
    h1(v-for="n in 30") default

  :markdown-it(linkify langPrefix='highlight-')
    ## 2.不滚动时隐藏滚动条
    ```html

      <v-scrollbar class="vScrollbar2" :isHideBar="true">
        <h3 v-for="n in 30">:isHideBar="true"</h3>
      </v-scrollbar>

    ```

  v-scrollbar.vScrollbar2(:isHideBar="true")
    h3(v-for="n in 30") :isHideBar="true"

  :markdown-it(linkify langPrefix='highlight-')
    ## 3.顶部滚动条
    ```
      <v-scrollbar class="vScrollbar3" :isTopBar="true">
        <h3 v-for="n in 30">:isTopBar="true"</h3>
      </v-scrollbar>

    ```
  v-scrollbar.vScrollbar3(:isTopBar="true")
    h3(v-for="n in 30") :isTopBar="true"
  :markdown-it(linkify langPrefix='highlight-')
    ## 4.通过slot自定义复杂滚动条样式
    ```

    <v-scrollbar
      class="vScrollbar4"
      :barContainerStyle="{width:'14px', background:'#282828' ,borderLeft:'1px solid #1d1d1d',borderRight:'1px solid #3e3e3b'}"
      :barStyle="{width:'8px',border:'1px solid #191919',borderRadius:'5px',overflow:'hidden'}">

      <div slot="barIn" :style="{width:'100%',height:'100%',background:'#454545',borderLeft:'1px solid #585858'}"></div>

      <h3 v-for="n in 30">:isTopBar="true"</h3>
    </v-scrollbar>

    ```
  v-scrollbar.vScrollbar4(:barContainerStyle="{width:'14px', background:'#282828' ,borderLeft:'1px solid #1d1d1d',borderRight:'1px solid #3e3e3b'}", :barStyle="{width:'8px',border:'1px solid #191919',borderRadius:'5px',overflow:'hidden'}")
    div(slot="barIn", :style="{width:'100%',height:'100%',background:'#454545',borderLeft:'1px solid #585858'}")
    h3(v-for="n in 30") :isTopBar="true"

  :markdown-it(linkify langPrefix='highlight-')
    ## 5.顶部滚动条上一个音乐的符号
    ```
      <v-scrollbar class="vScrollbar5" :isTopBar="true">
        <h3 v-for="n in 30">:isTopBar="true"</h3>
        <div slot="topBarIn" :style="{position:'absolute',right:'0',top:'-5px',color:'#17ce28',zIndex:'1000'}">♪</div>
      </v-scrollbar>

    ```
  v-scrollbar.vScrollbar5(:isTopBar='true')
    h3(v-for='n in 30') :isTopBar="true"
    div(slot='topBarIn', :style="{position:'absolute',right:'0',top:'-5px',color:'#17ce28',zIndex:'1000'}") ♪

  :markdown-it(linkify langPrefix='highlight-')
    ## 6.当滚动内容高度动态变化时，执行重新计算
    ### html
      ```
        <v-scrollbar ref="vScrollbar6" class="vScrollbar6">
          <h1 v-row v-for="v in testArr">{{v}}</h1>
          <button @click="addContent"> add coontent </button>
        </v-scrollbar>

      ```
    ### 测试：用于增加内容的方法
    ```js
      data() {
        return {
          testArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      },

      methods: {
        addContent() {
          var ii = this.testArr.length + 1
          var len = this.testArr.length + 11
          for (var i = ii; i < len; i++) {
            this.testArr.push(i)
          }
          this.$nextTick(() => {
            this.$refs.vScrollbar6.reCalcu() // 通过ref属性访问组件的方法reCalcu
          })
        }
      }
    ```
  v-scrollbar.vScrollbar6(ref="vScrollbar6")
    h1(v-for="v in testArr") {{v}}
    button(@click='addContent')  add coontent

  div(style="height:200px")
</template>

<script>
import hljs from 'highlightjs'
import 'highlightjs/styles/darcula.css'

import vScrollbar from './vue-scrollbar-custom/vue-scrollbar-custom.vue'

export default {
  name: 'app',
  components: {
    vScrollbar
  },
  data() {
    return {
      testArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  methods: {
    addContent() {
      var ii = this.testArr.length + 1
      var len = this.testArr.length + 11
      for (var i = ii; i < len; i++) {
        this.testArr.push(i)
      }
      this.$nextTick(() => {
        this.$refs.vScrollbar6.reCalcu()
      })
    },
    scrollFn(e) {
      console.log(e.type)
    }
  },
  mounted() {
    hljs.initHighlightingOnLoad()
  }

}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}

#app {
  width: 660px;
  margin: 0 auto;
  height: 100%;

  .document-title{
    background: #000;
    color: #ccc;
    font-family: 'microsoft yahei';
    font-size: 24px;
    text-align: center;
    line-height: 40px;
    margin: 0;
  }
  .vScrollbar1,
  .vScrollbar2,
  .vScrollbar3,
  .vScrollbar4,
  .vScrollbar5,
  .vScrollbar6 {
    width: 400px;
    height: 200px; // position: absolute;
    border: 1px solid red;
    margin: auto;
  }
}
</style>
