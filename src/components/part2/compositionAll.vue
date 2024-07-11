<template>
  <div class="container">
    <div class="compositionChart" ref="compositionChart">
      <div class="tooltip-cps">
        <div class="name"></div>
        <div class="value"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { compositionAll, computPos } from "@/assets/js/part2/compositionAll";
import { materialCps } from "@/assets/js/part2/material";
import flavor from "@/assets/data/part2/flavor.json";
import FlavorSubstances from "@/assets/data/part2/FlavorSubstances.json";
export default {
  data() {
    return {
      smallAngle: 0,
      radius: 0,
      total: {},
      curCps: {},
      rectR: 0,
      color: d3.scaleSequential(d3.interpolateOranges),
      rectColor: ["#DB9595", "#597399", "#BAAB6E"],
      smellColor: ["rgb(179,147,184)", "rgb(169,174,194)", "rgb(162,215,195)"], //香臭无
    };
  },
  props: ["cur"],
  mounted() {
    compositionAll(this);
    materialCps(this);
    this.curCps = computPos(this.total, this.smallAngle, this.cur);
    this.drawCps();
    this.drawFlavorText();
    this.drawFigure();
  },
  methods: {
    drawCps() {
      let that = this;
      let width = document.querySelector(".compositionChart").offsetWidth,
        height = document.querySelector(".compositionChart").offsetHeight;
      let color = d3.scaleSequential(d3.interpolateOranges);
      let radius = height * 0.4;
      let rectR = radius * 1.2;
      let rect = d3.select(".composition-all-svg").append("g");
      var toolTip = d3
        .select(".container")
        .append("div")
        .attr("class", "tooltip");
      toolTip.append("div").attr("class", "text-describe")
      toolTip.append("div").attr("class", "text-describe text-describe-2");
      let text = d3.select(".composition-all-svg").append("g")
      text.selectAll("text")
        .data(this.total)
        .enter()
        .append("text")
        .attr("class", "total-text")
        .attr("font-size", 20)
        .attr("opacity", 0)
        .attr("x", (d, i) => {
          let data = d.data[that.cur]
          if (i == 0) {
            return width / 2 + data.radius * Math.sin(d.startAngle) - String(data.content).length * 18
          } else if (i == 1) {
            return width / 2 + data.radius * Math.sin(d.startAngle) - 30
          } else if (i == 2) {
            return width / 2 + data.radius * Math.sin(d.startAngle) - 35
          }
        })
        .attr("y", (d, i) => {
          let data = d.data[that.cur]
          if (i == 0) {
            return height / 2 - data.radius * Math.cos(d.startAngle) + 10
          } else if (i == 1) {
            return height / 2 - data.radius * Math.cos(d.startAngle) - 10
          } else if (i == 2) {
            return height / 2 - data.radius * Math.cos(d.startAngle) + 20
          }
        })
        .text((d) => d.data[that.cur].content + "mg/L")
        .transition()
        .delay(1000)
        .attr("opacity", 1)

      this.curCps.forEach((item, index) => {
        rect
          .append("g")
          .attr("class", `rect-g-${index}`)
          .selectAll(".cpsRect")
          .data(item.data)
          .enter()
          .append("rect")
          .attr("class", "cpsRect")
          .attr("transform", function (d) {
            return `rotate(${(d.midAngle / Math.PI) * 180
              }, ${width / 2 + rectR * Math.sin(d.midAngle)}, ${height / 2 - rectR * Math.cos(d.midAngle)})`;
          })
          .attr("x", (d) => width / 2 + rectR * Math.sin(d.midAngle))
          .attr("y", (d) => height / 2 - rectR * Math.cos(d.midAngle))
          .attr("width", radius * Math.sin(this.smallAngle / 2) * 2)
          .attr("height", 0)
          .on("mouseover", function (d, i) {
            d3.select(this)
              .transition()
              .duration(500)
              .attr("fill", "rgb(238,154,73)");
            // console.log(d);
            let keys = Object.keys(FlavorSubstances);
            let detail = FlavorSubstances[keys[index]][i].detail;
            toolTip
              .select(".text-describe")
              .text(d.name + ":" + d.content + "mg/L");
            toolTip
              .select(".text-describe-2")
              .text("气味描述：" + detail);
            toolTip.style("display", "block");
            toolTip.style("opacity", 2);
            toolTip
              .style("top", d3.event.layerY + 10 + "px")
              .style("left", d3.event.layerX - 25 + "px");
          })
          .on("mouseleave", function (d, i) {
            toolTip.style("display", "none");
            toolTip.style("opacity", 0);
            // console.log(d3.select(this));
            d3.select(this)
              .transition()
              .duration(500)
              .attr("fill", () => {
                let keys = Object.keys(FlavorSubstances);
                let smell = FlavorSubstances[keys[index]][i].smell;
                if (smell == "香") {
                  return that.smellColor[0];
                } else if (smell == "臭") {
                  return that.smellColor[1];
                } else {
                  return that.smellColor[2];
                }
              });
          })
          .transition()
          .duration(500)
          .delay((d, i) => i * 30)
          .attr("height", (d) => {
            let h = d.content;
            if (h >= 700) {
              return 10 + h / 30;
            } else if (h >= 100 && h < 700) {
              return 10 + h / 10;
            } else if (h > 0 && h < 100) {
              return 10 + h / 20;
            } else {
              return h;
            }
          })
          .attr("fill", (d, i) => {
            // return color(0.5 + 0.01 * i)
            let keys = Object.keys(FlavorSubstances);
            let smell = FlavorSubstances[keys[index]][i].smell;
            if (smell == "香") {
              return this.smellColor[0];
            } else if (smell == "臭") {
              return this.smellColor[1];
            } else {
              return this.smellColor[2];
            }
          });
      });
    },
    //图例
    drawFigure() {
      let Figure = d3.select(".composition-all-svg");
      let FigureG = Figure.append("g");

      // 第一个弧
      let FigureArc1 = d3
        .arc()
        .innerRadius(62)
        .outerRadius(66)
        .startAngle((Math.PI * 305) / 200)
        .endAngle((Math.PI * 390) / 200);
      let FigureG_1 = FigureG.append("g");
      FigureG_1.append("path")
        .attr("d", FigureArc1)
        .attr("transform", "translate(90,90)")
        .attr("fill", "rgb(214,203,156)");
      FigureG_1.append("text")
        .text("总醇")
        // .style("font-size",'20px')
        .attr("transform", "translate(50,70)")
        // .attr("style", "font-size:15px;text-shadow:1px 1px 1px")
        .attr("style", "font-size:18px")
        .attr("stroke", "grey");

      // 第二个弧
      let FigureArc2 = d3
        .arc()
        .innerRadius(62)
        .outerRadius(66)
        .startAngle(Math.PI / 100)
        .endAngle((Math.PI * 98) / 200);
      let FigureG_2 = FigureG.append("g");
      FigureG_2.append("path")
        .attr("d", FigureArc2)
        .attr("transform", "translate(90,90)")
        .attr("fill", "rgb(205,185,184)");
      FigureG_2.append("text")
        .text("总酸")
        .attr("transform", "translate(105,70)")
        // .attr("style", "font-size:15px;text-shadow:1px 1px 1px")
        .attr("style", "font-size:18px")
        .attr("stroke", "grey");

      // 第三个弧
      let FigureArc3 = d3
        .arc()
        .innerRadius(62)
        .outerRadius(66)
        .startAngle((Math.PI * 108) / 200)
        .endAngle((Math.PI * 292) / 200);
      let FigureG_3 = FigureG.append("g");
      FigureG_3.append("path")
        .attr("d", FigureArc3)
        .attr("transform", "translate(90,90)")
        .attr("fill", "rgb(135,153,184)");
      FigureG_3.append("text")
        .text("总酯")
        .attr("transform", "translate(77,130)")
        // .attr("style", "font-size:15px;text-shadow:1px 1px 1px")
        .attr("style", "font-size:18px")
        .attr("stroke", "grey");

      // FigureG_3.append("text")
      //   .text("图例")
      //   .attr("transform", "translate(72,170)")
      //   .attr("style", "font-size:17px;")

      //香臭图例
      let width = document.querySelector(".compositionChart").offsetWidth;
      let height = document.querySelector(".compositionChart").offsetHeight;
      let radius = height * 0.4;
      let rectWidth = radius * Math.sin(this.smallAngle / 2) * 2;
      let rectGap = rectWidth * 1.5;
      let smellFigureG = Figure.append("g");
      smellFigureG
        .append("rect")
        .attr("x", width * 0.83)
        .attr("y", height * 0.9)
        .attr("width", rectWidth)
        .attr("height", 40)
        .attr("fill", this.smellColor[0]);
      smellFigureG
        .append("text")
        .text("香味")
        .attr("x", width * 0.83 - (1 * 18) / 3)
        .attr("y", height * 0.97)
        .attr("font-size", 18)
        .attr("stroke", "grey");
      smellFigureG
        .append("rect")
        .attr("x", width * 0.83 + rectGap + rectWidth)
        .attr("y", height * 0.9)
        .attr("width", rectWidth)
        .attr("height", 40)
        .attr("fill", this.smellColor[1]);
      smellFigureG
        .append("text")
        .text("臭味")
        .attr("x", width * 0.83 - (1 * 18) / 3 + rectGap + rectWidth)
        .attr("y", height * 0.97)
        .attr("font-size", 18)
        .attr("stroke", "grey");
      smellFigureG
        .append("rect")
        .attr("x", width * 0.83 + (rectGap + rectWidth) * 2)
        .attr("y", height * 0.9)
        .attr("width", rectWidth)
        .attr("height", 40)
        .attr("fill", this.smellColor[2]);
      smellFigureG
        .append("text")
        .text("未知")
        .attr("x", width * 0.83 - (1 * 18) / 3 + (rectGap + rectWidth) * 2)
        .attr("y", height * 0.97)
        .attr("font-size", 18)
        .attr("stroke", "grey");
    },

    drawFlavorText() {
      let flavorTextG = d3
        .select(".compositionChart")
        .append("div")
        .attr("class", "feature");

      flavorTextG
        .append("div")
        .attr("class", "flavorTextTitle")
        .transition()
        .style("opacity", 0)
        .duration(500)
        .transition()
        .duration(500)
        .style("opacity", 1)
        .text("风味特点");
      flavorTextG
        .data(flavor)
        .append("div")
        .attr("class", "flavorText")
        .transition()
        .style("opacity", 0)
        .duration(500)
        .transition()
        .duration(500)
        .style("opacity", 1)
        .text((d) => d.Composition_Characteristics);
    },
    updateRect(n, o) {
      let that = this
      let width = document.querySelector(".compositionChart").offsetWidth,
        height = document.querySelector(".compositionChart").offsetHeight;
      let color = d3.scaleSequential(d3.interpolateOranges);
      let radius = height * 0.4;
      let rectR = radius * 1.2;
      this.curCps.forEach((item, index) => {
        let rectTemp = d3
          .select(`.rect-g-${index}`)
          .selectAll(".cpsRect")
          .data(item.data)
          .transition()
          .duration(500)
          .delay((d, i) => i * 30)
          .attr("height", (d) => {
            let h = d.content;
            if (h >= 700) {
              return 10 + h / 30;
            } else if (h >= 100 && h < 700) {
              return 10 + h / 10;
            } else if (h > 0 && h < 100) {
              return 10 + h / 20;
            } else {
              return h;
            }
          })
          .attr("fill", (d, i) => {
            let keys = Object.keys(FlavorSubstances);
            let smell = FlavorSubstances[keys[index]][i].smell;
            if (smell == "香") {
              return this.smellColor[0];
            } else if (smell == "臭") {
              return this.smellColor[1];
            } else {
              return this.smellColor[2];
            }
            // return this.rectColor[index];
          });
      });

      let flavorTextArr = [];
      for (var i = 0; i < flavor.length; i++) {
        flavorTextArr.push(flavor[i].Composition_Characteristics);
      }
      d3.select(".flavorText")
        .data(flavorTextArr)
        .transition()
        .style("opacity", 0)
        .duration(500)
        .transition()
        .duration(500)
        .style("opacity", 1)
        .text(() => flavorTextArr[n]);
      //改变当前香型的弧的样式
      console.log(n);
      let mainColor = [
        "rgb(205,185,184)",
        "rgb(135,153,184)",
        "rgb(214,203,156)",
      ];
      d3.selectAll(`.cps-flavor-${o}`)
        .transition()
        .duration(500)
        .attr("stroke", (d, i) => mainColor[i])
        .attr("stroke-width", 8);

      d3.selectAll(`.cps-flavor-${n}`)
        .transition()
        .duration(500)
        .attr("stroke", "#EE9A49")
        .attr("stroke-width", 14);
      d3.selectAll(".total-text")
        .data(this.total)
        .transition()
        .attr("x", (d, i) => {
          let data = d.data[that.cur]
          if (i == 0) {
            return width / 2 + data.radius * Math.sin(d.startAngle) - String(data.content).length * 18
          } else if (i == 1) {
            return width / 2 + data.radius * Math.sin(d.startAngle) - 30
          } else if (i == 2) {
            return width / 2 + data.radius * Math.sin(d.startAngle) - 35
          }
        })
        .attr("y", (d, i) => {
          let data = d.data[that.cur]
          if (i == 0) {
            return height / 2 - data.radius * Math.cos(d.startAngle) + 10
          } else if (i == 1) {
            return height / 2 - data.radius * Math.cos(d.startAngle) - 10
          } else if (i == 2) {
            return height / 2 - data.radius * Math.cos(d.startAngle) + 20
          }
        })
        .text((d) => `${d.data[that.cur].content}mg/L`)
    },
    //选择香型后更新中间
    updateMaterial(n, o) {
      d3.selectAll(".main-node")
        .transition()
        .duration(500)
        .attr("fill", function (d, i) {
          // console.log(d);
          let color = "";
          for (let j = 0; j < flavor[n].brew.length; j++) {
            // console.log(d.name+" "+flavor[n].brew[j]);
            // console.log(n);
            if (d.name == flavor[n].brew[j]) {
              // console.log(1);
              color = "#E0BE8C";
              return color;
            } else {
              color = "rgb(190,158,98)";
            }
          }
          return color;
        })
        .attr("r", (d) => {
          let rr;
          for (let j = 0; j < flavor[n].brew.length; j++) {
            if (d.name == flavor[n].brew[j]) {
              rr = 25;
              return rr;
            } else {
              rr = 20;
            }
          }
          return rr;
        });
    },
  },
  watch: {
    cur(n, o) {
      this.curCps = computPos(this.total, this.smallAngle, n);
      this.updateRect(n, o);
      this.updateMaterial(n, o);
    },
  },
};
</script>

<style lang="less">
@import url(@/assets/css/composition.less);
</style>