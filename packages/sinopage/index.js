/**
 * isSmallpage:false,样式 值为true显示方的  为false显示圆的
 isTotal:true, 总页数 值为true显示 为false不显示
 isSelect:true, 下拉框 值为true显示 为false不显示
 isjumper:true  跳转 值为true显示 为false不显示
 *
 *  <sino-page v-bind:page="page" v-bind:page-size="pageSize" v-on:pagehandler="pageHandler"
 :pageArray="pageArray" v-on:choosePageFun="choooseNum" v-bind:object="object"
 :total="total"></sino-page>

 * export default {
    components: {SinoPage},
    data() {
      return {
        object:{
          maxPage:2,
          isSmallpage:false,
          isTotal:true,
          isSelect:true,
          isjumper:true
        },

        object1:{
          maxPage:2,
          isSmallpage:true,
          isTotal:false,
          isSelect:false,
          isjumper:false
        },

        object2:{
          maxPage:2,
          issmallPage:true,
          isTotal:true,
          isSelect:false,
          isjumper:false
        },

        object3:{
          maxPage:2,
          issmallPage:true,
          isTotal:false,
          isSelect:false,
          isjumper:false
        },
        page: 1,
        total:1000,
        pageSize: 10,
        pageArray:[10,20,30,40]
      }
    },
    methods:{
      pageHandler:function(page){
        this.page = page;
      },
      choooseNum:function(pageSize){
        this.pageSize = pageSize;
      }
    }

  }
 */

import sinoPage from './src/index.vue';

/* istanbul ignore next */
sinoPage.install = function(Vue) {
  Vue.component(sinoPage.name, sinoPage);
};
export default sinoPage;

