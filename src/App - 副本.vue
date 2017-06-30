<template>
  <div id="app">
    <v-scrollbar class="vScrollbar1" @scroll="fn">
      <h1 v-for="n in 30">default</h1>
    </v-scrollbar>

    <v-scrollbar class="vScrollbar2" :isHideBar="true">
      <h3 v-for="n in 30">:isHideBar="true"</h3>
    </v-scrollbar>

    <v-scrollbar class="vScrollbar3" :isTopBar="true">
      <h3 v-for="n in 30">:isTopBar="true"</h3>
    </v-scrollbar>

    <v-scrollbar class="vScrollbar4" :barContainerStyle="{width:'14px', background:'#282828' ,borderLeft:'1px solid #1d1d1d',borderRight:'1px solid #3e3e3b'}" :barStyle="{width:'8px',border:'1px solid #191919',borderRadius:'5px',overflow:'hidden'}">
      <div slot="barIn" :style="{width:'100%',height:'100%',background:'#454545',borderLeft:'1px solid #585858'}"></div>
      <h3 v-for="n in 30">:isTopBar="true"</h3>
    </v-scrollbar>

    <v-scrollbar class="vScrollbar5" :isTopBar="true">
      <h3 v-for="n in 30">:isTopBar="true"</h3>
      <div slot="topBarIn" :style="{position:'absolute',right:'0',top:'-5px',color:'#17ce28',zIndex:'1000'}">♪</div>
    </v-scrollbar>
    <v-scrollbar ref="vScrollbar6" class="vScrollbar6">
      <h1 v-for="v in  testArr">{{v}}</h1>
      <button @click="addContent"> add coontent </button>
    </v-scrollbar>
  </div>
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
  mounted(){
    ljs.initHighlightingOnLoad()
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
  height: 100%;
  .vScrollbar1,
  .vScrollbar2,
  .vScrollbar3,
  .vScrollbar4,
  .vScrollbar5,
  .vScrollbar6 {
    width: 200px;
    height: 200px;
    position: absolute;
    border: 1px solid red;
  }
  .vScrollbar1 {}
  .vScrollbar2 {
    left: 210px;
  }
  .vScrollbar3 {
    left: 420px;
  }
  .vScrollbar4 {
    top: 210px;
    background: #272822;
    color: #ccc;
  }
  .vScrollbar5 {
    top: 210px;
    left: 210px;
  }
  .vScrollbar6 {

    top: 210px;
    left: 420px;
  }
}
</style>
