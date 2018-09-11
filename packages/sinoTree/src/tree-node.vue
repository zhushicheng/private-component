<template>
    <div class="tree-folder" @click.stop="handleClick" v-show="node.visible"
         :class="{
      'is-expanded': childNodeRendered && expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible
    }">
        <div class="tree-folder-header"
             :style="{ 'padding-left': '5px' }" :class="{'is-reduce': (!(node.isLeaf || node.data.isFolder === 0)) && reduceFlag}">
            <i class="fl sino-tree-folder" :class="{ 'is-leaf': (node.isLeaf || node.data.isFolder === 0), expanded: !node.isLeaf && expanded }" @click.stop="handleExpandIconClick"></i>
            <sino-checkbox
                v-if="showCheckbox"
                v-model="node.checked"
                :indeterminate="node.indeterminate"
                :disabled="!!node.disabled"
                @change.stop="handleCheckChange">
            </sino-checkbox>
            <span v-if="node.loading"
                class="fl el-tree-node__loading-icon el-icon-loading">
            </span>
            <span class="fl el-tree-node__label" :class="{'node-text-checked-style':node.checked}"><span class="fl" @click.stop="nameCtrlCheck">{{node.label}} </span><i class="iconfont sino-modify extra-i" @click.stop="extraFun(node)" v-if="extraShow && node.checked && (node.data.btnFlag === 1)"></i></span>
            <!--鼠标滑上展示-->
            <div class="sino-tree-hover" :class="isRadio?'isRadio':'isNotRadio'" v-if="showTreeHover && isRadio && node.checked">
                <i class="iconfont sino-shang" @click.stop="ascNode(node)" :class="{'is-firstIcon':node.parent&&node.parent.childNodes&&node.parent.childNodes.length > 0 && node.parent.childNodes[0]==node}" v-if="showAsc"></i>
                <i class="iconfont sino-xia" @click.stop="downNode(node)" :class="{'is-lastIcon':node.parent&&node.parent.childNodes&&node.parent.childNodes.length > 0 && node.parent.childNodes[node.parent.childNodes.length-1]==node}" v-if="showDown"></i>
                <i class="iconfont sino-wenjian1" @click.stop="lookNode(node)" v-if="showLook"></i>
                <i class="iconfont sino-add" @click.stop="addNode(node)" v-if="showAdd"></i>
                <i class="iconfont sino-modify" @click.stop="editNode(node)" v-if="showEdit"></i>
                <i class="iconfont sino-shanchu1" @click.stop="comfirmMessage(node)" v-if="showDelete && node.data.level !== 0"></i>
            </div>
            <!--鼠标滑上展示-->
            <node-content :node="node"></node-content>
        </div>
        <div
            class="tree-folder-content"
            v-show="expanded">
            <sino-tree-node
                :render-content="renderContent"
                v-for="child in node.childNodes"
                :key="getNodeKey(child)"
                :node="child"
                @node-expand="handleChildNodeExpand">
            </sino-tree-node>
        </div>
    </div>
</template>

