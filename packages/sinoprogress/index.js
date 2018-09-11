/**
 * Created by wangjijun on 2017/8/9 0009.
 * <sino-progress></progress>
 * type:line/circle =>进度条为线条还是圆形
 * percentage 百分比
 * stroke-width：进度条的宽度，线条默认宽度为20px ,环形为10px;
 * text-inside：对line类型有效，进度值在进度条内部 Boolean
 * status:进度条状态	success/exception 用户成功/失败切换样式
 * width：环形进度条容器宽度
 * show-text:是否显示进度条文字内容
 */
import sinoProgress from './src/index.vue';

/* istanbul ignore next */
sinoProgress.install = function(Vue) {
  Vue.component(sinoProgress.name, sinoProgress);
};

export default sinoProgress;

