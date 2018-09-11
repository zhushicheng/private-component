<template>
    <transition name="msgbox-fade">
        <div class="sino-message-box-wrapper" tabindex="-1" v-show="visible" @click.self="handleWrapperClick">
            <div class="sino-message-box" :class="customClass" :dragFlag="dragFlag"><!--v-on="{mousedown:down}"-->
                <div class="sino-message-tit" v-if="title !== undefined" @mousedown="downFun" style="user-select: none;cursor: move;">
                    <span class="fl">{{ title || t('el.messagebox.title') }}</span>
                    <i class="fr iconfont sino-guanbi" aria-label="Close" v-if="showClose"
                       @click="handleAction('cancel')"></i>
                </div>
                <div class="sino-message-box-content" v-if="message !== ''">
                    <div class="sino-message-con" v-show="!showInput">
                        <div class="iconfont sino-message-box-status" :class="[ sinoClass ]">
                            <i class="iconfont" :class="[ typeClass ]"></i>
                        </div>
                        <div class="sino-message-box-message">
                            <slot><p v-html="message"></p></slot><!--{{ message }}-->
                        </div>
                    </div>
                    <div v-show="showInput" class="sino-msg-input">
                        <div class="sino-message-box-msg">
                            <slot><p v-html="message"></p></slot>
                        </div>
                        <div class="sino-message-box-input">
                            <sino-input v-model="inputValue" @keyup.enter.native="handleAction('confirm')"
                                        :placeholder="inputPlaceholder" ref="input"></sino-input>
                            <!--<div class="sino-message-box-errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }"></div>-->
                                <sino-popover ref="popover" :popper-class="'inputTip'" placement="bottom-end" trigger="hover" :content="editorErrorMessage"></sino-popover>
                                <i class="iconfont tip-icon-1 sino-tanhao" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }" v-popover:popover></i>
                        </div>
                    </div>
                <div class="sino-message-box-btns">
                    <sino-button
                            :loading="confirmButtonLoading"
                            ref="confirm"
                            type="primary"
                            :class="[ confirmButtonClasses ]"
                            v-show="showConfirmButton"
                            @click.native="handleAction('confirm')">
                        {{ confirmButtonText || t('el.messagebox.confirm') }}
                    </sino-button>
                    <sino-button
                            :loading="cancelButtonLoading"
                            :class="[ cancelButtonClasses ]"
                            v-show="showCancelButton"
                            type="text"
                            @click.native="handleAction('cancel')">
                        {{ cancelButtonText || t('el.messagebox.cancel') }}
                    </sino-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/babel">
    import Popup from '../../../src/utils/popup';
    import Locale from '../../../src/mixins/locale';
    import sinoInput from '../../sinoinput/index';
    import sinoButton from '../../sinobutton/index';
    import {addClass, removeClass} from '../../../src/utils/dom';
    import {t} from '../../../src/locale';

    let typeMap = {
        success: 'sino-duigou',
        info: 'sino-i',
        warning: 'sino-gantanhao',
        error: 'sino-guanbi'
    };

    const TYPE_SINO_MAP = {
        'success': 'sino-message-duigou',
        'warning': 'sino-message-gantanhao',
        'error': 'sino-message-error',
        'info': 'sino-message-i'
    }
    let oDiv, disX, disY, pageX, pageY;

    export default {
        mixins: [Popup, Locale],

        props: {
            modal: {
                default: true
            },
            lockScroll: {
                default: true
            },
            dragFlag: {
                type: Boolean,
                default: true
            },
            showClose: {
                type: Boolean,
                default: true
            },
            closeOnClickModal: {
                default: true
            },
            closeOnPressEscape: {
                default: true
            }
        },

        components: {
            sinoInput,
            sinoButton
        },

        computed: {
            typeClass() {
                return this.type && typeMap[this.type] ? typeMap[this.type] : '';
            },

            confirmButtonClasses() {
                return `el-button--primary ${ this.confirmButtonClass }`;
            },
            cancelButtonClasses() {
                return `${ this.cancelButtonClass }`;
            },
            sinoClass() {
                return this.type && TYPE_SINO_MAP[this.type] ? TYPE_SINO_MAP[this.type] : ''
            }
        },

        methods: {
            getSafeClose() {
                const currentId = this.uid;
                return () => {
                    this.$nextTick(() => {
                        if (currentId === this.uid) this.doClose();
                    });
                };
            },
            doClose() {
                if (!this.visible) return;
                this.visible = false;
                this._closing = true;

                this.onClose && this.onClose();

                if (this.lockScroll) {
                    setTimeout(() => {
                        if (this.modal && this.bodyOverflow !== 'hidden') {
                            document.body.style.overflow = this.bodyOverflow;
                            document.body.style.paddingRight = this.bodyPaddingRight;
                        }
                        this.bodyOverflow = null;
                        this.bodyPaddingRight = null;
                    }, 200);
                }
                this.opened = false;

                if (!this.transition) {
                    this.doAfterClose();
                }
                if (this.action) this.callback(this.action, this);
            },

            handleWrapperClick() {
                if (this.closeOnClickModal) {
                    this.handleAction('cancel');
                }
            },

            handleAction(action) {
                if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
                    return;
                }
                this.action = action;
                if (typeof this.beforeClose === 'function') {
                    this.close = this.getSafeClose();
                    this.beforeClose(action, this, this.close);
                } else {
                    this.doClose();
                }
            },

            validate() {
                if (this.$type === 'prompt') {
                    var inputPattern = this.inputPattern;
                    if (inputPattern && !inputPattern.test(this.inputValue || '')) {
                        this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
                        addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
                        return false;
                    }
                    var inputValidator = this.inputValidator;
                    if (typeof inputValidator === 'function') {
                        var validateResult = inputValidator(this.inputValue);
                        if (validateResult === false) {
                            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
                            addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
                            return false;
                        }
                        if (typeof validateResult === 'string') {
                            this.editorErrorMessage = validateResult;
                            return false;
                        }
                    }
                }
                this.editorErrorMessage = '';
                removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
                return true;
            },
            downFun (ev) {
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
                    document.onmousemove = function (ev) {
                        var l = ev.clientX - disX + 220;
                        var t = ev.clientY - disY + 127;

                        if (l < 220) {
                            l = 220
                        }
                        if (l > document.documentElement.clientWidth - 220) {
                            l = document.documentElement.clientWidth - 220
                        }
                        if (t < 127) {
                            t = 127
                        }
                        if (t > document.documentElement.clientHeight - 127) {
                            t = document.documentElement.clientHeight - 127
                        }
                        oDiv.style.left = l + 'px';
                        oDiv.style.top = t + 'px'
                    };
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmousedown = null

                    }
                }
            }
        },

        watch: {
            inputValue: {
                immediate: true,
                handler(val) {
                    this.$nextTick(_ => {
                        if (this.$type === 'prompt' && val !== null) {
                            this.validate();
                        }
                    });
                }
            },

            visible(val) {
                if (val) this.uid++;
                if (this.$type === 'alert' || this.$type === 'confirm') {
                    this.$nextTick(() => {
                        this.$refs.confirm.$el.focus();
                    });
                }
                if (this.$type !== 'prompt') return;
                if (val) {
                    setTimeout(() => {
                        if (this.$refs.input && this.$refs.input.$el) {
                            this.$refs.input.$el.querySelector('input').focus();
                        }
                    }, 500);
                } else {
                    this.editorErrorMessage = '';
                    removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
                }
            }
        },

        data() {
            return {
                uid: 1,
                title: undefined,
                message: '',
                type: '',
                customClass: '',
                showInput: false,
                inputValue: null,
                inputPlaceholder: '',
                inputPattern: null,
                inputValidator: null,
                inputErrorMessage: '',
                showConfirmButton: true,
                showCancelButton: false,
                action: '',
                confirmButtonText: '',
                cancelButtonText: '',
                confirmButtonLoading: false,
                cancelButtonLoading: false,
                confirmButtonClass: '',
                confirmButtonDisabled: false,
                cancelButtonClass: '',
                editorErrorMessage: null,
                callback: null
            };
        }
    };
</script>
