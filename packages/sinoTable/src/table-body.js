import { getCell, getColumnByCell, getRowIdentity } from './util';
import { hasClass, addClass, removeClass } from 'sinoUI/src/utils/dom';
import sinoCheckbox from 'sinoUI/packages/sinocheckbox';
import sinoTooltip from 'sinoUI/packages/sinotooltip';
import debounce from 'throttle-debounce/debounce';

export default {
  components: {
    sinoCheckbox,
    sinoTooltip
  },

  props: {
    store: {
      required: true
    },
    stripe: Boolean,
    context: {},
    layout: {
      required: true
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: String,
    highlight: Boolean,
    oper:Boolean
  },

  render(h) {
    const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));
    return (
      <table
        class="el-table__body"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this._l(this.columns, column =>
              <col
                name={ column.id }
                width={ column.realWidth || column.width }
              />)
          }
        </colgroup>
        <tbody>
          {
            this._l(this.data, (row, $index) =>
              [<tr
                style={ this.rowStyle ? this.getRowStyle(row, $index) : null }
                key={ this.table.rowKey ? this.getKeyOfRow(row, $index) : $index }
                on-dblclick={ ($event) => this.handleDoubleClick($event, row) }
                on-click={ ($event) => this.handleClick($event, row) }
                on-contextmenu={ ($event) => this.handleContextMenu($event, row) }
                on-mouseenter={ _ => this.handleMouseEnter($index) }
                on-mouseleave={ _ => this.handleMouseLeave() }
                class={ [this.getRowClass(row, $index)] }>
                {
                  this._l(this.columns, (column, cellIndex) => {
                    const { rowspan, colspan } = this.getSpan(row, column, $index, cellIndex);
                    if (!rowspan || !colspan) {
                      return '';
                    } else {
                      if (rowspan === 1 && colspan === 1) {
                        return (
                          <td
                            style={ this.getCellStyle($index, cellIndex, row, column) }
                            class={ this.getCellClass($index, cellIndex, row, column) }
                            on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                            on-mouseleave={ this.handleCellMouseLeave }>
                            {
                              column.renderCell.call(
                                this._renderProxy,
                                h,
                                {
                                  row,
                                  column,
                                  $index,
                                  store: this.store,
                                  _self: this.context || this.table.$vnode.context
                                },
                                columnsHidden[cellIndex]
                              )
                            }
                          </td>
                        );
                      } else {
                        return (
                          <td
                            style={ this.getCellStyle($index, cellIndex, row, column) }
                            class={ this.getCellClass($index, cellIndex, row, column) }
                            rowspan={ rowspan }
                            colspan={ colspan }
                            on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                            on-mouseleave={ this.handleCellMouseLeave }>
                            {
                              column.renderCell.call(
                                this._renderProxy,
                                h,
                                {
                                  row,
                                  column,
                                  $index,
                                  store: this.store,
                                  _self: this.context || this.table.$vnode.context
                                },
                                columnsHidden[cellIndex]
                              )
                            }
                          </td>
                        );
                      }
                    }
                  })
                }
                {
                  !this.fixed && this.layout.scrollY && this.layout.gutterWidth ? <td class="gutter" /> : ''
                }
              </tr>,
                this.store.states.expandRows.indexOf(row) > -1
                ? (<tr>
                    <td colspan={ this.columns.length } class="el-table__expanded-cell">
                      { this.table.renderExpanded ? this.table.renderExpanded(h, { row, $index, store: this.store }) : ''}
                    </td>
                  </tr>)
                : ''
              ]
            ).concat(
              <sino-tooltip effect={ this.table.tooltipEffect } placement="top" ref="tooltip" content={ this.tooltipContent }></sino-tooltip>
            )
          }
        </tbody>
      </table>
    );
  },

  watch: {
		'store.states.selection': {
			handler (newVal, oldVal) {
				const el = this.$el;
				if (!el) return;
				const data = this.store.states.data;
				const tr = el.querySelector('tbody').children;
				const rows = [].filter.call(tr, row => hasClass(row, 'el-table__row'));
				for (let i = 0; i < tr.length; i++) {
					tr[i].classList.remove('row-sel');
				}
				for (let item of newVal) {
					if (!item.flag) {
						addClass(rows[data.indexOf(item)], 'row-sel');
					}
				}
			},
			deep: true
		},
    'store.states.hoverRow'(newVal, oldVal) {
      if (!this.store.states.isComplex) return;
      const el = this.$el;
      if (!el) return;
      const tr = el.querySelector('tbody').children;
      const rows = [].filter.call(tr, row => hasClass(row, 'el-table__row'));
      const oldRow = rows[oldVal];
      const newRow = rows[newVal];
      if (oldRow) {
        removeClass(oldRow, 'hover-row');
      }
      if (newRow) {
        addClass(newRow, 'hover-row');
      }
    },
    'store.states.currentRow'(newVal, oldVal) {
      if (!this.highlight) return;
      const el = this.$el;
      if (!el) return;
      const data = this.store.states.data;
      const tr = el.querySelector('tbody').children;
      const rows = [].filter.call(tr, row => hasClass(row, 'el-table__row'));
      const oldRow = rows[data.indexOf(oldVal)];
      const newRow = rows[data.indexOf(newVal)];
      if (oldRow) {
        removeClass(oldRow, 'current-row');
      } else if (rows) {
        [].forEach.call(rows, row => removeClass(row, 'current-row'));
      }
      if (newRow) {
        addClass(newRow, 'current-row');
      }
    }
  },

  computed: {
    table() {
      return this.$parent;
    },

    data() {
        let _data =this.store.states.data;
        if(_data.length > 0 && _data[_data.length-1].flag === 1){
        } else {
            this.store.states.data.forEach(function(val,index,arr){
                val.oper = true;
            });
        }
        if(this.store.states.data.length > 0 && this.store.states.data.length < 10){
            let arr = this.store.states.data;
            let  needPush= [];
            while (10 - this.store.states.data.length - needPush.length > 0 ) {
                needPush.push({flag:1});
            }
            this.store.states.data = arr.concat(needPush);
        }
      return this.store.states.data;
    },

    columnsCount() {
      return this.store.states.columns.length;
    },

    leftFixedLeafCount() {
      return this.store.states.fixedLeafColumnsLength;
    },

    rightFixedLeafCount() {
      return this.store.states.rightFixedLeafColumnsLength;
    },

    leftFixedCount() {
      return this.store.states.fixedColumns.length;
    },

    rightFixedCount() {
      return this.store.states.rightFixedColumns.length;
    },

    columns() {
      return this.store.states.columns;
    }
  },

  data() {
    return {
      tooltipContent: ''
    };
  },

  created() {
    this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
  },

  methods: {
    getKeyOfRow(row, index) {
      const rowKey = this.table.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey);
      }
      return index;
    },

    isColumnHidden(index) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedLeafCount;
      } else if (this.fixed === 'right') {
        return index < this.columnsCount - this.rightFixedLeafCount;
      } else {
        return (index < this.leftFixedLeafCount) || (index >= this.columnsCount - this.rightFixedLeafCount);
      }
    },

    getSpan(row, column, rowIndex, columnIndex) {
      let rowspan = 1;
      let colspan = 1;

      const fn = this.table.spanMethod;
      if (typeof fn === 'function') {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex
        });

        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (typeof result === 'object') {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }

      return {
        rowspan,
        colspan
      };
    },

    getRowStyle(row, rowIndex) {
      const rowStyle = this.table.rowStyle;
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, {
          row,
          rowIndex
        });
      }
      return rowStyle;
    },

    getRowClass(row, rowIndex) {
      const classes = ['el-table__row'];

      if (this.stripe && rowIndex % 2 === 1) {
        classes.push('el-table__row--striped');
      }
      const rowClassName = this.table.rowClassName;
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName);
      } else if (typeof rowClassName === 'function') {
        classes.push(rowClassName.call(null, {
          row,
          rowIndex
        }));
      }

      if (this.store.states.expandRows.indexOf(row) > -1) {
        classes.push('expanded');
      }

      return classes.join(' ');
    },

    getCellStyle(rowIndex, columnIndex, row, column) {
      const cellStyle = this.table.cellStyle;
      if (typeof cellStyle === 'function') {
        return cellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      }
      return cellStyle;
    },

    getCellClass(rowIndex, columnIndex, row, column) {
      const classes = [column.id, column.align, column.className, column.isEdit];

      if (this.isColumnHidden(columnIndex)) {
        classes.push('is-hidden');
      }

      const cellClassName = this.table.cellClassName;
      if (typeof cellClassName === 'string') {
        classes.push(cellClassName);
      } else if (typeof cellClassName === 'function') {
        classes.push(cellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }

      return classes.join(' ');
    },

    handleCellMouseEnter(event, row) {
      const table = this.table;
      const cell = getCell(event);

      if (cell) {
        const column = getColumnByCell(table, cell);
        const hoverState = table.hoverState = {cell, column, row};
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
      }

      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = event.target.querySelector('.cell');

      if (hasClass(cellChild, 'sino-tooltip') && cellChild.scrollWidth > cellChild.offsetWidth && this.$refs.tooltip) {
        const tooltip = this.$refs.tooltip;

        this.tooltipContent = cell.textContent || cell.innerText;
        tooltip.referenceElm = cell;
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
        tooltip.doDestroy();
        tooltip.setExpectedState(true);
        this.activateTooltip(tooltip);
      }
    },

    handleCellMouseLeave(event) {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
      const cell = getCell(event);
      if (!cell) return;

      const oldHoverState = this.table.hoverState;
      this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
    },

    handleMouseEnter(index) {
      this.store.commit('setHoverRow', index);
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
    },

    handleContextMenu(event, row) {
      this.handleEvent(event, row, 'contextmenu');
    },

    handleDoubleClick(event, row) {
      this.handleEvent(event, row, 'dblclick');
    },

    handleClick(event, row) {
      this.store.commit('setCurrentRow', row);
      this.handleEvent(event, row, 'click');
    },

    handleEvent(event, row, name) {
      const table = this.table;
      const cell = getCell(event);
      let column;
      if (cell) {
        column = getColumnByCell(table, cell);
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table.$emit(`row-${name}`, row, event, column);
    },

    handleExpandClick(row) {
      this.store.toggleRowExpansion(row);
    }
  }
};