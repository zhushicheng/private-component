<template>
  <label class="sino-switch" :class="{ 'is-disabled': disabled, 'sino-switch-wide': hasText, 'is-checked': checked }">
    <div class="sino-switch-mask" v-show="disabled"></div>
    <input class="sino-switch-input" type="checkbox" @change="handleChange" ref="input" :name="name" :true-value="onValue" :false-value="offValue" :disabled="disabled">
    <span class="sino-switch-core" ref="core" :style="{ 'width': coreWidth + 'px' }">
      <span class="sino-switch-button" :style="{ transform }"></span>
    </span>
    <transition name="label-fade">
      <div class="sino-switch-label sino-switch-label--left" v-show="checked" :style="{ 'width': coreWidth + 'px' }">
        <i :class="[onIconClass]" v-if="onIconClass"></i>
        <span v-if="!onIconClass && onText" class="left-font">{{ onText }}</span>
      </div>
    </transition>
    <transition name="label-fade">
      <div class="sino-switch-label sino-switch-label--right" v-show="!checked" :style="{ 'width': coreWidth + 'px' }">
        <i :class="[offIconClass]" v-if="offIconClass"></i>
        <span v-if="!offIconClass && offText" class="right-font">{{ offText }}</span>
      </div>
    </transition>
  </label>
</template>

<script>
  export default {
    name: 'sinoSwitch',
    props: {
      value: {
        type: [Boolean, String, Number],
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },
      onIconClass: {
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },
      onText: {
        type: String,
        default: '开'
      },
      offText: {
        type: String,
        default: '关'
      },
      onColor: {
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },
      onValue: {
        type: [Boolean, String, Number],
        default: true
      },
      offValue: {
        type: [Boolean, String, Number],
        default: false
      },
      name: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        coreWidth: this.width
      };
    },
    created() {
      if (!~[this.onValue, this.offValue].indexOf(this.value)) {
        this.$emit('input', this.offValue);
      }
    },
    computed: {
      checked() {
        return this.value === this.onValue;
      },
      hasText() {
        /* istanbul ignore next */
        return this.onText || this.offText;
      },
      transform() {
        return this.checked ? `translate(${ this.coreWidth - 21 }px, 2px)` : 'translate(4px, 2px)';
      }
    },
    watch: {
      checked() {
        if (this.onColor || this.offColor) {
          this.setBackgroundColor();
        }
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('change', !this.checked ? this.onValue : this.offValue);
        this.$emit('input', !this.checked ? this.onValue : this.offValue);
        this.$nextTick(() => {
          // set input's checked property
          // in case parent refuses to change component's value
          this.$refs.input.checked = this.checked;
        });
      },
      setBackgroundColor() {
        let newColor = this.checked ? this.onColor : this.offColor;
        this.$refs.core.style.borderColor = newColor;
        this.$refs.core.style.backgroundColor = newColor;
      }
    },
    mounted() {
      /* istanbul ignore if */
      if (this.width === 0) {
        this.coreWidth = this.hasText ? 60 : 60;
      }
      if (this.onColor || this.offColor) {
        this.setBackgroundColor();
      }
      this.$refs.input.checked = this.checked;
    }
  }
</script>
