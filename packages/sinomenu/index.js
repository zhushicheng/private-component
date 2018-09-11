import sinoMenu from './src/menu.vue';

/* istanbul ignore next */
sinoMenu.install = function(Vue) {
  Vue.component(sinoMenu.name, sinoMenu);
};

export default sinoMenu;
