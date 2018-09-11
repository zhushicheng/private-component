/**
 * Created by wangjijun on 2017/7/27 0027.
 * sinoMenu:<sino-menu></sino-menu>
 * items:后台获取的数据源，格式为数组
 */
import sinoMenu from './src/index.vue'

/* istanbul ignore next */
sinoMenu.install = function (Vue) {
  Vue.component(sinoMenu.name, sinoMenu)
}
export default sinoMenu
