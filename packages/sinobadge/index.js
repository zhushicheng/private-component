/**
 * Created by GuoXiangLian on 2017/8/1.
 * 标记组件<sino-badge></sino-badge>
 * isDot 是否显示小圆点
 * :value='' 显示未读消息数量
 * :max='99'  可设置最大显示数量，超出去最大显示数量：99+
 * hidden  是否显示badge,默认为false
 */
import sinoBadge from './src/index.vue'

/* istanbul ignore next */
sinoBadge.install = function (Vue) {
  Vue.component(sinoBadge.name, sinoBadge)
}

export default sinoBadge

