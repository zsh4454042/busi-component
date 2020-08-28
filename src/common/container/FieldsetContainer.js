/**
 * 带标题和边框的fieldset容器
 */
seajs.use('common/container/fieldsetContainer.css');
define('common/container/FieldsetContainer',['bui/common'],function(r){
	var BUI = r('bui/common'),Component = BUI.Component;
	var COLLAPSE_ARROW = '&nbsp;<span class="x-caret x-caret-left"></span>',
		EXPAND_ARROW = '&nbsp;<span class="x-caret x-caret-down"></span>';
	var FieldsetContainer = Component.Controller.extend({
		initializer:function(){
			var _self = this;
			var legend = _self._initLegend();
			_self.addChild(legend);
			BUI.each(_self.get('items'),function(e){
				_self.addChild(e);
			});
		},
		_initLegend:function(){
			var _self = this,title = _self.get('title'),collapse = _self.get('collapse');
			if(collapse)
				title += EXPAND_ARROW;
			else
				title;
			var legend = new Component.Controller({
				id : 'common-legend',
				elTagName : 'legend',
				elCls : 'common-legend',
				content : title
			});
			return legend;
		},
		bindUI:function(){
			var _self = this,legend = _self.getChild('common-legend'),
			collapse = _self.get('collapse'),title = _self.get('title');
			legend.on('click',function(){
				if(!collapse)
					return;
				var height = _self.get('el').height();
				if(height){//收缩
					_self.set('legendHeight',height);
					_self._disableChildren(false);
					_self.set('height',0);
					legend.set('content',title + COLLAPSE_ARROW )
				}else{//展开
					_self.set('height',_self.get('legendHeight'));
					_self._disableChildren(true);
					legend.set('content',title + EXPAND_ARROW )
				}
				_self.fire('toggleEvent',{});
			})
		},
		_disableChildren:function(status){
			var _self = this;
			_self.eachChild(function(c){
				if(c.get('id') != 'common-legend')
					c.set('visible',status)
			});
		}
	},{
		ATTRS:{
			elCls : {value:'common-fieldset'},
			elTagName  : {value : 'fieldset'},
			items : {value : []},
			collapse : {value : false},
			events : {
				value : {
					'toggleEvent' : true
				}
			},
			title : {}
		}
	});
	return FieldsetContainer;
});