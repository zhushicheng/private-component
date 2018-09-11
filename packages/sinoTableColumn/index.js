import sinoTableColumn from '../sinotable/src/table-column';

/* istanbul ignore next */
sinoTableColumn.install = function(Vue) {
  Vue.component(sinoTableColumn.name, sinoTableColumn);
};

export default sinoTableColumn;
