<template>
  <div class="germ">
    <div class="title">发酵微生物</div>
    <div class="chart"></div>
    <div class="germ-tooltip">
      <div class="text-describe"></div>
    </div>
  </div>
</template>

<script>
import { drawChart } from "@/assets/js/part2/germ";

export default {
  props: ["cur"],
  mounted() {
    drawChart(this.cur);
  },
  watch: {
    cur(n, o) {
      drawChart(this.cur);
    }
  }
}
</script>

<style lang="less">
.germ {
  width: 70%;
  height: 100%;
  // border-right: 1px dashed #d0d0c8;

  .title {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: STXingkai;
    font-size: 32px;
  }

  .chart {
    height: calc(100% - 60px);
    width: 100%;
    position: relative;

    .germ-legend {
      position: absolute;
      width: 24%;
      height: 43%;
      top: 1%;
      right: 2%;
    }
  }

  .germ-tooltip {
    background: white;
    box-shadow: 0 0 5px #999999;
    border: 5px solid rgba(168, 167, 150, 0.971);
    color: #333;
    width: 84px;
    height: 26px;
    // height: 50px;
    font-size: 20px;
    left: 130px;
    padding: 10px;
    position: absolute;
    text-align: center;
    top: 95px;
    z-index: 1000;
    display: block;
    opacity: 0;
    font-family: kaiTi;
    pointer-events: none;

    .text-describe {
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>