<template>
  <div class="sino-title" :class="[ titeLevel ]">
    <i class="fl sino-title-i"></i>
    <h3 class="fl">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script>
  const TYPE_TITLE_LEVEL = {
      'levelOne':'sino-level-one',
      'levelTwo':'sino-level-two'
  };
  export default {
    name:"sinoTitle",
    props: {
      title:String,
      type:String
    },
    computed: {
      titeLevel(){
        return TYPE_TITLE_LEVEL[this.type] || 'sino-level-one'
      }
    }
  }
</script>
