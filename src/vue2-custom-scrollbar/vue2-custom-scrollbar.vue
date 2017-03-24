<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
.vue2-custom-scrollbar {
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 500px;
  border: 1px solid;
  .scrollbar-hide {
    position: absolute;
    left: 0;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .content {
    width: 300px;// 和.vue2-custom-scrollbar宽度一样， 把垂直滚动条顶出去
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue2-custom-scrollbar
  .scrollbar-hide
    .content
      slot


</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'vue2-custom-scrollbar',
  data() {
    return {
      msg: 'this is from vue2-custom-scrollbar.vue',

    }
  },
  methods: {

  }
}
</script>
