<template>
  <li class="el-menu-item-group">
    <div class="el-menu-item-group__title" :style="{paddingLeft: levelPadding + 'px'}">
      <template v-if="!$slots.title">{{title}}</template>
      <slot v-else name="title"></slot>
    </div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'sinoMenuItemGroup',

    componentName: 'sinoMenuItemGroup',

    inject: ['rootMenu'],
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        paddingLeft: 15
      };
    },
    computed: {
      levelPadding() {
        let padding = 10;
        let parent = this.$parent;
        if (this.rootMenu.collapse) return 15;
        while (parent && parent.$options.componentName !== 'sinoMenu') {
          if (parent.$options.componentName === 'sinoSubmenu') {
            padding += 15;
          }
          parent = parent.$parent;
        }
        padding === 10 && (padding = 15);
        return padding;
      }
    }
  };
</script>

