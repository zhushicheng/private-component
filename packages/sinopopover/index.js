/**
 * Created by wangjijun on 2017/8/10 0010.
 */
import sinoPopover from './src/index.vue';
import directive from './src/directive';
import Vue from 'vue';

Vue.directive('popover', directive);

/* istanbul ignore next */
sinoPopover.install = function(Vue) {
  Vue.directive('popover', directive);
  Vue.component(sinoPopover.name, sinoPopover);
};
sinoPopover.directive = directive;

export default sinoPopover;
