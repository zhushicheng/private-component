import sinoAutoTable from './src/table.vue';

/* istanbul ignore next */
sinoAutoTable.install = function(Vue) {
  Vue.component(sinoAutoTable.name, sinoAutoTable);
};

export default sinoAutoTable;
