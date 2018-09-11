<template>
  <div v-bind:style="outBoxStyle">
    <div class="sino-link-container" v-bind:style="innerBoxStyle">
      <div class="sino-link-container-triangle" v-bind:style="triangleStyle"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sinoLinkContainer',
    props: {
      outBoxStyle: {},
      innerBoxStyle: {},
      triangleStyle: {}
    }
  };
</script>
<style>
  .sino-link-container{
    position:relative;
    border:1px solid #ececec;
    border-left:4px solid #399ff2;
    border-radius:2px;
    box-shadow:0 0 3px #ccc;
  }
  .sino-link-container-triangle{
    position:absolute;
    left:-10px;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-right: 6px solid #399ff2;
    border-bottom: 7px solid transparent;
  }
  .tree-edit-layer .sino-dialog{
    width:603px;
    height:auto;
  }
  .tree-edit-layer .sino-dialog-header{
    width:572px;
  }
  .tree-edit-layer .sino-dialog-body{
    padding-left:0;
    height:auto;
  }
  .tree-edit-layer .title{
    line-height:22px;
    text-align:right;
    width:113px;
    color:#333;
  }
  .tree-edit-layer .sino-radio{
    width:70px;
    margin-top:4px;
  }
  .tree-edit-layer .content-text{
    width:160px;
  }
  .tree-edit-layer .content-textarea{
    width:434px;
    height:75px;
  }
  .tree-edit-layer-ul>li{
    overflow:hidden;
    margin-bottom:19px;
  }
  .tree-edit-layer-ul li>div:first-child{
    width:120px;
  }
  .tree-edit-layer-ul li>div:first-child{
    width:120px;
  }
  .tree-edit-layer .tree-button-save{
    width:130px;
    height:30px;
    line-height:30px;
    background:#f6b412;
    color:#fff;
    font-size:14px;
    text-align:center;
  }
  .tree-edit-layer .tree-button-cancel{
    line-height:30px;
    color:#399ff2;
    margin-left:20px;
    background:none;
  }
  .tree-edit-layer .sino-dialog-footer{
    margin-top:12px;
    margin-bottom:30px;
  }
</style>
