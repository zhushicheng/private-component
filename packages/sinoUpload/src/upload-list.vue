<template>
  <transition-group
    tag="ul"
    :class="['sino-upload-list', 'sino-upload-list-' + listType]"
    name="sino-list"
  >
    <li
      v-for="(file, index) in files"
      :class="['sino-upload-list-item', 'is-' + file.status]"
      :key="index"
    >
      <img
        class="sino-upload-list-item-thumbnail"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url" alt=""
      >
      <a class="sino-upload-list-item-name" @click="handleClick(file)">
        <i class="iconfont sino-qubiezhen"></i><!--{{file.name}}-->
        <input class="sino-upload-list-item-input-name" type="text" v-model="file.name" />
      </a>
      <label class="sino-upload-list-item-status-label" @click="$emit('remove', file)">
        <!--<i :class="{
          'iconfont icon-dui': true,
          'sino-icon-circle-check': listType === 'text',
          'sino-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>-->
        删除
      </label>
      <!--<i class="sino-icon-close iconfont icon-error" @click="$emit('remove', file)"></i>-->
      <sino-progress
        v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :percentage="parsePercentage(file.percentage)">
      </sino-progress>
      <span class="sino-upload-list-item-actions" v-if="listType === 'picture-card'">
        <span
          class="sino-upload-list-item-preview"
          v-if="handlePreview && listType === 'picture-card'"
          @click="handlePreview(file)"
        >
          <i class="sino-icon-view"></i>
        </span>
        <span
          v-if="!disabled"
          class="sino-upload-list-item-delete"
          @click="$emit('remove', file)"
        >
          <i class="sino-icon-delete2"></i>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
  import Locale from '../../../src/mixins/locale';
  import sinoProgress from '../../../packages/sinoprogress/index';

  export default {
    mixins: [Locale],

    components: { sinoProgress },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    methods: {
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
</script>
