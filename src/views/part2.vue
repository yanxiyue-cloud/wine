<template>
  <div class="all">
    <div class="body">
      <div class="left">
        <compositionAll :cur="renderIndex"></compositionAll>
      </div>

      <div class="right">
        <div class="right-top">
          <cloud></cloud>
        </div>
        <div class="right-bottom">
          <germ :cur="renderIndex"></germ>
          <koji :cur="renderIndex"></koji>
        </div>
      </div>

      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in shortClass" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import compositionAll from "@/components/part2/compositionAll.vue";
import koji from "@/components/part2/koji.vue";
import germ from "@/components/part2/germ.vue";
import cloud from "@/components/part2/cloud.vue";

import Swiper from "swiper";
import "swiper/css/swiper.min.css";

export default {
  data() {
    return {
      renderIndex: 0,
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
    };
  },
  components: {
    compositionAll,
    koji,
    germ,
    cloud,
  },
  methods: {
    part1() {
      this.$router.push("/part1");
    },
  },
  mounted() {
    let that = this;
    new Swiper(".swiper-container", {
      direction: "vertical",
      watchSlidesProgress: true,
      slidesPerView: 5,
      slideToClickedSlide: true,
      centeredSlides: true,
      loop: true,
      loopedSlides: 5,
      autoplay: false,
      loopAdditionalSlides: 3,
      effect: "creative",
      creativeEffect: {
        prev: {
          origin: "left center",
          translate: ["-5%", 0, -200],
          rotate: [0, 100, 0],
        },
        next: {
          origin: "right center",
          translate: "",
          rotate: "",
        },
      },
      on: {
        slideChangeTransitionEnd: function () {
          that.renderIndex = this.realIndex;
        },
      },
    });
  },
};
</script>

<style lang="less">
.all {
  width: 100%;
  height: 100%;

  // overflow-x: auto;
  // white-space: nowrap;
  .body {
    width: 100%;
    height: calc(100% - 80px);
    display: flex;
    position: relative;

    .left {
      width: 55%;
      height: 100%;
    }

    .right {
      width: 45%;
      height: 100%;

      .right-top {
        width: 100%;
        height: 40%;
      }

      .right-bottom {
        width: 100%;
        height: 60%;
        display: flex;
      }
    }

    .swiper-container {
      width: 260px;
      height: 80%;
      position: absolute;
      left: 56%;
      top: 49%;
      transform: translate(-50%, -50%);
      z-index: 0;

      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url(@/assets/image/jar.png);
        background-size: 30%;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
        font-size: 38px;
        font-family: KaiTi;
        transform: translateX(-90px);
        transition: transform 0.3s;
        z-index: 100;
        cursor: pointer;
      }

      .swiper-slide.swiper-slide-prev {
        transform: translateX(-20px);
      }

      .swiper-slide.swiper-slide-next {
        transform: translateX(-20px);
      }

      .swiper-slide.swiper-slide-active {
        transform: translateX(0);
      }
    }
  }
}
</style>