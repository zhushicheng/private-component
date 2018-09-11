import sinoTable from './src/table.vue';

/* istanbul ignore next */
sinoTable.install = function(Vue) {
  Vue.component(sinoTable.name, sinoTable);
};

export default sinoTable;
