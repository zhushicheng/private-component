<template>
  <span class="sino-breadcrumb__item">
    <span class="sino-breadcrumb__item__inner" ref="link"><span><slot></slot></span></span>
    <span class="sino-breadcrumb__separator">{{separator}}</span>
  </span>
</template>
<script>
  export default {
    name: 'sinoBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean
    },
    data() {
      return {
        separator: ''
      }
    },
    mounted() {
      this.separator = this.$parent.separator;
      var self = this;
      if (this.to) {
        let link = this.$refs.link;
        link.addEventListener('click', _ => {
          let to = this.to;
          self.replace ? self.$router.replace(to)
            : self.$router.push(to);
        })
      }
    }
  };
</script>
