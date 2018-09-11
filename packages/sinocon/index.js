/**
 * Created by GuoXiangLian on 2017/9/25.
 * sinoCon：<sino-con></sino-con>
 */
import sinoCon from './src/index.vue'

/* istanbul ignore next */
sinoCon.install = function (Vue) {
  Vue.component(sinoCon.name, sinoCon)
}

export default sinoCon

