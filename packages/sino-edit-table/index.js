import sinoEditTable from './src/edittable.vue';

/* istanbul ignore next */
sinoEditTable.install = function(Vue) {
  Vue.component(sinoEditTable.name, sinoEditTable);
};

export default sinoEditTable;
