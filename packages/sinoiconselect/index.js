/**
 * Created by wangjijun on 2017/8/1 0001.
 * 标签为<sino-select></sino-select>
 * selectItems:传递给组件的数据，类型为数组
 * tipText：提示信息
 * showFilter：Boolean类型，是否开启模糊查询
 * receive：为选择以后父级调用的方法，用于取到选择值
 * isMultiselect：Boolean 是否为多选
 * totalNum:为显示选择条数还是标题，配合isMultiselect使用
 */
import sinoIconSelect from './src/sinoiconselect.vue';

/* istanbul ignore next */
sinoIconSelect.install = function(Vue) {
  Vue.component(sinoIconSelect.name, sinoIconSelect);
};

export default sinoIconSelect;
