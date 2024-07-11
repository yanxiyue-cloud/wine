<template>
  <div class="storageAll">
    <div class="storage-tooltip">
      <div class="flavor-text text"></div>
      <div class="equip-text text"></div>
      <div class="year-text text"></div>
    </div>
    <div class="chart" ref="storageAll"></div>
  </div>
</template>

<script>
import { storageAll } from '@/assets/js/part1/stroageAll';
import * as d3 from "d3"

export default {
  props: ["cur"],
  watch: {
    cur(n, o) {
      storageAll(this.cur);
    },
  },
  data() {
    return {
      chartInstance: null,
      allData: null,
    }
  },
  mounted() {
    storageAll(this.cur);
  },
  methods: {}
}
</script>

<style lang="less">
@import url(@/assets/css/storageAll.less);

.storageAll {
  width: 100%;
  height: 100%;
  position: relative;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>