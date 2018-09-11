import sinoMenuItemGroup from '../sinomenu/src/menu-item-group.vue';

/* istanbul ignore next */
sinoMenuItemGroup.install = function(Vue) {
  Vue.component(sinoMenuItemGroup.name, sinoMenuItemGroup);
};

export default sinoMenuItemGroup;
