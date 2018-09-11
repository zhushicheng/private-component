<template>
    <div class="sino-select-group" v-clickoutside="handleClose" :multiselect="multiselect" :isshowTotol="isshowTotol" :filterable="filterable" :isGroup="isGroup">
        <div class="show-box">
            <i class="iconfont sino-unie628" :class="{'reverseTrigle':selectShow}" @click="disabled?'':selectShow = !selectShow"></i>
            <i class="select-icon-error iconfont sino-cuowu"
               @click="clearDate"
               v-if="isClear">
            </i>
            <input class="select_input" :class="{'input-clear':isClear,'is-disabled': disabled == true}" type="text" :placeholder="tipText" @click="selectShow = !selectShow"  readonly="true" :disabled="disabled" v-model="multiselect?name.join('，'):name">
        </div>
        <div class="icon-out-select-content" v-show="selectShow">
          <div class="icon-select-content">
            <ul class="select-array" :class="{'isMultiselect':multiselect,'isPage':isPage}">
              <li class="select-filter" v-if="filterable">
                <input class="select-filter-input" type="text" v-model="filterText" placeholder="请输入查询条件"/>
              </li>
              <sino-icon-options v-for="item in list" :itemGroup="item" v-if="isGroup">
                <sino-icon-option v-for="option in item.option" :multiselect="multiselect" :item="option" v-on:receive="getChoose" :checkedId="id"></sino-icon-option>
              </sino-icon-options>
              <sino-icon-option  v-if="!isGroup" :multiselect="multiselect" v-for="option in list" :item="option" v-on:receive="getChoose" :checkedId="id"></sino-icon-option>
              <li class="noDate-style" v-if="noDate">无匹配数据</li>
              <li class="branch-page" v-if="isPage">
                <p class="branch-page-box">
                  <span class="fl" @click.stop="prePage" :class="{'preButDisabled':currentPage <= 1}" :disabled="currentPage <= 1">上页</span>
                  <span class="pageNum">{{currentPage}}/{{totalPage}}</span><span>页</span>
                  <span class="fr" @click.stop="nextPage" :class="{'nextButDisabled':currentPage==totalPage}" :disabled="currentPage==totalPage">下页</span>
                </p>
              </li>
              <li class="multiselect-button" v-if="multiselect">
                <div class="multiselect-button-box" @click="multiselectButtonFun">确 定</div>
              </li>
            </ul>
          </div>
        </div>
    </div>
</template>
<script>
    import Clickoutside from '../../../src/utils/clickoutside.js';
    import sinoIconOption from '../../../packages/sinoiconoption/index.js'
    import sinoIconOptions from '../../../packages/sinoiconoptions/index.js'
    import Emitter from '../../../src/mixins/emitter';
    import sinoScrollbar from '../../../packages/sinoscrollbar/index.js';
    export default{
        name:'sinoIconSelect',
        componentName: 'sinoIconSelect',
        components:{
            sinoIconOption,
            sinoIconOptions,
            sinoScrollbar
        },
        mixins: [Emitter],
        props:[
            'tipText',
            'disabled',
            'filterable',
            'multiselect',
            'isshowTotol',
            'filterable',
            'isGroup',
            'isPage',
            //绑定值
            'chooseName',
            'chooseId',
            'clear',
            'method',
            'linkage',
            'outSideList'
        ],
        data:function(){
            return {
                selectShow:false,
                filterText:'',
                noDate:false,
                name:this.chooseName,
                id:this.chooseId,
                queryList:[],
                list:[],
                isClear:false,
                currentPage:1,
                totalPage:1,

            };
        },
        directives: { Clickoutside },
        mounted(){
            this.queryList = this.outSideList;
            this.list = this.outSideList;
        },
        methods:{
            handleClose() {
                this.selectShow = false;
            },
            multiselectButtonFun(){
                this.selectShow=false;
            },
            getChoose(item){
                if(this.multiselect) {
                    if (this.id.indexOf(item.id) == -1) {
                        this.id.push(item.id)
                        this.name.push(item.title)
                    } else {
                        this.id.splice(this.id.indexOf(item.id), 1);
                        this.name.splice(this.name.indexOf(item.title), 1)
                    }
                }else{
                    this.name = item.title;
                    this.id = item.id;
                    this.selectShow=false;
                }
                this.$emit('update:chooseName', this.name);
                this.$emit('update:chooseId',this.id);
//                this.$emit('change',this.name,this.id);
            },
            clearDate(){
                if(this.multiselect){
                    this.name=[];
                    this.id=[];
                }else{
                    this.name='';
                    this.id='';
                }
                this.$emit('update:chooseName', this.name);
                this.$emit('update:chooseId',this.id);
                // this.$emit('change',this.name,this.id);
            },
        },
        watch:{
            chooseId(val){
                let _this = this;
                if(_this.multiselect){
                    if(val.length !=0 ){
                        _this.name = _this.chooseName;
                        _this.id = _this.chooseId;
                        _this.$emit('update:chooseName', _this.chooseName);
                        _this.$emit('update:chooseId',_this.chooseId);
                        if ( this.clear ) {
                            _this.isClear = true
                        }
                    }else{
                        _this.isClear = false;
                    }
                    _this.$emit('change',_this.name,_this.id);
                }else{
                    if(val === 0 || val) {
                        _this.name = _this.chooseName;
                        _this.id = _this.chooseId;
                        _this.$emit('update:chooseName', _this.chooseName);
                        _this.$emit('update:chooseId',_this.chooseId);
                        if ( this.clear ) {
                            _this.isClear = true
                        }
                    }else{
                        _this.isClear = false;
                    }
                    _this.$emit('change',_this.name,_this.id);
                }
            },
            selectShow(val){
                if(!val){
                    this.filterText='';
                }
            },
            singleSelect(val){
                this.selectShow=false;
            },
            chooseName(val){
                if (!val) {
                    if (this.multiselect) {
                        if (val.length == 0) {
                            this.name = [];
                            this.id = [];
                            this.$emit('update:chooseName', this.name);
                            this.$emit('update:chooseId', this.id);
                        }
                    } else {
                        this.name = '';
                        this.id = '';
                        this.$emit('update:chooseName', this.name);
                        this.$emit('update:chooseId', this.id);
                    }
                }
//                this.$emit('change', this.name, this.id);
                this.dispatch('SinoFormItem', 'sino.form.change', [this.name]);
            }
        }
    }
</script>
