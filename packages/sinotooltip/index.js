import sinoTooltip from './src/main';

/* istanbul ignore next */
sinoTooltip.install = function(Vue) {
  Vue.component(sinoTooltip.name, sinoTooltip);
};

export default sinoTooltip;
