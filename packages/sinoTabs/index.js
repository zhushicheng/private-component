import sinoTabs from './src/tabs.vue';

/* istanbul ignore next */
sinoTabs.install = function(Vue) {
  Vue.component(sinoTabs.name, sinoTabs);
};

export default sinoTabs;
