<template>
  <div
    class="sino-step"
    :style="[style,  isLast ? '' : { marginRight: - $parent.stepOffset + 'px' }]"
    :class="['is-' + $parent.direction]">
    <div
      class="sino-step-head"
      :class="['is-' + currentStatus, { 'is-text': !icon }]">
      <div
        class="sino-step-line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
        :class="['is-' + $parent.direction,'sino-step-line-is-' + currentStatus,{ 'is-icon': icon },]">
        <i class="sino-step-line-inner" :style="lineStyle"></i>
      </div>
      <span class="sino-step-icon">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <i v-if="icon" :class="['sino-icon-' + icon]"></i>
          <div v-else>{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          class="iconfont"
          :class="[(currentStatus === 'success' ? 'sino-duigou' : 'sino-cuo')]">
        </i>
      </span>
    </div>
    <div class="sino-step-main">
      <div
        class="sino-step-title"
        ref="title"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        class="sino-step-description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sinoStep',

    props: {
      title: String,
      icon: String,
      description: String,
      status: String
    },

    data() {
      return {
        index: -1,
        lineStyle: {},
        mainOffset: 0,
        internalStatus: ''
      };
    },

    beforeCreate() {
      this.$parent.steps.push(this);
    },

    beforeDestroy() {
      const steps = this.$parent.steps;
      const index = steps.indexOf(this);
      if (index >= 0) {
        steps.splice(index, 1);
      }
    },

    computed: {
      currentStatus() {
        return this.status || this.internalStatus;
      },
      isLast: function() {
        const parent = this.$parent;
        return parent.steps[parent.steps.length - 1] === this;
      },
      style: function() {
        const parent = this.$parent;
        const isCenter = parent.center;
        const len = parent.steps.length;

        if (isCenter && this.isLast) {
          return {};
        }
        const space = (typeof parent.space === 'number'
          ? parent.space + 'px'
          : parent.space + '%')
        if (parent.direction === 'horizontal') {
          return { width: space };
        } else {
          if (!this.isLast) {
            return { height: space };
          }
        }
      }
    },

    methods: {
      updateStatus(val) {
        const prevChild = this.$parent.$children[this.index - 1];

        if (val > this.index) {
          this.internalStatus = this.$parent.finishStatus;
        } else if (val === this.index) {
          this.internalStatus = this.$parent.processStatus;
        } else {
          this.internalStatus = 'wait';
        }

        if (prevChild) prevChild.calcProgress(this.internalStatus);
      },

      calcProgress(status) {
        let step = 100;
        const style = {};

        style.transitionDelay = 150 * this.index + 'ms';
        if (status === this.$parent.processStatus) {
          step = 50;
        } else if (status === 'wait') {
          step = 0;
          style.transitionDelay = (-150 * this.index) + 'ms';
        }

        style.borderWidth = step ? '1px' : 0;
        this.$parent.direction === 'vertical'
          ? style.height = step + '%'
          : style.width = step + '%';

        this.lineStyle = style;
      }
    },

    mounted() {
      const parent = this.$parent;

      if (parent.direction === 'horizontal') {
        if (parent.alignCenter) {
          this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
        }
      }

      const unwatch = this.$watch('index', val => {
        this.$watch('$parent.active', this.updateStatus, { immediate: true });
        unwatch();
      });
    }
  };
</script>
