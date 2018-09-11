/**
 * Created by wangjijun on 2017/8/15 0015.
 */
import sinoOption from '../sinoselect/src/sinooption.vue';

/* istanbul ignore next */
sinoOption.install = function(Vue) {
  Vue.component(sinoOption.name, sinoOption);
};

export default sinoOption;
