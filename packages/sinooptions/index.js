/**
 * Created by Administrator on 2017/8/15 0015.
 */
import sinoOptions from '../sinoselect/src/sinooptions.vue';

/* istanbul ignore next */
sinoOptions.install = function(Vue) {
  Vue.component(sinoOptions.name, sinoOptions);
};

export default sinoOptions;

