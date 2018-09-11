import sinoCheckbox from 'sinoUI/packages/sinocheckbox';
import sinoRadio from 'sinoUI/packages/sinoradio/index';
import ElTag from 'sinoUI/packages/tag';
import objectAssign from 'sinoUI/src/utils/merge';
import { getPropByPath } from 'sinoUI/src/utils/util';

let columnIdSeed = 1;

const defaults = {
  default: {
    order: ''
  },
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
    className: 'el-table-column--selection'
  },
    radioSelection: {
        width: 48,
        minWidth: 48,
        realWidth: 48,
        order: '',
        className: 'sino-table-column--selection'
    },
    money: {
        width: 48,
        minWidth: 48,
        realWidth: 48,
        order: ''
    },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  }
};

const forced = {
  selection: {
    renderHeader: function(h) {
      return <sino-checkbox
        nativeOn-click={ this.toggleAllSelection }
        value={ this.isAllSelected } />;
    },
    renderCell: function(h, { row, column, store, $index }) {
      if (row.oper === true) {
        return <sino-checkbox
          value={ store.isSelected(row) }
          disabled={ column.selectable ? !column.selectable.call(null, row, $index) : false }
          on-input={ () => { store.commit('rowSelectedChanged', row); } } />;
      }
    },
    sortable: false,
    resizable: false
  },
    radioSelection: {
        renderHeader: function(h) {
            return '';
        },
        renderCell: function(h, { row, column, store, $index }) {
            if(row.oper === true){
                return <sino-radio type={'checkbox'}
                label={ store.isSelected(row) }
                on-input={ () => { store.commit('rowSelectedChangedRadio', row); } } />;
            }
        },
        sortable: false,
        resizable: false
    },
    money: {
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }, proxy) {
            if(row.oper === true){
                let property = column.property;
                let _value = DEFAULT_RENDER_CELL(h, { row, column });
                var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if(!reg.test(_value)){ // 判断是否为数字
                    let _moneyValue = toThousands(_value,2,'.',',');
                    if (_moneyValue) {
                        return <div><span class={ (parseInt(_moneyValue) >= 0 ? 'el-table-money-span-plus' : 'el-table-money-span-minus')}>￥</span><span class={ (parseInt(_moneyValue) >= 0 ? 'el-table-money-plus' : 'el-table-money-minus')}>{ _moneyValue }</span></div>;
                    } else {
                        return '';
                    }
                } else {
                    return <div>{ _value }</div>;
                }
            }
        },
        sortable: false,
        resizable: false
    },
  index: {
    renderHeader: function(h, { column }) {
      return column.label || '#';
    },
    renderCell: function(h, { row, $index, column }) {
      if (row.oper === true) {
          let i = $index + 1;
          const index = column.index;

          if (typeof index === 'number') {
              i = $index + index;
          } else if (typeof index === 'function') {
              i = index($index);
          }

          return <div>{ i }</div>;
      }
    },
    sortable: false
  },
  expand: {
    renderHeader: function(h, { column }) {
      return column.label || '';
    },
    renderCell: function(h, { row, store }, proxy) {
      const expanded = store.states.expandRows.indexOf(row) > -1;
      return <div class={ 'el-table__expand-icon ' + (expanded ? 'el-table__expand-icon--expanded' : '') }
                  on-click={ () => proxy.handleExpandClick(row) }>
        <i class='el-icon el-icon-arrow-right'></i>
      </div>;
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column'
  }
};

const getDefaultColumn = function(type, options) {
  const column = {};

  objectAssign(column, defaults[type || 'default']);

  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      const value = options[name];
      if (typeof value !== 'undefined') {
        column[name] = value;
      }
    }
  }

  if (!column.minWidth) {
    column.minWidth = 80;
  }

  column.realWidth = column.width === undefined ? column.minWidth : column.width;

  return column;
};

