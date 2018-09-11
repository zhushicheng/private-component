/**
 * Created by GuoXiangLian on 2017/7/26.
 * sinoRadio：<sino-radio></sino-radio>
 * v-model   绑定值
 * label  Radio 的 value
 * disable  是否是禁用，如果禁用，该按钮消失
 * name    原生name值
 */
import sinoRadio from './src/index.vue'

/* istanbul ignore next */
sinoRadio.install = function (Vue) {
  Vue.component(sinoRadio.name, sinoRadio)
}

export default sinoRadio

