/*
 Created by GuoXiangLian on 2017/8/9.
* dropdown 下拉菜单
* <sino-dropdown></sino-dropdown>
*  trigger="click"  点击显示，默认鼠标滑上显示
*  disabled   禁用
*  split-button  文字与按钮分离
* */
import sinoDropdown from './src/sinodropdown.vue';

/* istanbul ignore next */
sinoDropdown.install = function(Vue) {
  Vue.component(sinoDropdown.name, sinoDropdown);
};

export default sinoDropdown;
