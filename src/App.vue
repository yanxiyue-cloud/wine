<template>
  <div id="app">
    <navigation :curPage="curPage" :dataForm="dataForm" v-if="curPage != '首页'"></navigation>
    <router-view></router-view>
  </div>
</template>
<script>
import navigation from './components/navigation.vue';

export default {
  data() {
    return {
      windowHeight: 0,
      curPage: "首页",
      dataForm: "《传统白酒酿造技术》、《白酒酿造与技术创新》、《白酒生产技术全书》等"
    }
  },
  mounted() {
    this.windowHeight = window.innerHeight - 1;
    let scale = this.windowHeight / 1080
    document.body.style.zoom = scale;
  },
  components: {
    navigation
  },
  watch: {
    $route: { 
      handler(n, o) {
        this.curPage = n.name
        // console.log(this.curPage);
        this.dataForm = n.meta.dataForm
      }
    }
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

text {
  pointer-events: none;
  user-select: none;
}
</style>
