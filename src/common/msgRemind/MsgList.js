/**
 * @fileOverview 消息列表
 * @author zsh
 */
define('common/msgRemind/MsgList',
		['bui/common', 'bui/list'],
		function(require){
	var BUI = require('bui/common'),
	Component = BUI.Component;
	List = require('bui/list');
	var ITEM_TPL = '<li class="bui-list-item {handleCls}" style="height: 22px;color: #333333; cursor: pointer; box-shadow: 0 0 1px #999999 inset; padding: 4px;">'
		+ '<span style="float: left; line-height:1; padding: 5.5px 7px; color: #428bca; ">{text}</span><span class="badge badge-error" style="padding: 3px 4px; position: relative; left: -5px; top: -5px;">{count}</span><span class="x-icon x-icon-small x-icon-info" style="float: right; position: relative; top: 4px;"><i class="icon icon-white {handleIconCls}"></i></span>'
		+ '</li>';
	
	/**
	* 弹出框带面包屑组件，弹出框表头包含面包屑
	* @class 
	* @extends List.SimpleList.extend
	*/
	var MsgList = List.SimpleList.extend({
		bindUI : function(){
			var _self = this;
			_self.on('itemclick', function(e){
				var element = $(e.element);
				var item = e.item;
				
		    	if(element.hasClass('jumpBtn')) {
		    		_self.fire('jumpHandle', item);
		    	}
		    	/*
		    	 * return false说明：
		    	 * 阻止触发 'rowclick' ,'rowselected','rowunselected'事件，解决报错：Cannot read property 'isElementSelected' of undefined
		    	 */ 
		    	return false;
	        });
		}
	},{
		ATTRS : {
			events : {
				value : {
					'jumpHandle' : true
				}
			},
			store : {},
			itemTplRender : {
				value : function(item) {
					
					var text = item.text;
					var count = item.count;
					return BUI.substitute(ITEM_TPL, {
						text : text,
						count : count,
						handleCls : 'jumpBtn',
						handleIconCls : 'icon-share-alt'
					});
				}
			},
			width : {value : '100%'},
		},
	});
	return MsgList;
});