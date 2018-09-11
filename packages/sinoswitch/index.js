/*
*<sino-switch v-model="value1" on-color="#ffc333" off-color="#999999"></sino-switch>
*<sino-switch v-model="value2" disabled></sino-switch>
*
*data(){
      return{
        value1: true
      }
    }
*
* */

import sinoSwitch from './src/index.vue';

/* istanbul ignore next */
sinoSwitch.install = function(Vue) {
  Vue.component(sinoSwitch.name, sinoSwitch);
};

export default sinoSwitch;
