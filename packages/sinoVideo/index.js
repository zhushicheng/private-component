import sinoVideo from './src/video.vue';

/* istanbul ignore next */
sinoVideo.install = function(Vue) {
  Vue.component(sinoVideo.name, sinoVideo);
};

export default sinoVideo;
