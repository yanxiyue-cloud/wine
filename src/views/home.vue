<template>
    <div class="home">
        <!-- <div class="head">
            <div class="logo"></div>
            <div class="title">中国白酒酿造工艺
            </div>
            <img src="../assets/image/left-top.png" alt="tupian">
        </div> -->
        <div class="anime">
            <div class="anime-container">
                <img class="title-1 home-title" src="../assets/image/home/title_2.png" alt="">
                <img class="title-2 home-title" src="../assets/image/home/title_1.png" alt="">
                <img class="title-3" src="../assets/image/home/title_3.png" alt="">
                <img class="home-des-1" src="../assets/image/home/home_des_1.png" alt="">
                <img class="home-bg-1" src="../assets/image/home/home_bg.png" alt="">
                <div class="home-part">
                    <img class="home-part-img" src="../assets/image/home/home-part-1.png" alt="">
                    <img class="home-part-img" src="../assets/image/home/home-part-2.png" alt="">
                    <img class="home-part-img" src="../assets/image/home/home-part-3.png" alt="">
                    <img class="home-part-img" src="../assets/image/home/home-part-4.png" alt="">
                    <img class="home-part-img" src="../assets/image/home/home-part-5.png" alt="">
                </div>
                <div class="goto" @click="goto">●开始探索</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        goto() {
            this.$router.push("/part1")
        }
    }
}
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
}

.home {
    width: 100%;
    height: 100%;
}

.anime {
    width: 100%;
    height: calc(100%);
    display: flex;
    justify-content: center;
    align-items: center;

    .anime-container {
        position: relative;
        width: 50%;
        height: 100%;
        border-top: 5px rgb(166, 137, 90) solid;
        border-bottom: 5px rgb(166, 137, 90) solid;
        background-color: rgba(250, 234, 214, 0.5);
        perspective: 1200px;

        .home-title {
            position: absolute;
            height: 50%;
            transform-origin: center;
        }

        .title-1 {
            top: 20%;
            left: 38%;
            animation: appearScale 3s ease-in-out, afterTransform 1s 4s ease-in-out forwards;
        }

        .title-2 {
            left: 52%;
            top: 10%;
            animation: appearScale 3s ease-in-out, afterTransform 1s 4s ease-in-out forwards;
        }

        .title-3 {
            top: 30%;
            height: 40%;
            left: -20%;
            opacity: 0;
            animation: opacity 1s 3s ease-in-out forwards, afterTransform 1s 4s ease-in-out forwards;
        }

        .home-des-1 {
            height: 7%;
            top: 12%;
            left: 38%;
            position: absolute;
            opacity: 0;
            animation: opacity 1s 2s ease-in-out forwards, afterTransform 1s 4s ease-in-out forwards;
        }

        .home-bg-1 {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
        }

        .goto {
            position: absolute;
            margin: auto auto;
            bottom: 200px;
            left: 0;
            right: 0;
            width: 200px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            font-family: STXingKai;
            opacity: 0;
            cursor: pointer;
            animation: opacity 1s 4s ease-in-out forwards;
            border: 5px solid grey;
            border-radius: 10px;
            transition: all 0.5s;
        }

        .goto:hover {
            color: rgb(165, 32, 32);
            border-color: rgb(165, 32, 32);
            border-radius: 30px;
        }
    }

    .anime-container::before {
        content: "";
        top: -5px;
        right: 100%;
        position: absolute;
        height: 100%;
        width: calc(50%);
        // border-left: 5px rgb(166, 137, 90) solid;
        border-top: 5px rgb(166, 137, 90) solid;
        border-bottom: 5px rgb(166, 137, 90) solid;
        background-image: url(../assets/image/home/home_1.png);
        background-repeat: no-repeat;
        background-size: 110%;
        background-position: center;
        transform-style: preserve-3d;
        transform-origin: 100%;
        animation: appear2 3s ease-in-out;
        z-index: 100;
    }

    .anime-container::after {
        content: "";
        top: -5px;
        left: 100%;
        position: absolute;
        height: 100%;
        width: calc(50%);
        // border-right: 5px rgb(166, 137, 90) solid;
        border-top: 5px rgb(166, 137, 90) solid;
        border-bottom: 5px rgb(166, 137, 90) solid;
        background-image: url(../assets/image/home/home_2.png);
        background-repeat: no-repeat;
        background-size: 110%;
        background-position: center;
        transform-style: preserve-3d;
        transform-origin: 0;
        animation: appear1 3s ease-in-out;
        z-index: 100;
    }

    .home-part {
        position: absolute;
        width: 50%;
        height: 80%;
        right: 10%;
        top: 10%;
        opacity: 0;
        animation: opacity 1s 5s ease-in-out forwards;

        .home-part-img {
            width: 25%;
            position: absolute;
        }

        .home-part-img:nth-child(1) {
            top: 3%
        }

        .home-part-img:nth-child(2) {
            top: 14%
        }

        .home-part-img:nth-child(3) {
            top: 25%
        }

        .home-part-img:nth-child(4) {
            top: 36%
        }

        .home-part-img:nth-child(5) {
            top: 47%
        }

        .home-part-img:nth-child(2n-1) {
            right: 45%;
        }

        .home-part-img:nth-child(2n) {
            right: 10%;
        }
    }
}

@keyframes appearScale {
    0% {
        opacity: 0;
        scale: 0.5;
    }

    100% {
        opacity: 1;
        scale: 1;
    }
}

@keyframes appear1 {
    0% {
        transform: rotateY(-180deg)
    }

    100% {
        transform: rotateY(0);
    }
}

@keyframes appear2 {
    0% {
        transform: rotateY(180deg)
    }

    100% {
        transform: rotateY(0);
    }
}

@keyframes opacity {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes afterTransform {
    0% {
        transform: translateX(0px);
    }

    100% {
        transform: translateX(-160px);
    }
}
</style>