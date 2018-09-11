<template>
  <li
    class="sino-dropdown-menu-item"
    :class="[
      type ? 'is-' + type : '',
      {
        'is-disabled': disabled,
        'el-dropdown-menu__item--divided': divided
      }
    ]"
    @click="handleClick" :type="nativeType"
  >
    <slot></slot>
  </li>
</template>
<script>
  import Emitter from '../../../src/mixins/emitter';

  export default {
    name: 'sinoDropdownItem',

    mixins: [Emitter],

    props: {
      type: {
        type: String,
        default: ''
      },
      command: null,
      disabled: Boolean,
      divided: Boolean,
      nativeType : String
    },

    methods: {
      handleClick(e) {
        this.dispatch('sinoDropdown', 'menu-item-click', [this.command, this]);
      }
    }
  };
</script>
