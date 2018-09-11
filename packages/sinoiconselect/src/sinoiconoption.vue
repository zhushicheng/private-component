<template>
  <li class="select-option" @click="selectValueHandle(item)"><!--@mouseenter="getTextTip(item.title,14,item.id)" @mouseleave="destoryTextTip"-->
    <!--<div class="longTextTip" v-if="item.id === longTipId">{{item.title}}</div>-->
    <p v-if="multiselect" class="select-option-text" :class="{'select-option-text-active':checkedId.indexOf(item.id)!==-1}">
      <span class="text-content"><i class="iconfont icon-img-box" :class="item.title"></i>{{item.title}}</span>
      <span class="select-option-checkbox">
          <i class="iconfont" :class="{'sino-duigou':checkedId.indexOf(item.id)!==-1}"></i>
        </span>
    </p>
    <p v-else class="select-option-text" :class="{'select-option-text-active':item.id === checkedId }">
      <span class="text-content"><i class="iconfont" :class="item.title"></i>{{item.title}}</span>
      <span class="select-option-radio">
          <i class="iconfont" :class="{'sino-duigou':item.id === checkedId}"></i>
        </span>
    </p>
  </li>
</template>
<script>
//  function calcStringPixelsCount(str, strFontSize) {
//    // 字符串字符个数
//    var stringCharsCount = str.length;
//
//    // 字符串像素个数
//    var stringPixelsCount = 0;
//
//    // JS 创建HTML元素：span
//    var elementPixelsLengthRuler = document.createElement("span");
//    elementPixelsLengthRuler.style.fontSize = strFontSize;  // 设置span的fontsize
//    elementPixelsLengthRuler.style.visibility = "hidden";  // 设置span不可见
//    elementPixelsLengthRuler.style.display = "inline-block";
//    elementPixelsLengthRuler.style.wordBreak = "break-all !important";  // 打断单词
//
//    // 添加span
//    document.body.appendChild(elementPixelsLengthRuler);
//
//    for (var i =0; i < stringCharsCount; i++) {
//      // 判断字符是否为空格，如果是用&nbsp;替代，原因如下：
//      // 1）span计算单个空格字符（ ），其像素长度为0
//      // 2）空格字符在字符串的开头或者结果，计算时会忽略字符串
//      if (str[i] == " ") {
//        elementPixelsLengthRuler.innerHTML = "&nbsp;";
//      } else {
//        elementPixelsLengthRuler.innerHTML = str[i];
//      }
//
//      stringPixelsCount += elementPixelsLengthRuler.offsetWidth;
//    }
//    document.body.removeChild(elementPixelsLengthRuler);
//    return stringPixelsCount;
//  }
  export default{
    name:'sinoIconOption',
    props:['item','checkedId',"multiselect"],
    data:function(){
      return {
        noDate:false,
        longTipId:''
      }
    },
    methods: {
      selectValueHandle(item){
        this.$emit('receive', item)
      },
//      getTextTip(str,size,id){
//        var length = calcStringPixelsCount(str,size);
//        if(length>117){
//          this.longTipId = id;
//        }
//      },
//      destoryTextTip(){
//        this.longTipId = '';
//      }
    }
  }
</script>
