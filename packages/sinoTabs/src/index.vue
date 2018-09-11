<template>
  <ul class="tabs-ul">
    <li class="tabs-li"  @click="toggle(index ,tab.view)" v-for="(tab,index) in tabs" :class="{active:active===index}">   {{tab.type}} </li>
  </ul>
  <div class="tabs-div">
    <component :is="currentView"></component>
  </div>
 <!-- <div class="tabItems">
    <div class="Tab_tittle_wrap" @click="tabswitch">
      <span v-for="(v,i) in tabTitle" :style="{width:(100/tabTitle.length-7.5)+'%'}" :class="isShowTab==i?'router-link-active':''">{{v}}<i></i></span>
    </div>
    <div class="Tab_item_wrap">
      <slot></slot>
    </div>
  </div>-->
</template>

<script>
  export default {
    name: 'sinoTabs',
    props:{
      type: String,

    },
    data() {
      return {
        active: 0,
        currentView: 'child1',
        tabs: [
          {
            type: 'tab1',
            view: 'child1'
          },
          {
            type: 'tab2',
            view: 'child2'
          },
          {
            type: 'tab3',
            view: 'child3'
          }
        ]
      }
    },
    methods: {
      toggle(i, v){
        this.active = i
        this.currentView = v
      }
    },
    mounted() {
      let slot = this.$slots.default;
      for(let i = 0; i < slot.length; i++) {
        if(slot[i].tag == "div") {
          this.tabTitle.push(slot[i].data.attrs.name);
          if(slot[i].elm) {
            slot[i].elm.className = "hide";
            if(this.isShowTab == i) {
              slot[i].elm.className = "";
            }
          };
        }
      }
    },


    created: function() {
      let is = sessionStorage.getItem("isTabShow");
      if(is) {
        this.isShowTab = is;
      } else {
        let URL = libUtils.GetURLParamObj();
        this.isShowTab = URL.isShowTab ? URL.isShowTab : "0";
      }

      setTimeout(function() {
        this.tabswitch(document.querySelector(".Tab_tittle_wrap").children[this.isShowTab].click());
      }.bind(this), 0);
    },
    mounted() {
      let slot = this.$slots.default;
      for(let i = 0; i < slot.length; i++) {
        if(slot[i].tag == "div") {
          this.tabTitle.push(slot[i].data.attrs.name);
          if(slot[i].elm) {
            slot[i].elm.className = "hide";
            if(this.isShowTab == i) {
              slot[i].elm.className = "";
            }
          };
        }
      }
    },
    methods: {
      tabswitch() {
        if(!event) return;
        let target = event.target;

        if(target.nodeName.toLowerCase() !== 'span') {
          return;
        }

        let len = target.parentNode.children;
        for(let i = 0; i < len.length; i++) {
          len[i].index = i;
          len[i].removeAttribute('class');
        }
        target.setAttribute('class', 'router-link-active');
        this.isShowTab = target.index;

        //tabItems
        let child = this.$el.children[1].children;
        for(let k = 0; k < child.length; k++) {
          child[k].className = "hide";
          if(k == target.index) {
            child[k].className = "showAnminous";
          }
        }
        try {
          sessionStorage.setItem("isTabShow", target.index);
        } catch(err) {
          console.log(err);
        }
      }
    }
  }
</script>
