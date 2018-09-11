<template>
  <div class="sino-autocomplete" v-clickoutside="close">
    <sino-input
      ref="input"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      :icon="icon"
      :on-icon-click="onIconClick"
      @compositionstart.native="handleComposition"
      @compositionupdate.native="handleComposition"
      @compositionend.native="handleComposition"
      @change="handleChange"
      @focus="handleFocus"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.native.prevent="handleKeyEnter"
    >
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </sino-input>
    <sino-autocomplete-suggestions
      :props="props"
      :class="[popperClass ? popperClass : '']"
      ref="suggestions"
      :suggestions="suggestions"
    >
    </sino-autocomplete-suggestions>
  </div>
</template>
<script>
  import sinoInput from 'sinoUI/packages/sinoinput';
  import Clickoutside from 'sinoUI/src/utils/clickoutside';
  import sinoAutocompleteSuggestions from './autocomplete-suggestions.vue';
  import Emitter from 'sinoUI/src/mixins/emitter';
  import ajax from './ajax';

  export default {
    name: 'sinoAutocomplete',

    mixins: [Emitter],

    componentName: 'sinoAutocomplete',

    components: {
      sinoInput,
      sinoAutocompleteSuggestions
    },

    directives: { Clickoutside },

    props: {
      props: {
        type: Object,
        default() {
          return {
            label: 'value',
            value: 'value'
          };
        }
      },
      popperClass: String,
      placeholder: String,
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      autofocus: Boolean,
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      customItem: String,
      icon: String,
      url: String,
      token: String,
      onIconClick: Function
    },
    data() {
      return {
        activated: false,
        isOnComposition: false,
        suggestions: [],
        loading: false,
        highlightedIndex: -1
      };
    },
    computed: {
      suggestionVisible() {
        const suggestions = this.suggestions;
        let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
        return (isValidData || this.loading) && this.activated;
      }
    },
    watch: {
      suggestionVisible(val) {
        this.broadcast('sinoAutocompleteSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
      }
    },
    methods: {
      getData(queryString) {
        let _t = this;
          _t.loading = true;
//        this.fetchSuggestions(queryString, (suggestions) => {
//          this.loading = false;
//          if (Array.isArray(suggestions)) {
//            this.suggestions = suggestions;
//          } else {
//            console.error('autocomplete suggestions must be an array');
//          }
//        });
          ajax({
              data: {
                  title: queryString
              },
              url:this.url,
              token:this.token,
              method:this.method,
              success:function(res){
                  if(res.data) {
                      _t.suggestions = res.data.list;
                      var results = _t.suggestions;
                      clearTimeout(_t.timeout);
                      _t.timeout = setTimeout(() => {
//                          cb(results);
                          _t.loading = false;
                          if (Array.isArray(results)) {
                            _t.suggestions = results;
                          } else {
                            console.error('autocomplete suggestions must be an array');
                          }
                      }, 2000 * Math.random());
                  }
              },
              error:function(res){
                  console.log('下拉框未请求到数据！')
              }
          })
      },
      handleComposition(event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false;
          this.handleChange(this.value);
        } else {
          this.isOnComposition = true;
        }
      },
      handleChange(value) {
        this.$emit('input', value);
        if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
          this.suggestions = [];
          return;
        }
        this.getData(value);
      },
      handleFocus() {
        this.activated = true;
        if (this.triggerOnFocus) {
          this.getData(this.value);
        }
      },
      close(e) {
        this.activated = false;
      },
      handleKeyEnter() {
        if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
          this.select(this.suggestions[this.highlightedIndex]);
        }
      },
      select(item) {
        this.$emit('input', item.title);
//        this.$emit('input', item[this.props.value]);
        this.$emit('select', item);
        this.$nextTick(_ => {
          this.suggestions = [];
        });
      },
      highlight(index) {
        if (!this.suggestionVisible || this.loading) { return; }
        if (index < 0) index = 0;
        if (index >= this.suggestions.length) {
          index = this.suggestions.length - 1;
        }
        const suggestion = this.$refs.suggestions.$el.querySelector('.sino-autocomplete-suggestion__wrap');
        const suggestionList = suggestion.querySelectorAll('.sino-autocomplete-suggestion__list li');

        let highlightItem = suggestionList[index];
        let scrollTop = suggestion.scrollTop;
        let offsetTop = highlightItem.offsetTop;

        if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
          suggestion.scrollTop += highlightItem.scrollHeight;
        }
        if (offsetTop < scrollTop) {
          suggestion.scrollTop -= highlightItem.scrollHeight;
        }

        this.highlightedIndex = index;
      }
    },
    mounted() {
      this.$on('item-click', item => {
        this.select(item);
      });
    },
    beforeDestroy() {
      this.$refs.suggestions.$destroy();
    }
  };
</script>
