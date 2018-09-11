<template>
  <div class="sino-transfer-panel"  :class="{'sino-transfer-panel-height': data.length === 0}">
    <p class="sino-transfer-panel-header">{{ title }}</p>
    <div class="sino-transfer-filter" v-if="filterable">
      <sino-input
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        @click="clearQuery"
        :icon="inputIcon"
        ></sino-input>
      <i class="fr iconfont sino-sousuo"></i>
    </div>
    <div class="sino-transfer-panel-checkedall">
      <sino-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">{{ checkedSummary }}</sino-checkbox>
      <slot></slot>
    </div>

    <sino-scrollbar class="sino-transfer-scrollbar" noresize>
      <div class="sino-transfer-panel-body">
        <sino-checkbox-group
          v-model="checked"
          v-show="!hasNoMatch && data.length > 0"
          :class="{ 'is-filterable': filterable }"
          class="sino-transfer-panel-list">
          <sino-checkbox
            class="sino-transfer-panel-item"
            :label="item[keyProp]"
            :disabled="item[disabledProp]"
            :key="item[keyProp]"
            v-for="item in filteredData">
            <option-content :option="item"></option-content>
          </sino-checkbox>
        </sino-checkbox-group>
        <p
          class="el-transfer-panel__empty"
          v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
        <p
          class="el-transfer-panel__empty"
          v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
      </div>
    </sino-scrollbar>


    <p class="sino-transfer-panel-footer" :class="{'sino-transfer-panel-footer-height': data.length === 0}">
      <!--<sino-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">{{ checkedSummary }}</sino-checkbox>
      <slot></slot>-->
      <sino-page v-if="data.length > 0" v-bind:page="page" v-bind:page-size="pageSize" v-on:pagehandler="pageHandler" :pageArray="pageArray" v-on:choosePageFun="choooseNum" v-bind:object="object" :total="total"></sino-page>
    </p>
  </div>
</template>

<script>
  import sinoCheckboxGroup from '../../sinocheckboxGroup/index';
  import sinoCheckbox from '../../sinocheckbox/index';
  import sinoInput from '../../sinoinput/index';
  import Locale from '../../../src/mixins/locale';
  import SinoScrollbar from "../../sinoscrollbar/src/main";
  import SinoPage from "../../sinopage/src/index";

  export default {
    mixins: [Locale],

    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      SinoPage,
      SinoScrollbar,
      sinoCheckboxGroup,
      sinoCheckbox,
      sinoInput,
      OptionContent: {
        props: {
          option: Object
        },
        render(h) {
          const getParent = vm => {
            if (vm.$options.componentName === 'ElTransferPanel') {
              return vm;
            } else if (vm.$parent) {
              return getParent(vm.$parent);
            } else {
              return vm;
            }
          };
          const parent = getParent(this);
          return parent.renderContent
            ? parent.renderContent(h, this.option)
            : <span>{ this.option[parent.labelProp] || this.option[parent.keyProp] }</span>;
        }
      }
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      filterable: Boolean,
      footerFormat: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object
    },

    data() {
      return {
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        pageArray:[10,20,30,40],
        page: 1,
        total:null,
        pageSize: 10,
        object:{
          maxPage:2,
          issmallPage:true,
          isPage:true,
          isTotal:false,
          isSelect:false,
          isjumper:false,
          isSelectPage:false
        }
      };
    },

    watch: {
      checked(val) {
        this.updateAllChecked();
        this.$emit('checked-change', val);
      },

      data() {
        const checked = [];
        const filteredDataKeys = this.filteredData.map(item => item[this.keyProp]);
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checked = checked;
      },

      checkableData() {
        this.updateAllChecked();
      },

      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return;
          const checked = [];
          const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
          val.forEach(item => {
            if (checkableDataKeys.indexOf(item) > -1) {
              checked.push(item);
            }
          });
          this.checked = checked;
        }
      },
      page(val){
        this.$emit('emitPage',val)
      }
    },

    computed: {
      filteredData() {
        const _this = this;
        return _this.data.filter(item => {
          let _query = this.query;
          if(_query){
            let str = /^[A-Za-z]*$/;
            if(str.test(_query)){
              return item.pinyin.indexOf(_query) > -1;
            }
            const reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(_query)){
              return item.label.indexOf(_query) > -1;
            }
          }else{
            const label = item[this.labelProp] || item[this.keyProp].toString();
            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          }

        })
//          if (typeof this.filterMethod === 'function') {
//            return this.filterMethod(this.query, item);
//          } else {
//            const label = item[this.labelProp] || item[this.keyProp].toString();
//            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
//          }
      },

      checkableData() {
        return this.filteredData.filter(item => !item[this.disabledProp]);
      },

      checkedSummary() {
        this.total = this.data.length;
        const checkedLength = this.checked.length;
        const dataLength = this.data.length;
        const { noChecked, hasChecked } = this.footerFormat;
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength);
        } else {
          return checkedLength > 0
            ? this.t('el.transfer.hasCheckedFormat', { total: dataLength, checked: checkedLength })
            : this.t('el.transfer.noCheckedFormat', { total: dataLength });
        }
      },

      isIndeterminate() {
        const checkedLength = this.checked.length;
        return checkedLength > 0 && checkedLength < this.checkableData.length;
      },

      hasNoMatch() {
        return this.query.length > 0 && this.filteredData.length === 0;
      },

      inputIcon() {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'chaxun';
      },

      labelProp() {
        return this.props.label || 'label';
      },

      keyProp() {
        return this.props.key || 'key';
      },

      disabledProp() {
        return this.props.disabled || 'disabled';
      }
    },

    methods: {
      updateAllChecked() {
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
      },

      handleAllCheckedChange(value) {
        this.checked = value.target.checked
          ? this.checkableData.map(item => item[this.keyProp])
          : [];
      },

      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = '';
        }
      },
      pageHandler:function(page){
        this.page = page;

      },
      choooseNum:function(pageSize){
        this.pageSize = pageSize;
      }
    }
  };
</script>
