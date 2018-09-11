<template>
  <li class="sino-menu-item"
    :style="paddingStyle"
    @click="handleClick"
    :class="{
      'is-active': active,
      'is-disabled': disabled
    }">
    <sino-tooltip
      v-if="$parent === rootMenu && rootMenu.collapse"
      effect="light"
      placement="right">
      <div slot="content"><slot name="title"></slot></div>
      <div>
        <slot></slot>
      </div>
    </sino-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </li>
</template>
<script>
  import Menu from './menu-mixin';
  import Emitter from '../../../src/mixins/emitter'
  import sinoTooltip from '../../sinotooltip/index';

  export default {
    name: 'sinoMenuItem',

    componentName: 'sinoMenuItem',

    mixins: [Menu, Emitter],

    components:{
      sinoTooltip
    },

    props: {
      index: {
        type: String,
        required: false
      },
      route: {
        type: Object,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false
      }
    },
    computed: {
      active() {
        return this.index === this.rootMenu.activedIndex;
      }
    },
    methods: {
      handleClick() {
        this.dispatch('sinoMenu', 'item-click', this);
        this.$emit('click', this);
      }
    },
    created() {
      this.parentMenu.addItem(this);
      this.rootMenu.addItem(this);
    },
    beforeDestroy() {
      this.parentMenu.removeItem(this);
      this.rootMenu.removeItem(this);
    }
  };
</script>
