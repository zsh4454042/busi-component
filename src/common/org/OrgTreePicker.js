/**
 * 组织机构树多选公用组件--luoyan
 */
define('common/org/OrgTreePicker',['bui/common','bui/picker','bui/data','bui/tree'],function(require){
	
	var Common = require('bui/common'),
	ListPicker = require("bui/picker").ListPicker,
	Data=require('bui/data'),
	Tree = require('bui/tree');
	ORGTREE_ID = 'common-orgpicker';
	var OrganizationPicker = ListPicker.extend(
	{
		initializer:function(){
			var _self = this,orgTree = _self._initTree();
			_self.addChild(orgTree);
		},
		//根据传入的URL路径获取数据源
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
			/*
			*渲染ORG组织机构树
			*/
			var tree = new Tree.TreeList({
				id : ORGTREE_ID,
				store : treeStore,
				showRoot : _self.get('showRoot'),
				checkType : _self.get('checkType'),
				showLine : true,	//显示连接线
				cascadeCheckd : true, //级联勾选
				multipleCheck:_self.get('multipleCheck'),
				width : _self.get('width'), 
				height : _self.get('height')
			});	
			return tree;

		},
		
		bindUI : function(){
			var _self = this;
			var  valueField = _self.get('valueField');
			var  trigger = _self.get('trigger');
			_self.getChild(ORGTREE_ID).on('checkedchange',function(ev){
				if(valueField){
					$(valueField).val(_self.getSelectedValue());
				}
				if(trigger){
					$(trigger).val(_self.getSelectedText());
				}
				_self.fire('selectedChange',{
					selectedValue:_self.getSelectedValue(),
					selectedText:_self.getSelectedText()
				})
			});
			/**
			 * 兼容单选的回显 luoyan
			 */
			if(_self.get('checkType')=='none'){
				_self.getChild(ORGTREE_ID).on('itemclick',function(ev){
					var item = ev.item;
					if(valueField){
						$(valueField).val(item.id);
					}
					if(trigger){
						$(trigger).val(item.text);
					}
					_self.fire('orgItemclick',{
						value:item.id,
						text:item.text
					})
				});
			}
			
		},
		getSelectedValue: function() {
			var _self = this,
				tree = _self.getChild(ORGTREE_ID);
			var seleNodes = tree.getCheckedNodes();
			return seleNodes = seleNodes, Common.Array.map(seleNodes, function(e) {
				return e.id
			}).join(",")
		},
		getSelectedText: function() {
			var _self = this,
				tree = _self.getChild(ORGTREE_ID);
			var seleNodes = tree.getCheckedNodes();
			return seleNodes = seleNodes, Common.Array.map(seleNodes, function(e) {
				return e.text
			}).join(",")
		},
	},
	{
	    /**
	     * 
	     */
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
	    	 * 是否多选，默认多选
	    	 */
	    	multipleCheck : {value : true},
	    	/**
	    	 * all,onlyLeaf,none,custom
	    	 */
	    	checkType : {value:'all'},
	    	
	    	/**
	    	 *  节点映射
	    	 */
	    	map : {value :  { 
				'ORG_ID_' : 'id',
				'SHOW_ORG_NAME_' : 'text' 
			}},
	    	
			selectStatus : {value :'selected'},// 设置勾选作为状态改变的事件
			events:{//选择改变事件，quyy加
				value:{
					"selectedChange":true
				}
			},
			
			width :{value : 300},
			height :{value : 320}
	    }
	}
	);
	return OrganizationPicker;	
});