<template>
  <transition name="dialog-fade">
    <div class="sino-dialog-wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
              class="sino-dialog"
              :class="[sizeClass, customClass]"
              ref="dialog"
              :dragFlag="dragFlag"
              :style="style">
        <div class="sino-dialog-header" @mousedown="downFun" style="user-select: none;cursor: move;">
          <slot name="title">
            <span class="sino-dialog-title">{{title}}</span>
          </slot>
          <button type="button" class="sino-dialog-headerbtn " aria-label="Close"
                  v-if="showClose" @click="handleClose">
            <i class="sino-dialog-close sino-dialog-button sino-icon sino-icon-close iconfont sino-guanbi"></i>
          </button>
        </div>
        <!--<template v-if="dialogHide === true">
          <div class="sino-dialog-body" v-if="rendered">
            <sino-scrollbar noresize style="max-height: 470px;">
              <div style="max-height: 470px;">
                <slot></slot>
              </div>
            </sino-scrollbar>
          </div>
        </template>-->
        <!--<template v-if="dialogHide === false">
          <div class="sino-dialog-body" v-if="rendered"><slot></slot></div>
        </template>-->
        <div class="sino-dialog-body" v-if="rendered">
          <slot></slot>
        </div>
        <div class="sino-dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    import Popup from 'sinoUI/src/utils/popup';
    import emitter from 'sinoUI/src/mixins/emitter';
    import scrollIntoView from 'sinoUI/src/utils/scroll-into-view';
    //  import SinoScrollbar from "../../sinoScrollbar/src/main";
    let oDiv,disX,disY,pageX,pageY;
    export default {
        components: {scrollIntoView},
        name: 'sinoDialog',

        mixins: [Popup, emitter],

        props: {
            title: {
                type: String,
                default: ''
            },

            modal: {
                type: Boolean,
                default: true
            },

            modalAppendToBody: {
                type: Boolean,
                default: true
            },

            lockScroll: {
                type: Boolean,
                default: true
            },
            dragFlag: {
                type: Boolean,
                default: true
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },

            closeOnPressEscape: {
                type: Boolean,
                default: true
            },

            showClose: {
                type: Boolean,
                default: true
            },

            size: {
                type: String,
                default: 'small'
            },

            dialogHide: {
                type: Boolean,
                default: false
            },

            customClass: {
                type: String,
                default: ''
            },

            top: {
                type: String,
                default: '15%'
            },
            beforeClose: Function
        },

        watch: {
            visible(val) {
                this.$emit('update:visible', val);
                if (val) {
                    this.$emit('open');
                    this.$el.addEventListener('scroll', this.updatePopper);
                    this.$nextTick(() => {
                        this.$refs.dialog.scrollTop = 0;
                    });
                } else {
                    this.$el.removeEventListener('scroll', this.updatePopper);
                    this.$emit('close');
                }
            }
        },

        computed: {
            sizeClass() {
                return `sino-dialog-${ this.size }`;
            },
            style() {
                return this.size === 'full' ? {} : { 'top': this.top };
            }
        },

        methods: {
            downFun(ev){
                const _this = this;
                if (_this.dragFlag !== true) {
                    return
                }
                document.onmousedown = function () {

                    oDiv = _this.$el.firstChild;
                    disX = ev.clientX - oDiv.offsetLeft;
                    disY = ev.clientY - oDiv.offsetTop;
                    pageX = ev.pageX
                    pageY = ev.pageY
                    ev.preventDefault()
                    document.onmousemove = function (ev) {
                        var w = oDiv.clientWidth/2;
                        var h = oDiv.clientHeight/2;
                        var l = ev.clientX - disX
                        var t = ev.clientY - disY

                        if (l < w) {
                            l = w
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
                        oDiv.style.left = l + 'px'
                        oDiv.style.top = t + 'px'
                        ev.preventDefault()

                    }
                    document.onmouseup = function () {
                        document.onmousemove = null
                        document.onmouseup = null;
                        document.onmousedown=null;
                    }
                }
            },
            handleWrapperClick() {
                if (!this.closeOnClickModal) return;
                this.handleClose();
            },
            handleClose() {
                if (typeof this.beforeClose === 'function') {
                    this.beforeClose(this.hide);
                } else {
                    this.hide();
                }
            },
            hide(cancel) {
                if (cancel !== false) {
                    this.$emit('update:visible', false);
                    this.$emit('visible-change', false);
                }
            },
            updatePopper() {
                this.broadcast('ElSelectDropdown', 'updatePopper');
                this.broadcast('ElDropdownMenu', 'updatePopper');
            }
        },

        mounted() {
            if (this.visible) {
                this.rendered = true;
                this.open();
            }
        }

    };
</script>