<template>
    <div v-show="isready" class="cpdf" ref="cpdf">
        <div class="center" @mousedown="downFun">
            <sino-title slot="title" type="levelOne" title="PDF预览" :dragFlag="dragFlag">
                <button type="button" aria-label="Close" @click="closepdf">
                    <i class="iconfont sino-guanbi"></i>
                </button>
            </sino-title>
            <div class="contor">
                <button class="btn fl prev" @click="prev">
                    <span>上一页</span>
                </button>
                <div class="page fl">
                    <input type="text" readonly v-model="page_num" class="pagenum"> /
                    <input type="text" readonly v-model="page_count" class="pagecount">
                </div>
                <button class="btn fl" @click="next">
                    <span>下一页</span>
                </button>
                <div class="fr">
                    <button class="minus" @click="minus" >-</button>
                    <button class="addscale" @click="addscale" >+</button>
                </div>
                <!--<button class="btn" @click="closepdf">关闭</button>-->

            </div>
            <div class="pdf-con" v-show="isshowpdf">
                <canvas class="canvasstyle" id="the-canvas"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
    import PDFJS from '../pdf/pdf';
    import sinoTitle from '../../sinoTitle/index';

    let oDiv,disX,disY,pageX,pageY;
    export default {
        name: 'sinoPdf',
        components: {sinoTitle},
        props: {
            pdfurl: {
                default: '',
            },
            value: {

            },
            maxscale: {
                default: 2,
                type: Number
            },
            minscale: {
                default: 0.8,
                type: Number
            },
            scale: {
                default: 1.2,
                type: Number
            },
            dragFlag: {
                type: Boolean,
                default: true
            },
            isshowpdf: {
                type: Boolean,
                default: false
            }
        },
        //['pdfurl', 'value'],
        data() {
            return {
                pdfDoc: null, //pdfjs 生成的对象
                pageNum: 1, //
                pageRendering: false,
                pageNumPending: null,
                compuscale: 0, //放大倍数
                page_num: 0, //当前页数
                page_count: 0, //总页数
                // maxscale: 2, //最大放大倍数
                // minscale: 0.8, //最小放大倍数
                isready: false
            }
        },
        methods: {
            renderPage(num) { //渲染pdf
                let vm = this
                this.pageRendering = true;
                let canvas = document.getElementById('the-canvas')
                // Using promise to fetch the page
                this.pdfDoc.getPage(num).then(function(page) {
                    var viewport = page.getViewport(vm.compuscale);
                    //alert(vm.canvas.height)
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    vm.isready = true
                    var renderContext = {
                        canvasContext: vm.ctx,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);

                    // Wait for rendering to finish
                    renderTask.promise.then(function() {
                        vm.pageRendering = false;
                        if (vm.pageNumPending !== null) {
                            // New page rendering is pending
                            vm.renderPage(vm.pageNumPending);
                            vm.pageNumPending = null;
                        }
                    });
                });
                vm.page_num = vm.pageNum;

            },
            addscale() { //放大
                if (this.compuscale >= this.maxscale) {
                    return
                }
                this.compuscale += 0.1;
                this.queueRenderPage(this.pageNum)
            },
            minus() { //缩小
                if (this.compuscale <= this.minscale) {
                    return
                }
                this.compuscale -= 0.1;
                this.queueRenderPage(this.pageNum)
            },
            prev() { //上一页
                let vm = this
                if (vm.pageNum <= 1) {
                    return;
                }
                vm.pageNum--;
                vm.queueRenderPage(vm.pageNum);
            },
            next() { //下一页
                let vm = this
                if (vm.pageNum >= vm.page_count) {
                    return;
                }
                vm.pageNum++;
                vm.queueRenderPage(vm.pageNum);
            },
            closepdf() { //关闭PDF
                this.pdfDoc = null;
                this.isready = false
                this.compuscale = this.scale
                this.$emit('closepdf');
            },
            throwerr(err) {
                this.$emit('pdferr', err);
            },
            downFun(ev){
                const _this = this;
                if (_this.dragFlag !== true) {
                    return
                }
                document.onmousedown = function () {
                    oDiv = _this.$el.firstChild;
                    disX = ev.clientX - oDiv.offsetLeft;
                    disY = ev.clientY - oDiv.offsetTop;
                    pageX = ev.pageX;
                    pageY = ev.pageY;
                    ev.preventDefault();
                    document.onmousemove = function (ev) {
                        var w = oDiv.offsetWidth;
                        var h = oDiv.clientHeight/2;
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
                        if (t > document.documentElement.clientHeight - h*2) {
                            t = document.documentElement.clientHeight - h*2
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
                }
            },
            queueRenderPage(num) {
                if (this.pageRendering) {
                    this.pageNumPending = num;
                } else {
                    this.renderPage(num);
                }
            }
        },
        computed: {
            ctx() {
                let id = document.getElementById('the-canvas');
                return id.getContext('2d');
            }
//            isshowpdf() {
//                if (this.value == undefined) return false
//                return this.value;
//            }
        },
        mounted() {
            this.compuscale = this.scale;
//            let vm = this;
//            PDFJS.getDocument(vm.pdfurl).then(function(pdfDoc_) { //初始化pdf
//                vm.pdfDoc = pdfDoc_;
//                vm.page_count = vm.pdfDoc.numPages;
//                vm.renderPage(vm.pageNum);
//            });
        },
        watch: {
            isshowpdf(b) {
                let vm = this;
                var val = vm.pdfurl;
                vm.pageNum = 1;

                if (b == false || val == '' || val == undefined) return;
                PDFJS.getDocument(val).then(function(pdfDoc_) { //初始化pdf
                    vm.pdfDoc = pdfDoc_;
                    vm.page_count = vm.pdfDoc.numPages;
                    vm.renderPage(vm.pageNum);
                }).catch(function(err) {
                    if (err) {
                        console.log(err);
                        vm.throwerr(vm.pdfurl)
                    }
                })
            }


        }
    }
</script>
