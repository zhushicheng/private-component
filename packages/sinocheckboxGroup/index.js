/**
 * Created by GuoXiangLian on 2017/7/26.
 * sinoCheckboxGroup：<sino-checkbox-group></sino-checkbox-group>
 * v-model   绑定值
 * label  Radio 的 value
 * disable  是否是禁用，如果禁用，该按钮消失
 * name    原生name值
 */
import sinoCheckboxGroup from '../sinocheckbox/src/checkboxGroup.vue'

/* istanbul ignore next */
sinoCheckboxGroup.install = function (Vue) {
    Vue.component(sinoCheckboxGroup.name, sinoCheckboxGroup)
}

export default sinoCheckboxGroup

