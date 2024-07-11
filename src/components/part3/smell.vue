<template>
  <div class="smell">
    <div class="smell-legend">
      <div class="diamonds">
        <div class="diamond"></div>
        <div class="diamond"></div>
        <div class="diamond"></div>
        <div class="diamond"></div>
      </div>
      <div class="legend-text">
        <div>香气描述</div>
        <div>口感描述</div>
        <div>色泽描述</div>
        <div>描述词语频数</div>
      </div>
    </div>
  </div>
</template>

<script>
import { smellChart } from "@/assets/js/part3/smell";
import * as d3 from "d3";

export default {
  props: ["cur"],
  mounted() {
    smellChart(this);
  },
  watch: {
    cur(n, o) {
      let widthSmell = document.querySelector(".smell").offsetWidth;
      let radius = widthSmell / 2.5;
      let arc = d3.arc()
        .innerRadius((d) => (d.depth == 1 ? radius / 6 : d.radius - radius / 3))
        .outerRadius((d) => d.radius)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle);
      let arcActive = d3.arc()
        .innerRadius((d) => (d.depth == 1 ? radius / 6 : d.radius - radius / 3))
        .outerRadius((d) => d.radius + 40)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle);
      let arcColor = ['rgba(231,223,213)', 'rgba(230,222,197)']
      let colorScale = d3.scaleLinear().range(arcColor).domain([1, 10])
      d3.selectAll(".smell-arc")
        .transition()
        .attr("d", arc)
        .attr("fill", (d1) => {
          if (d1.data.children) {
            return d1.data.itemStyle.color;
          } else {
            if (d1.data.flavor) {
              if (d1.data.flavor == "all") {
                return colorScale(10);
              } else {
                return colorScale(d1.data.flavor.length);
              }
              // console.log();
            }
            return "#DDEAD3";
          }
          // return d1.data.itemStyle.color;
        });
      d3.selectAll(`.smell-class-${n}`).transition().attr("d", arcActive);
      // .attr("fill", "rgb(240,192,180)");
      d3.selectAll(`.smell-class-all`).transition().attr("d", arcActive);
      // .attr("fill", "rgb(240,192,180)");
    },
  },
  methods: {},
};
</script>

<style lang="less">
.smell {
  height: 80%;
  width: 100%;
  position: relative;

  .smell-legend {
    position: absolute;
    width: 19%;
    height: 17%;
    bottom: 1%;
    right: 1%;
    display: flex;

    .diamonds {
      width: 25%;

      .diamond {
        margin-bottom: 46%;
        width: 20px;
        height: 20px;
        transform: rotate(45deg);
      }

      .diamond:nth-child(1) {
        background-color: rgb(219, 203, 167);
      }

      .diamond:nth-child(2) {
        background-color: rgb(219, 203, 197);
      }

      .diamond:nth-child(3) {
        background-color: rgb(219, 223, 197);
      }

      .diamond:nth-child(4) {
        background-image: linear-gradient(rgb(221, 234, 211), rgb(230, 222, 197), rgb(231, 223, 209));
      }

      .diamond:before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        // border: solid 5px #000;
        transform: rotate(-45deg);
      }
    }

    .legend-text {
      width: 75%;
      font-family: kaiti;
      font-size: 20px;

      div {
        margin-bottom: 15%;
      }
    }
  }
}
</style>