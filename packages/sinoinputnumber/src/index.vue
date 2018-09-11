<template>
  <div class="sino-input-number"
       :class="[
      size ? 'sino-input-number-' + size : '',
      { 'is-disabled': disabled },
      { 'is-without-controls': !controls}
    ]"
  >
    <span
      v-if="controls"
      class="sino-input-number-decrease"
      :class="{'is-disabled': minDisabled}"
      v-repeat-click="decrease"
    >
      <i class="iconfont sino-jianhao1"></i>
    </span>
    <span
      v-if="controls"
      class="sino-input-number-increase"
      :class="{'is-disabled': maxDisabled}"
      v-repeat-click="increase"
    >
      <i class="iconfont sino-iconjia"></i>
    </span>
    <sino-input
      :value="currentValue"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @input="debounceHandleInput"
      :disabled="disabled"
      :size="size"
      :max="max"
      :min="min"
      ref="input"
    >
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </sino-input>
  </div>
</template>
<script>
  import sinoInput from '../../sinoinput/index.js';
  import { once, on } from '../../../src/utils/dom';
  import debounce from 'throttle-debounce/debounce';

  export default {
    name: 'sinoInputNumber',
    directives: {
      repeatClick: {
        // bind钩子函数：只调用一次，指令第一次绑定到元素时调用
        // el 所绑定该指令的元素
        // bind 为一个对象，包含：
        //    name: 指令名，不包括 v- 前缀。
        //    value: 指令的绑定值， 例如： v-my-directive="1 + 1", value 的值是 2。
        //    oldValue: 指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
        //    expression: 绑定值的字符串形式。 例如 v-my-directive="1 + 1" ， expression 的值是 "1 + 1"。
        //    arg: 传给指令的参数。例如 v-my-directive:foo， arg 的值是 "foo"。
        //    modifiers: 一个包含修饰符的对象。 例如： v-my-directive.foo.bar, 修饰符对象 modifiers 的值是 { foo: true, bar: true }。
        // vnode: Vue编译生成的虚拟节点:
        bind(el, binding, vnode) {
          let interval = null;
          let startTime;
          const handler = () => vnode.context[binding.expression].apply();
          console.log(handler)
          const clear = () => {
            if (new Date() - startTime < 100) {
              handler();
            }
            clearInterval(interval);
            interval = null;
          };
          on(el, 'mousedown', () => {
            startTime = new Date();
            once(document, 'mouseup', clear);
            clearInterval(interval);
            interval = setInterval(handler, 100);
          });
        }
      }
    },
    components: {
      sinoInput
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      value: {
        default: 0
      },
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: true
      },
      debounce: {
        type: Number,
        default: 300
      }
    },
    data() {
      return {
        currentValue: 0
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(value) {
          let newVal = Number(value);
          if (isNaN(newVal)) return;
          if (newVal >= this.max) newVal = this.max;
          if (newVal <= this.min) newVal = this.min;
          this.currentValue = newVal;
          this.$emit('input', newVal);
        }
      }
    },
    computed: {
      minDisabled() {
        return this._decrease(this.value, this.step) < this.min;
      },
      maxDisabled() {
        return this._increase(this.value, this.step) > this.max;
      },
      precision() {
        const { value, step, getPrecision } = this;
        return Math.max(getPrecision(value), getPrecision(step));
      }
    },
    methods: {
      toPrecision(num, precision) {
        if (precision === undefined) precision = this.precision;
        return parseFloat(parseFloat(Number(num).toFixed(precision)));
      },
      getPrecision(value) {
        const valueString = value.toString();
        const dotPosition = valueString.indexOf('.');
        let precision = 0;
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
        return precision;
      },
      _increase(val, step) {
        if (typeof val !== 'number') return this.currentValue;

        const precisionFactor = Math.pow(10, this.precision);

        return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
      },
      _decrease(val, step) {
        if (typeof val !== 'number') return this.currentValue;

        const precisionFactor = Math.pow(10, this.precision);

        return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
      },
      increase() {
        if (this.disabled || this.maxDisabled) return;
        const value = this.value || 0;
        const newVal = this._increase(value, this.step);
        if (newVal > this.max) return;
        this.setCurrentValue(newVal);
      },
      decrease() {
        if (this.disabled || this.minDisabled) return;
        const value = this.value || 0;
        const newVal = this._decrease(value, this.step);
        if (newVal < this.min) return;
        this.setCurrentValue(newVal);
      },
      handleBlur() {
        this.$refs.input.setCurrentValue(this.currentValue);
      },
      setCurrentValue(newVal) {
        const oldVal = this.currentValue;
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        if (oldVal === newVal) {
          this.$refs.input.setCurrentValue(this.currentValue);
          return;
        }
        this.$emit('change', newVal, oldVal);
        this.$emit('input', newVal);
        this.currentValue = newVal;
      },
      handleInput(value) {
        if (value === '') {
          return;
        }
        const newVal = Number(value);
        if (!isNaN(newVal)) {
          this.setCurrentValue(newVal);
        } else {
          this.$refs.input.setCurrentValue(this.currentValue);
        }
      }
    },
    created() {
      this.debounceHandleInput = debounce(this.debounce, value => {
        this.handleInput(value);
      });
    }
  };
</script>
