<template>
  <i :class="'sino-' + name"></i>
</template>

<script>
  export default {
    name: 'sinoIcon',

    props: {
      name: String
    }
  };
</script>
