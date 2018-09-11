<template>
    <div class="sino-form-item" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': isRequired || required
  }">
        <label :for="prop" class="sino-form-item-label" v-bind:style="labelStyle" v-if="label || $slots.label">
            <slot name="label">{{label + form.labelSuffix}}</slot>
        </label>
        <div class="sino-form-item-content" v-bind:style="contentStyle">
            <slot></slot>
            <transition name="sino-zoom-in-top">
                <div  class="sino-form-item-error" :class="{'sino-form-item-error-text':justText}" v-if="validateState === 'error' && showMessage && form.showMessage && justText">{{validateMessage}}</div>
                <div class="sino-form-item-error" v-if="validateState === 'error' && showMessage && form.showMessage && !justText">
                    <sino-popover ref="popover" :popper-class="'inputTip'" placement="bottom-end" trigger="hover" :content="validateMessage"></sino-popover>
                    <i class="iconfont tip-icon-1 sino-tanhao" v-popover:popover></i>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import AsyncValidator from 'async-validator';
    import emitter from '../../../src/mixins/emitter';
    import sinoPopover from '../../sinopopover/index.js'

    function noop() {}

    function getPropByPath(obj, path) {
        let tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');

        let keyArr = path.split('.');
        let i = 0;

        for (let len = keyArr.length; i < len - 1; ++i) {
            let key = keyArr[i];
            if (key in tempObj) {
                tempObj = tempObj[key];
            } else {
                throw new Error('please transfer a valid prop path to form item!');
            }
        }
        return {
            o: tempObj,
            k: keyArr[i],
            v: tempObj[keyArr[i]]
        };
    }

    export default {
        name: 'sinoFormItem',
        components:{sinoPopover},

        componentName: 'sinoFormItem',

        mixins: [emitter],

        props: {
            label: String,
            labelWidth: String,
            prop: String,
            required: Boolean,
            rules: [Object, Array],
            error: String,
            validateStatus: String,
            showMessage: {
                type: Boolean,
                default: true
            },
            justText:{
                type: Boolean,
                default: false
            }
        },
        watch: {
            error(value) {
                this.validateMessage = value;
                this.validateState = value ? 'error' : '';
            },
            validateStatus(value) {
                this.validateState = value;
            }
        },
        computed: {
            labelStyle() {
                var ret = {};
                if (this.form.labelPosition === 'top') return ret;
                var labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    ret.width = labelWidth;
                }
                return ret;
            },
            contentStyle() {
                var ret = {};
                const label = this.label;
                if (this.form.labelPosition === 'top' || this.form.inline) return ret;
                if (!label && !this.labelWidth) return ret;
                var labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    ret.marginLeft = labelWidth;
                }
                return ret;
            },
            form() {
                var parent = this.$parent;
                while (parent.$options.componentName !== 'sinoForm') {
                    parent = parent.$parent;
                }
                return parent;
            },
            fieldValue: {
                cache: false,
                get() {
                    var model = this.form.model;
                    if (!model || !this.prop) { return; }

                    var path = this.prop;
                    if (path.indexOf(':') !== -1) {
                        path = path.replace(/:/, '.');
                    }

                    return getPropByPath(model, path).v;
                }
            },
            isRequired() {
                let rules = this.getRules();
                let isRequired = false;
                if (rules && rules.length) {
                    rules.every(rule => {
                        if (rule.required) {
                            isRequired = true;
                            return false;
                        }
                        return true;
                    });
                }
                return isRequired;
            }
        },
        data() {
            return {
                validateState: '',
                validateMessage: '',
                validateDisabled: false,
                validator: {}
            };
        },
        methods: {
            validate(trigger, callback = noop) {
                var rules = this.getFilteredRule(trigger);
                if (!rules || rules.length === 0) {
                    callback();
                    return true;
                }

                this.validateState = 'validating';

                var descriptor = {};
                descriptor[this.prop] = rules;

                var validator = new AsyncValidator(descriptor);
                var model = {};

                model[this.prop] = this.fieldValue;

                validator.validate(model, { firstFields: true }, (errors, fields) => {
                    this.validateState = !errors ? 'success' : 'error';
                    this.validateMessage = errors ? errors[0].message : '';

                    callback(this.validateMessage);
                });
            },
            resetField() {
                this.validateState = '';
                this.validateMessage = '';

                let model = this.form.model;
                let value = this.fieldValue;
                let path = this.prop;
                if (path.indexOf(':') !== -1) {
                    path = path.replace(/:/, '.');
                }

                let prop = getPropByPath(model, path);

                if (Array.isArray(value)) {
                    this.validateDisabled = true;
                    prop.o[prop.k] = [].concat(this.initialValue);
                } else {
                    this.validateDisabled = true;
                    prop.o[prop.k] = this.initialValue;
                }
            },
            getRules() {
                var formRules = this.form.rules;
                var selfRuels = this.rules;

                formRules = formRules ? formRules[this.prop] : [];

                return [].concat(selfRuels || formRules || []);
            },
            getFilteredRule(trigger) {
                var rules = this.getRules();

                return rules.filter(rule => {
                    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
                });
            },
            onFieldBlur() {
                this.validate('blur');
            },
            onFieldChange() {
                if (this.validateDisabled) {
                    this.validateDisabled = false;
                    return;
                }

                this.validate('change');
            }
        },
        mounted() {
            if (this.prop) {
                this.dispatch('sinoForm', 'sino.form.addField', [this]);

                let initialValue = this.fieldValue;
                if (Array.isArray(initialValue)) {
                    initialValue = [].concat(initialValue);
                }
                Object.defineProperty(this, 'initialValue', {
                    value: initialValue
                });

                let rules = this.getRules();

                if (rules.length) {
                    this.$on('sino.form.blur', this.onFieldBlur);
                    this.$on('sino.form.change', this.onFieldChange);
                }
            }
        },
        beforeDestroy() {
            this.dispatch('sinoForm', 'sino.form.removeField', [this]);
        }
    };
</script>
