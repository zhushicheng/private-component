<template>
  <div
          class="sino-select-dropdown"
          :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
          :style="{ minWidth: minWidth, height: height}">
    <slot></slot><!-- sino-popper-->
  </div>
</template>

<script type="text/babel">
    import Popper from 'sinoUI/src/utils/vue-popper';

    export default {
        name: 'sinoSelectDropdown',

        componentName: 'sinoSelectDropdown',

        mixins: [Popper],

        props: {
            placement: {
                default: 'bottom-start'
            },

            boundariesPadding: {
                default: 0
            },

            popperOptions: {
                default() {
                    return {
                        gpuAcceleration: false
                    };
                }
            },

            visibleArrow: {
                default: true
            },

            appendToBody: {
                type: Boolean,
                default: true
            }
        },

        data() {
            return {
                minWidth: '',
                height: ''
            };
        },

        computed: {
            popperClass() {
                return this.$parent.popperClass;
            }
        },

        watch: {
            '$parent.inputWidth': function() {
                this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
            }
        },

        mounted() {
            this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
            this.referenceElm = this.$parent.$refs.reference;
            this.$parent.popperElm = this.popperElm = this.$el;
            this.$on('updatePopper', () => {
                if (this.$parent.visible) this.updatePopper();
            });
            this.$on('destroyPopper', this.destroyPopper);
        }
    };
</script>
