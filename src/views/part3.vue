<template>
  <div class="taste">
    <div class="body">
      <div class="left taste-div">
        <div class="title">香型衍生图</div>
        <div class="derive"> </div>
        <div class="bottom">{{ describe }}</div>
      </div>
      <div class="mid taste-div">
        <div class="title">白酒风味轮</div>
        <smell :cur="cur"></smell>
        <div class="step-img">
          <div class="step-item">
            <img src="../assets/image/taste/one.png" alt="one" />
            <div class="text">观色</div>
          </div>
          <div class="step-item">
            <img src="../assets/image/taste/two.png" alt="two" />
            <div class="text">闻香</div>
          </div>
          <div class="step-item">
            <img src="../assets/image/taste/three.png" alt="three" />
            <div class="text">尝味</div>
          </div>
          <div class="step-item">
            <img src="../assets/image/taste/four.png" alt="four" />
            <div class="text">悟格</div>
          </div>
        </div>
        <div class="sell_wine">
          <img :src="`part3_wine/${cur}.png`" alt="" class="cur_img">
          <p>{{ wine[cur].name }}</p>
          <p>{{ wine[cur].price }}元</p>
        </div>
      </div>
      <div class="right taste-div">
        <div class="title">分级评酒</div>
        <rank></rank>
      </div>
    </div>
  </div>
</template>

<script>
import smellDescribe from "../assets/data/part3/smellDescribe.json"
import rank from "../components/part3/rank.vue";
import smell from '../components/part3/smell.vue';
import { derive } from "@/assets/js/part3/derive";

export default {
  data() {
    return {
      describe: "",
      cur: 0,
      wine: [
        {
          "name": "玉蝉大曲",
          "price": "49.9"
        },
        {
          "name": "北大仓 部优系列",
          "price": "58"
        },
        {
          "name": "红星二锅头",
          "price": "42"
        },
        {
          "name": "桂林三花酒",
          "price": "35"
        },
        {
          "name": "景阳春（小老虎）",
          "price": "58"
        },
        {
          "name": "白云边 十年陈酿",
          "price": "97"
        },
        {
          "name": "佛山玉冰烧",
          "price": "15"
        },
        {
          "name": "衡水老白干 青花",
          "price": "107"
        },
        {
          "name": "酒鬼酒 黄坛",
          "price": "191"
        },
        {
          "name": "绿脖西凤",
          "price": "61"
        },
        {
          "name": "东方韵 弘韵",
          "price": "78"
        },
        {
          "name": "老贵董",
          "price": "83"
        }
      ]
    }
  },
  components: {
    rank, smell
  },
  mounted() {
    this.describe = smellDescribe[this.cur].describe
    derive(this)
  },
  methods: {
  },
  watch: {
    cur(n, o) {
      this.describe = smellDescribe[n].describe
    }
  }
};
</script>

<style lang="less">
.taste {
  width: 100%;
  height: 100%;

  .body {
    width: 100%;
    height: calc(100% - 80px);
    display: flex;

    .taste-div {
      height: 100%;
      // border: 1px dashed grey;
      position: relative;

      .title {
        position: absolute;
        top: 1%;
        right: 3%;
        writing-mode: tb;
        font-family: STXingkai;
        font-size: 33px;
      }

      .sell_wine {
        height: 25%;
        width: 25%;
        position: absolute;
        bottom: 20%;

        .cur_img {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        p {
          width: 100%;
        }
      }
    }

    .left {
      width: 25%;

      .derive {
        width: 100%;
        height: 80%;
        position: relative;

        .derive-flavor {
          background-color: rgb(231, 227, 226);
          box-shadow: rgb(245, 186, 56) -5px 5px 5px;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          font-weight: bold;
          font-family: KaiTi;
          transition: all 0.5s;
          user-select: none;
        }

        .derive-flavor.active {
          background-color: rgb(240, 192, 180);
          box-shadow: rgb(245, 186, 56) -5px 5px 5px;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          font-weight: bold;
          font-family: KaiTi;
        }
      }

      .bottom {
        height: 20%;
        padding: 0 15px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        text-align: left;
        text-indent: 42px;
        font-family: kaiTi;
      }
    }

    .mid {
      width: 45%;

      .step-img {
        height: 20%;
        width: 100%;
        display: flex;
        display: flex;
        justify-content: center;
        align-items: center;

        .step-item {
          width: 23%;
          height: 100%;

          img {
            width: 88%;
            height: 80%;
          }

          .text {
            font-family: STkaiti;
            font-size: 27px;
          }
        }
      }

      .smell-contain {
        height: 80%;
        width: 100%;
      }
    }

    .right {
      width: 30%;
      position: relative;

      .cap {
        position: absolute;
        bottom: 1%;
        right: 1%;
        opacity: 0.7;
      }
    }
  }
}
</style>