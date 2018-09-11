import sinoTabPane from '../sinoTabs/src/tab-pane.vue';

/* istanbul ignore next */
sinoTabPane.install = function(Vue) {
  Vue.component(sinoTabPane.name, sinoTabPane);
};

export default sinoTabPane;
