<template>
    <div class="video-contain">
        <div :class="video ? 'video-button active' : 'video-button'" v-on:click="change"
            :style="{ backgroundImage: 'url(' + (video ? closePng : openPng) + ')' }">
        </div>
        <div class="player-contain">
            <d-player ref="player" id="player" :options="options"></d-player>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import vueDplayer from 'vue-dplayer';
import 'vue-dplayer/dist/vue-dplayer.css';
Vue.use(vueDplayer)

export default {
    name: "video-dplayer",
    data() {
        return {
            options: {
                container: document.getElementById('dplayer'),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                lang: 'zh-cn',
                hotkey: true,
                preload: 'auto',
                volume: 1,
                video: {
                    url: 'video/flavor_1.mp4',
                    type: 'auto',
                }
            },
            video: false,
            openPng: 'video/video_open.png',
            closePng: 'video/video_close.png',
            dp: ''
        };
    },
    mounted() {
        this.dp = this.$refs.player.dp
        this.dp.volume(1, true, false)
    },
    methods: {
        change() {
            this.video = !this.video
            let contain = document.querySelector(".player-contain");
            if (this.video) {
                contain.style.background = "rgba(250, 235, 215, 0.3)"
                contain.style.display = 'flex'
                this.dp.play()
            } else {
                contain.style.background = "rgba(250, 235, 215, 0)"
                contain.style.display = 'none'
                this.dp.seek(0)
                this.dp.pause()
            }
        },
    }
}
</script>

<style lang="less" scoped>
.video-contain {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    text-align: center;
    background-color: rgba(250, 235, 215, 0);
    transition: background-color 0.3s ease-in-out;
    pointer-events: none;

    .video-button {
        width: 40px;
        height: 40px;
        font-size: 30px;
        cursor: pointer;
        user-select: none;
        position: absolute;
        top: 20px;
        right: 27%;
        pointer-events: all;
        background-size: 100%;
    }

    .player-contain {
        position: absolute;
        right: 0;
        top: 0;
        width: 25%;
        height: 21%;
        pointer-events: all;
        box-sizing: border-box;
        display: none;
        background-color: rgba(250, 235, 215, 0.3);
        display: none;
        justify-content: center;
        align-items: center;

        #player {
            height: 90%;
            width: 90%;
        }
    }
}
</style>