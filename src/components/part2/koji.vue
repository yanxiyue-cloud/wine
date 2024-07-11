<template>
  <div class="koji">
    <div class="title">用曲</div>
    <div class="chart"></div>
    <div class="koji-tooltip">
      <div class="text-describe"></div>
    </div>
  </div>
</template> 

<script>
import { drawKoji } from "@/assets/js/part2/koji";
import kojiMicrobe from "@/assets/data/part2/kojiMicrobe.json";
import * as d3 from "d3";
import flavor from "@/assets/data/part2/flavor.json";

export default {
  props: ["cur"],
  data() {
    return {
      type: ["霉菌", "酵母", "细菌"]
    };
  },
  mounted() {
    drawKoji(this.cur);
    // console.log(this.cur);
  },
  watch: {
    cur(n, o) {
      let that = this
      let mainColor = ["rgb(191,211,184)", "rgb(169,128,178)", "rgb(197,164,132)"]
      let flavorKoji = flavor[n].koji; //该香型用曲
      d3.selectAll(".koji-item")
        .transition()
        .duration(500)
        .style("background-color", "transparent");

      d3.selectAll(".microbe")
        .transition()
        .duration(500)
        .attr("r", 5)
        .attr("fill", (d, i) => {
          return mainColor[that.type.indexOf(d.type)]
        })
      for (let i = 0; i < kojiMicrobe.length; i++) {
        if (flavorKoji.includes(kojiMicrobe[i].name)) {
          d3.select(".koji-item" + i)
            .on("mouseout", d => {
              if (flavorKoji.includes(kojiMicrobe[i].name)) {
                d3.select(".koji-item" + i).style("background-color", "rgb(217,224,220)");
              } else {
                d3.select(".koji-item" + i).style("background-color", "transparent");
              }
            })
            .transition()
            .duration(500)
            .style("background-color", "rgb(217,224,220)")

          d3.selectAll(`.koji-${i}`)
            .transition()
            .duration(500)
            .attr("r", 10)
        }
      }
    },
  },
};
</script>

<style lang="less">
.koji {
  width: 30%;
  height: 100%;
  position: relative;

  .title {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: STXingkai;
    font-size: 32px;
    // border-bottom: 1px solid rgb(193, 188, 188);
  }

  .chart {
    width: 100%;
    height: calc(100% - 60px);

    .koji-div {
      position: absolute;
      left: 54%;
      top: 42%;
      font-family: kaiTi;
      font-size: 27px;
      cursor: pointer;
      z-index: 40;
    }

    .koji-item {
      height: 20%;
      width: 100%;
      // border-bottom: 1px solid red;
      border-radius: 130px 0 0 130px;

      .koji-img {
        width: 40%;
        height: 84%;
        position: absolute;
        top: 7%;
        left: 5%;
        // border: 1px solid red;
        // z-index: 1000;
        cursor: pointer;
      }
    }
  }
  .koji-tooltip {
    background: white;
    box-shadow: 0 0 5px #999999;
    border: 5px solid rgba(168, 167, 150, 0.971);
    color: #333;
    width: 200px;
    height: 156px;
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
      width: 90%;
      // height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>