/**
 * Created by GuoXiangLian on 2017/7/26.
 * sinoSlert：<sino-alert title="标题" type=""></sino-alert>
 * title   弹层标题
 * description 弹层描述
 * type  类型：success(成功)  error(失败)   warning(警告)  busyservice(服务器繁忙)
 * showIcon 图标是否显示
 * closable 是否可关闭
 * closeText  按钮的文本文字
 * isBoldTitle  标题是否加粗
 * dragFlag   是否可拖拽
 */
import sinoAlert from './src/index.vue'

/* istanbul ignore next */
sinoAlert.install = function (Vue) {
  Vue.component(sinoAlert.name, sinoAlert)
}

export default sinoAlert

