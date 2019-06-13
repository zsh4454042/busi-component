/**
 * 组织机构选择框
 * 组织机构用法
 *<input type="text" id="orgSelectName" readonly="readonly" style="width: 175px;">
 *<input type="text" id="orgSelectId" readonly="readonly" style="display: none;">
 *<script>
 *var contextPath = '<%=contextPath%>' + '/';
 *seajs.use('common/OrganizationPicker',function(OrganizationPicker){
 *	 var orgPicker = new OrganizationPicker({
 *          trigger : '#orgSelectName',
 *         rootOrgId:'43c3803e730e495ab51ed1db6111dbdf',//必填项
 *          rootOrgText:'广州通信段',//必填项
 *          url : contextPath+'organization/getOrgChildrenById.cn',//必填项
 *          multipleSelect : true,//多选，选填
 *          autoHide: true,
 *          align : {
 *              points:['bl','tl']
 *            },
 *          width:200,
 *          height:200
 *	 });
 *	 orgPicker.render();
 *	 orgPicker.on('orgSelected',function(e){
 *		 //单选如下处理
 *		 $('#orgSelectName').val(e.org.text);
 *		 $('#orgSelectId').val(e.org.id);
 *		//多选如下处理
 *		var data = getSelection();
 *		var text = "";
 *		var id = "";
 *		for(var i=0;i<data.length;i++){
 *			text = text + ',' + data[i].text
 *			id = id + ',' + data[i].id
 *		}
 *		$('#orgSelectName').val(text.substring(1));
 *		$('#orgSelectId').val(id.substring(1));
 *	 });
 *});
 *</script>
 * 
 */
define('common/org/OrganizationPicker',['bui/overlay','bui/data','bui/tree'],function(require){
	
	var Overlay = require('bui/overlay').Overlay,
	Data=require('bui/data'),
	Tree = require('bui/tree'),
	ORGTREE_ID = 'common-orgpicker';
	var OrganizationPicker = Overlay.extend(
	{
		initializer:function(){
			var _self = this,orgTree = _self._initTree();
			_self.addChild(orgTree);
		},
		//根据传入的URL路径获取数据源
		_initTree : function(){
			var _self = this;
			/*
			*渲染ORG组织机构树
			*/
			var treeStore = new Data.TreeStore({
				root : {
					id : _self.get('rootOrgId'),
					text : _self.get('rootOrgText')
				},
				url : _self.get('url'),
				proxy : {
					method : 'post'
				},
				map : _self.get('map')
				});
			// 默认加载根节点
			treeStore.load({id : _self.get('rootOrgId')});
			var tree = new Tree.TreeList({
				id : ORGTREE_ID,
				store : treeStore,
				showRoot : _self.get('showRoot'),
				checkType : _self.get('checkType'),
				multipleSelect : _self.get('multipleSelect'),
				showLine : true,	//显示连接线
				cascadeCheckd : false, //不级联勾选
				width : _self.get('width'), 
				height : _self.get('height')
			});	
			_self.set('commonTreeStore',treeStore);
			return tree;

		},
		/**
		 * 获取勾选的数据
		 * @return Array
		 */
		getSelection : function(){
			var _self = this,tree = _self.getChild(ORGTREE_ID); 
			return tree.getSelection();
		},
		load : function(param){
			var _self = this,store = _self.get('commonTreeStore');
			if(store)
				store.load(param);
		},
		bindUI : function(){
			var _self = this;
			// 多选时，选中，取消选中都触发此事件，单选时，只有选中时触发此事件
			_self.getChild(ORGTREE_ID).on('selectedchange',function(ev){
				_self.fire("orgSelected",{					
					org : ev.item
				});
				_self.hide();
			});
		}
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
	    	 * 设置宽度,默认宽度200
	    	 */
	    	width:{value:200},
	    	/**
	    	 * 设置高度，默认高度200
	    	 */
	    	height:{value:200},
	    	/**
	    	 * 是否显示根节点，默认显示
	    	 */
	    	showRoot : {value : true},
	    	/**
	    	 * lidt 修改2017-8-1
	    	 * 新增自定义map,checkType,multipleSelect
	    	 */
	    	map : {
	    		value :{
	    			'name' : 'text',	// 节点显示文本
	    			'isdept' : 'leaf'	// 是否为叶子节点
	    		}
	    	},
	    	/**
	    	 * 勾选类型,默认自定义勾选，只有节点数据上有checked字段才允许勾选
	    	 */
	    	checkType : {value : 'custom'},
	    	/**
	    	 * 是否多选，默认单选
	    	 */
	    	multipleSelect : {value:false},
	    	/**
	    	 *  事件
	    	 */	    	
	    	events:{
	    		value: {
	    			/**
	    			 * orgSelected  选择一条数据
	    			 */
	    			'orgSelected': true	    			
	    			}
	    	}
	    }
	}
	);
	return OrganizationPicker;	
});