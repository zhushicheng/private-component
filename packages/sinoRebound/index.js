/**
 * Created by zhuqianqian on 2017/8/30.
 */
import sinoRebound from './src/index.vue'

/* istanbul ignore next */
sinoRebound.install = function (Vue) {
  Vue.component(sinoRebound.name, sinoRebound)
};

export default sinoRebound

