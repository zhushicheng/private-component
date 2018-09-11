import sinoAutoTableColumn from '../sinoAutoTable/src/table-column';

/* istanbul ignore next */
sinoAutoTableColumn.install = function(Vue) {
  Vue.component(sinoAutoTableColumn.name, sinoAutoTableColumn);
};

export default sinoAutoTableColumn;
