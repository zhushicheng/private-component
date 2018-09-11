<template>
    <span>
        <ul v-if="data && data.length" :class="[prefixCls + '-menu']">
            <sino-casitem
                v-for="item in data"
                :key="getKey()"
                :prefix-cls="prefixCls"
                :data="item"
                :tmp-item="tmpItem"
                @click.native.stop="handleClickItem(item)"
                @mouseenter.native.stop="handleHoverItem(item)"></sino-casitem>
        </ul><sino-caspanel v-if="sublist && sublist.length" :prefix-cls="prefixCls" :data="sublist" :disabled="disabled" :trigger="trigger" :change-on-select="changeOnSelect"></sino-caspanel>
    </span>
</template>
<script>
    import sinoCasitem from './casitem.vue';
    import Emitter from './emitter';
    import { findComponentUpward, findComponentDownward } from './assist';

    let key = 1;

    export default {
        name: 'sinoCaspanel',
        mixins: [ Emitter ],
        components: { sinoCasitem },
        props: {
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            disabled: Boolean,
            changeOnSelect: Boolean,
            trigger: String,
            prefixCls: String
        },
        data () {
            return {
                tmpItem: {},
                result: [],
                sublist: []
            };
        },
        watch: {
            data () {
                this.sublist = [];
            }
        },
        methods: {
            handleClickItem (item) {
                if (this.trigger !== 'click' && item.children && item.children.length) return;  // #1922
                this.handleTriggerItem(item, false, true);
            },
            handleHoverItem (item) {
                if (this.trigger !== 'hover' || !item.children || !item.children.length) return;  // #1922
                this.handleTriggerItem(item, false, true);
            },
            handleTriggerItem (item, fromInit = false, fromUser = false) {
                if (item.disabled) return;

                if (item.loading !== undefined && !item.children.length) {
                    const sinoCascader = findComponentUpward(this, 'sinoCascader');
                    if (sinoCascader && sinoCascader.loadData) {
                      sinoCascader.loadData(item, () => {
                            // todo
                            if (fromUser) {
                              sinoCascader.isLoadedChildren = true;
                            }
                            if (item.children.length) {
                                this.handleTriggerItem(item);
                            }
                        });
                        return;
                    }
                }

                // return value back recursion  // 向上递归，设置临时选中值（并非真实选中）
                const backItem = this.getBaseItem(item);
                this.tmpItem = backItem;
                this.emitUpdate([backItem]);
                if (item.children && item.children.length){
                    this.sublist = item.children;
                    this.dispatch('sinoCascader', 'on-result-change', {
                        lastValue: false,
                        changeOnSelect: this.changeOnSelect,
                        fromInit: fromInit
                    });

                    // #1553
                    if (this.changeOnSelect) {
                        const sinoCaspanel = findComponentDownward(this, 'sinoCaspanel');
                        if (sinoCaspanel) {
                          sinoCaspanel.$emit('on-clear', true);
                        }
                    }
                } else {
                    this.sublist = [];
                    this.dispatch('sinoCascader', 'on-result-change', {
                        lastValue: true,
                        changeOnSelect: this.changeOnSelect,
                        fromInit: fromInit
                    });
                }
            },
            updateResult (item) {
                this.result = [this.tmpItem].concat(item);
                this.emitUpdate(this.result);
            },
            getBaseItem (item) {
                let backItem = Object.assign({}, item);
                if (backItem.children) {
                    delete backItem.children;
                }

                return backItem;
            },
            emitUpdate (result) {
                if (this.$parent.$options.name === 'sinoCaspanel') {
                    this.$parent.updateResult(result);
                } else {
                    this.$parent.$parent.updateResult(result);
                }
            },
            getKey () {
                return key++;
            }
        },
        mounted () {
            this.$on('on-find-selected', (params) => {
                const val = params.value;
                let value = [...val];
                if (value && value.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        for (let j = 0; j < this.data.length; j++) {
                            if (value[i] === this.data[j].value) {
                                this.handleTriggerItem(this.data[j], true);
                                value.splice(0, 1);
                                this.$nextTick(() => {
                                    this.broadcast('sinoCaspanel', 'on-find-selected', {
                                        value: value
                                    });
                                });
                                return false;
                            }
                        }
                    }
                }
            });
            // deep for #1553
            this.$on('on-clear', (deep = false) => {
                this.sublist = [];
                this.tmpItem = {};
                if (deep) {
                    const sinoCaspanel = findComponentDownward(this, 'sinoCaspanel');
                    if (sinoCaspanel) {
                      sinoCaspanel.$emit('on-clear', true);
                    }
                }
            });
        }
    };
</script>
