<template>
  <div
    class="sino-progress"
    :class="[
      'sino-progress-' + type,
      status ? 'is-' + status : '',
      {
        'sino-progress-without-text': !showText,
        'sino-progress-text-inside': textInside
      }
    ]"
  >
    <div class="sino-progress-bar" v-if="type === 'line'">
      <div class="sino-progress-bar-outer" :style="{height: strokeWidth + 'px'}">
        <div class="sino-progress-bar-inner" :style="barStyle">
          <div class="sino-progress-bar-innerText" :style="{lineHeight:strokeWidth + 'px'}" v-if="showText && textInside">{{percentage}}%</div>
        </div>
      </div>
    </div>
    <div class="sino-progress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
      <svg viewBox="0 0 100 100">
        <path class="sino-progress-circle-track" :d="trackPath" stroke="#e5e9f2" :stroke-width="relativeStrokeWidth" fill="none"></path>
        <path class="sino-progress-circle-path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path>
      </svg>
    </div>
    <div
      class="sino-progress-text"
      v-if="showText && !textInside"
      :style="{fontSize: progressTextSize + 'px'}"
    >
      <template v-if="!status">{{percentage}}%</template>
      <i v-else class="iconfont" :class="iconClass"></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sinoProgress',
    props: {
      type: {
        type: String,
        default: 'line',
        // validator=>自定义验证，返回Boolean，表示验证通过与否
        validator: val => ['line', 'circle'].indexOf(val) > -1
      },
      percentage: {
        type: Number,
        default: 0,
        required: true,
        validator: val => val >= 0 && val <= 100
      },
      status: {
        type: String
      },
      strokeWidth: {
        type: Number,
        default:function(){
          if(this.type == 'circle' ){
            return 10
          }else{
            return 22
          }
        }
      },
      textInside: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 126
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      barStyle() {
        var style = {};
        style.width = this.percentage + '%';
        return style;
      },
      relativeStrokeWidth() {
        return (this.strokeWidth / this.width * 100).toFixed(1);
      },
      trackPath() {
        var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);
        return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
      },
      perimeter() {
        var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
        return 2 * Math.PI * radius;
      },
      circlePathStyle() {
        var perimeter = this.perimeter;
        return {
          strokeDasharray: `${perimeter}px,${perimeter}px`,
          strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        };
      },
      stroke() {
        var ret;
        switch (this.status) {
          case 'success':
            ret = '#13ce66';
            break;
          case 'exception':
            ret = '#ff4949';
            break;
          default:
            ret = '#399ff2';
        }
        return ret;
      },
      iconClass() {
        if (this.type === 'line') {
          return this.status === 'success' ? 'sino-dui' : 'sino-cuowu';
        } else {
          return this.status === 'success' ? 'sino-duigou' : 'sino-cuo';
        }
      },
      progressTextSize() {
        return this.type === 'line'
          ? 5.2 + this.strokeWidth * 0.4
          : this.width * 0.111111 + 4;
      }
    }
  };
</script>
