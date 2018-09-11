<template>
  <label class="sino-radio">
    <template v-if="type !== 'checkbox'">
      <span class="sino-radio-span" :class="{ 'is-disabled': isDisabled,'is-checked': model === label,'is-focus': focus }" :disabled="isDisabled">
        <span class="sino-radio-inner"></span>
        <input class="sino-radio-input" :value="label" type="radio" v-model="model" @focus="focus = true" @change="handleChange"  @blur="focus = false" :name="name" :disabled="isDisabled">
      </span>
      <span class="sino-radio-span">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
      </span>
    </template>
    <template v-if="type === 'checkbox'">
      <span class="sino-radio-checkspan" :class="{ 'is-disabled': isDisabled,'is-checked': model === label,'is-focus': focus }" :disabled="isDisabled">
        <span class="sino-radio-inner"><i class="iconfont sino-tick" v-show="label === true"></i></span>
        <input class="sino-radio-input" :value="label" type="radio" v-model="model" @focus="focus = true" @change="handleChange"  @blur="focus = false" :name="name" :disabled="isDisabled">
      </span>
      <span class="sino-radio-span">
        <slot></slot>
      </span>
    </template>
  </label>
</template>
<style>

</style>
<script>
    import Emitter from 'sinoUI/src/mixins/emitter';
    export default {
        name: 'SinoRadio',
        componentName: 'SinoRadio',
        mixins: [Emitter],
        props : {
            value: {},
            label: {},
            disabled: {
                type:Boolean,
                default: false
            },
            name: String,
            type:String
        },
        data() {
            return {
                focus: false
            };
        },
        watch: {
            model (val) {
                if (typeof(val) === 'number') {
                    this.dispatch('SinoFormItem', 'sino.form.change', [this.model]);
                }
            }
        },
        computed: {
            isGroup() {
                let parent = this.$parent;
                while (parent) {
                    if (parent.$options.componentName !== 'SinoRadioGroup') {
                        parent = parent.$parent;
                    } else {
                        this._radioGroup = parent;
                        return true;
                    }
                }
                return false;
            },
            model: {
                get() {
                    return this.isGroup ? this._radioGroup.value : this.value;
                },

                set(val) {
                    if (this.isGroup) {
                        this.dispatch('SinoRadioGroup', 'input', [val]);
                    } else {
                        this.$emit('input', val);
                    }
                }
            },
            isDisabled() {
                return this.isGroup ? this._radioGroup.disabled || this.disabled : this.disabled;
            }
        },
        methods: {
            handleChange() {
                this.$nextTick(() => {
                    this.$emit('change', this.model);
                    this.isGroup && this.dispatch('sinoRadioGroup', 'handleChange', this.model);
                });
            }
        }
    }
</script>
