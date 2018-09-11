/*
*<template>
  <div>
    <div class="sino-dialog-button-text" type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</div>
    <sino-dialog title="查询模板" :visible.sync="dialogFormVisible">
      <div slot="button" class="sino-dialog-button" @click="dialogFormVisible = false">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <form class="sino-dialog-form" :model="form">
        <div class="sino-dialog-item">
          <div class="sino-dialog-L">
            <label class="sino-dialog-form-item-label" >模板名称 <span class="sino-dialog-form-item-labels">:</span> </label>
            <div class="sino-dialog-form-item-content">
              <div class="sino-dialog-input">
                <input type="text" placeholder="增值税计算器" v-model="form.name" auto-complete="off" class="sino-dialog-input-inner">
              </div>
            </div>
          </div>
          <div class="sino-dialog-R">
            <label class="sino-dialog-form-item-label">模板类型 <span class="sino-dialog-form-item-labels">:</span> </label>
            <div class="sino-dialog-select">
              <div class="sino-dialog-border">
                <div class="sino-dialog-select--border">
                  <select class="sino-dialog-option">
                    <option>税务</option>
                  </select>
                </div>
                <div class="sino-dialog-Lowertriangle"><i class='iconfont icon-unie628'></i></div>
              </div>
            </div>
          </div>
        </div>
        <div class="sino-dialog-textarea">
          <label class="sino-dialog-form-item-label" >模板描述<span class="sino-dialog-form-item-labels">:</span> </label>
          <div class="sino-dialog-textarea-input">
            <textarea class="sino-dialog-textareas" id="" cols="30" rows="10">增值器计算器Excel</textarea>
          </div>
        </div>
        <div class="sino-dialog-Enclosure">
          <label class="sino-dialog-form-item-Label" >模板附件<span class="sino-dialog-form-item-Labels">:</span> </label>
          <div class="sino-dialog-Paperclip">
            <div class="sino-dialog-PaperClip"><i class="iconfont icon-qubiezhen" ></i></div>
            <span class="sino-dialog-Calculator">增值税计算器.dox</span>
            <a class="sino-dialog-download" href="file" target="_blank">下载</a>
          </div>
        </div>
      </form>

      <button slot="footer" class="sino-dialog-Close" @click="dialogFormVisible = false">
        <sino-button @click="dialogFormVisible = false">关闭</sino-button>
      </button>
    </sino-dialog>
  </div>
</template>
<script>

  import sinoDialog from '../../../../../packages/sinoDialog/index'

  export default {
    components: {
      sinoDialog
    },
    data() {
      return {
        dialogFormVisible: false,
        visible:true,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    }
  }
</script>

*/


import sinoDialog from './src/index.vue';

/* istanbul ignore next */
sinoDialog.install = function(Vue) {
  Vue.component(sinoDialog.name, sinoDialog);
};

export default sinoDialog;
