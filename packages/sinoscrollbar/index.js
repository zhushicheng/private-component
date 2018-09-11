import sinoScrollbar from './src/main';

/* istanbul ignore next */
sinoScrollbar.install = function(Vue) {
  Vue.component(sinoScrollbar.name, sinoScrollbar);
};

export default sinoScrollbar;