<script type="text/jsx">
    import sinoCheckbox from '../../sinocheckbox/index';
    import emitter from '../../../src/mixins/emitter';

    export default {
        name: 'sinoTreeNode',
        componentName: 'sinoTreeNode',
        mixins: [emitter],
        props: {
            node: {
                default() {
                    return {};
                }
            },
            props: {},
            renderContent: Function,
        },
        components: {
            sinoCheckbox,
            NodeContent: {
                props: {
                    node: {
                        required: true
                    }
                },
                render(h) {
                    const parent = this.$parent;
                    const node = this.node;
                    const data = node.data;
                    const store = node.store;
                    return (parent.renderContent ? parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node, data, store }) : this.node.label )
                }
            }
        },
        data() {
            return {
                activeNodeId:'',
                isRadio:{
                    type:Boolean,
                    default:true,
                },
                tree: null,
                expanded: false,
                childNodeRendered: false,
                showCheckbox: false,
                oldChecked: null,
                oldIndeterminate: null,
                showTreeHover:{
                    type:Boolean,
                    default:true
                },
                extraShow: {
                    type:Boolean,
                    default:false
                },
                showAsc:{
                    type:Boolean,
                    default:true
                },
                showDown:{
                    type:Boolean,
                    default:true
                },
                showLook:{
                    type:Boolean,
                    default:true
                },
                showAdd:{
                    type:Boolean,
                    default:true
                },
                showEdit:{
                    type:Boolean,
                    default:true
                },
                showDelete:{
                    type:Boolean,
                    default:true
                },
                reduceFlag: {
                    type:Boolean,
                    default:false
                }
            };
        },
        watch: {
            'node.indeterminate'(val) {
                this.handleSelectChange(this.node.checked, val);
            },
            'node.checked'(val) {
                this.handleSelectChange(val, this.node.indeterminate);
            },
            'node.expanded'(val) {
                this.expanded = val;
                if (val) {
                    this.childNodeRendered = true;
                }
            }
        },
        methods: {
            extraFun (node) {
                this.tree.$emit('extra',node)
            },
            getNodeKey(node, index) {
                const nodeKey = this.tree.nodeKey;
                if (nodeKey && node) {
                    return node.data[nodeKey];
                }
                return index;
            },
            //升序
            ascNode(model){
//                if(this.$parent.node){
//                    let m;
//                    let upArray;
//                    this.$parent.node.data.children.forEach((item, index) => {
//                        if (item.id === model.data.id) {
//                            m = index;
//                            return;
//                        }
//                    })
//                    if(m>0){
//                        upArray = this.$parent.node.data.children[m-1];
//                        this.$parent.node.data.children[m-1] = this.$parent.node.data.children[m]
//                        this.$parent.node.data.children[m] = upArray;
//                    }
//                }else {
//                    let m1;
//                    let upArray1;
//                    this.$parent.children.forEach(function (item, index) {
//                        if (item.id === model.data.id) {
//                            m1 = index;
//                            return;
//                        }
//                    })
//                    if (m1 > 0) {
//                        upArray1 = this.$parent.children[m1 - 1];
//                        this.$parent.children[m1 - 1] = this.$parent.children[m1]
//                        this.$parent.children[m1] = upArray1;
//                    }
//                }
                this.tree.$emit('ascNode',this.tree.children,model.data,'up')
            },
            //降序
            downNode(model){
//                if(this.$parent.node) {
//                    let n;
//                    let downArray;
//                    this.$parent.node.data.children.forEach((item, index) => {
//                        if (item.id === model.data.id) {
//                            n = index;
//                            return;
//                        }
//                    })
//                    if (n < this.$parent.node.data.children.length - 1) {
//                        downArray = this.$parent.node.data.children[n + 1];
//                        this.$parent.node.data.children[n + 1] = this.$parent.node.data.children[n]
//                        this.$parent.node.data.children[n] = downArray;
//                    }
//                }else{
//                    let n1;
//                    let downArray1;
//                    this.$parent.children.forEach((item, index) => {
//                        if (item.id === model.data.id) {
//                            n1 = index;
//                            return;
//                        }
//                    });
//                    if (n1 < this.$parent.children.length - 1) {
//                        downArray1 = this.$parent.children[n1 + 1];
//                        this.$parent.children[n1 + 1] = this.$parent.children[n1];
//                        this.$parent.children[n1] = downArray1;
//                    }
//                }
                this.tree.$emit('ascNode',this.tree.children,model.data,'down')
            },
            //查看
            lookNode(model){
                this.tree.$emit('ascNode',this.tree.children,model.data,'look')
            },
            addNode(model){
                //console.log()
                this.tree.$emit('ascNode',this.tree.children,model.data,'add')
            },
            editNode(model){
                this.tree.$emit('ascNode',this.tree.children,model.data,'edit')
            },
            comfirmMessage(model){
                this.tree.$emit('ascNode',this.tree.children,model.data,'delete');
            },
            handleSelectChange(checked, indeterminate) {
                if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
                    this.tree.$emit('check-change', this.node.data, checked, indeterminate);
                }
                this.oldChecked = checked;
                this.indeterminate = indeterminate;
            },
            handleClick() {
                const store = this.tree.store;
                store.setCurrentNode(this.node);
                this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
                this.tree.currentNode = this;
                if (this.tree.expandOnClickNode) {
                    this.handleExpandIconClick();
                }
                this.tree.$emit('node-click', this.node.data, this.node, this);
            },
            handleExpandIconClick() {
                if (this.node.isLeaf) return;
                if (this.expanded) {
                    this.tree.$emit('node-collapse', this.node.data, this.node, this);
                    this.node.collapse();
                } else {
                    this.node.expand();
                    this.$emit('node-expand', this.node.data, this.node, this);
                }
            },
            handleCheckChange(ev) {
                this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
            },
            nameCtrlCheck(ev){
                ev.target.checked = !ev.target.checked;
                this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
            },
            handleChildNodeExpand(nodeData, node, instance) {
                this.broadcast('sinoTreeNode', 'sinoTree-node-expand', node);
                this.tree.$emit('node-expand', nodeData, node, instance);
            }
        },
        created() {
            const parent = this.$parent;
            if (parent.isTree) {
                this.tree = parent;
            } else {
                this.tree = parent.tree;
            }

            const tree = this.tree;
            if (!tree) {
                console.warn('Can not find node\'s sinoTree.');
            }

            const props = tree.props || {};
            const childrenKey = props['children'] || 'children';

            this.$watch(`node.data.${childrenKey}`, () => {
                this.node.updateChildren();
            });
            this.isRadio = tree.isRadio;
            this.showCheckbox = tree.showCheckbox;
            this.showTreeHover = tree.showTreeHover;
            this.extraShow = tree.extraShow;
            this.showAsc = tree.showAsc;
            this.showDown = tree.showDown;
            this.showLook = tree.showLook;
            this.showAdd = tree.showAdd;
            this.showEdit = tree.showEdit;
            this.showDelete = tree.showDelete;
            this.reduceFlag = tree.reduceFlag;

            if (this.node.expanded) {
                this.expanded = true;
                this.childNodeRendered = true;
            }

            if(this.tree.accordion) {
                this.$on('sinoTree-node-expand', node => {
                    if(this.node !== node) {
                        this.node.collapse();
                    }
                });
            }
        }
    };
</script>