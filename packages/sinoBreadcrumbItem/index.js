import sinoBreadcrumbItem from '../sinoBreadcrumb/src/breadcrumb-item.vue';

/* istanbul ignore next */
sinoBreadcrumbItem.install = function(Vue) {
  Vue.component(sinoBreadcrumbItem.name, sinoBreadcrumbItem);
};

export default sinoBreadcrumbItem;
