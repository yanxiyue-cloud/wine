<template>
  <div id="app">
    <div class="main-contain">
      <div class="left">
        <div class="left-top">
          <div class="materialAll"></div>
          <div class="title-v">原料选取</div>
          <div class="des"></div>
          <div class="des-first des-number"></div>
        </div>
        <div class="left-bottom">
          <div class="title-v">蒸馏</div>
          <div class="des"></div>
          <distillAll :cur="renderIndex"></distillAll>
          <div class="des-second des-number"></div>
        </div>
      </div>
      <div class="mid">
        <div class="title-v">工艺流程图</div>
        <process :cur="renderIndex"></process>
      </div>
      <div class="right">
        <div class="right-top">
          <div class="feature">
            <div class="feature-title">总体工艺特点</div>
            <div class="feature-text">{{ totalFeature }}</div>
          </div>
          <div class="des"></div>
        </div>
        <div class="right-mid">
          <div class="title-v">发酵</div>
          <fermentation :cur="renderIndex"></fermentation>
          <div class="des"></div>
          <div class="des-third des-number"></div>
        </div>
        <div class="right-bottom">
          <div class="title-v">贮存</div>
          <storageAll :cur="renderIndex"></storageAll>
          <div class="des-fourth des-number"></div>
        </div>
      </div>
      <wineVideo></wineVideo>
    </div>
  </div>
</template>


<script>
import wineVideo from "@/components/wineVideo.vue"
import process from "@/components/part1/process.vue";
import fermentation from "@/components/part1/fermentation.vue";
import storageAll from "@/components/part1/storageAll.vue";
import { materialAll } from "@/assets/js/part1/materialAll";
import processData from "@/assets/data/part1/processData.json";
import distillAll from "@/components/part1/distillAll.vue";
import wineVideoVue from '../components/wineVideo.vue';

export default {
  data() {
    return {
      wineClass: [
        "浓香型",
        "酱香型",
        "清香型",
        "米香型",
        "芝麻香型",
        "兼香型",
        "豉香型",
        "老白干香型",
        "馥郁香型",
        "凤香型",
        "特香型",
        "药香型",
      ],
      shortClass: [
        "浓",
        "酱",
        "清",
        "米",
        "芝",
        "兼",
        "豉",
        "白",
        "馥",
        "凤",
        "特",
        "药",
      ],
      total: 0,
      renderIndex: 0,
      totalFeature: processData[0].totalFeature
    };
  },
  mounted() {
    let that = this
    materialAll(that, this.renderIndex)
  },
  components: {
    process,
    fermentation,
    storageAll,
    materialAll,
    distillAll,
    wineVideo
  },
  methods: {
    change() {
      this.renderIndex = document.querySelector("select").value;
    },
    part2() {
      this.$router.push('/part2')
    },
  },
  watch: {
    renderIndex(n, o) {
      this.totalFeature = processData[this.renderIndex].totalFeature
    }
  },
};
</script>


<style lang="less">
@import url(@/assets/css/materialAll.less);

* {
  margin: 0;
  padding: 0;
  position: relative;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1920px;
  height: 1080px;
  margin: 0 auto;
  overflow: hidden;
  background-image: url('@/assets/image/bg.png');
}

.head {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #d0d0c8;
  font-family: 'STLiti';
  font-size: 20px;

  .logo {
    width: 70px;
    height: 70px;
    // border: 5px solid #d0d0c8;
    background: url('@/assets/image/svg/logo.svg');
    background-size: 100% 90%;

  }

  .title {
    margin-left: 30px;
    font-size: 32px;
    position: relative;

  }

  .other {
    display: flex;
    margin-left: 10%;

    .btu {
      padding: 0 50px;
      cursor: pointer;
      font-size: 26px;

    }
  }

  img {
    position: absolute;
    left: 78%;
    height: 107%;
    width: 19%;
  }
}

.main-contain {
  height: calc(100% - 80px);
  width: 100%;
  display: flex;

  .left {
    width: 25%;
    height: 100%;

    .left-top {
      width: 100%;
      height: 55%;
      position: relative;

      .materialAll {
        width: 100%;
        height: 100%;
        /* border: 1px solid red; */
      }

      .image {
        position: absolute;
        width: 186px;
        height: 186px;
        top: 33%;
        left: 49%;
        // border: #2c3e50 1px solid;
        background: url('@/assets/image/material/MaoTai.png');
        background-size: 100%;
      }
    }

    .left-bottom {
      width: 100%;
      height: 45%;
    }
  }

  .mid {
    position: relative;
    width: 50%;
    height: 100%;
    border-left: 1px dashed #d0d0c8;
    border-right: 1px dashed #d0d0c8;
  }

  .right {
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .right-top {
      width: 100%;
      height: 20%;

      .feature {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .feature-title {
          writing-mode: horizontal-tb;
          width: 100%;
          height: 30%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: STXingkai;
          font-size: 40px;
        }

        .feature-text {
          width: 90%;
          height: 70%;
          font-size: 20px;
          font-family: KaiTi;
          font-weight: bold;
          text-indent: 40px;
          text-align: left;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .right-mid {
      width: 100%;
      height: 50%;
    }

    .right-bottom {
      width: 100%;
      height: 30%;
    }
  }
}

.des {
  width: 95%;
  height: 5px;
  margin: 0 auto;
  border-bottom: 3px solid #d0d0c8;
}

.des-number {
  width: 100px;
  height: 100px;
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
}

.des-first {
  background-image: url(@/assets/image/zl-1.png);
  left: -10px;
  bottom: 0px;
}

.des-second {
  background-image: url(@/assets/image/zl-3.png);
  left: -10px;
  bottom: 0px;
}

.des-third {
  background-image: url(@/assets/image/zl-2.png);
  right: -10px;
  top: -10px;
}

.des-fourth {
  background-image: url(@/assets/image/zl-4.png);
  right: -10px;
  top: -10px;
}

.title-v,
.title-h {
  font-family: STXingkai;
  font-size: 40px;
  position: absolute;
}

.title-v {
  writing-mode: vertical-lr;
  top: 10px;
  left: 5px;
}

.title-h {
  writing-mode: horizontal-tb;
  top: 20px;
  left: 50%;
  width: 60%;
  transform: translate(-50%);
}
</style>