<template>
  <ul class="sino-create-select-group__wrap">
    <li class="sino-create-select-group__title" v-show="visible">{{ label }}</li>
    <li>
      <ul class="sino-create-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
  import Emitter from 'sinoUI/src/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'sinoCreateOptionGroup',

    componentName: 'sinoCreateOptionGroup',

    props: {
      label: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: true
      };
    },

    watch: {
      disabled(val) {
        this.broadcast('sinoCreateOption', 'handleGroupDisabled', val);
      }
    },

    methods: {
      queryChange() {
        this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.visible === true);
      }
    },

    created() {
      this.$on('queryChange', this.queryChange);
    },

    mounted() {
      if (this.disabled) {
        this.broadcast('sinoCreateOption', 'handleGroupDisabled', this.disabled);
      }
    }
  };
</script>
