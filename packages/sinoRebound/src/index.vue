<template>
  <transition name="fade-in" class="sino-dialog-dialog-fade">
    <div v-show="visible">
      <div class="rebound-core-bg" :style="style">
        <div class="rebound-core"></div>
      </div>
      <div v-if="$slots.contener" class="rebound-contener" :style="positon">
        <div class="fl bg-arrow"></div>
        <div class="contener-box">
          <slot name="contener"></slot>
          <div class="rebound-btn-box"><span
            class="rebound-btn" @click="changeVisible()">知道了</span></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'sinoRebound',
    props: {

      visible: {
        type: Boolean,
        default: true
      },

      dialogFormVisible: {
        type: Boolean,
        default: false
      },
      closeCallback: Function,
      option: {
        type: Object,
      },
    },
    computed: {
      style () {
        let obj = {}
        if (this.option.left) {
          obj.borderLeftWidth = this.option.left + 'px'
        }
        if (this.option.top) {
          obj.borderTopWidth = this.option.top + 'px'
        }
        if (this.option.height) {
          obj.height = this.option.height + 'px'
        }
        if (this.option.width) {
          obj.width = this.option.width + 'px'
        }
        return obj
      },
      positon () {
        let obj = {}
        if (this.option.top) {
          obj.top = (this.option.top - 0) + (this.option.height - 0) + 20 + 'px'
        }
        if (this.option.left) {
          obj.left = this.option.width / 2 + (this.option.left - 0) - 15 + 'px'
        }
        return obj
      }
    },
    data() {
      return{
        changeVisible: function () {
          this.$emit('closeRebound')
        }
      }
    },
    watch: {
      visible: function (newValue, oldValue) {
        console.log(newValue, oldValue)
        if (newValue == false && typeof this.closeCallback == 'function') {
          this.closeCallback()
          document.body.style.overflow = 'initial'
        } else {
          document.body.style.overflow = 'hidden'
        }
      }
    }

  }

</script>
