/**
 * @fileOverview 消息列表弹出框，包含消息列表和分页组件
 * @author zsh
 */
define('common/msgRemind/MsgDialog', 
		['bui/common', 'bui/data', 'bui/overlay', 'bui/toolbar', 'common/msgRemind/MsgList'], 
		function(require) {
	var BUI = require('bui/common'),
	Component = BUI.Component,
	Data = require('bui/data'),
	Overlay = require('bui/overlay'),
	Toolbar = require('bui/toolbar'),
	MsgList = require('common/msgRemind/MsgList');
	
	/**
	* 消息列表弹出框，包含消息列表和分页组件
	* @class 
	* @extends Overlay.Dialog.extend
	*/
	var MsgDialog = Overlay.Dialog.extend({
		initializer:function(){
			var _self = this;
			
			_self._ininStore();
			
			var msgList = _self._initMsgList();
			_self.addChild(msgList);
			_self.set('msgList', msgList);
			
			var paging = _self._initNumberPagingBar();
			_self.addChild(paging);
			_self.set('paging', paging);
		},
		bindUI : function(){
			var _self = this;
			var msgList = _self.get('msgList');
			msgList.on('jumpHandle', function(item) {
				_self.fire('jumpHandle', item);
				_self.close();
			});
		},
		_initMsgList : function() {
			var _self = this;
			var msgList = new MsgList({
				store : _self.get('store')
			});
			return msgList;
		},
		_initNumberPagingBar : function() {
			var _self = this;
			var paging = new Toolbar.NumberPagingBar({
				elCls : 'pagination pull-right',
				store : _self.get('store'),
			});
			return paging;
		},
		_ininStore : function() {
			var _self = this;
			var store = new Data.Store(_self.get('msgListStoreCfg'));
			_self.set('store', store);
			return store;
		}
	}, {
		ATTRS : {
			events : {
				value : {
					'jumpHandle' : true
				}
			},
			footerStyle : {
				value : {
					display : 'none'
				}
			},
			msgListStoreCfg : {},
			mask : {value : true},
			width : {value : 650},
			height : {value : 450},
			title : {value : '待办列表'},
			closeAction : {
				value : 'destroy'
			},
		}
	});
	return MsgDialog;
});