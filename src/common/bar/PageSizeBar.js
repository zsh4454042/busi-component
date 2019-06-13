/**
 * 包含配置当前页面数据条数的分页组件
 */
define('common/bar/PageSizeBar', ['bui/toolbar','bui/data'], function(r) {
	var BUI = r('bui/common'),Component = BUI.Component,Toolbar = r('bui/toolbar'),Data = r('bui/data');
	var PREFIX = BUI.prefix,
	ID_FIRST = 'first',
    ID_PREV = 'prev',
    ID_NEXT = 'next',
    ID_LAST = 'last',
    ID_SELECT = 'select',
    ID_TOTAL_PAGE = 'totalPage',
    ID_CURRENT_PAGE = 'curPage',
    ID_TOTAL_COUNT = 'totalCount',
    ID_BUTTONS = [ID_FIRST,ID_PREV,ID_NEXT,ID_LAST,ID_SELECT],
    ID_TEXTS = [ID_TOTAL_PAGE,ID_CURRENT_PAGE,ID_TOTAL_COUNT],
    SELECT_OPTIONS = [10,20,50];

var PageSizeBar = Toolbar.Bar.extend([Component.UIBase.Bindable],
    {
        initializer:function () {
            var _self = this,
                children = _self.get('children'),
                items = _self.get('items'),
                store = _self.get('store');
            if(!items){
                items = _self._getItems();
                BUI.each(items, function (item) {
                    children.push(item);//item
                });
            }else{
                BUI.each(items, function (item,index) { //转换对应的分页栏
                    if(BUI.isString(item)){
                        if(BUI.Array.contains(item,ID_BUTTONS)){
                            item = _self._getButtonItem(item);
                        }else if(BUI.Array.contains(item,ID_TEXTS)){
                            item = _self._getTextItem(item);
                        }else{
                            item = {xtype : item};
                        }
                    }
                    children.push(item);
                }); 
            }
            
            if (store && store.get('pageSize')) {
                _self.set('pageSize', store.get('pageSize'));
            }
        },
        bindUI:function () {
            var _self = this;
            _self._bindButtonEvent();
        },
        jumpToPage:function (page) {
            if (page <= 0 || page > this.get('totalPage')) {
                return;
            }
            var _self = this,
                store = _self.get('store'),
                pageSize = _self.get('pageSize'),
                index = page - 1,
                start = index * pageSize;
            var result = _self.fire('beforepagechange', {from:_self.get('curPage'), to:page});
            if (store && result !== false) {
                store.load({ start:start, limit:pageSize, pageIndex:index });
            }
        },
        //after store loaded data,reset the information of paging bar and buttons state
        _afterStoreLoad:function (store, params) {
            var _self = this,
            	selectEl = _self.getItem(ID_SELECT).get('el'),
                pageSize = _self.get('pageSize'),
                start = 0, //页面的起始记录
                end, //页面的结束记录
                totalCount, //记录的总数
                curPage, //当前页
                totalPage;//总页数;

            start = store.get('start');
            
            //设置加载数据后翻页栏的状态
            totalCount = store.getTotalCount();
            end = totalCount - start > pageSize ? start + store.getCount() - 1: totalCount;
            totalPage = parseInt((totalCount + pageSize - 1) / pageSize, 10);
            totalPage = totalPage > 0 ? totalPage : 1;
            curPage = parseInt(start / pageSize, 10) + 1;
            
            _self.set('start', start);
            _self.set('end', end);
            _self.set('totalCount', totalCount);
            _self.set('curPage', curPage);
            _self.set('totalPage', totalPage);
            
            //设置按钮状态
            _self._setAllButtonsState();
            _self._setNumberPages();
        },

        //bind page change events
        _bindButtonEvent:function () {
            var _self = this;

            //first page handler
            _self._bindButtonItemEvent(ID_FIRST, function () {
                _self.jumpToPage(1);
            });

            //previous page handler
            _self._bindButtonItemEvent(ID_PREV, function () {
                _self.jumpToPage(_self.get('curPage') - 1);
            });

            //previous page next
            _self._bindButtonItemEvent(ID_NEXT, function () {
                _self.jumpToPage(_self.get('curPage') + 1);
            });

            //previous page next
            _self._bindButtonItemEvent(ID_LAST, function () {
                _self.jumpToPage(_self.get('totalPage'));
            });
            _self.getItem(ID_SELECT).get('el').change(function(){
            	var pageSize = parseInt($(this).find('option:selected').val()),
            		store = _self.get('store');
            	if(pageSize == -1){
            		store.set('start',0);
            		pageSize = store.getTotalCount(); 
            	}
            	if(pageSize > store.getTotalCount()){
            		store.set('start',0);
            	}
            	store.set('pageSize',pageSize);
            	_self.set('pageSize',pageSize);
            	store.load();
            });
        },
        // bind button item event
        _bindButtonItemEvent:function (id, func) {
            var _self = this,
                item = _self.getItem(id);
            if (item) {
                item.on('click', func);
            }
        },
        onLoad:function (params) {
            var _self = this,
                store = _self.get('store');
            _self._afterStoreLoad(store, params);
        },
        //get the items of paging bar
        _getItems:function () {
            var _self = this,
                items = _self.get('items');
            if (items && items.length) {
                return items;
            }
            //default items
            items = [];
            //first item
            items.push(_self._getButtonItem(ID_FIRST));
            //previous item
            items.push(_self._getButtonItem(ID_PREV));
            //separator item
            items.push(_self._getSeparator());
            //total page of store
            items.push(_self._getTextItem(ID_TOTAL_PAGE));
            //current page of store
            items.push(_self._getTextItem(ID_CURRENT_PAGE));
            //button for select pageSize
            items.push(_self._getSelectItem(ID_SELECT));
            //separator item
            items.push(_self._getSeparator());
            //next item
            items.push(_self._getButtonItem(ID_NEXT));
            //last item
            items.push(_self._getButtonItem(ID_LAST));
            //separator item
            items.push(_self._getSeparator());
            //current page of store
            items.push(_self._getTextItem(ID_TOTAL_COUNT));
            return items;
        },
        _getButtonItem:function (id) {
            var _self = this;
            return {
                id:id,
                xclass:'bar-item-button',
                text:_self.get(id + 'Text'),
                disabled:true,
                elCls:_self.get(id + 'Cls')
            };
        },
        _getSeparator:function () {
            return {xclass:'bar-item-separator'};
        },
        _getSelectItem:function(id){
        	var _self = this,selectContent = _self._getTextItemTpl(id),store = _self.get('store');
        	if(!selectContent){
        		selectContent = '<select id="pageSizeSelect"'+ 
        		' style="height:18px;margin:0;width:53px;vertical-align:baseline;*vertical-align:middle;padding:0 2px;">'+
        		_self._getSelectOptionsEl(store.get('pageSize'))+
        		'<option value="-1">全部</option>'+
        		'</select>';
        	}
        	return {
                id:id,
                xclass:'bar-item-text',
                text:selectContent
            };
        },
        _getSelectOptionsEl:function(pageSize){
        	var optionElStr = '';
        	$.each(SELECT_OPTIONS,function(idx,v){
        		if(v == parseInt(pageSize)){
        			optionElStr += '<option value="'+v+'" selected>'+v+'</option>';
        		}else{
        			optionElStr += '<option value="'+v+'">'+v+'</option>';
        		}
        	});
        	return optionElStr;
        },
        _getTextItem:function (id) {
            var _self = this;
            return {
                id:id,
                xclass:'bar-item-text',
                text:_self._getTextItemTpl(id)
            };
        },
        _getTextItemTpl:function (id) {
            var _self = this,
                obj = _self.getAttrVals();
            return BUI.substitute(this.get(id + 'Tpl'), obj);
        },
        _setAllButtonsState:function () {
            var _self = this,
                store = _self.get('store');
            if (store) {
                _self._setButtonsState([ID_PREV, ID_NEXT, ID_FIRST, ID_LAST, ID_SELECT], true);
            }

            if (_self.get('curPage') === 1) {
                _self._setButtonsState([ID_PREV, ID_FIRST], false);
            }
            if (_self.get('curPage') === _self.get('totalPage')) {
                _self._setButtonsState([ID_NEXT, ID_LAST], false);
            }
        },
        _setButtonsState:function (buttons, enable) {
            var _self = this,
                children = _self.get('children');
            BUI.each(children, function (child) {
                if (BUI.Array.indexOf(child.get('id'), buttons) !== -1) {
                    child.set('disabled', !enable);
                }
            });
        },
        _setNumberPages:function () {
            var _self = this,
                items = _self.getItems();
        	BUI.each(items,function(item){
                if(item.__xclass === 'bar-item-text'){
                    item.set('content', _self._getTextItemTpl(item.get('id')));
                }
            });

        }
    }, {
        ATTRS:
 
        {
            firstText:{
                value:'首 页'
            },
            firstCls:{
                value:PREFIX + 'pb-first'
            },
            prevText:{
                value:'上一页'
            },
            prevCls:{
                value: PREFIX + 'pb-prev'
            },
            nextText:{
                value:'下一页'
            },
            nextCls:{
                value: PREFIX + 'pb-next'
            },
            lastText:{
                value:'末 页'
            },
            lastCls:{
                value:PREFIX + 'pb-last'
            },
            totalPageTpl:{
                value:'共 {totalPage} 页'
            },
            curPageTpl:{
                value:'第 {curPage} 页'
            },
            selectTpl:{
            },
            totalCountTpl:{
                value:'共{totalCount}条记录'
            },
            autoInitItems : {
                value : false
            },
            curPage:{
                value:0
            },
            totalPage:{
                value:0
            },
            totalCount:{
                value:0
            },
            pageSize:{
                
            },
            elCls:{
            	value:'bui-pagingbar bui-bar'
            },
            store:{

            }
        },
        ID_FIRST:ID_FIRST,
        ID_PREV:ID_PREV,
        ID_NEXT:ID_NEXT,
        ID_LAST:ID_LAST,
        ID_SELECT:ID_SELECT,
        ID_TOTAL_PAGE:ID_TOTAL_PAGE,
        ID_CURRENT_PAGE:ID_CURRENT_PAGE,
        ID_TOTAL_COUNT:ID_TOTAL_COUNT
    });
	return PageSizeBar;
});