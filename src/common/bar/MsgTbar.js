/**
 * 带消息提示的grid上方工具栏
 */
define('common/bar/MsgTbar', ['bui/toolbar'], function(r) {
	var Toolbar = r('bui/toolbar');
	//失败提示信息
	var errorMsgHtml = '<div id="errorMsg" class="tips tips-small tips-warning" style="display:none">'+
    '<span class="x-icon x-icon-small" style="background:#da4f49;color:#FFF;"><i class="icon icon-white icon-bell"></i></span>'+
    '<div id="errorResultMsg" class="tips-content"></div>'+
    '</div>';
	//成功提示信息
	var sucMsgHtml = '<div id="sucMsg" class="tips tips-small  tips-success" style="display:none">'+
	'<span class="x-icon x-icon-small x-icon-success"><i class="icon icon-white icon-ok"></i></span>'+
	'<div id="sucResultMsg" class="tips-content"  style="width:100%;"></div>'+
	'</div>';
	var MsgTbar = Toolbar.Bar.extend({
		initializer:function(){
			var _self = this;
			_self.addChild({
				id: 'msgTips',
                xclass:'bar-item-text',
                text:errorMsgHtml + sucMsgHtml
			});
		},
		msg : function(result){
			var _self = this;
			if(result.status == '1'){
				_self._suc(result.msg);
			}else{
				_self._fail(result.msg);
			}
		},
		_suc : function(msg){
			var _self = this,msgTipsEl = _self.getChild('msgTips').get('el');
			if(!msg){
				msg = '操作成功！';
			}
			msgTipsEl.find('#sucResultMsg').empty();
			msgTipsEl.find('#sucResultMsg').append(msg);
			msgTipsEl.find('#sucMsg').show();
			msgTipsEl.find('#sucMsg').fadeOut(5000);
		},
		_fail : function(msg){
			var _self = this,msgTipsEl = _self.getChild('msgTips').get('el');
			if(!msg){
				msg = '保存数据失败，请联系管理员！';
			}
			msgTipsEl.find('#errorResultMsg').empty();
			msgTipsEl.find('#errorResultMsg').append(msg);
			msgTipsEl.find('#errorMsg').show();
			msgTipsEl.find('#errorMsg').fadeOut(5000);
		}
	},{
		ATTRS : {
			defaultChildClass : {value : "bar-item-button"},
			width : {value : '100%'},
			elCls : {value : 'bui-grid-button-bar'}
		}
	});
	return MsgTbar;
});