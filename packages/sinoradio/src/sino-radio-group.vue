<template>
    <div class="sino-radio-group">
        <slot></slot>
    </div>
</template>
<script>
    import Emitter from 'sinoUI/src/mixins/emitter';

    export default {
        name: 'SinoRadioGroup',

        componentName: 'SinoRadioGroup',

        mixins: [Emitter],

        props: {
            value: {},
            size: String,
            fill: String,
            textColor: String,
            disabled: Boolean
        },
        watch: {
            value(value) {
                this.$emit('change', value);
                this.dispatch('SinoFormItem', 'sino.form.change', [this.value]);
            }
        }
    };
</script>

