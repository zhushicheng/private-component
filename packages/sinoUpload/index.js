import sinoUpload from './src/index.vue';

/* istanbul ignore next */
sinoUpload.install = function(Vue) {
  Vue.component(sinoUpload.name, sinoUpload);
};

export default sinoUpload;
