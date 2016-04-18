function qcloudXBlockInitStudio(runtime, element) {

    $(element).find('.action-cancel').bind('click', function() {
        runtime.notify('cancel', {});
    });
/*
    $(element).find('.action-save').bind('click', function() {
        var data = {
            'file_id': $('#youku_edit_file_id').val(),
        };

        runtime.notify('save', {state: 'start'});

        var handlerUrl = runtime.handlerUrl(element, 'save_qcoud');
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
*/
    var ErrorCode = qcVideo.get('ErrorCode'), JSON = qcVideo.get('JSON'), Log = qcVideo.get('Log');

    ErrorCode.UN_SUPPORT_BROWSE !== qcVideo.uploader.init(
        //1: 上传基础条件
        {
            web_upload_url: 'http://vod.qcloud.com/v2/index.php',
            upBtnId: "qcloud_upload", //上传按钮ID（任意页面元素ID
            secretId: "AKIDfVocMTtvumn6qE5UOFAoPGz4rujCv03a", // 云api secretId
            secretKey: "JnQaORflRzhOozOXylFyNQXIEJmdH9Jt",//云api secretKey: <选填参数> （secretKey不能暴露给外部用户，建议只在内部系统使用该参数）
            /*
                @desc 获取签名的方法  <选填参数>
                server端实现逻辑
                1:首先 secretKey 做sha1 加密 argStr 得到结果 result
                2:最后 将result做base64后返回
                附nodejs样例
                    crypto.createHmac('sha1', '你的secretKey').update(argStr).digest().toString('base64');
                附php实例实现
                    base64_encode(hash_hmac('sha1', $argStr, $secretKey, true));
                附java示例实现 感谢 更深的蓝 友情赞助
                    http://video.qcloud.com/sdk/GetSKeyServlet.java.txt
            */
        
            // getSignature: function(argStr,done){
            // //     //注意：出于安全考虑， 服务端接收argStr这个参数后，需要校验其中的Action参数是否为 "MultipartUploadVodFile",用来证明该参数标识上传请求
            //     $.ajax({
            //         'dataType': 'json',
            //         'url': 'http://video.qcloud.com/?args='+encodeURIComponent(argStr),
            //         'success': function(d){
            //             done(d['result']);
            //             console.log(d);
            //         }
            //     });
            // }
        

            after_sha_start_upload: true,//sha计算完成后，开始上传 (默认非立即上传)
            sha1js_path: 'http://video.qcloud.com/calculator_worker_sha1.js', //计算sha1的位置  ，默认为 'http://你的域名/calculator_worker_sha1.js'
            disable_multi_selection: false, //禁用文件多选 ，默认不禁用
            transcodeNotifyUrl: 'http://test.domain.com/on_transcode_done.serverfile',//(转码成功后的回调地址)isTranscode==true,时开启； 回调url的返回数据格式参考  http://www.qcloud.com/wiki/v2/MultipartUploadVodFile
            classId: null, //视频分类的ID
        },
        //2: 回调函数
        {
            /**
            * 更新文件状态和进度
            * @param args { id: 文件ID, size: 文件大小, name: 文件名称, status: 状态, percent: 进度,speed: 速度, errorCode: 错误码 }
            */
            onFileUpdate: function (args) {
                Log.debug(args);
            },
            /**
            * 文件状态发生变化
            * @param info  { done: 完成数量 , fail: 失败数量 , sha: 计算SHA或者等待计算SHA中的数量 , wait: 等待上传数量 , uploading: 上传中的数量 }
            */
            onFileStatus: function (info) {
                var data = JSON.stringify(info);
                Log.debug('各状态总数-->',data);
                if(data[serverFild])
                {
                    $('#qcloud_edit_file_id').val(data[serverFild]);
                }

            },
            /**
            *  上传时错误文件过滤提示
            * @param args {code:{-1: 文件类型异常,-2: 文件名异常} , message: 错误原因 ， solution: 解决方法 }
            */
            onFilterError: function (args) {
                Log.debug('message:' + args.message + (args.solution ? (';solution==' + args.solution) : ''));
            }
        }
    );
}
