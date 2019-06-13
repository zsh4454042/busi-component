/**
 * 从A-Z的字母列表分页工具栏
 * @author roysong
 * @date 171113
 */
define('common/bar/CharBar',['bui/common','bui/toolbar'],function(r){
	var BUI = r('bui/common'),Component = BUI.Component,Toolbar = r('bui/toolbar');
	var CHAR_ARRAY = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var CharBar = Toolbar.Bar.extend([Component.UIBase.Bindable],{
		initializer:function () {
            var _self = this,
                children = _self.get('children'),
                items = _self._getItems();
            BUI.each(items, function (item) {
                children.push(item);//item
            });
		},
		_getItems : function(){
			var _self = this,items = [];
			CHAR_ARRAY.forEach(function(char){
				items.push(_self._geCharItem(char));
			});
			return items;
		},
		_geCharItem : function(char){
			return {
				id : char,
				elCls : 'bui-button-number',
				disabled : true
			}
		},
		bindUI : function(){
			var _self = this,store = _self.get('store');
			$('.bui-button-number').click(function(){
				var charIdx = this.id;
				store.load({charIdx : charIdx });
			})
		}
	},{
		ATTRS : {
			itemStatusCls : {
		          value : {
		            selected : 'active',
		          }
		    },
			itemTpl : {
		          value : '<a href="#">{id}</a>'
		    },
		    elCls : {
		    	value : 'bui-pagingbar-number pagination pull-right'
		    }
		}
	})
	return CharBar;
})