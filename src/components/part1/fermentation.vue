<template>
  <div class="fermentation">
    <div class="text">
      <div class="way">发酵方式：{{ fermentationData[cur].way }}</div>
      <div class="time">发酵周期：{{ fermentationData[cur].round?fermentationData[cur].round:"一" }}轮发酵</div>
      <div class="equipment">发酵设备：{{ fermentationData[cur].equipment }}</div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { fermentationCircle } from "@/assets/js/part1/fermentation";
import fermentationData from "@/assets/data/part1/fermentationData.json";

export default {
  props: ["cur"],
  data() {
    return {
      fermentationData: fermentationData
    }
  },
  mounted() {
    fermentationCircle(fermentationData[this.cur]);
  },
  watch: {
    cur(n, o) {
      d3.select(".fSvg").remove();
      fermentationCircle(fermentationData[this.cur]);
    },
  },
};
</script>

<style lang="less">
@import "@/assets/css/fermentation.less";

.fermentation {
  width: 100%;
  height: 100%;
  position: relative;

  /* background-color: rgb(213, 210, 206); */
  .text {
    position: absolute;
    top: 88%;
    left: 5%;
    color: gray;
    font-family: KaiTi;
    font-size: 18px;

    text-align: left;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
  }
}
</style>