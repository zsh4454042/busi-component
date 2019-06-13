/**
 * @fileOverview 消息提醒组件
 * @author zsh
 */
define('common/msgRemind/MsgRemind',
		['bui/common', 'common/msgRemind/MsgSpan', 'common/msgRemind/MsgDialog'],
		function(require){
	var BUI = require('bui/common'),
	Component = BUI.Component,
	MsgSpan =  require('common/msgRemind/MsgSpan'),
	MsgDialog =  require('common/msgRemind/MsgDialog');
	/**
	* 
	* <pre><code>
	* <span id="msgRemind"></span>
	* <script type="text/javascript">
	*	BUI.use(['common/msgRemind/MsgRemind','bui/data'],function(MsgRemind,Data){
	*		// store返回数据格式要求：
	*		// {
	*		// 	id : 字符串，三级菜单权限id
	*		// 	text : 字符串，三级菜单名称或其他业务说明
	*		// 	count :  数字，三级菜单模块待处理记录总数
	*		// 	href : 跳转处理->三级菜单加载路径
	*		// }
	*		var msgListStoreCfg = {
	*			url : 'http://192.168.0.216:8001/processhandle/todoList/getTodoList',
	*			proxy : {
	*				method : 'get',
	*				dataType : 'jsonp',
	*				jsonp : "callback",
	*				jsonpCallback : "success_callback",
	*			},
	*			params : {
	*				userId : "45e63d71105e4014adae167212f734a6"
	*			},
	*			autoLoad :true,
	*			pageSize : 10
	*		};
	*		// webSocket返回数据格式要求：
	*		// 数字，表示当前用户所有模块的代办记录总数
	*		var webSocket = new WebSocket("ws://192.168.0.216:7008/socket/todoListSocket/"+_self.get("userId"));
	*		var msgRemind = new MsgRemind({
	*			render : '#msgRemind',
	*			webSocket : webSocket,
	*			msgListStoreCfg : msgListStoreCfg
	*		});
	*		msgRemind.render();
	*	});
	* </script>
	* </code></pre>
	* 消息提醒组件
	* @class 
	* @extends Component.Controller.extend
	*/
	var MsgRemind = Component.Controller.extend({
		initializer : function(){
			var _self = this;
			var msgSpan = new MsgSpan({
				webSocket : _self.get('webSocket')
			});
			_self.addChild(msgSpan);
			_self.set('msgSpan', msgSpan);
		},
		bindUI : function(){
			var _self = this;
			
			_self.on('click', function(e){
				var msgDialog = new MsgDialog({
					msgListStoreCfg : _self.get('msgListStoreCfg')
				});
				msgDialog.show();
				
				msgDialog.on('jumpHandle', function(item){
					_self.fire('jumpHandle', item);
				});
			});
		}
	},{
		ATTRS : {
			events : {
				value : {
					'jumpHandle' : true
				}
			},
			elTagName : {
				value : 'span'
			},
			msgListStoreCfg : {
				
			},
			webSocket : {
				
			}
		},
	},{
		xclass : 'MsgRemind',
		priority : 1	
	});
	return MsgRemind;
});