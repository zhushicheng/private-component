/**
 * Created by wangjijun on 2017/7/29 0029.
 */
import sinoStep from '../sinosteps/src/step.vue';

/* istanbul ignore next */
sinoStep.install = function(Vue) {
  Vue.component(sinoStep.name, sinoStep);
};

export default sinoStep;
