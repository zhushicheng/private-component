import sinoCreateSelect from './src/select.vue';

/* istanbul ignore next */
sinoCreateSelect.install = function(Vue) {
  Vue.component(sinoCreateSelect.name, sinoCreateSelect);
};

export default sinoCreateSelect;
