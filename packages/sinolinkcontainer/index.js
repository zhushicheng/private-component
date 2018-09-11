/**
 * Created by wangjijun on 2017/9/6 0006.
 */
import sinoLinkContainer from './src/index.vue';

/* istanbul ignore next */
sinoLinkContainer.install = function (Vue) {
  Vue.component(sinoLinkContainer.name, sinoLinkContainer);
};

export default sinoLinkContainer;
