/**
 * Created by wangjijun on 2017/8/4.
 * <sino-time-picker></sino-time-picker>
 * v-model   绑定值
 * disable  是否是禁用 Boolean值
 * format   日期格式
 * Picker Options  当前日期选择器特有的选项参考表
 * editable 是否可输入
 * readonly 是否为只读
 * 详细可参考element-ui 用法
 */
import sinoTimePicker from '../sinodatepicker/src/picker/time-picker';

/* istanbul ignore next */
sinoTimePicker.install = function(Vue) {
  Vue.component(sinoTimePicker.name, sinoTimePicker);
};

export default sinoTimePicker;
