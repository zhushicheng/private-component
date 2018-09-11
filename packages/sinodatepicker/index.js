/**
 * Created by wangjijun on 2017/8/4.
 * <sino-date-picker></sino-date-picker>
 * v-model   绑定值
 * disable  是否是禁用 Boolean值
 * format   日期格式
 * Picker Options  当前日期选择器特有的选项参考表
 * editable 是否可输入
 * readonly 是否为只读
 * 详细可参考element-ui 用法
 */


import sinoDatePicker from './src/picker/date-picker';

/* istanbul ignore next */
sinoDatePicker.install = function install(Vue) {
  Vue.component(sinoDatePicker.name, sinoDatePicker);
};

export default sinoDatePicker;
