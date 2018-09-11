import sinoBreadcrumb from './src/index.vue';

/* istanbul ignore next */
sinoBreadcrumb.install = function(Vue) {
  Vue.component(sinoBreadcrumb.name, sinoBreadcrumb);
};

export default sinoBreadcrumb;
