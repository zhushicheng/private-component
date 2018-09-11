<template>
  <transition name="fade" mode="out-in" appear>
    <div class="sino-mask" v-if="sinoAlert">
      <div class="sino-alert-con" :dragFlag="dragFlag" v-on="{mousedown:down}">
        <div class="sino-alert-tit">
          <span class="fl">{{ title }}</span>
          <i class="fr iconfont sino-guanbi" v-show="closable" @click="close()"></i>
        </div>
        <div class="sino-alert-icon" :class="[ sinoClass ]" v-if="showIcon">
          <i class="iconfont" :class="[ iconClass ]"></i>
        </div>
        <slot>
          <span class="sino-alert-msg">{{description}}</span>
        </slot>
        <div class="sino-alert-btn">
          <span v-show="closable" @click="close()">{{ closeText }}</span>
        </div>
      </div>
    </div>
  </transition>

</template>
<script>
  const TYPE_ICON_MAP = {
    'success': 'sino-duigou',
    'warning': 'sino-gantanhao',
    'error': 'sino-guanbi',
    'busyservice': 'sino-i'
  }
  const TYPE_SINO_MAP = {
    'success': 'sino-alert-duigou',
    'warning': 'sino-alert-gantanhao',
    'error': 'sino-alert-unie61a',
    'busyservice': 'sino-alert-i'
  }
  var oDiv,disX,disY,pageX,pageY;
  export default {
    name:'SinoAlert',
    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      closeText: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: true
      },
      dragFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        sinoAlert: true
      };
    },
    methods: {
      close() {
          this.sinoAlert = false
      },
      down(ev){
        const _this = this;
        if(_this.dragFlag !== true){
            return
        }
        document.onmousedown = function () {
          oDiv = _this.$el.firstChild;
          disX = ev.clientX -oDiv.offsetLeft;
          disY = ev.clientY - oDiv.offsetTop;
          pageX = ev.pageX
          pageY = ev.pageY
          document.onmousemove = function(ev){
            var l = ev.clientX-disX+220
            var t = ev.clientY-disY+127

            if(l < 220){
              l = 220
            }
            if(l>document.documentElement.clientWidth-220){
              l = document.documentElement.clientWidth-220
            }
            if(t < 127){
              t = 127
            }
            if(t>document.documentElement.clientHeight-127){
              t = document.documentElement.clientHeight-127
            }
            oDiv.style.left =  l+'px'
            oDiv.style.top = t+'px'
          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmousedown = null
          }
        }
      }
    },
    computed: {
      iconClass() {
        return TYPE_ICON_MAP[this.type] || 'icon-gantanhao';
      },
      sinoClass() {
        return TYPE_SINO_MAP[this.type] || 'sinosss.scss-sinoAlert-gantanhao';
      }
    }
  }
</script>

