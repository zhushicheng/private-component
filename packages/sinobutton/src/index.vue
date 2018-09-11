<template>
  <div class="sino-button" :class="[
      type ? 'is-' + type : '',
      {
        'is-disabled': disabled,
        'is-loading' : loading
      }
      ]" :disabled="disabled" :type="nativeType" @click="handleClick">

    <i class="iconfont sino-shuaxin" v-if="loading"></i>
    <i class="iconfont" :class="icon" v-if="icon"></i>
    <span class="sino-button-span" v-if="$slots.default"><slot></slot></span>
  </div>
</template>
<script>
    export default {
        name:'sinoButton',
        props :{
            disabled: {
                type: Boolean,
                deafult: false,
            },
            icon:{
                type:String,
                deafult:''
            },
            type: {
                type: String,
                default: ''
            },
            nativeType : String,
            loading: Boolean
        },
        methods :{
            handleClick(evt){
                if (this.disabled) {return;}
                this.$emit('click', evt);
            }
        }
    }
</script>
