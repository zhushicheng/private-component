var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json');
// var saladConfig = require('../packages/theme-default/salad.config.json');

var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`sinoUI/packages/${key}`] = `sinoUI/lib/${key}`;
});

externals['sinoUI/src/locale'] = 'sinoUI/lib/locale';
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`sinoUI/src/utils/${file}`] = `sinoUI/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`sinoUI/src/mixins/${file}`] = `sinoUI/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`sinoUI/src/transitions/${file}`] = `sinoUI/lib/transitions/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  'sinoUI': path.resolve(__dirname, '../')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date.\js/;

// exports.postcss = function(webapck) {
//   saladConfig.features.partialImport = {
//     addDependencyTo: webapck
//   };
//   return [
//     require('postcss-salad')(saladConfig)
//   ];
// };
