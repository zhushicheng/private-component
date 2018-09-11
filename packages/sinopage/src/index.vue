<template>
  <div v-if="total !== null && total !== 0 && total !== undefined">
    <div class="page-bar" :class="{'isSmallpage':isSmallpage}" v-if="isPage">
      <ul class="pageul">
        <li v-bind:key="index" v-for="(item,index) in pageList" v-bind:class ="item.class" @click.stop="setPage(item)" v-html="item.html" >
        </li>
      </ul>
      <span class="total" id="total" v-if="isTotal">共<span class="total_a">{{total}}</span>条</span>
      <div class="select" @change="choosePage(pages)" v-if="isSelect">
        <span class="sel-font">每页</span>
        <div class="sel-dotted">
          <div class="sel-border" >
            <select class="sel-page" v-model="pages" @change="choosePage(pages)">
              <option v-for="num in pageArray" :value="num" class="option" :selected="num == pages">{{num}}</option>
            </select>
          </div>
          <span class="san">
          <i class='iconfont sino-unie628'></i>
        </span>
        </div>
        <span class="sel-right">条</span>
      </div>
      <div class="sino--page-jumper" v-if="isjumper">
        <span class="sino-jumper">至</span>
        <input class="sino-pagination__editor" type="text" v-model="bigpage" />
        <span class="sino-jumper-page">页</span>
        <button class="sino-page-bar-button" @click="setPage({class: '',page:parseInt(bigpage) , html:parseInt(bigpage)})" :disabled="!bigpage">确定</button>
      </div>
    </div>
    <div v-else="selectPage" class="selectPage">
      <div class="sino-page-small">
        <div v-if="nowPage>1"><a class="banclickl" @click="setPage({class: '', page:--nowPage , html:nowPage})">上页</a></div>
        <div v-if="nowPage==1"><a class="banclickl">上页</a></div>
        <div class="sino-page-total">{{nowPage}}/{{total}}<span class="sino-page-span">页</span></div>
        <div v-if="nowPage!=total"><a class="banclickr" v-on:click="setPage({class: '', page:++nowPage , html:nowPage})">下页</a></div>
        <div v-if="nowPage == total"><a class="banclickr">下页</a></div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sinoPage',
    props: {
      prevHtml: String,
      nextHtml: String,
      page: Number,
      pageSize: Number,
      pageArray: Array,
      object: Object,
      total: Number
    },
    data: function () {
      return {
        nowPage:this.page,
        pages: this.pageSize,
        bigpage: this.bigpage,
        prepageNum:this.prepageNum,
        isPage:this.object.isPage,
        isSelectPage:this.object.isSelectPage,
        maxPage: this.object.maxPage,
        isTotal: this.object.isTotal,
        isSelect: this.object.isSelect,
        isjumper: this.object.isjumper,
        selectPage:this.object.selectPage,
        isSmallpage:this.object.isSmallpage
      }
    },
    computed: {
      pageList: function () {
        var _this = this, pageList = [];
        let pageCount = Math.ceil(_this.total / _this.pageSize);  //显示多少页
        let page = _this.page;                     //当前页
        let prevHtml = _this.prevHtml ? _this.prevHtml : _this.isSmallpage ? "<i class='iconfont sino-zuoyoujiantouicon-defuben1'></i>" : "<i class='iconfont sino-zuo' ></i>";//上一页
        let nextHtml = _this.nextHtml ? _this.nextHtml : _this.isSmallpage ? "<i v-show class='iconfont sino-zuoyoujiantouicon-defuben'></i>" : "<i class='iconfont sino-you1 ' ></i>";//下一页
        let maxPage = _this.maxPage ? _this.maxPage : 9;

        let hasPrev = page > 1;
        let hasNext = page < pageCount;

        //上一页
        pageList.push({
          class: hasPrev ? '' : 'disabled',
          page: hasPrev ? page - 1 : page,
          html: prevHtml
        });

        //首页
        pageList.push({
          class: page == 1 ? 'active' : '',
          page: 1,
          html: 1
        });

        var p0 = Math.floor(maxPage / 2);
        var p1 = 1 + 2 + p0;    //首页+省略至少2个页码+中间页面数的一半
        var start, end;

        if (page >= p1) {
          start = page - p0;
          if (start > pageCount) {
            start = pageCount - 2;
          }

          //前置省略号
          pageList.push({
            class: 'predot',
            page: page,
            html: '...',
          });
        } else {
          start = 2;
        }
        var p2 = page + p0;
        if (p2 < pageCount) {
          end = p2;
        } else {
          end = pageCount - 1;
        }

        //页码列表
        for (let i = start; i <= end; i++) {
          pageList.push({
            class: page == i ? 'active' : '',
            page: i,
            html: i
          });
        }


        if (end < pageCount - 1) {
          //后置省略号
          pageList.push({
            class: 'nextdot',
            page: page,
            html: '...',
          });
        }


        //尾页
        if (pageCount > 1) {
          if (pageCount < page) {
            pageList.push({
              class: 'active',
              page: pageCount,
              html: pageCount
            });
          } else {
            pageList.push({
              class: page == pageCount ? 'active' : '',
              page: pageCount,
              html: pageCount
            });
          }
        }

        //下一页
        pageList.push({
          class: hasNext ? '' : 'disabled',
          page: hasNext ? page + 1 : page,
          html: nextHtml
        });
        return pageList;
      }
    },
    methods: {
      setPage: function (item) {
        var currentPage;
        for (var i = 0; i < this.pageList.length; i++) {
          if (this.pageList[i].class === "active") {
            currentPage = this.pageList[i].page
          }
        }
        var _this = this
        if (item.class == '') {
          this.$emit('pagehandler', item.page);
        } else if (item.class == 'predot') {
          if (currentPage - 5 < 1) {
            item.page = 1;
          } else {
            item.page = currentPage - 5;
          }
          this.$emit('pagehandler', item.page);
        } else if (item.class == 'nextdot') {
          item.page = currentPage + 5;
          this.$emit('pagehandler', item.page);
        }
      },
      choosePage: function (pageNum) {
        this.$emit('choosePageFun', pageNum);
      }
    }
  }
</script>

