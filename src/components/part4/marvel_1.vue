<template>
  <div class="marvel-contain">
    <div class="marvel-line"></div>
  </div>
</template>

<script>
import * as d3 from "d3"
import { drawMarvelLine } from '@/assets/js/part4/marvel_1';

export default {
  props: ["cur"],
  mounted() {
    drawMarvelLine(this.cur)
  },
  watch: {
    cur(n, o) {
      d3.select(".marvel-svg").remove()
      drawMarvelLine(n)
    }
  }
};
</script>
  
<style lang="less">
.marvel-contain {
  width: 100%;
  height: 100%;

  .marvel-line {
    width: 100%;
    height: 100%;
  }
}
</style>