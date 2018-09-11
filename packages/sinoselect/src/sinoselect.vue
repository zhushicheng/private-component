<template>
    <div class="sino-select-group"
         v-clickoutside="handleClose"
         :multiselect="multiselect"
         :isshowTotol="isshowTotol"
         :autoFetch="autoFetch"
         :filterable="filterable"
         :isGroup="isGroup"
         :class="{'is-disabled': disabled == true}"
    >
        <div class="show-box">
            <i class="iconfont sino-unie628" :class="{'reverseTrigle':visible}" ></i>
            <!--@click="disabled?'':visible = !visible"-->
            <i class="select-icon-error iconfont sino-cuowu"
               @click="clearDate"
               v-if="isClear && disabled !== true && (multiselect?name.length>0:name)">
            </i>
            <input class="select_input"
                   :class="{'input-clear':isClear,'is-disabled': disabled == true}"
                   type="text"
                   :placeholder="tipText"
                   :readonly="true"
                   :disabled="disabled"
                   v-model="multiselect?name.join('，'):name"
                   @keydown="handleKeydown"
                   ref="reference"
                   @click="toggleMenu"
            ><!--@click="visible = !visible" @focus="visible = true"-->
        </div>
        <sino-select-menu
                ref="popper"
                :append-to-body="popperAppendToBody"
                v-show="visible"
        >
            <ul class="select-array" ref="selectUl" :class="{'isMultiselect':multiselect,'isPage':isPage}">
                <li class="select-filter" v-if="filterable">
                    <input class="select-filter-input"
                           type="text"
                           ref="input"
                           v-model="filterText"
                           placeholder="请输入查询条件"
                           @keydown="handleKeydown"
                           autofocus="autofocusFlag"
                           v-focus
                           v-if="visible">
                </li>
                <sino-options v-for="(item, index) in list" :key="index" :itemGroup="item" v-if="isGroup">
                    <sino-option v-for="(option, index) in item.option" :key="index" :multiselect="multiselect" :item="option" v-on:receive="getChoose" :checkedId="id"></sino-option>
                </sino-options>
                <sino-option  v-if="!isGroup" :multiselect="multiselect" v-for="(option, index) in list" :key="index" :item="option" v-on:receive="getChoose" :checkedId="id"></sino-option>
                <li class="noDate-style" v-if="noDate">暂无数据</li>
                <li class="branch-page" v-if="isPage && !noDate">
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
        </sino-select-menu>
    </div>
