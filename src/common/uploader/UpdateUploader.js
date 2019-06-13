/**
 * 用于新增和修改更新业务时的附件展示和修改。
 * 解决修改更新时，附件上传组件载入已上传附件，点击任意附件的删除按钮后，只会删除第一条附件的问题。
 */
define('common/uploader/UpdateUploader', ['bui/uploader', 'bui/progressbar'], function (r) {
    var Uploader = r('bui/uploader'), Theme = Uploader.Theme, ProgressBar = r('bui/progressbar'),
        Progressbar = ProgressBar.Base;
    ;
    Theme.addTheme('updateTheme', {//自定义附件组件的显示主题
        elCls: 'defaultTheme',
        queue: {
            //结果的模板，可以根据不同状态进进行设置
            resultTpl: {
                'default': '<div class="default">{name}</div>',
                'success': '<div class="success"><label id="{id}" class="fileLabel" title={title}>{name}</label></div>',
                'error': '<div class="error"><span title="{name}"></span><span class="uploader-error">{msg}</span></div>',
                'progress': '<div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div>'
            }
        }
    });
    var UpdateUploader = Uploader.Uploader.extend({
        renderUI: function () {
            var _self = this, queue = _self.get('queue'), items = _self.get('alreadyItems');
            if (items && Array.isArray(items)) {
                queue.addItems(items);
            }
        },
        bindUI: function () {
            var _self = this, queue = _self.get('queue'), items = queue.getItems();
            if (items) {
                items.forEach(function (item) {
                    queue.updateFileStatus(item, 'success');
                });
            }
            _self.on('change', function (e) {
                var itemArr = e.items, fileSliceSize = 2097152;
                for (var i in itemArr) {
                    if (itemArr[i].size > fileSliceSize) {//文件大于2M时进行拆分上传
                        var item = itemArr[i];
                        queue.updateFileStatus(item, 'progress');
                        var file = item.file, blobArr = [];//获取文件的FILE对象
                        //1.安装2M大小对文件进行切片
                        var sliceNum = Math.ceil(file.size / fileSliceSize);
                        for (var j = 0; j < sliceNum; j++) {
                            var start = j * fileSliceSize,
                                end = (start + fileSliceSize) >= file.size ? file.size+1 : (start + fileSliceSize);
                            blobArr.push(file.slice(start, end, file.type));
                        }
                        //2.发送文件大小和文件名称给服务器端，确定从第几个分片开始上传
                        $.ajax({
                           url:'/zuul/std/atachFile/checkFile' ,
                            data:{name: item.name, size: item.size},
                            async:false,
                            type:'POST',
                            success:function (result) {
                                if (result) {
                                    _self._uploadBlob(result, blobArr, item);
                                } else {
                                    _self._uploadBlob(0, blobArr, item);
                                }
                            }
                        });
                    } else {//小于2M的文件通过BUI原有机制上传
                        _self.upload();
                    }
                }
            })
        },
        getSucFiles: function () {
            var _self = this, queue = _self.get('queue');
            return queue.getItemsByStatus('success');
        },
        /**
         * 分片上传文件
         * @param upNum 分片起始上传序号
         * @param blobArr 分片数组
         * @param item 上传文件对象
         * @private
         */
        _uploadBlob: function (upNum, blobArr, item) {
            var _self = this, queue = _self.get('queue');
            var i = upNum;
            var formData = new FormData();
            if (i == blobArr.length - 1) {
                formData.append("status", "end");
            }else{
                formData.append("status", "slice");
            }
            formData.append("name", item.name);
            formData.append("size", item.size);
            formData.append("file", blobArr[i], item.name +"_"+ item.size + "_" + i);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/zuul/std/atachFile/uploadSlice");
            xhr.send(formData);
            xhr.onload = function (e) {
                if (e.target.response) {
                    item.path=JSON.parse(e.target.response).path;
                    queue.updateFileStatus(item, 'success');
                } else {
                    item.loadedPercent = 100 / blobArr.length * (i + 1);
                    if (!item.success) {
                        queue.updateFileStatus(item, 'progress');
                    }
                }
                i++;
                if(i<blobArr.length){
                    _self._uploadBlob(i,blobArr,item);
                }
            }
        }
    }, {
        ATTRS: {
            alreadyItems: {value: []},
            rules: {
                value: {
                    //文的类型
                    ext: ['.doc,.docx,.xls,.xlsx,.vsd,.pdf,.jpg,.tif,.dwg', '文件类型只能为{0}'],
                    //文件大小的最大值,单位也是kb
                    maxSize: [1024 * 250, '文件大小不能大于250M']
                }
            },
            theme: {value: 'updateTheme'},
            autoUpload: {value: false}
        }
    });
    return UpdateUploader;
});