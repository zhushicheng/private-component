import sinoSubmenu from '../sinomenu/src/submenu.vue';

/* istanbul ignore next */
sinoSubmenu.install = function(Vue) {
  Vue.component(sinoSubmenu.name, sinoSubmenu);
};

export default sinoSubmenu;
