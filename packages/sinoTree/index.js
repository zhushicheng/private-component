/*
 Created by GuoXiangLian on 2017/8/3.
* accordion  手风琴
* show-checkbox 是否显示复选框
* node-key="id"  通过ID来控制展开还是选中
* :default-expanded-keys="[2, 3]"    默认展开
* :default-checked-keys="[9]"    默认选中
* :filter-node-method="filterNode" 节点过滤
* ref="tree"   指定在哪里过滤节点
* 节点过滤对应的方法
* watch:{
     filterText(val) {
     this.$refs.tree.filter(val);
     }
 },
 methods:{
     filterNode(value, data) {
     if (!value) return true;
     return data.label.indexOf(value) !== -1;
     },
 }

*
* */
import sinoTree from './src/tree.vue';

/* istanbul ignore next */
sinoTree.install = function(Vue) {
  Vue.component(sinoTree.name, sinoTree);
};

export default sinoTree;
