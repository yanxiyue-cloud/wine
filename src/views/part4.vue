<template>
  <div class="people">
    <div class="body">
      <div class="top">
        <div class="left">
          <div class="content">
            <div class="text">
              <div class="num">10</div>
              <div class="stext">位酿酒功臣</div>
            </div>
            <div class="text">
              <div class="num">82</div>
              <div class="stext">篇酿酒论著</div>
            </div>
            <div class="text">
              <div class="num">1908</div>
              <div class="stext">年——&nbsp;&nbsp;</div>
              <div class="num">2011</div>
              <div class="stext">年</div>
            </div>
          </div>
        </div>
        <div class="right"></div>
      </div>
      <div class="bottom">
        <marvel :cur="renderPeople"></marvel>
        <div class="title">
          <div class="name">{{ name }}</div>
          <div class="job">{{ job }}</div>
          <div class="back">{{ back }}</div>
        </div>
        <div class="experience">
          <div class="experience-time"></div>
          <div class="experience-name"></div>
          <div class="experience-text"></div>
        </div>
        <div class="book">
          <div class="book-time"></div>
          <div class="book-name"></div>
          <div class="book-text"></div>
        </div>
      </div>
    </div>
    <div class="both-frame">出生时间</div>
    <div class="exp-frame">人物经历</div>
    <div class="drink"></div>
  </div>
</template>

<script>
import marvel from "@/components/part4/marvel_1.vue";
import people from "@/assets/data/part4/personMessage.json";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import * as d3 from "d3";

export default {
  data() {
    return {
      svg: "",
      renderPeople: 0,
      name: "秦含章",
      job: "高级工程师",
      back: "曾任轻工业部发酵工程科学研究所所长，轻工业部食品发酵工业研究所所长、名誉所长，也是我国食品科学技术和工程发酵与酿造技术的开拓者和学术带头人",
    };
  },
  mounted() {
    this.initPeople();
  },
  methods: {
    initPeople() {
      let that = this;
      let peopleData = people;
      peopleData.sort((a, b) => a.birth - b.birth);
      let width = document.querySelector(
        ".people .body .top .right"
      ).offsetWidth;
      let height = document.querySelector(
        ".people .body .top .right"
      ).offsetHeight;
      let margin = width / 20;
      this.svg = d3
        .select(".people .body .top .right")
        .append("svg")
        .attr("class", "people-birth")
        .attr("width", width)
        .attr("height", height);
      let birthLen = width - margin * 2;
      let birthLine = this.svg
        .append("path")
        .attr("stroke-width", 4)
        .attr("stroke", "grey")
        .attr("d", `M${margin},${height / 2} H${width - margin}`);

      let interval = birthLen / peopleData.length;
      let tickHeight = 30;
      let ticks = this.svg
        .append("g")
        .selectAll("path")
        .data(peopleData)
        .enter()
        .append("path")
        .attr("class", "ticks")
        .attr("stroke-width", 2)
        .attr("stroke", "grey")
        .attr("d", (d, i) => {
          let transformTick =
            i % 2 ? height / 2 - tickHeight : height / 2 + tickHeight;
          return `M${interval / 2 + margin + i * interval},${height / 2
            } V${transformTick}`;
        });
      let ticksText = this.svg
        .append("g")
        .selectAll("text")
        .data(peopleData)
        .enter()
        .append("text")
        .text((d) => d.birth + "年")
        .attr("font-size", "20px")
        .attr("font-family", "KaiTi")
        .attr("font-weight", "bold")
        .attr("fill", "grey")
        .attr("x", (d, i) => {
          return interval / 2 + margin + i * interval - 20;
        })
        .attr("y", (d, i) => {
          return i % 2 ? height / 2 + tickHeight : height / 2 - tickHeight;
        });
      let bgRectHeight = height / 3,
        bgRectWidth = 100;
      let bgRect = this.svg
        .append("g")
        .selectAll("rect")
        .data(peopleData)
        .enter()
        .append("rect")
        .attr("class", "imageRect")
        .attr(
          "x",
          (d, i) => interval / 2 + margin + i * interval - bgRectWidth / 2
        )
        .attr("y", (d, i) =>
          i % 2
            ? height / 2 - tickHeight - bgRectHeight
            : height / 2 + tickHeight
        )
        .attr("width", bgRectWidth)
        .attr("height", bgRectHeight)
        .attr("stroke", "grey")
        .attr("stroke-width", 3)
        .attr("fill", "none");
      let peopleFrame = this.svg
        .append("g")
        .selectAll("image")
        .data(peopleData)
        .enter()
        .append("image")
        .attr("xlink:href", `people/zl.png`)
        .attr("width", bgRectWidth + 30)
        .attr("height", bgRectHeight)
        .attr(
          "x",
          (d, i) => interval / 2 + margin + i * interval - bgRectWidth / 2 - 15
        )
        .attr("y", (d, i) =>
          i % 2 ? height / 2 - tickHeight - bgRectHeight - 25 : height / 2 - 54
        )
        .style("transform", "scaleY(1.5)");
      let peopleImage = this.svg
        .append("g")
        .selectAll("image")
        .data(peopleData)
        .enter()
        .append("image")
        .attr("class", "peopleImage")
        .style("cursor", "pointer")
        .attr("xlink:href", (d) => `people/${d.img}`)
        .attr(
          "x",
          (d, i) => interval / 2 + margin + i * interval - bgRectWidth / 2
        )
        .attr("y", (d, i) =>
          i % 2
            ? height / 2 - tickHeight - bgRectHeight
            : height / 2 + tickHeight
        )
        .attr("width", bgRectWidth)
        .attr("height", bgRectHeight)
        .on("click", function (d, i) {
          d3.select(".experience").select(".experience-time").text("");
          d3.select(".experience").select(".experience-name").text("");
          d3.select(".experience").select(".experience-text").text("");
          d3.select(".book").select(".book-time").text("");
          d3.select(".book").select(".book-name").text("");
          d3.select(".book").select(".book-text").text("");
          that.name = d.name;
          that.job = d.job;
          that.back = d.background;
          that.renderPeople = i;
          d3.select(".flag-img")
            .transition()
            .duration(500)
            .attr("transform", `translate(${i * interval},0)`);
        });
      //初始小旗子
      let flag = this.svg
        .append("g")
        .append("image")
        .attr("xlink:href", "people/flag.svg")
        .attr("x", margin + interval / 2 - 15)
        .attr("y", height / 2 - 25)
        .attr("width", "30px")
        .attr("height", "30px")
        .attr("class", "flag-img");
    },
  },
  watch: {},
  components: {
    marvel,
  },
};
</script>

