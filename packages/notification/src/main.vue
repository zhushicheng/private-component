<template>
  <transition name="el-notification-fade">
    <div
      class="sino-notification"
      :class="customClass"
      v-show="visible"
      :style="{ top: top ? top + 'px' : 'auto' }"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click">
      <div class="sino-notification-icon sino-alert-icon" :class="[ sinoClass ]" v-if="type || iconClass">
        <i class="iconfont" :class="[ typeClass, iconClass ]"></i>
      </div>
      <div class="sino-notification-group" :class="{ 'is-with-icon': typeClass || iconClass }">
        <div class="sino-notification-title">
          <span v-text="title"></span>
        </div>
        <div class="sino-notification-content">
          <slot>
            <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
            <p v-else v-html="message"></p>
          </slot>
        </div>
        <i class="sino-notification-closeBtn iconfont sino-guanbi" @click.stop="close"></i>
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
      success: 'sino-alert-duigou',
      warning: 'sino-alert-gantanhao',
      error: 'sino-alert-unie61a',
      info: 'sino-alert-i'
  }
  export default {
    data() {
      return {
        visible: false,
        title: '',
        message: '',
        duration: 4500,
        type: '',
        customClass: '',
        iconClass: '',
        onClose: null,
        onClick: null,
        closed: false,
        top: null,
        timer: null,
        dangerouslyUseHTMLString: false
      };
    },

    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? typeMap[this.type] : '';
      },
      sinoClass() {
        return TYPE_SINO_MAP[this.type] || 'sino-alert-gantanhao';
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

      click() {
        if (typeof this.onClick === 'function') {
          this.onClick();
        }
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose();
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
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    }
  };
</script>
