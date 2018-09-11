/**
 * Created by GuoXiangLian on 2017/7/26.
 * sinoCheckbox：<sino-checkbox></sino-checkbox>
 * v-model   绑定值
 * label  Radio 的 value
 * disable  是否是禁用，如果禁用，该按钮消失
 * name    原生name值
 */
import sinoCheckbox from './src/index.vue'

/* istanbul ignore next */
sinoCheckbox.install = function (Vue) {
  Vue.component(sinoCheckbox.name, sinoCheckbox)
}

export default sinoCheckbox

