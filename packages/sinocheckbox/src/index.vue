<template>
    <label class="sino-checked-label">
    <span class="sino-checked-span"
          :class="{
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
    >
      <span class="sino-checked-inner">
        <i class="iconfont sino-tick"></i>
      </span>
      <input
          v-if="trueLabel || falseLabel"
          class="sino-checked-input"
          type="checkbox"
          :name="name"
          :disabled="disabled"
          :true-value="trueLabel"
          :false-value="falseLabel"
          v-model="model"
          @change="handleChange"
          @focus="focus = true"
          @blur="focus = false">
      <input
          v-else
          class="sino-checked-input"
          type="checkbox"
          :disabled="disabled"
          :value="label"
          :name="name"
          v-model="model"
          @change="handleChange"
          @focus="focus = true"
          @blur="focus = false">
    </span>
        <span class="sino-checked-span" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
    </label>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter';

    export default {
        name: 'sinoCheckbox',

        mixins: [Emitter],

        componentName: 'sinoCheckbox',

        data() {
            return {
                selfModel: false,
                focus: false
            };
        },

        computed: {
            model: {
                get() {
                    return this.isGroup
                        ? this.store : this.value !== undefined
                            ? this.value : this.selfModel;
                },

                set(val) {
                    if (this.isGroup) {
                        let isLimitExceeded = false;
                        (this._checkboxGroup.min !== undefined &&
                        val.length < this._checkboxGroup.min &&
                        (isLimitExceeded = true));

                        (this._checkboxGroup.max !== undefined &&
                        val.length > this._checkboxGroup.max &&
                        (isLimitExceeded = true));

                        isLimitExceeded === false &&
                        this.dispatch('sinoCheckboxGroup', 'input', [val]);
                    } else {
                        this.$emit('input', val);
                        this.selfModel = val;
                    }
                }
            },

            isChecked() {
                if ({}.toString.call(this.model) === '[object Boolean]') {
                    return this.model;
                } else if (Array.isArray(this.model)) {
                    return this.model.indexOf(this.label) > -1;
                } else if (this.model !== null && this.model !== undefined) {
                    return this.model === this.trueLabel;
                }
            },

            isGroup() {
                let parent = this.$parent;
                while (parent) {
                    if (parent.$options.componentName !== 'sinoCheckboxGroup') {
                        parent = parent.$parent;
                    } else {
                        this._checkboxGroup = parent;
                        return true;
                    }
                }
                return false;
            },

            store() {
                return this._checkboxGroup ? this._checkboxGroup.value : this.value;
            }
        },

        props: {
            value: {},
            label: {},
            indeterminate: Boolean,
            disabled: Boolean,
            checked: Boolean,
            name: String,
            trueLabel: [String, Number],
            falseLabel: [String, Number]
        },

        methods: {
            addToStore() {
                if (
                    Array.isArray(this.model) &&
                    this.model.indexOf(this.label) === -1
                ) {
                    this.model.push(this.label);
                } else {
                    this.model = this.trueLabel || true;
                }
            },
            handleChange(ev) {
                this.$emit('change', ev);
                if (this.isGroup) {
                    this.$nextTick(_ => {
                        this.dispatch('sinoCheckboxGroup', 'change', [this._checkboxGroup.value]);
                    });
                }
            }
        },

        created() {
            this.checked && this.addToStore();
        }
    };
</script>