const DEFAULT_RENDER_CELL = function(h, { row, column }) {
  const property = column.property;
  const value = property && getPropByPath(row, property).v;
  if (column && column.formatter) {
    return column.formatter(row, column, value);
  }
  return value;
};
const toThousands =  function(number, decimals, decPoint, thousandsSep) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * decPoint：小数点符号
    * thousandsSep：千分位符号
    * */
    if (number === null) return;
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number;
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
    let s = '';
    let toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.ceil(n * k) / k;
    };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
};
export default {
  name: 'sinoTableColumn',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [String, Boolean],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    context: {},
    columnKey: String,
    align: String,
    oper: Boolean,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    editType:{
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: [],
      isColumnEdit: ''
    };
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
  },

  components: {
    sinoCheckbox,
    sinoRadio,
    ElTag
  },

  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },
    columnOrTableParent() {
      let parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    }
  },

  created() {
    this.customRender = this.$options.render;
    this.$options.render = h => h('div', this.$slots.default);

    let parent = this.columnOrTableParent;
    let owner = this.owner;
    this.isSubColumn = owner !== parent;
    this.columnId = (parent.tableId || (parent.columnId + '_')) + 'column_' + columnIdSeed++;

    let type = this.type;
    this.isColumnEdit = this.editType === true ? 'is-edit' : '';

    let width = this.width;
    if (width !== undefined) {
      width = parseInt(width, 10);
      if (isNaN(width)) {
        width = null;
      }
    }

    let minWidth = this.minWidth;
    if (minWidth !== undefined) {
      minWidth = parseInt(minWidth, 10);
      if (isNaN(minWidth)) {
        minWidth = 80;
      }
    }

    let isColumnGroup = false;

    let column = getDefaultColumn(type, {
      id: this.columnId,
      isEdit: this.isColumnEdit,
      columnKey: this.columnKey,
      label: this.label,
      className: this.className,
      labelClassName: this.labelClassName,
      property: this.prop || this.property,
      type,
      renderCell: null,
      renderHeader: this.renderHeader,
      minWidth,
      width,
      isColumnGroup,
      context: this.context,
      align: this.align ? 'is-' + this.align : null,
      oper: this.oper ? 'is-' + this.oper : null,
      headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null),
      sortable: this.sortable === '' ? true : this.sortable,
      sortMethod: this.sortMethod,
      sortBy: this.sortBy,
      resizable: this.resizable,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      formatter: this.formatter,
      selectable: this.selectable,
      reserveSelection: this.reserveSelection,
      fixed: this.fixed === '' ? true : this.fixed,
      filterMethod: this.filterMethod,
      filters: this.filters,
      filterable: this.filters || this.filterMethod,
      filterMultiple: this.filterMultiple,
      filterOpened: false,
      filteredValue: this.filteredValue || [],
      filterPlacement: this.filterPlacement || '',
      index: this.index
    });

    objectAssign(column, forced[type] || {});

    this.columnConfig = column;

    let renderCell = column.renderCell;
    let _self = this;

    if (type === 'expand') {
      owner.renderExpanded = function(h, data) {
        return _self.$scopedSlots.default
          ? _self.$scopedSlots.default(data)
          : _self.$slots.default;
      };

      column.renderCell = function(h, data) {
        return <div class="cell">{ renderCell(h, data, this._renderProxy) }</div>;
      };

      return;
    }

    column.renderCell = function(h, data) {
      if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data);
      }

      if (!renderCell) {
        renderCell = DEFAULT_RENDER_CELL;
      }

     /* return _self.showOverflowTooltip || _self.showTooltipWhenOverflow
        ? <div class="cell el-tooltip" style={'width:' + (data.column.realWidth || data.column.width) + 'px'}>{ renderCell(h, data) }</div>
        : <div class="cell">{ renderCell(h, data) }</div>;*/
      return _self.showOverflowTooltip || _self.showTooltipWhenOverflow
            ? <div class="cell sino-tooltip" style={'width:' + (data.column.realWidth || data.column.width) + 'px'}>{ renderCell(h, data) }</div>
        : <div class="cell" title={data.column.label=== "操作" || data.column.type=== "money" || data.column.type=== "selection" || data.column.type=== "index" ? '' :(typeof renderCell(h, data) === 'number' || typeof renderCell(h, data) === 'string') ? renderCell(h, data) : '' }>{ data.row.flag === 1?'': renderCell(h, data) }</div>;
    };
  },

  destroyed() {
    if (!this.$parent) return;
    this.owner.store.commit('removeColumn', this.columnConfig);
  },

  watch: {
    label(newVal) {
      if (this.columnConfig) {
        this.columnConfig.label = newVal;
      }
    },

    prop(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },

    property(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },

    filters(newVal) {
      if (this.columnConfig) {
        this.columnConfig.filters = newVal;
      }
    },

    filterMultiple(newVal) {
      if (this.columnConfig) {
        this.columnConfig.filterMultiple = newVal;
      }
    },

    align(newVal) {
      if (this.columnConfig) {
        this.columnConfig.align = newVal ? 'is-' + newVal : null;

        if (!this.headerAlign) {
          this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
        }
      }
    },

    oper(newVal){
      if (this.columnConfig) {
        this.columnConfig.oper = newVal ? 'is-' + newVal : null;
      }
    },

    headerAlign(newVal) {
      if (this.columnConfig) {
        this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
      }
    },

    width(newVal) {
      if (this.columnConfig) {
        this.columnConfig.width = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    minWidth(newVal) {
      if (this.columnConfig) {
        this.columnConfig.minWidth = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    fixed(newVal) {
      if (this.columnConfig) {
        this.columnConfig.fixed = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    sortable(newVal) {
      if (this.columnConfig) {
        this.columnConfig.sortable = newVal;
      }
    },
    editType: function (newVal){
      if(this.editType) {
        this.isColumnEdit = 'is-edit';
      } else {
        this.isColumnEdit = '';
      }
      this.columnConfig.isEdit = this.isColumnEdit;
    },

    index(newVal) {
      if (this.columnConfig) {
        this.columnConfig.index = newVal;
      }
    }
  },

  mounted() {
    const owner = this.owner;
    const parent = this.columnOrTableParent;
    let columnIndex;

    if (!this.isSubColumn) {
      columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
    } else {
      columnIndex = [].indexOf.call(parent.$el.children, this.$el);
    }

    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  }
};
