<template lang="pug">
div#hello
  h1 {{msg}}
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'this is hello.vue'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1{
  color:red;
}
</style>