</template>
<script>
    import Clickoutside from 'sinoUI/src/utils/clickoutside';
    import sinoOption from '../../sinooption/index.js'
    import sinoOptions from '../../sinooptions/index.js'
    import sinoSelectMenu from './select-dropdown.vue';
    import sinoInput from '../../sinoinput/index';
    import { addResizeListener, removeResizeListener } from 'sinoUI/src/utils/resize-event';
    import Emitter from 'sinoUI/src/mixins/emitter';
    import ajax from './ajax.js'

    var getBoolean =  function (chooseId,chooseName,id,name,mul){
        if(mul){
            if( ( chooseId.length !=0 && chooseName.length ==0) || (chooseId.length != id.length) || (chooseName.length != name.length)){
                return true
            }else{
                return false
            }
        }else{
            if( ( chooseId  && !chooseName ) || (chooseId != id) || (chooseName != name)){
                return true
            }else{
                return false
            }
        }
    };
    var autoChooseFun = function (Boolean,_this,res) {
        if (Boolean) {
            if (_this.isPage) {
                if (_this.currentPage === 1 && res.data.list.length === 1) {
                    if (_this.multiselect ) {
                        if (_this.id.length === 0) {
                            _this.id = [res.data.list[0].id];
                            _this.name = [res.data.list[0].title];
                            _this.$emit('update:chooseName', _this.name);
                            _this.$emit('update:chooseId',_this.id);
                            _this.$emit('contentChange', res.data.list[0]);
                        }
                    } else {
                        if (!(_this.id === 0 || _this.id)) {
                            _this.id = res.data.list[0].id;
                            _this.name = res.data.list[0].title;
                            _this.$emit('update:chooseName', _this.name);
                            _this.$emit('update:chooseId',_this.id);
                            _this.$emit('contentChange', res.data.list[0]);
                        }
                    }
                } else {
                    _this.$emit('update:chooseName', _this.name);
                    _this.$emit('update:chooseId',_this.id);
                }
            } else {
                if (res.data.list.length === 1) {
                    if (_this.multiselect ) {
                        if (_this.id.length === 0) {
                            _this.id = [res.data.list[0].id];
                            _this.name = [res.data.list[0].title];
                            _this.$emit('update:chooseName', _this.name);
                            _this.$emit('update:chooseId',_this.id);
                            _this.$emit('contentChange', res.data.list[0]);
                        }
                    } else {
                        if (!(_this.id === 0 || _this.id)) {
                            _this.id = res.data.list[0].id;
                            _this.name = res.data.list[0].title;
                            _this.$emit('update:chooseName', _this.name);
                            _this.$emit('update:chooseId',_this.id);
                            _this.$emit('contentChange', res.data.list[0]);
                        }
                    }
                } else {
                    _this.$emit('update:chooseName', _this.name);
                    _this.$emit('update:chooseId',_this.id);
                }
            }
        }
    };

    export default{
        mixins: [Emitter],

        name:'sinoSelect',
        componentName: 'sinoSelect',
        components:{
            sinoInput,
            sinoOption,
            sinoOptions,
            sinoSelectMenu
        },
        directives: {
            Clickoutside,
            focus: {
                inserted: function (el) {
                    setTimeout(function () {
                        el.focus();
                    }, 100);
                }
            }
        },
        props: {
            tipText: {},
            disabled: {
                type: Boolean,
                default: false
            },
            linkageStartReq: {
                type: Boolean,
                default: false
            },
            filterable: {
                type: Boolean,
                default: false
            },
            multiselect: {
                type: Boolean,
                default: false
            },
            isshowTotol: {
                type: Boolean,
                default: false
            },
            isGroup: {},
            isPage: {
                type: Boolean,
                default: false
            },
            chooseName: {},
            chooseId: {},
            url: {},
            data: {},
            token: {},
            clear: {
                type: Boolean,
                default: false
            },
            method: {},
            linkage: {
                type: Boolean,
                default: false
            },
            autoChoose: {
                type: Boolean,
                default: false
            },
            popperAppendToBody: {},
            remote: {},
            autoFetch: {
                type: Boolean,
                default: false
            }
        },
        data:function(){
            return {
//                selectShow:false,
                filterText:'',
                noDate:false,
                name:this.chooseName,
                id:this.chooseId,
                queryList:[],
                list:[],
                isClear:false,
                currentPage:1,
                totalPage:1,
                autofocusFlag: false,
                visible: false,
                referenceWidth: '',
                initCount: 0
            };
        },
        created(){
            let obj;
            if (this.data){
                obj = JSON.parse(JSON.stringify(this.data))
            } else {
                obj = {};
            }
            if(this.isPage) {
                obj.pageNum = 1;
                obj.pageSize = 5;
            }
            let _this = this;
            if (this.linkage) {
                this.noDate = true;
                if (this.linkageStartReq) {
                    ajax({
                        data:obj,
                        url:this.url,
                        token: this.token,
                        method:this.method,
                        success:function(res){
                            if(res.data) {
                                _this.queryList = res.data.list;
                                _this.list = res.data.list;
                                _this.checkData(res.data.list);
                                if (_this.isPage) {
                                    _this.currentPage = res.data.pageNum;
                                    _this.totalPage = res.data.pages;
                                }
                                autoChooseFun(_this.autoChoose,_this,res);
                                _this.resetInputHeight();
                            }
                        },
                        error:function(res){
                            console.log('下拉框未请求到数据！')
                        }
                    });
                }
                this.$watch("data", function (val){
                    if (!this.linkageStartReq) {this.clearDate();}
                    // this.initCount++;
                    // this.clearDate();
                    // if (this.initCount !== 1) {
                    //     if(this.multiselect){
                    //         if( this.name.length !== 0 || this.id.length !== 0) {
                    //             this.name=[];
                    //             this.id=[];
                    //         }
                    //     }else{
                    //         this.name='';
                    //         this.id='';
                    //     }
                    // }
                    if(val){
                        obj = val;
                    }else{
                        obj = {};
                    }
                    if(this.isPage) {
                        obj.pageNum = 1;
                        obj.pageSize = 5;
                    }
                    let _this = this;
                    ajax({
                        data:obj,
                        url:this.url,
                        token: this.token,
                        method:this.method,
                        success:function(res){
                            if(res.data) {
                                _this.queryList = res.data.list;
                                _this.list = res.data.list;
                                _this.checkData(res.data.list);
                                if (_this.isPage) {
                                    _this.currentPage = res.data.pageNum;
                                    _this.totalPage = res.data.pages;
                                }
                                _this.$emit('finish',_this.list);
                                autoChooseFun(_this.autoChoose,_this,res);
                                _this.$nextTick(() => {
                                    _this.resetInputHeight();
                                });
                            }
                        },
                        error:function(res){
                            console.log('下拉框未请求到数据！')
                        }
                    })
                }, { deep: true });
            } else {
                ajax({
                    data:obj,
                    url:this.url,
                    token: this.token,
                    method:this.method,
                    success:function(res){
                        if(res.data) {
                            _this.queryList = res.data.list;
                            _this.list = res.data.list;
                            _this.checkData(res.data.list);
                            if (_this.isPage) {
                                _this.currentPage = res.data.pageNum;
                                _this.totalPage = res.data.pages;
                            }
                            autoChooseFun(_this.autoChoose,_this,res);
                            _this.resetInputHeight();
                        }
                    },
                    error:function(res){
                        console.log('下拉框未请求到数据！')
                    }
                });
            }
            if (this.multiselect) {
                if (this.chooseId.length > 0) {
                    if (this.clear) {
                        this.isClear = true;
                    }
                }
            } else {
                if (this.chooseId === 0 || this.chooseId) {
                    if (this.clear) {
                        this.isClear = true;
                    }
                }
            }
        },
        mounted() {
            addResizeListener(this.$el, this.handleResize);
            this.resetInputHeight();
        },
        methods:{
            toggleMenu() {
                if(!this.disabled) {
                    this.visible = !this.visible;
                    if (this.autoFetch) {
                        let obj;
                        if (this.data){
                            obj = JSON.parse(JSON.stringify(this.data))
                        } else {
                            obj = {};
                        }
                        if(this.isPage) {
                            obj.pageNum = 1;
                            obj.pageSize = 5;
                        }
                        let _this = this;
                        ajax({
                            data:obj,
                            url:this.url,
                            token: this.token,
                            method:this.method,
                            success:function(res){
                                if(res.data) {
                                    _this.queryList = res.data.list;
                                    _this.list = res.data.list;
                                    _this.checkData(res.data.list);
                                    if (_this.isPage) {
                                        _this.currentPage = res.data.pageNum;
                                        _this.totalPage = res.data.pages;
                                    }
                                    autoChooseFun(_this.autoChoose,_this,res);
                                    _this.resetInputHeight();
                                }
                            },
                            error:function(res){
                                console.log('下拉框未请求到数据！')
                            }
                        });
                    }
                }

            },

            resetInputWidth() {
//                this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
//                this.$refs.popper.minWidth = this.$refs.reference.$el.getBoundingClientRect().width + 'px';
                if (!this.$refs.reference.offsetWidth) {
                    this.inputWidth = this.referenceWidth;
                    this.$refs.popper.minWidth = this.referenceWidth + 'px';
                } else {
                    this.referenceWidth = this.$refs.reference.offsetWidth
                    this.inputWidth = this.$refs.reference.offsetWidth;
                    this.$refs.popper.minWidth = this.$refs.reference.offsetWidth + 'px';
                }
            },

            resetInputHeight() {
                if (!this.filterable) return;
                this.$nextTick(() => {
                    if (!this.$refs.reference) return;
//                    let inputChildNodes = this.$refs.reference.$el.childNodes;
//                    let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
                    if (this.visible) {
                        this.broadcast('sinoSelectDropdown', 'updatePopper');
                    }
                });
            },

            handleResize() {
                this.resetInputWidth();
                if (this.multiple) this.resetInputHeight();
            },

            handleKeydown(event) {
                const keyCode = event.keyCode;
                if (this.filterable === true) {
                    this.autofocusFlag = true;
                }
                // TAB or ESC
                if (keyCode === 9 || keyCode === 27) {
//                    this.selectShow = false;
                    this.visible = false;
                    event.stopPropagation();
                }
            },
            checkData (val) {
                if (val.length === 0 || val === undefined || val === null || val === '') {
                    this.noDate = true;
                }else {
                    this.noDate = false;
                }
            },
            handleClose() {
                if (this.visible === true && this.isPage && this.currentPage !== 1) {
                    if(this.multiselect){
                        if( this.name.length === 0 && this.id.length === 0) {
                            this.currentPage = 2;
                            this.prePage();
                        }
                    }else{
                        if ((this.id === '' && this.name === '')) {
                            this.currentPage = 2;
                            this.prePage();
                        }
                    }
                }
//                this.selectShow = false;
                this.visible = false;
            },
            multiselectButtonFun(){
//                this.selectShow=false;
                this.visible=false;
            },
            getChoose(item){
                if(this.multiselect) {
                    if (this.id.indexOf(item.id) === -1) {
                        this.id.push(item.id);
                        this.name.push(item.title)
                    } else {
                        this.id.splice(this.id.indexOf(item.id), 1);
                        this.name.splice(this.name.indexOf(item.title), 1)
                    }
                }else{
                    this.name = item.title;
                    this.id = item.id;
//                    this.selectShow=false;
                    this.visible=false;
                }
                this.$emit('update:chooseName', this.name);
                this.$emit('update:chooseId',this.id);
                this.$emit('contentChange', item);
//                this.$emit('change',this.name,this.id);
            },
            clearDate(item){
                if(this.multiselect){
                    if( this.name.length !== 0 || this.id.length !== 0) {
                        this.name=[];
                        this.id=[];
                    }
                }else{
                    this.name='';
                    this.id='';
                }
                if (this.visible === false && this.isPage && this.currentPage !== 1) {
                    if(this.multiselect){
                        if( this.name.length === 0 && this.id.length === 0) {
                            this.currentPage = 2;
                            this.prePage();
                        }
                    }else{
                        if ((this.id === '' && this.name === '')) {
                            this.currentPage = 2;
                            this.prePage();
                        }
                    }
                }
                this.$emit('update:chooseName', this.name);
                this.$emit('update:chooseId',this.id);
                this.$emit('clearChange', item);
//                 this.$emit('change',this.name,this.id);
            },
            prePage(){
                let _this = this;
                let obj;
                if (this.data){
                    obj = JSON.parse(JSON.stringify(this.data))
                } else {
                    obj = {};
                }
                if (this.filterText !== '') {
                    obj.title = this.filterText;
                }
                if(_this.currentPage > 1) {
                    obj.pageNum = _this.currentPage - 1;
                    obj.pageSize = 5;
                    ajax({
                        data:obj,
                        url:this.url,
                        token: this.token,
                        method:this.method,
                        success:function(res){
                            if(res.data){
                                _this.queryList = res.data.list;
                                _this.list = res.data.list;
                                _this.checkData(res.data.list);
                                if(_this.isPage){
                                    _this.currentPage = res.data.pageNum;
                                    _this.totalPage = res.data.pages;
                                }
                                autoChooseFun(_this.autoChoose,_this,res);
                                _this.resetInputHeight();
                                _this.$nextTick(() => {
                                    let _height = _this.$refs.selectUl.offsetHeight;
                                    _this.$refs.popper.height = _height + 'px';
                                    _this.broadcast('sinoSelectDropdown', 'updatePopper');
                                });
                            }
                        },
                        error:function(res){
                            console.log('下拉框未请求到数据！')
                        }
                    })
                }
            },
            nextPage(){
                let _this = this;
                let obj;
                if (this.data){
                    obj = JSON.parse(JSON.stringify(this.data))
                } else {
                    obj = {};
                }
                if (this.filterText !== '') {
                    obj.title = this.filterText;
                }
                if(_this.currentPage !== _this.totalPage) {
                    obj.pageNum = _this.currentPage + 1;
                    obj.pageSize = 5;
                    ajax({
                        data:obj,
                        url:this.url,
                        token: this.token,
                        success:function(res){
                            if(res.data) {
                                _this.queryList = res.data.list;
                                _this.list = res.data.list;
                                _this.checkData(res.data.list);
                                if (_this.isPage) {
                                    _this.currentPage = res.data.pageNum;
                                    _this.totalPage = res.data.pages;
                                }
                                autoChooseFun(_this.autoChoose,_this,res);
                                _this.resetInputHeight();
                                _this.$nextTick(() => {
                                    let _height = _this.$refs.selectUl.offsetHeight;
                                    _this.$refs.popper.height = _height + 'px';
                                    _this.broadcast('sinoSelectDropdown', 'updatePopper');
                                });
                            }
                        },
                        error:function(res){
                            console.log('下拉框未请求到数据！')
                        }
                    })
                }
            }
        },
        watch:{
            chooseId(val){
                let _this = this;
                if(_this.multiselect){
                    if(val.length !==0 ){
                        _this.name = _this.chooseName;
                        _this.id = _this.chooseId;
                        _this.$emit('update:chooseName', _this.chooseName);
                        _this.$emit('update:chooseId',_this.chooseId);
                        if ( _this.clear ) {
                            _this.isClear = true
                        }
                    }else{
                        _this.isClear = false;
                    }
                    _this.$emit('change',_this.name,_this.id);
                } else {
                    if(val === 0 || val) {
                        _this.name = _this.chooseName;
                        _this.id = _this.chooseId;
                        _this.$emit('update:chooseName', _this.chooseName);
                        _this.$emit('update:chooseId',_this.chooseId);
                        if ( _this.clear ) {
                            _this.isClear = true
                        }
                    }else{
                        _this.isClear = false;
                    }
                    _this.$emit('change',_this.name,_this.id);
                }
            },
            singleSelect(val){
                this.visible=false;
            },
            filterText(val){
                let obj;
                if (this.data){
                    obj = JSON.parse(JSON.stringify(this.data))
                } else {
                    obj = {};
                }
                obj.title = val;
                if(this.isPage) {
                    obj.pageNum = 1;
                    obj.pageSize = 5;
                }
                let _this = this;
                ajax({
                    data:obj,
                    url:this.url,
                    token:this.token,
                    method:this.method,
                    success:function(res){
                        if(res.data) {
                            _this.queryList = res.data.list;
                            _this.list = res.data.list;
                            _this.checkData(res.data.list);
                            if (_this.isPage) {
                                _this.currentPage = res.data.pageNum;
                                _this.totalPage = res.data.pages;
                            }
                            autoChooseFun(_this.autoChoose,_this,res);
                            _this.resetInputHeight();
                            _this.$nextTick(() => {
                                let _height = _this.$refs.selectUl.offsetHeight;
                                _this.$refs.popper.height = _height + 'px';
                                _this.broadcast('sinoSelectDropdown', 'updatePopper');
                            });
                        }
                    },
                    error:function(res){
                        console.log('下拉框未请求到数据！')
                    }
                });
            },
            chooseName(val){
                if (this.multiselect) {
                    if (val.length === 0) {
                        if (this.name.length !== 0 &&  this.name.id !==0) {
                            this.name = [];
                            this.id = [];
                            this.$emit('update:chooseName', this.name);
                            this.$emit('update:chooseId', this.id);
                        }
                    }
                } else {
                    if (!val) {
                        this.name = '';
                        this.id = '';
                        this.$emit('update:chooseName', this.name);
                        this.$emit('update:chooseId', this.id);
                    }
                }
//                this.$emit('change', this.name, this.id);
                this.dispatch('SinoFormItem', 'sino.form.change', [this.name]);
            },
            visible(val) {
                let t = this;
                if (!val) {
                    this.filterText='';
                    this.broadcast('sinoSelectDropdown', 'destroyPopper');
                } else {
                    setTimeout(function () {
                        let _height = t.$refs.selectUl.offsetHeight;
                        t.$refs.popper.height = _height + 'px';
                        t.broadcast('sinoSelectDropdown', 'updatePopper');
                    }, 0);
                }
                this.$emit('visible-change', val);
            },
            list() {
                this.$nextTick(() => {
                    this.broadcast('sinoSelectDropdown', 'updatePopper');
                });
            }
        },
        beforeDestroy() {
            if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
        }
    }
</script>
