<template>
  <div class="process">
    <div class="represent-text">{{ flavorClass[cur] + "代表酒:" + tyipcalWine[cur] }}</div>
    <div class="tooltip">
      <div class="tooltip-des"></div>
      <div class="init">
        <img class="init-image" v-for="(item, index) in initImage" :key="index" :src="item" />
      </div>
      <div class="after">
        <div class="text">
          <div class="title"></div>
          <div class="active-text"></div>
        </div>
        <div class="active-image"></div>
      </div>
    </div>
    <div class="process-typical"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { lines } from "@/assets/js/part1/process";
import { kojiDetail } from "@/assets/js/part1/kojiDetail";
import processData from "@/assets/data/part1/processData.json";
import kojiData from "@/assets/data/part1/kojiData.json";

export default {
  data() {
    return {
      tyipcalWine: [
        "泸州老窖(原窖法)",
        "茅台",
        "杏花村",
        "绍兴酒",
        "景芝酒",
        "湘泉酒",
        "石湾玉冰烧",
        "衡水老白干",
        "酒鬼酒",
        "西凤酒",
        "四特酒",
        "董酒",
      ],
      initImage: [
        "process/1.png",
        "process/2.png",
        "process/3.png",
        "process/4.png",
      ],
      timer: "",
      flavorClass: ["浓香型", "酱香型", "清香型", "米香型", "芝麻香型", "兼香型", "豉香型", "老白干香型", "馥郁香型", "凤香型", "特香型", "药香型"]
    };
  },
  created() {
    // console.log(processData);
  },
  mounted() {
    clearInterval(this.timer)
    this.timer = null
    lines(processData[this.cur]);
    kojiDetail(kojiData[this.cur]);
    //添加图例
    let tyWidth = document.querySelector(".process-typical").offsetWidth;
    let tyHeight = document.querySelector(".process-typical").offsetHeight;
    let typicalSvg = d3
      .select(".process-typical")
      .append("svg")
      .attr("class", "typical-svg")
      .attr("width", tyWidth)
      .attr("height", tyHeight);

    let dotFontSize = 18;
    let mainDot = typicalSvg.append("g");
    mainDot
      .append("circle")
      .attr("r", 12)
      .attr("cx", tyWidth / 6)
      .attr("cy", tyHeight / 7)
      .attr("class", "dot main");
    mainDot
      .append("text")
      .text("关键步骤")
      .attr("font-size", dotFontSize)
      .attr("font-family", "KaiTi")
      .attr("font-weight", "bold")
      .attr("x", tyWidth / 6 + 20)
      .attr("y", tyHeight / 7 + dotFontSize / 2 - 3);

    let dot = typicalSvg.append("g");
    dot
      .append("circle")
      .attr("r", 12)
      .attr("cx", tyWidth / 6)
      .attr("cy", (tyHeight / 7) * 3)
      .attr("class", "dot");
    dot
      .append("text")
      .text("普通步骤")
      .attr("font-size", dotFontSize)
      .attr("font-family", "KaiTi")
      .attr("font-weight", "bold")
      .attr("x", tyWidth / 6 + 20)
      .attr("y", (tyHeight / 7) * 3 + dotFontSize / 2 - 3);

    let activeDot = typicalSvg.append("g");
    activeDot
      .append("circle")
      .attr("r", 10)
      .attr("cx", (tyWidth / 5) * 3)
      .attr("cy", (tyHeight / 7) * 3)
      .attr("class", "dot active active-typical");
    activeDot
      .append("text")
      .text("可交互节点")
      .attr("font-size", dotFontSize)
      .attr("font-family", "KaiTi")
      .attr("font-weight", "bold")
      .attr("x", (tyWidth / 5) * 3 + 20)
      .attr("y", (tyHeight / 7) * 3 + dotFontSize / 2 - 3);

    let kojiDot = typicalSvg.append("g");
    kojiDot
      .append("circle")
      .attr("r", 10)
      .attr("cx", (tyWidth / 5) * 3)
      .attr("cy", (tyHeight / 7) * 1)
      .attr("class", "nodeMain");
    kojiDot
      .append("text")
      .text("制曲步骤")
      .attr("font-size", dotFontSize)
      .attr("font-family", "KaiTi")
      .attr("font-weight", "bold")
      .attr("x", (tyWidth / 5) * 3 + 20)
      .attr("y", (tyHeight / 7) * 1 + dotFontSize / 2 - 3);

    let selected = typicalSvg.append("g");
    selected
      .append("image")
      .attr("class", "selecedImg")
      .attr("width", "24px")
      .attr("height", "24px")
      .attr("xlink:href", "process/curProcess.png")
      .attr("x", tyWidth / 6 - 12)
      .attr("y", (tyHeight / 7) * 5 - 12);
    selected
      .append("text")
      .text("选中的节点")
      .attr("font-size", dotFontSize)
      .attr("font-family", "KaiTi")
      .attr("font-weight", "bold")
      .attr("x", tyWidth / 6 + 20)
      .attr("y", (tyHeight / 7) * 5 + dotFontSize / 2 - 3);
    clearInterval(this.timer)
    this.timer = null
    // this.lineAnimation()
  },
  props: ["cur"],
  watch: {
    cur(n, o) {
      d3.select(".process-svg").remove();
      lines(processData[this.cur]);
      // materialDetail(materialData.flavor[this.cur]);
      kojiDetail(kojiData[this.cur]);
      // this.lineAnimation();
    },
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    lineAnimation() {
      this.timer = setInterval(() => {
        d3.selectAll(".ani-g").remove();
        let aniSvg =
          "M4.38,9h-2C1.62,9-.21,5.13.54,3.86a3,3,0,0,1,2-1.38c.56,0,1,.69,1.8.69Zm0,0h2C7.14,9,8.87,5,8,3.79A2.76,2.76,0,0,0,6,2.48c-.41,0-.81.69-1.66.69ZM8,1.31c.23.29.66,1.93.4,2.08s-.66-.56-1.17-.86a1.84,1.84,0,0,0-1.09-.32,1.45,1.45,0,0,0-.7.3,1.9,1.9,0,0,1-1,.29,1.65,1.65,0,0,1-1-.29,1.34,1.34,0,0,0-.85-.3,1.68,1.68,0,0,0-1,.32c-.51.3-1.3,1-1.55.86S.34,1.62.6,1.31c.11-.14.32-.28.46-.13.36.38,2.18.59,3.25.59s2.82-.15,3.25-.59C7.7,1,7.89,1.17,8,1.31ZM7.58.7c0,.49-1.46.92-3.27.92S1,1.19,1,.7,2.48,0,4.3,0,7.58.21,7.58.7Z";
        //第一根线
        let aniG = d3.select(".process-svg").append("g").attr("class", "ani-g");
        aniG
          .append("path")
          .attr("d", aniSvg)
          .attr("transform", "translate(" + 120 + "," + 180 + "),scale(4)")
          .attr("fill", "rgb(197,193,170)")
          .attr("opacity", 0)
          .transition()
          .duration(500)
          .attr("opacity", 1)
          .transition()
          .duration(4000)
          .attr("transform", "translate(" + 805 + "," + 180 + "),scale(4)")
          .transition()
          .duration(500)
          .attr("opacity", 0);
        //第二根线
        aniG
          .append("path")
          .attr("d", aniSvg)
          .attr("fill", "rgb(197,193,170)")
          .attr("transform", "translate(" + 805 + "," + 580 + "),scale(4)")
          .attr("opacity", 0)
          .transition()
          .delay(4000)
          .duration(500)
          .attr("opacity", 1)
          .transition()
          .duration(4000)
          .attr("transform", "translate(" + 120 + "," + 580 + "),scale(4)")
          .transition()
          .duration(500)
          .attr("opacity", 0);
        // //第三根线
        aniG
          .append("path")
          .attr("d", aniSvg)
          .attr("fill", "rgb(197,193,170)")
          .attr("transform", "translate(" + 120 + "," + 980 + "),scale(4)")
          .attr("opacity", 0)
          .transition()
          .delay(8000)
          .duration(500)
          .attr("opacity", 1)
          .transition()
          .duration(4000)
          .attr("transform", "translate(" + 394 + "," + 980 + "),scale(4)")
          .transition()
          .duration(500)
          .attr("opacity", 0);
      }, 14000);
    }
  },
};
</script>

<style lang="less">
@import "@/assets/css/process.less";

.process {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  /* border: 1px solid red; */
  .process-typical {
    position: absolute;
    width: 400px;
    height: 10%;
    bottom: 30px;
    right: 50px;
  }

  .represent-text {
    position: absolute;
    top: 1%;
    left: 6%;
    font-family: KaiTi;
    font-size: 20px;
    font-weight: bold;
    color: rgb(149, 156, 156);
  }
}
</style>