<template>
    <div class="sino-checkbox-group">
        <slot></slot>
    </div>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter';
    export default {
        name: 'sinoCheckboxGroup',
        componentName: 'sinoCheckboxGroup',

        mixins: [Emitter],
        props: {
            value: {},
            min: Number,
            max: Number,
            size: String,
            fill: String,
            textColor: String
        },
        watch: {
            value(value) {
                this.dispatch('SinoFormItem', 'sino.form.change', [value]);
            }
        }
    };
</script>
