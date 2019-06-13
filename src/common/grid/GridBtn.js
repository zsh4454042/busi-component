/**
 * 包含上下工具栏按钮，及能够根据按钮权限数据对按钮进行过滤的公用列表组件
 */
define('common/grid/GridBtn', [
	'bui/common','bui/grid','bui/mask',
	'common/bar/MsgTbar',
    'common/bar/PageSizeBar'
	], function(require) {
	var BUI = require('bui/common'),
	Grid = require('bui/grid'),Mask = require('bui/mask'),
	MsgTbar = require('common/bar/MsgTbar'),
	PageSizeBar = require('common/bar/PageSizeBar');
	var GridBtn = Grid.Grid.extend({
		renderUI : function(){
			var _self = this,
			permissionStore = _self.get('permissionStore'),
			tbarItems = _self.get('tbarItems'),
			paging = _self.get('paging'),
			loadMask = _self.get('loadMask');
			if(paging)
				_self._renderBbar();
			if(tbarItems)
				_self._renderTbar();
			if(permissionStore)
				$('.bui-grid-tbar button').hide();
			if(loadMask)
				loadMask.set('msg','数据加载中，请稍候...');
		},
		_renderBbar : function(){
			var _self = this,bbarContainer = _self.get('el').find('.bui-grid-bbar');
			bbarContainer.css('display','block');
			var bar = new PageSizeBar({store : _self.get('store'),render : bbarContainer,parent : _self});
			bar.render();
		},
		_renderTbar : function(){
			var _self = this,tbarItems = _self.get('tbarItems'),tbarContainer = _self.get('el').find('.bui-grid-tbar');
			tbarContainer.css('display','block');
			tbarContainer.css('width','100%');
			var bar = new MsgTbar({children : tbarItems,render : tbarContainer,parent : _self});
			bar.render();
			_self.set('tbar',bar);
		},
		_filterTbarButton : function(allowBtn){
			var _self = this,tbarContainer = _self.get('el').find('.bui-grid-tbar');
			tbarContainer.find('button').each(function(){
				var btnText =  $(this).text();
				if(BUI.Array.contains(btnText,allowBtn)){
					$(this).show();
				}
			});
		},
		_filterGridButton : function(allowBtn){
			var _self = this,tableContainer = _self.get('el').find('.bui-grid-table');
			tableContainer.find('.grid-command').each(function(){
				var btnText =  $(this).text();
				if(BUI.Array.contains(btnText,allowBtn)){
					$(this).show();
				}
			});
		},
		bindUI : function(){
			// 在表格数据加载完成后，根据按钮权限的permissionDesc中文匹配表格上下的按钮，没有配置权限的按钮默认隐藏
			var _self = this,store = _self.get('store'),permissionStore = _self.get('permissionStore');
			if(permissionStore){
				store.on('load',function(){
					if(!permissionStore.hasData()){
						$('.bui-grid-table .grid-command').hide();
						permissionStore.load(permissionStore.get('params'),function(e){
							var records = permissionStore.getResult(),
							btnArr = BUI.Array.map(records,function(record){
								return record.text;
							});
							_self._filterTbarButton(btnArr);
							_self._filterGridButton(btnArr);
						});
					}
				});
			}
		}
	}, {
		ATTRS : {
			tbarItems : {},//当此参数为空时，不生成表格上方tbar工具栏
			paging : {value : true},//是否有分页工具栏
			permissionStore : {}//当此参数为空时，不进行按钮权限过滤
		}
	});
	return GridBtn;
});