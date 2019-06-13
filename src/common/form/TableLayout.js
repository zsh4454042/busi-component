/**
 * 表格布局，使用时需要引入tableLayout.css文件
 */
seajs.use('common/form/tableLayout.css');
define('common/form/TableLayout',['bui/common'],function(require){
	var BUI = require('bui/common'),
	Controller = BUI.Component.Controller;
	
	var CLS_TABLE = 'tableLayout',
	ATTR_LABEL = 'label',
	ATTR_ITEM_COLSPAN = 'itemColspan',
	ARRR_RED_STAR_FLAG = 'redStarFlag',
	ATTR_ITEM = 'item';
	
	var TableLayout = Controller.extend({
		
		initializer : function() {
			
			var _self = this;
			_self.set('elTagName', 'table');
			_self.set('elCls', CLS_TABLE);
			_self.set('children', _self._initTableContent());
		},
		_initTableContent : function() {
			
			var _self = this;
			var colNum = _self.get('colNum') * 2;// 计算得出实际表格列
			var remainColNum = colNum;
			
			var formChildrens = _self.get('formChildrens');
			formChildrens = BUI.Array.map(formChildrens, function(elememt) {
				
				if(!elememt[ATTR_ITEM_COLSPAN]) {
					elememt[ATTR_ITEM_COLSPAN] = 1;
					return elememt;
				}
				elememt[ATTR_ITEM_COLSPAN] = elememt[ATTR_ITEM_COLSPAN] * 2 - 1;
				return elememt;
			});
			
			var trArray = new Array();
			var tr = _self._createTr();
			BUI.Array.each(formChildrens, function(formChildren) {
				
				tr.addChild(_self._createTh(formChildren));
				tr.addChild(_self._createTd(formChildren));
				
				remainColNum = remainColNum - formChildren[ATTR_ITEM_COLSPAN];
				
				if(remainColNum <= colNum/2) {
					trArray.push(tr);
					
					tr = _self._createTr();
					remainColNum = colNum;
				}
			});
			
			return trArray;
		},
		_createTr : function() {
			var tr = new Controller({
				elTagName : 'tr',
			});
			return tr;
		},
		_createTh : function(formChildren) {
			var _self = this;
			var th = new Controller({
				elTagName : 'th',
				content : _self._getLabel(formChildren)
			});
			return th;
		},
		_createTd : function (formChildren) {
			
			var td = new Controller({
				elTagName : 'td',
				elAttrs : {
					colspan : formChildren[ATTR_ITEM_COLSPAN]
				}
			});
			var div = new Controller({
				elTagName : 'div',
				content : formChildren[ATTR_ITEM]
			});
			td.addChild(div);
			return td;
		},
		_getLabel : function(item) {
			var itemLabel = item[ATTR_LABEL];
			if(item[ARRR_RED_STAR_FLAG]) {
				return '<s>*</s>' + itemLabel;
			}
			// &ensp半角空格，用于没有*标示单元格的占位符
			return '&ensp;' + itemLabel;
		}
	}, {
		ATTRS : {
			colNum : {value : 1},
			formChildrens : {}
		}
	});
	return TableLayout;
});