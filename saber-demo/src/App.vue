<template>
  <div id="app">
    <router-view />
    <my-modal />
  </div>
</template>

<script>
import MyModal from './plugins/modal/index'
export default {
  name: 'App',
  components: { MyModal }
}
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.basic-container-box {
  padding: 10px 10px 0;
  margin: 0 10px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  overflow: auto;
  &--block {
    height: 100%;
  }
}
</style>
