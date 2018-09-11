<template>
  <div class="sino-breadcrumb">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'sinoBreadcrumb',

    props: {
      separator: {
        type: String,
        default: '>'
      }
    }
  }
</script>
