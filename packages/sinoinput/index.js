/**
 * Created by wangjijun on 2017/7/27 0027.
 * <sino-input></sino-input>
 * icon触发事件=> :on-icon-click,后面跟方法名，然后在methods写事件函数
 * 输入框禁用=> ：disabled
 * icon属性内容为图标样式，分别为 error=>错误提示 tanhao=>清除样式
 * placeholder 为提示内容
 * 边框错误提示为warn
 */
import sinoInput from './src/index.vue';

/* istanbul ignore next */
sinoInput.install = function(Vue) {
  Vue.component(sinoInput.name, sinoInput);
};

export default sinoInput;
