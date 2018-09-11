<template>
    <transition name="fade">
        <div v-show="isready">
            <div class="sino-img"  @mousedown="downFun" :style="[computePosition, {'width': outWidth, 'height': outHeight}]">
                <sino-title slot="title" type="levelOne" title="图片预览" :dragFlag="dragFlag">
                    <button type="button" aria-label="Close" @click="closeimg">
                        <i class="iconfont sino-guanbi"></i>
                    </button>
                </sino-title>
                <div class="sino-img-con" v-show="isshowimg" :style="{'max-height': 'calc(100% - 45px)', 'height': 'calc(100% - 45px)'}">
                    <!--<i class="iconfont sino-zuoyoujiantouicon-defuben1"></i>-->
                    <img :style="{'width': imgWidth, 'height': imgHeight}" :src="imgurls"/>
                    <!--<i class="iconfont sino-zuoyoujiantouicon-defuben"></i>-->
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import sinoTitle from '../../sinoTitle/index';
    let oDiv,disX,disY,pageX,pageY;
    export default {
        name: 'sinoImg',
        components: {
            sinoTitle
        },
        props: {
            imgurl: {
                default: '',
            },
            dragFlag: {
                type: Boolean,
                default: true
            },
            isshowimg: {
                type: Boolean,
                default: false
            },
            position: {
                type: String,
                default: 'right'
            },
            imgHeight: {
                type: String,
                default: '100%'
            },
            imgWidth: {
                type: String,
                default: 'auto'
            },
            outWidth: {
                type: String,
                default: '40%'
            },
            outHeight: {
                type: String,
                default: '94%'
            }
        },
        computed: {
            computePosition () {
                return this.position === 'left' ? {'left': '20px'} : this.position === 'center' ? {'left': 'calc(50% - ' + (parseFloat(this.outWidth)/2 + 'px') + ')'} : {'right': '20px'}
            }
        },
        data() {
            return {
                isready: false,
                imgurls: ''
            }
        },
        methods: {
            closeimg() {
                this.isready = false;
                this.$emit('closeimg');
            },
            downFun(ev){
                const _this = this;
                if (_this.dragFlag !== true) {
                    return
                }
                // document.onmousedown = function () {
                oDiv = _this.$el.firstChild;
                disX = ev.clientX - oDiv.offsetLeft;
                disY = ev.clientY - oDiv.offsetTop;
                ev.preventDefault();
                document.onmousemove = function (ev) {
                    var w = oDiv.offsetWidth;
                    var h = oDiv.offsetHeight;
                    var l = ev.clientX - disX;
                    var t = ev.clientY - disY;

                    if (l < 0) {
                        l = 0
                    }
                    if (l > document.documentElement.clientWidth - w) {
                        l = document.documentElement.clientWidth - w
                    }
                    if (t < 0) {
                        t = 0
                    }
                    if (t > document.documentElement.clientHeight - h) {
                        t = document.documentElement.clientHeight - h
                    }
                    oDiv.style.left = l + 'px';
                    oDiv.style.top = t + 'px';
                    ev.preventDefault()

                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    document.onmousedown=null;
                }
                // }
            }
        },
        watch: {
            isshowimg (b) {
                let vm = this;
                var val = vm.imgurl;
                if (b == false || val == '' || val == undefined) return;
                vm.isready = true;
                vm.imgurls = val;
            }
        }
    }
</script>
