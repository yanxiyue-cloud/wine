<template>
    <div class="navigation">
        <div class="logo"></div>
        <div class="title">中国白酒</div>
        <div class="nav">
            <div class="cur-page">{{ curPage }}</div>
            <ul class="ullist">
                <li class="li-item" @click="goto('part1')">醉技千秋</li>
                <li class="li-item" @click="goto('part2')">佳酿美学</li>
                <li class="li-item" @click="goto('part3')">酒色逸香</li>
                <li class="li-item" @click="goto('part4')">酿酒名家 </li>
                <li class="li-item" @click="goto('part5')">酒厂厂志</li>
                <!-- <li class="li-item li-drop">追本溯源
                    <ul>
                        <li class="drop-item" @click="goto('part5')">酒厂厂志</li>
                        <li class="drop-item" @click="goto('part6')">流光酒史</li>
                    </ul>
                </li> -->
            </ul>
        </div>
        <div class="data">数据来源：{{ dataForm }}</div>

        <img src="@/assets/image/left-top.png" alt="tupian">
    </div>
</template>

<script>
export default {
    data() {
        return {
            // data:"《传统白酒酿造技术》、《白酒酿造与技术创新》、《白酒生产技术全书》等"
        }
    },
    props: ["curPage", "dataForm"],
    mounted() { },
    methods: {
        goto(name) {
            if (name == '') {
                return
            }
            this.$router.push(`/${name}`)
        }
    }
}
</script>

<style lang="less">
.navigation {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #d0d0c8;
    font-family: 'STLiti';
    font-size: 20px;

    .nav {
        margin-left: 50px;
        height: 50%;
        width: 200px;
        z-index: 1000;

        .cur-page {
            width: 100%;
            height: 100%;
            background-color: rgba(190, 158, 98, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            color: white;
        }

        .ullist {
            top: 100%;
            display: none;
            position: absolute;
            height: 100%;
            width: 100%;
            list-style: none;

            .li-item {
                cursor: pointer;
                height: 40px;
                background-color: rgba(240, 248, 255, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                color: black;
                border-top: 1px solid rgb(219, 217, 217);
            }

            .li-item:nth-child(1) {
                border: none;
            }

            .li-item:hover {
                background-color: rgba(190, 158, 98, 0.8);
                color: white;
            }

            .li-drop ul {
                display: none;
                list-style: none;
                height: 100%;
                width: 100%;
                left: 100%;
                position: absolute;

                .drop-item {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-top: 1px solid rgb(219, 217, 217);
                    background-color: rgba(240, 248, 255, 0.8);
                    color: black;
                }

                .drop-item:nth-child(1) {
                    border: none;
                }

                .drop-item:hover {
                    background-color: rgba(190, 158, 98, 0.8);
                    color: white;
                }
            }

            .li-drop:hover ul {
                display: block;
            }
        }
    }

    .nav:hover .ullist {
        display: block;
    }

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

    img {
        position: absolute;
        left: 78%;
        height: 107%;
        width: 19%;
    }

    .data {
        margin-left: 50px;
    }
}
</style>