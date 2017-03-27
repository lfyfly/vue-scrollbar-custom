<template>
  <div id="app">
    <button @click="push">push</button>
    <v-scrollbar ref="barChild">
      <h1 v-for="n in arr">{{n}}</h1>
    </v-scrollbar>
  </div>
</template>

<script>
import vScrollbar from './vue2-custom-scrollbar/vue2-custom-scrollbar.vue'

export default {
  name: 'app',
  data () {
    return {
      arr:[123]
    }
  },
  methods: {
    push () {
      this.arr.push(123)
      console.log(this.$refs.barChild)
      this.$refs.barChild.reCalcu()
    }
  },
  components: {
    vScrollbar
  }
}
</script>

<style lang="scss">
html,body{
}
#app {
  h1{
    height: 100px;
    margin: 50px 0;
  }
}
</style>
