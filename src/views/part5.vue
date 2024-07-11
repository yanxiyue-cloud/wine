<template>
  <div class="factory">
    <div class="factory-body">
      <div class="top">
        <div class="left">
          <div class="cur-none" v-if="factory == ''">
            <div class="title">酒厂历史</div>
            <div class="tip">(请点击地图或时间轴上节点查看)</div>
          </div>
          <div class="cur-history" v-if="factory != ''">
            <div class="chart"></div>
          </div>
        </div>
        <div class="right">
          <div class="factory-map"></div>
          <div class="factory-describe" v-if="factory != ''">
            <img class="logo" :src="factory == '' ? '' : `/factoryLogo/${factory.name}.png`" alt="" />
            <div class="name">{{ factory.name }}</div>
            <div class="time">成立时间：{{ factory.birth }}</div>
            <div class="location">{{ factory.location }}</div>
          </div>
          <div class="south-sea"></div>
          <div class="factory-total">
            <div class="factory-num">
              <h2>{{ total.factoryNum }}</h2>
              家酒厂
            </div>
            <!-- <div class="time">
              <h2>{{ total.minTime }}</h2>
              年----
              <h2>{{ total.curTime }}</h2>
              年
            </div> -->
          </div>
          <div class="factory-map-title">
            <div class="title-1">白酒</div>
            <div class="title-2">地图</div>
          </div>
          <div class="examine">
            <p>中国地图数据来源：高德软件</p>
            <p>审图号：GS京(2022)1061号</p>
          </div>
          <div class="map-tooltip"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="factory-history">
          <p v-if="factory != ''">双击节点复原</p>
        </div>
        <div class="cur-factory-map-tooltip">
          <div class="time"></div>
          <div class="name"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { factoryMap } from "@/assets/js/part5/factoryMap";
import { factoryHistory } from "@/assets/js/part5/factoryHistory";
import { curHistory } from "@/assets/js/part5/curHistory";
import factory from "@/assets/data/part5/factory.json";
import f_f from "@/assets/data/part5/factory_flavor.json";

export default {
  data() {
    return {
      factory: "",
      ani: true,
      timer: "",
      total: {
        factoryNum: 104,
        wineNum: 569,
        minTime: 1900,
        curTime: 2023,
      },
    };
  },
  mounted() {
    factoryMap(this);
    factoryHistory(this);
    this.mapAni()
    this.total.factoryNum = factory.length;
  },
  methods: {
    mapAni() {
      let index = 0
      this.timer = setInterval(() => {
        //地图对应香型变化
        d3.selectAll(".factory-map")
          .transition()
          .attr("opacity", 0.1)
          .attr("r", 5)
        d3.selectAll(`.factory-map-flavor-${index}`)
          .transition()
          .attr("opacity", 1)
          .attr("r", 10)
        //图例对应香型变化
        d3.selectAll(".factory-example")
          .transition()
          .attr("opacity", 0.3)
        d3.selectAll(`.factory-example-${index}`)
          .transition()
          .attr("opacity", 1)

        index = (index + 1) % f_f.length
      }, 2000);
    }
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  watch: {
    factory(n, o) {
      setTimeout(() => {
        if (n == "") {
          d3.select(".cur-history-svg").remove();
        } else {
          curHistory(n);
        }
      }, 0);
    },
    ani(n, o) {
      if (n) {
        this.mapAni()
      } else {
        clearInterval(this.timer)
        this.timer = null
        if (this.factory == "") {
          return
        } else {
          d3.selectAll(`.factory-example`)
            .transition()
            .attr("opacity", 1)
        }
      }
    }
  },
};
</script>

<style lang="less">
.factory {
  height: 100%;
  width: 100%;

  .factory-body {
    width: 100%;
    height: calc(100% - 80px);

    .top {
      height: 75%;
      width: 100%;
      display: flex;
      border-bottom: 1px dashed grey;

      .left {
        height: 100%;
        width: 25%;
        border-right: 1px dashed grey;

        .cur-none {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .title {
            width: 100%;
            height: 60%;
            display: flex;
            justify-content: center;
            align-items: center;
            writing-mode: vertical-lr;
            font-family: STXingKai;
            letter-spacing: 20px;
            font-size: 80px;
            user-select: none;
          }

          .tip {
            writing-mode: horizontal-tb;
          }
        }

        .cur-history {
          box-sizing: border-box;
          padding: 5% 0;
          width: 100%;
          height: 100%;

          .chart {
            overflow: auto;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .chart::-webkit-scrollbar {
            width: 6px;
          }

          .chart::-webkit-scrollbar-thumb {
            background-color: #0003;
            border-radius: 3px;
          }

          .chart::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #efdcc1;
          }
        }
      }

      .right {
        width: 75%;
        height: 100%;
        display: flex;
        position: relative;

        .examine {
          position: absolute;
          background-color: rgba(61, 61, 61, 0.1);
          width: 250px;
          height: 50px;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          user-select: none;
        }

        .map-tooltip {
          position: absolute;
          background: white;
          box-shadow: 0 0 5px #999999;
          border: 5px solid rgba(168, 167, 150, 0.971);
          color: #333;
          // width: 150px;
          height: 50px;
          font-size: 18px;
          left: 0;
          padding: 10px;
          text-align: center;
          top: 0;
          z-index: 10;
          display: block;
          opacity: 0;
          pointer-events: none;
        }

        .factory-map {
          width: 100%;
          height: 100%;
          position: relative;

          .map-path.active {
            fill: rgba(179, 150, 46, 0.2);
          }
        }

        .factory-describe {
          position: absolute;
          width: 30%;
          top: 50%;
          transform: translateY(-50%);
          left: 55%;
          padding: 20px 0;
          background-color: rgba(190, 158, 98, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .logo {
            width: 90%;
            user-select: none;
          }

          .name {
            user-select: none;
            font-family: STXingKai;
            font-size: 32px;
            margin: 20px 0;
          }

          .time,
          .location {
            user-select: none;
            font-family: KaiTi;
            font-size: 22px;
            font-weight: bold;
          }
        }

        .factory-total {
          position: absolute;
          top: 40%;
          right: 0;
          width: 25%;
          height: 30%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 1;

          .wine-num,
          .factory-num,
          .time {
            user-select: none;
            display: flex;
            align-items: center;
            font-size: 28px;
            margin: 5px 0;
          }
        }

        .factory-map-title {
          position: absolute;
          left: 50px;
          bottom: 100px;
          display: flex;
          user-select: none;
          opacity: 1;

          .title-1,
          .title-2 {
            font-size: 64px;
            font-family: STXingKai;
            writing-mode: vertical-lr;
            text-shadow: #999289 3px 3px 3px;
          }

          .title-1 {
            padding-bottom: 40px;
          }
        }

        .south-sea {
          position: absolute;
          width: 12%;
          height: 25%;
          bottom: 20px;
          right: 15%;
          border: 1px dashed grey;
        }
      }
    }

    .bottom {
      height: 25%;
      width: 100%;
      position: relative;

      .factory-history {
        height: 100%;
        width: 100%;
        position: relative;

        p {
          user-select: none;
          position: absolute;
          width: 150px;
          margin: 0 auto;
          left: 0;
          right: 0;
          top: 20px;
          font-size: 20px;
          font-family: KaiTi;
          background-color: rgba(181, 206, 137, 0.5);
        }
      }

      .cur-factory-map-tooltip {
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgb(241, 230, 190);
        padding: 5px;
        font-size: 20px;
        opacity: 0;
        user-select: none;
        pointer-events: none;
        border-radius: 3px;

        .time {
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .name {
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>