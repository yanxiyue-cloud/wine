<template>
    <div class="rank">
        <div class="rank-tooltip">
            <div class="rank-tooltip-title"></div>
            <div class="rank-tooltip-text">
                <div class="text-acid"></div>
                <div class="text-ester"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { rankChart } from '@/assets/js/part3/rank';

export default {
    mounted() {
        rankChart()
    }
}
</script>

<style lang="less">
.rank {
    height: 100%;
    width: 100%;
    position: relative;

    .rank-tooltip {
        position: absolute;
        left: 0;
        top: 0;
        width: 180px;
        height: 70px;
        background-color: rgb(240, 233, 233);
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;

        .rank-tooltip-title {
            height: 50%;
            width: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px dashed grey;
        }

        .rank-tooltip-text {
            height: 50%;
            width: 100%;
            display: flex;

            .text-acid,
            .text-ester {
                width: 50%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>