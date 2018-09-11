/**
 * Created by wangjijun on 2017/7/29 0029.
 */
import sinoSteps from './src/steps.vue';

/* istanbul ignore next */
sinoSteps.install = function(Vue) {
  Vue.component(sinoSteps.name, sinoSteps);
};

export default sinoSteps;
