define('common/grid/SearchGridContainer', ['bui/common',
                                        'common/container/FieldsetContainer',
                                        'common/search/SearchForm',
                                    	'common/grid/GridBtn'], function(require) {
	var BUI = require('bui/common'),Component = BUI.Component,
	FieldSet = require('common/container/FieldsetContainer'),
	SearchForm = require('common/search/SearchForm'),
	GridBtn = require('common/grid/GridBtn'),
	SEARCH_FORM_ID = 'searchForm',
	SEARCH_GRID_ID = 'searchGrid',
	TAB_HEIGHT = 21;//tab容器上方导航条占的高度
	var SearchGridContainer = Component.Controller.extend({//获取到按钮权限数据后再渲染表格
		initializer:function(){
			var _self = this;
			var searchForm = _self._initSearchForm();
			var searchGrid = _self._initSearchGrid();
			var up = new FieldSet({id : 'searchFormFieldSet',title : '查询',items:[searchForm],collapse : _self.get('collapse')});
			var down = new FieldSet({id : 'searchGridFieldSet',title : '列表',items:[searchGrid]});
			_self.addChild(up);
			_self.addChild(down);
		},
		renderUI : function(){
			var _self = this;
			_self._calGridSize();
		},
		bindUI : function(){
			var _self = this,store = _self.get('store'),up = _self.getChild('searchFormFieldSet');
			//点击上方查询按钮刷新列表
			var searchForm = _self.getChild(SEARCH_FORM_ID, true);
			var gridBtn = _self.get('gridBtn');
			pbar = gridBtn.get('pbar');
			searchForm.on('formSearch',function(e){
				var param = e.param;
				//解决分页问题
				param["start"] = 0;
				param["pageIndex"] = 0;
				store.load(param);
				//采用此方法当一个模块使用两个本组件时会出现查询错误的问题（永远都只调用最后生成的SearchGridContainer的store的查询方法）
//				pbar.reload(param);
			});
			$(window).on('resize',function(){_self._calGridSize();});
			up.on('toggleEvent',function(){_self._calGridSize();});
			
		},
		_calGridSize : function(){//根据窗口高度和上面查询区域高度计算下方列表高度和宽度
			var _self = this;
			var searchForm = _self.getChild('searchFormFieldSet', true);
			var searchGrid = _self.getChild(SEARCH_GRID_ID, true);
			var formHeight = searchForm.get('el').outerHeight(true),
			extHeight = formHeight - searchForm.get('el').height();
			searchGrid.set('height', $(window).height() - TAB_HEIGHT - formHeight - extHeight);
			searchGrid.set('width', searchForm.get('el').width());
			var gridBodyWidth = $(".bui-grid-body .bui-grid-table").width();
			$(".bui-grid-header .bui-grid-table").width(gridBodyWidth);
		},
		_initSearchForm : function() {
			var _self = this;
            var searchFormCfg = BUI.merge(_self.get('searchForm'), {id : SEARCH_FORM_ID});
            var searchForm = new SearchForm(searchFormCfg);
            return searchForm;
		},
		_initSearchGrid : function() {
			var _self = this;
            var searchGridCfg = BUI.merge(_self.get('searchGrid'), {
            	id : SEARCH_GRID_ID,
            	store : _self.get('store'),
            	columns : _self.get('columns'),
            	width : '100%',
            	idField :'id',
            	loadMask: true
            });
            var gridBtn = new GridBtn(searchGridCfg);
            _self.set('gridBtn', gridBtn);
            return gridBtn;
		}
	}, {
		ATTRS : {
			searchForm : {},
			columns : {value : []},
			store : {},
			searchGrid : {},
			collapse:{value:true}//是否可以收缩表单内容
		},
		SEARCH_FORM_ID : SEARCH_FORM_ID,
		SEARCH_GRID_ID : SEARCH_GRID_ID,
		TAB_HEIGHT : TAB_HEIGHT
	});
	return SearchGridContainer;
});