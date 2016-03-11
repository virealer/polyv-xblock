function polyvXBlockInitStudio(runtime, element) {

    $(element).find('.action-cancel').bind('click', function() {
        runtime.notify('cancel', {});
    });

    $(element).find('.action-save').bind('click', function() {
        var data = {
            'vid': $('#polyv_vid').val(),
        };

        runtime.notify('save', {state: 'start'});

        var handlerUrl = runtime.handlerUrl(element, 'save_polyv');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                runtime.notify('save', {state: 'end'});
                // Reload the whole page :
                // window.location.reload(false);
            } else {
                runtime.notify('error', {msg: response.message})
            }
        });
    });

    $('#file_upload').uploadifive({
        'auto': true,
        //'uploadScript':'static/lib/uploadify/uploadify.php',
        'formData':{
        'fcharset':'ISO-8859-1',
        'writetoken':'6fb7b901-103c-4d58-b8a8-d5af9bc9bf4f',
        'cataid':'1',
        'JSONRPC':'{"title": "这里是标题", "tag": "标签", "desc": "视频文档描述"}',
        },
        'buttonText':'选择上传文件',
        'fileSizeLimit':'3000MB',
        //'fileType':'视频文件',
        'fileType' : 'video/*',//文件类型过滤
        //'swf'      : '/static/lib/uploadify/uploadify.swf',
        'uploadScript' : 'http://v.polyv.net/uc/services/rest?method=uploadfile',
        'multi':true,
        //'successTimeout':1800,
        'queueSizeLimit':100,

        'onUploadComplete':function(file,data,response){
            var jsonobj = eval('('+data+')');
            // alert(jsonobj.data[0].vid + " - " + jsonobj.data[0].playerwidth + " - " + jsonobj.data[0].duration);
            $("#polyv_vid").val(jsonobj.data[0].vid);
        }
    });

//    $(element).find('.action-upload').click(function(){
//        $('#file_upload').uploadifive('upload');
//    });
}
