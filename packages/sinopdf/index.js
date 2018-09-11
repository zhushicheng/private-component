import sinoPdf from './src/index.vue'

/* istanbul ignore next */
sinoPdf.install = function (Vue) {
    Vue.component(sinoPdf.name, sinoPdf)
}

export default sinoPdf
