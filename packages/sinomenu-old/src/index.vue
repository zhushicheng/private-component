<template>
  <div class="menu" id="layout">
    <ul class="first_menu">
      <li v-for="item in menuItems" @click="firstLiClick(item)" :class="firstActiveLiId === item.id ? 'first_li_active':''">
        <i class="iconfont" :class="item['left-icon']"></i>
        <span>{{item.title}}</span>
        <i class="iconfont iconTip" :class="item.id ===2 ? 'iconSet icon-shezhi' : 'icon-iconjia iconTip'" v-if="item.haveChild"></i>
        <transition name="second_menu">
          <ul class="second_menu" v-if="item.haveChild" v-show="secondShowId===item.id">
            <li v-for="secItem in item.childList" @click="secondLiClick(secItem)" :class="secondActiveLiId === secItem.id ? 'second_li_active':''">
              <i></i>
              <span>{{secItem.title}}</span>
              <i class="triangle" v-if="secItem.haveChild"></i>
              <transition name="third_menu">
                <ul class="third_menu" v-if="secItem.haveChild" v-show="thirdShowId === secItem.id">
                  <li v-for="thirItem in secItem.childList" @click="thirdLiClick(thirItem)" :class="thirdActiveLiId === thirItem.id ? 'third_li_active':''">
                    <span>{{thirItem.title}}</span>
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>
<script type="text/babel">
  export default {
    name: 'sinoMenu',
    props: {
      items: {
        default: ''
      }
    },
    data () {
      return {
        menuItems: this.items,
        firstActiveLiId: '1',
        secondActiveLiId: '',
        thirdActiveLiId: '',
        secondShowId: '',
        thirdShowId: '',
        menuMinHeight: ''
      }
    },
    watch: {
      items (val) {
        this.menuItems = val
      }
    },
    methods: {
      firstLiClick (item) {
        this.firstActiveLiId = item.id
        this.secondShowId = item.id
      },
      secondLiClick (item) {
        this.secondActiveLiId = item.id
        this.thirdShowId = item.id
      },
      thirdLiClick (item) {
        this.thirdActiveLiId = item.id
      }
    }
  }
</script>
