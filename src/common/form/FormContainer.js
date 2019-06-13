/**
 * 表单容器，使用时需要引入tableLayout.css文件

表单使用方法：

seajs.use(["form/FormContainer"],function(FormContainer){
	
	var formContainer = new FormContainer({
		colNum : 2,
		formChildrens : 
			[
				{
					label : '文件主题：',
					redStarFlag : true,
					itemColspan : 2,
					item : '<input type="text" id="fileName" data-rules="{required : true}" />'
				}, {
					label : '文件来源：',
					itemColspan : 2,
					item : '<input type="text" id="fileSrc" />'
				}, {
					label : '文件类型：',
					redStarFlag : true,
					item : '<select id="fileType" data-rules="{required : true}"><option>请选择</option></select>'
				}, {
					label : '适用范围：',
					redStarFlag : true,
					item : '<select id="fileSuitableRange" data-rules="{required : true}"></select>'
				}, {
					label : '备注：',
					itemColspan : 2,
					item : '<textarea id="remark" data-rules="{required : true}"></textarea>'
				},
			]
	});
	formContainer.render();

 */
define('common/form/FormContainer',['bui/common', 'bui/form', 'bui/tooltip', 'common/form/TableLayout'],function(require){
	var BUI = require('bui/common'),
	Controller = BUI.Component.Controller,
	HForm = require('bui/form').HForm,
	Tooltip = require('bui/tooltip'),
	TableLayout = require('common/form/TableLayout');
	
	var ATTR_ID = 'formContainer';
	
	var FormContainer = Controller.extend({
		
		initializer : function() {
			var _self = this;
			_self.set('elTagName', 'form');
			_self.set('elAttrs', {id : _self.get('attr_id')});
			_self.addChild(_self._initTableLayout());
		},
		renderUI : function() {
			var _self = this;
			_self._initHForm();
			_self._initValidTooltip();
		},
		_initTableLayout : function() {
			var _self = this;
			
			var tableLayout = new TableLayout({
				colNum : _self.get('colNum'),
				formChildrens : _self.get('formChildrens')
			});
			return tableLayout;
		},
		_initHForm : function() {
			var _self = this;
			var form = new HForm({
				srcNode : '#' + _self.get('attr_id'),
				errorTpl : '<span class="x-icon x-icon-small x-icon-error" data-title="{error}">!</span>'
			}).render();
			_self.set('common-formcontainer',form);
		},
		serializeToObject : function(){
			var _self = this,form = _self.get('common-formcontainer');
			return form.serializeToObject();
		},
		isValid : function(){// 表单验证是否通过
			var _self = this,form = _self.get('common-formcontainer');
			return form.isValid();
		},
		valid : function(){// 执行表单验证
			var _self = this,form = _self.get('common-formcontainer');
			form.valid();
		},
		_initValidTooltip : function() {
			new Tooltip.Tips({
		        tip : {
		          trigger : '.x-icon-error', //出现此样式的元素显示tip
		          alignType : 'left', //默认方向
		          elCls : 'tips tips-warning tips-no-icon tip1',
		          elStyle : {
		        	  'border-color' : '#EEEBEB',
		        	  'background-color' : '#FCFCFC'
		          },
		          zIndex : '2000',
		          offset : 10 //距离左边的距离
		        }
		      }).render();
		}
	}, {
		ATTRS : {
			colNum : {value : 1},
			formChildrens : {},
			attr_id:{value:'formContainer'}
		}
	});
	return FormContainer;
});