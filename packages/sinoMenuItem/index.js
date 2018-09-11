import sinoMenuItem from '../sinomenu/src/menu-item.vue';

/* istanbul ignore next */
sinoMenuItem.install = function(Vue) {
  Vue.component(sinoMenuItem.name, sinoMenuItem);
};

export default sinoMenuItem;
