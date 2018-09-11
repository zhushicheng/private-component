/**
 * Created by GuoXiangLian on 2017/7/26.
 * sinoRadio：<sino-radio></sino-radio>
 * v-model   绑定值
 * label  Radio 的 value
 * disable  是否是禁用，如果禁用，该按钮消失
 * name    原生name值
 */
import sinoRadioGroup from '../sinoradio/src/sino-radio-group.vue'

/* istanbul ignore next */
sinoRadioGroup.install = function (Vue) {
    Vue.component(sinoRadioGroup.name, sinoRadioGroup)
}

export default sinoRadioGroup

