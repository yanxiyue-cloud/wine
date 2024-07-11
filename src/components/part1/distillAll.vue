<template>
  <div class="distillAll">
    <div class="chart" ref="distillChart"></div>
    <div class="distill-typical"></div>
  </div>
</template>

<script>
import distillData from "@/assets/data/part1/distillData.json";
import * as d3 from "d3";
import { distillAll } from "@/assets/js/part1/distillAll";

export default {
  props: ["cur"],
  data() {
    return {};
  },
  mounted() {
    distillAll(this.cur)
  },
  watch: {
    cur(n, o) {
      d3.selectAll(".distill-node")
        .transition()
        .duration(500)
        .attr("opacity", 0.3)
        .attr("r", (d) => d.depth == 2 ? 10 : 20)
      d3.selectAll(".distill-link")
        .transition()
        .duration(500)
        .attr("stroke", "transparent")

      d3.selectAll(`.distill-flavor-${n}`)
        .transition()
        .duration(500)
        .attr("opacity", 1)
        .attr("r", (d) => d.depth == 2 ? 10 : 20)
      d3.selectAll(`.distill-link-${n}`)
        .transition()
        .duration(500)
        .attr("stroke", "grey")
    },
  },
  methods: {

  }
};
</script>

<style lang="less">
@import "@/assets/css/distill.less";

.distillAll {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .chart {
    width: 100%;
    height: 100%;
    // transform:translate(-50px,-120px);
    background: url('@/assets/image/distill/flower.png') no-repeat;
    background-size: 90%;
    background-position: center;
  }

  .distill-typical {
    position: absolute;
    // background: sandybrown;
    width: 21%;
    height: 13%;
    top: 1%;
    left: 77%;
  }
}
</style>