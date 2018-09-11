<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="sino-autocomplete-suggestion"
      :class="{ 'is-loading': parent.loading }"
      :style="{ width: dropdownWidth }"
    >
      <sino-scrollbar
        tag="ul"
        wrap-class="sino-autocomplete-suggestion__wrap"
        view-class="sino-autocomplete-suggestion__list"
      >
        <li v-if="parent.loading"><i class="iconfont sino-jishi-copy-copy"></i></li>
        <template v-for="(item, index) in suggestions" v-else>
          <li
            v-if="!parent.customItem"
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)" :title="item.title"
          >
            <!--{{item[props.label]}}-->
            {{item.title}}
          </li>
          <component
            v-else
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
            :is="parent.customItem"
            :item="item"
            :index="index">
          </component>
        </template>
      </sino-scrollbar>
    </div>
  </transition>
</template>
<script>
  import Popper from 'sinoUI/src/utils/vue-popper';
  import Emitter from 'sinoUI/src/mixins/emitter';
  import sinoScrollbar from 'sinoUI/packages/sinoScrollbar';

  export default {
    components: { sinoScrollbar },
    mixins: [Popper, Emitter],

    componentName: 'sinoAutocompleteSuggestions',

    data() {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      };
    },

    props: {
      props: Object,
      suggestions: Array,
      options: {
        default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    methods: {
      select(item) {
        this.dispatch('sinoAutocomplete', 'item-click', item);
      }
    },

    updated() {
      this.$nextTick(_ => {
        this.updatePopper();
      });
    },

    mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input;
    },

    created() {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = inputWidth + 'px';
        this.showPopper = val;
      });
    }
  };
</script>
