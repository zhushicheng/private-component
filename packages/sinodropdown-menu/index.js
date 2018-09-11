import sinoDropdownMenu from '../sinodropdown/src/sino-dropdown-menu.vue';

/* istanbul ignore next */
sinoDropdownMenu.install = function(Vue) {
  Vue.component(sinoDropdownMenu.name, sinoDropdownMenu);
};

export default sinoDropdownMenu;
