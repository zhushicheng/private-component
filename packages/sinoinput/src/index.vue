<template>
    <div :class="[
    type === 'textarea' ? 'sino-textarea' : 'sino-input',
    {
      'is-autosize':autosize,
      'is-warn':warn,
      'is-disabled': inputDisabled,
      'sino-input-group': $slots.prepend || $slots.append,
      'sino-input-group-append': $slots.append,
      'sino-input-group-prepend': $slots.prepend,
      'sino-input--prefix': $slots.prefix || prefixIcon,
      'sino-input--suffix': $slots.suffix || suffixIcon
    }
  ]"
         @mouseenter="hovering = true"
         @mouseleave="hovering = false"
    >
        <template v-if="type !== 'textarea'">
            <!-- input 图标 -->
            <slot></slot>
            <!--<slot name="icon">
              <i class="iconfont tip-icon-1"
                 :class="[
                  'icon-'+icon,
                  onIconClick ? 'is-clickable' : ''
                ]"
                 v-if="icon"
                 @click="handleIconClick">
              </i>
            </slot>-->
            <input
                class="sino-input-inner"
                :autocomplete="autoComplete"
                :value="currentValue"
                :disabled="inputDisabled"
                :placeholder="placeholder"
                :readonly="readonly"
                :type="type"
                ref="input"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
            >
            <!-- 前置内容 -->
            <span class="sino-input__prefix" v-if="$slots.prefix || prefixIcon" :style="prefixOffset">
                <slot name="prefix"></slot>
                <i class="sino-input__icon"
                   v-if="prefixIcon"
                   :class="prefixIcon">

                </i>
            </span>
            <!-- 后置内容 -->
            <span
                    class="sino-input__suffix"
                    v-if="$slots.suffix || suffixIcon || showClear || validateState && needStatusIcon"
                    :style="suffixOffset">
                <span class="sino-input__suffix-inner">
                  <template v-if="!showClear">
                    <slot name="suffix"></slot>
                    <i class="sino-input__icon"
                       v-if="suffixIcon"
                       :class="suffixIcon">
                    </i>
                  </template>
                  <i v-else class="el-input__icon el-icon-circle-close el-input__clear"
                     @click="clear"
                  ></i>
                </span>
                <i class="el-input__icon"
                   v-if="validateState"
                   :class="['el-input__validateIcon', validateIcon]">
                </i>
              </span>
            <!-- 后置元素 -->
            <div class="sino-input-group-append" v-if="$slots.append">
                <slot name="append"></slot>
            </div>
        </template>
        <textarea
            v-else
            class="sino-textarea-inner"
            :value="currentValue"
            :disabled="inputDisabled"
            :placeholder="placeholder"
            :readonly="readonly"
            ref="textarea"
            :style="textareaStyle"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
        ></textarea>
    </div>
</template>
<script>
    import emitter from '../../../src/mixins/emitter';
    import calcTextareaHeight from './calcTextareaHeight';
    import merge from '../../../src/utils/merge';
    import sinoPopover from '../../sinopopover/index.js';

    export default {
        name: 'sinoInput',
        componentName: 'sinoInput',
        components:{
            sinoPopover,
        },

        mixins: [emitter],

        data() {
            return {
                currentValue: this.value,
                textareaCalcStyle: {},
                prefixOffset: null,
                suffixOffset: null,
                hovering: false,
                focused: false
            };
        },

        props: {
            type: {
                type: String,
                default: 'text'
            },
            value: [String, Number],
            warn:String,
            placeholder: String,
            size: String,
            resize: String,
            readonly: {
                type: Boolean,
                default: false
            },
            autofocus: Boolean,
            disabled: Boolean,
            icon: String,
            type: {
                type: String,
                default: 'text'
            },
            name: String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            rows: {
                type: Number,
                default: 2
            },
            autoComplete: {
                type: String,
                default: 'off'
            },
            form: String,
            maxlength: Number,
            minlength: Number,
            max: {},
            min: {},
            step: {},
            validateEvent: {
                type: Boolean,
                default: true
            },
            suffixIcon: String,
            prefixIcon: String,
            clearable: {
                type: Boolean,
                default: false
            },
            onIconClick: Function
        },

        computed: {
            textareaStyle() {
                return merge({}, this.textareaCalcStyle, { resize: this.resize });
            },
            validateState() {
                return this.SinoFormItem ? this.SinoFormItem.validateState : '';
            },
            showClear() {
                return this.clearable && this.currentValue !== '' && (this.focused || this.hovering);
            },
            inputDisabled() {
                return this.disabled || (this.SinoForm || {}).disabled;
            },
            isGroup() {
                return this.$slots.prepend || this.$slots.append;
            },
            needStatusIcon() {
                console.log('this-----', this);
                return this.SinoForm ? this.SinoForm.statusIcon : false;
            }
        },

        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val);
            }
        },

        methods: {
            handleBlur(event) {
                this.focused = false;
                this.$emit('blur', event);
                if (this.validateEvent) {
                    this.dispatch('SinoFormItem', 'sino.form.blur', [this.currentValue]);
                }
            },
            inputSelect() {
                this.$refs.input.select();
            },
            resizeTextarea() {
                if (this.$isServer) return;
                var { autosize, type } = this;
                if (!autosize || type !== 'textarea') return;
                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows;

                this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
            },
            handleFocus(event) {
                this.focused = true;
                this.$emit('focus', event);
            },
            handleInput(event) {
                const value = event.target.value;
                this.$emit('input', value);
                this.setCurrentValue(value);
                this.$emit('change', value);
            },
            handleIconClick(event) {
                if(this.icon == "error"){
                    if (this.onIconClick) {
                        this.onIconClick(event);
                    }
                    this.$emit('click', event);
                }
            },
            setCurrentValue(value) {
                if (value === this.currentValue) return;
                this.$nextTick(_ => {
                    this.resizeTextarea();
                });
                this.currentValue = value;
                if (this.validateEvent) {
                    this.dispatch('SinoFormItem', 'sino.form.change', [value]);
                }
            },
            calcIconOffset(place) {
                const pendantMap = {
                    'suf': 'append',
                    'pre': 'prepend'
                };

                const pendant = pendantMap[place];

                if (this.$slots[pendant]) {
                    return { transform: `translateX(${place === 'suf' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)` };
                }
            }
        },

        created() {
            this.$on('inputSelect', this.inputSelect);
        },

        mounted() {
            this.resizeTextarea();
            if (this.isGroup) {
                this.prefixOffset = this.calcIconOffset('pre');
                this.suffixOffset = this.calcIconOffset('suf');
            }
        }
    };
</script>
