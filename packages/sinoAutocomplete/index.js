import sinoAutocomplete from './src/autocomplete.vue';

/* istanbul ignore next */
sinoAutocomplete.install = function(Vue) {
  Vue.component(sinoAutocomplete.name, sinoAutocomplete);
};

export default sinoAutocomplete;
