<template>
  <div class="cloud">
    <div class="title">微生物作用</div>
    <div class="chart"></div>
  </div>
</template>
  
<script>
import { wordCloud } from "@/assets/js/part2/cloud";

export default {
  mounted() {
    wordCloud();
  },
};
</script>
  
<style lang="less">
.cloud {
  width: 100%;
  height: 100%;

  .title {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: STXingkai;
    font-size: 32px;
  }

  .chart {
    width: 100%;
    height: calc(100% - 80px);
    position: relative;
    .microbe-text {
      width: 20%;
      height: 95%;
      position: absolute;
      top: 1%;
      right: 1%;
      font-family: kaiTi;
      font-size: 20px;
      line-height: 32px;
    }
  }
}
</style>