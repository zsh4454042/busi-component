/**
 * 组织机构树多选公用组件
 */
define('common/org/OrgTreePicker',[
								'bui/common','bui/picker',
								'bui/data','bui/tree'
	],function(require){
	var BUI = require('bui/common'),
	ListPicker = require("bui/picker").ListPicker,
	Data = require('bui/data'), Tree = require('bui/tree');
	var ORGTREE_ID = 'common-orgpicker';
	
	var OrgTreePicker = ListPicker.extend({
		initializer:function(){
			var _self = this;
			_self.addChild(_self._initTree());
		},
		// 根据传入的URL路径获取数据源
		_initTree : function(){
			var _self = this;
			var treeStore = new Data.TreeStore({
				root : {
					id : _self.get('rootOrgId'),
					text : _self.get('rootOrgText')
				},
				url : _self.get('url'),
				params : _self.get('params'),
				dataProperty : 'data',
				proxy : {
					method : 'post',
					dataType : 'json'
				},
				map : _self.get('map'),
				autoLoad : true
			});
			_self.set('commonTreeStore',treeStore);
			// 渲染ORG组织机构树
			var tree = new Tree.TreeList({
				id : ORGTREE_ID,
				store : treeStore,
				showRoot : _self.get('showRoot'),
				checkType : _self.get('checkType'),
				showLine : true,	//显示连接线
				cascadeCheckd : _self.get('cascadeCheckd'), //级联勾选
				multipleCheck:_self.get('multipleCheck'),//是否多选
				width : _self.get('width'), 
				height : _self.get('height'),
			});	
			return tree;
		},
		bindUI : function(){
			var _self = this;
			var valueField = _self.get('valueField');
			var trigger = _self.get('trigger');
			// 多选时触发此事件
			_self.getChild(ORGTREE_ID).on('checkedchange',function(ev){
				$(valueField).val(_self.getCheckedValue());
				$(trigger).val(_self.getCheckedText());
				_self.fire('orgChecked',{
					checkedValue : _self.getCheckedValue(),
					checkedText : _self.getCheckedText()
				})
			});
			// 多选时，屏蔽此事件
			if (!_self.get('multipleCheck')) {
				// 单选时触发此事件
				_self.getChild(ORGTREE_ID).on('selectedchange',function(ev){
					// leaf：是否为叶子节点属性名，true-叶子节点，false-根节点
					// 对应节点映射的map属性leaf映射
					if(ev.item.leaf){
						$(valueField).val(_self.getSelectedValue());
						$(trigger).val(_self.getSelectedText());
						_self.fire("orgSelected",{					
							selectedValue : _self.getSelectedValue(),
							selectedText : _self.getSelectedText()
						});
					}
				});
			}
			
		},
		// 多选时获取ids
		getCheckedValue: function() {
			var _self = this, tree = _self.getChild(ORGTREE_ID);
			var checked = tree.getCheckedNodes();
			var checkedValue = [];
			checked.map(function(e){
				// 过滤根节点数据
				if(e.leaf){
					checkedValue.push(e.id);
				}
			});
			return checkedValue.join(',');
		},
		// 多选时获取names
		getCheckedText: function() {
			var _self = this, tree = _self.getChild(ORGTREE_ID);
			var checked = tree.getCheckedNodes();
			var checkedText = [];
			checked.map(function(e){
				// 过滤根节点数据
				if(e.leaf){
					checkedText.push(e.text);
				}
			});
			return checkedText.join(',');
		},
		// 单选时获取id
		getSelectedValue : function(){
			var _self = this, tree = _self.getChild(ORGTREE_ID);
			var selected = tree.getSelection();
			var selectedValue = selected.map(function(e){
				return e.id;
			});
			return selectedValue;
		},
		// 单选时获取name
		getSelectedText : function(){
			var _self = this, tree = _self.getChild(ORGTREE_ID);
			var selected = tree.getSelection();
			var selectedText = selected.map(function(e){
				return e.text;
			});
			return selectedText;
		},
	},
	{
	    ATTRS : {
	    	/**
	    	 * 必填项
	    	 * 根节点组织机构ID
	    	 */
	    	rootOrgId:{},
	    	/**
	    	 * 必填项
	    	 * 根节点组织机构名称
	    	 */
	    	rootOrgText:{},
	    	/**
	    	 * 必填项
	    	 * 访问数据源的URL路径
	    	 */
	    	url:{},
	    	/**
	    	 * 访问数据源传的参数
	    	 */
	    	params : {value:{}},
	    	
	    	/**
	    	 * 是否显示根节点，默认显示
	    	 */
	    	showRoot : {value : true},
	    	/**
	    	 * checkType:勾选模式，提供了4中，all,onlyLeaf,none,custom
	    	   all : 全部节点可以勾选
			   onlyLeaf : 只有子节点可以勾选
			   custom : 自定义勾选，只有节点数据上有checked字段才允许勾选
			   none : 全部节点不可勾选
	    	 */
	    	checkType : {value : 'all'},
	    	/**
	    	 * 是否级联勾选
	    	 */
	    	cascadeCheckd : {value : true},
	    	/**
	    	 * 是否多选
	    	 */
	    	multipleCheck : {value : true},
	    	/**
	    	 *  节点映射
	    	 */
	    	map : {
	    		value :{
	    			'name' : 'text',	// 节点显示文本
	    			'isdept' : 'leaf'	// 是否为叶子节点
	    		}
	    	},
			events:{
				value:{
					"orgChecked":true,
					'orgSelected': true	   
				}
			},
			width :{value : 250},
			height :{value : 300}
	    },
	    ORGTREE_ID : ORGTREE_ID
	});
	return OrgTreePicker;	
});