<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <ul class="sino-dropdown-menu" v-show="showPopper">
      <slot></slot>
    </ul>
  </transition>
</template>
<script>
  import Popper from '../../../src/utils/vue-popper';

  export default {
    name: 'sinoDropdownMenu',

    componentName: 'sinoDropdownMenu',

    mixins: [Popper],

    created() {
      this.$on('updatePopper', () => {
        if (this.showPopper) this.updatePopper();
      });
      this.$on('visible', val => {
        this.showPopper = val;
      });
    },

    mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$el;
    },

    watch: {
      '$parent.menuAlign': {
        immediate: true,
        handler(val) {
          this.currentPlacement = `bottom-${val}`;
        }
      }
    }
  };
</script>
