/**
 * Created by wangjijun on 2017/8/4.
 * <sino-time-select></sino-time-select>
 * v-model   绑定值
 * disable  是否是禁用 Boolean值
 * format   日期格式
 * Picker Options  当前日期选择器特有的选项参考表
 * editable 是否可输入
 * readonly 是否为只读
 * 详细可参考element-ui 用法
 */

import sinoTimeSelect from '../sinodatepicker/src/picker/time-select';

/* istanbul ignore next */
sinoTimeSelect.install = function(Vue) {
  Vue.component(sinoTimeSelect.name, sinoTimeSelect);
};

export default sinoTimeSelect;
