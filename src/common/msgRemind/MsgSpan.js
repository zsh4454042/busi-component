/**
 * @fileOverview 消息提醒span
 * @author zsh
 */
seajs.use('common/msgRemind/MsgSpan.css');
define('common/msgRemind/MsgSpan',['bui/common', 'common/msgRemind/MsgList'],function(require){
	var BUI = require('bui/common'),
	Component = BUI.Component;
	var DEFAULT_DESC = "{count}条待办&nbsp;&nbsp;";
	
	/**
	* 消息提醒span
	* @class 
	* @extends Component.Controller.extend
	*/
	var MsgSpan = Component.Controller.extend({
		renderUI : function(){
			var _self = this;
			var webSocket = _self.get('webSocket');
			webSocket.onmessage = function (e) {
				var count = e.data;
				if(count >= 0) {
					var content = BUI.substitute(DEFAULT_DESC, {count : count})
					_self.set('content', content);
					_self.set('elCls', 'yunWeiBlink');
				}
			}
		}
	},{
		ATTRS : {
			content : {
				value : BUI.substitute(DEFAULT_DESC, {count : 0})
			},
			elTagName : {
				value : 'span'
			},
			webSocket : {}
		},
	},{
		xclass : 'MsgSpan',
		priority : 1	
	});
	return MsgSpan;
});