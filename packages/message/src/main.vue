<template>
  <transition name="el-message-fade">
    <div
      class="el-message"
      :class="customClass"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <div class="el-message__img" alt="" v-if="!iconClass" :class="[ sinoClass ]">
        <i class="iconfont" :class="[ typeClass ]"></i>
      </div>
      <div class="el-message__group" :class="{ 'is-with-icon': iconClass }">
        <slot><p>
          <i class="el-message__icon" :class="iconClass" v-if="iconClass"></i>
          <span v-html="message"></span>
        </p></slot>
        <div v-if="showClose" class="el-message__closeBtn el-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
    let typeMap = {
        success: 'sino-duigou',
        info: 'sino-i',
        warning: 'sino-gantanhao',
        error: 'sino-guanbi'
    };

    const TYPE_SINO_MAP = {
        'success': 'sino-message-suc',
        'warning': 'sino-message-warn',
        'error': 'sino-message-err',
        'info': 'sino-message-info'
    };
  export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 2000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null
      };
    },

    computed: {
      typeImg() {
        return require(`../assets/${ this.type }.svg`);
      },
        typeClass() {
            return this.type && typeMap[this.type] ? typeMap[this.type] : '';
        },

        sinoClass() {
            return this.type && TYPE_SINO_MAP[this.type] ? TYPE_SINO_MAP[this.type] : ''
        }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      }
    },

    mounted() {
      this.startTimer();
    }
  };
</script>
