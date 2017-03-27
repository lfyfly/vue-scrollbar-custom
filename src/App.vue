<template>
  <div id="app">
    <v-scrollbar>
      <h1 v-for="n in 30">{{n}}</h1>
    </v-scrollbar>
  </div>
</template>

<script>
import vScrollbar from './vue2-custom-scrollbar/vue2-custom-scrollbar.vue'

export default {
  name: 'app',
  components: {
    vScrollbar
  }
}
</script>

<style lang="scss">
#app {

}
</style>