<style lang="less" >
// @path:"/public/";
.people {
  width: 100%;
  height: 100%;
  position: relative;

  .both-frame {
    position: absolute;
    width: 6%;
    height: 21%;
    top: 11%;
    left: 26%;
    // border: 1px solid grey;
    writing-mode: vertical-lr;
    font-family: kaiti;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("@/assets/image/frame.png");
    background-size: 100% 100%;
  }

  .exp-frame {
    position: absolute;
    width: 6%;
    height: 21%;
    bottom: 27%;
    right: 3%;
    // border: 1px solid grey;
    writing-mode: vertical-lr;
    font-family: kaiti;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("@/assets/image/frame.png");
    background-size: 100% 100%;
  }

  .drink {
    position: absolute;
    width: 12%;
    height: 21%;
    bottom: 2%;
    right: 0%;
    // border: 1px solid grey;
    background-image: url("@/assets/image/drink.png");
    background-size: 100% 100%;
  }

  .body {
    width: 100%;
    height: calc(100% - 80px);

    .top {
      width: 100%;
      height: 35%;
      // border-bottom: 1px solid grey;
      display: flex;

      .left {
        width: 30%;
        height: 100%;

        // border-right: 1px solid grey;
        .content {
          display: flex;
          flex-direction: column;
          //   font-family: fangsong;
          font-weight: 600;
          text-align: left;
          height: 70%;
          justify-content: center;
          align-items: flex-start;

          .text {
            display: flex;
            width: 100%;
            height: 25%;
            align-items: flex-end;
            margin-left: 15%;
            font-family: FZQKBYSJW--GB1-0, FZQingKeBenYueSongS-R-GB;

            .num {
              font-size: 32px;
              font-weight: 400;
            }

            .stext {
              font-size: 19px;
              font-weight: 400;
              margin-left: 4px;
            }
          }
        }
      }

      .right {
        width: 70%;
        height: 100%;
      }
    }

    .bottom {
      width: 100%;
      height: 65%;
      position: relative;

      .title {
        position: absolute;
        width: 70%;
        height: 20%;
        top: 2%;
        left: 2%;
        font-size: 24px;
        font-family: fangsong;
        font-weight: 600;
        text-align: left;

        .name {
          font-size: 32px;
        }

        .back {
          width: 100%;
        }
      }

      .experience {
        position: absolute;
        bottom: 5%;
        right: 15%;
        width: 33%;
        padding: 10px 20px;
        // background-color: rgba(242, 229, 229, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background:
          linear-gradient(to top, #cbf4cf, #b6e2b8 10px, transparent 10px),
          linear-gradient(to right, #c1ef8c, #c1ef8c 10px, transparent 10px),
          linear-gradient(to bottom, #8bc34a, #8bc34a 10px, transparent 10px),
          linear-gradient(to left, #549c95, #66a8a2 10px, transparent 10px);
        background-origin: border-box;
        transition: all 0.5s;

        .experience-time {
          width: 80%;
          font-size: 32px;
        }

        .experience-name {
          width: 80%;
          font-size: 24px;
          font-family: STXingKai;
        }

        .experience-text {
          width: 80%;
          max-height: 100px;
          font-size: 20px;
          font-family: KaiTi;
          overflow: auto;
        }

        .experience-text::-webkit-scrollbar {
          width: 6px;
        }

        .experience-text::-webkit-scrollbar-thumb {
          background-color: #0003;
          border-radius: 3px;
        }

        .experience-text::-webkit-scrollbar-track {
          border-radius: 10px;
          background-color: #efdcc1;
        }
      }

      .book {
        position: absolute;
        top: 25%;
        left: 2%;
        width: 33%;
        padding: 10px 0;
        // background-color: rgba(242, 229, 229, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background:
          linear-gradient(to top, #e4d985, #e4d985 10px, transparent 10px),
          linear-gradient(to right, #daeaa1, #daeaa1 10px, transparent 10px),
          linear-gradient(to bottom, #b8c47b, #b8c47b 10px, transparent 10px),
          linear-gradient(to left, #c8b190, #c8b190 10px, transparent 10px);
        background-origin: border-box;

        .book-time {
          width: 80%;
          font-size: 32px;
        }

        .book-name {
          width: 100%;
          font-size: 32px;
          font-family: STXingKai;
        }

        .book-text {
          width: 80%;
          font-size: 20px;
          font-family: KaiTi;
        }
      }
    }
  }
}
</style>