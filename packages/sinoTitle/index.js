/**
 * Created by GuoXiangLian on 2017/8/1.
 * 标题组件：<sino-title></sino-title>
 * type   标题的类型：levelOne(一级标题)  levelTwo(二级标题)
 * title  标题的文字
 */
import sinoTitle from './src/title.vue'

/* istanbul ignore next */
sinoTitle.install = function(Vue) {
  Vue.component(sinoTitle.name, sinoTitle)
}

export default sinoTitle

