/**
 * Created by GuoXiangLian on 2017/7/26.
 * sinoButton：<sino-button></sino-button>
 * type 类型：默认为空，primary(主按钮),text(文字按钮),icon-text(带icon的文字按钮),success(成功),error(失败),warning(警告),danger(危险)
 * icon 显示icon="icon-duigou"，默认不显示icon
 * disabled 只读
 * loading  是否在加载中
 */
import sinoButton from './src/index.vue'

/* istanbul ignore next */
sinoButton.install = function (Vue) {
  Vue.component(sinoButton.name, sinoButton)
}

export default sinoButton

