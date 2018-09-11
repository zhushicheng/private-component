<template>
  <ul class="sino-options" v-bind="itemGroup">
    <li class="sino-options-title">{{itemGroup.title}}</li>
    <li>
      <ul class="sino-options-item">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>
<script>
  export default{
    name:'sinoIconOptions',
    props:['itemGroup']
  }
</script>
