/* Javascript for QiniuXBlock. */
function polyvXBlockInitStudio(runtime,element) {

    var elemContainer = $(element),
        $fileUpload = $('#file_upload');
//polyv upload
    function upload(url, onComplete) {

        if (!onComplete) {
            onComplete = function (file, data, response) {
                var jsonobj = eval('(' + data + ')');
                // alert(jsonobj.data[0].vid + " - " + jsonobj.data[0].playerwidth + " - " + jsonobj.data[0].duration);
                $("#polyv_vid").val(jsonobj.data[0].vid);
            };
        }

        $fileUpload.uploadifive({
            'auto': false,
            //'uploadScript':'static/lib/uploadify/uploadify.php',
            'formData': {
                'fcharset': 'ISO-8859-1',
                'writetoken': '6fb7b901-103c-4d58-b8a8-d5af9bc9bf4f',
                'cataid': '1',
                'JSONRPC': '{"title": "这里是标题", "tag": "标签", "desc": "视频文档描述"}',
            },
            'buttonText': '选择上传文件',
            'fileSizeLimit': '3000MB',
            //'fileType':'视频文件',
            'fileType': 'video/*',//文件类型过滤
            //'swf'      : '/static/lib/uploadify/uploadify.swf',
            'uploadScript': url,
            'multi': true,
            //'successTimeout':1800,
            'queueSizeLimit': 100,

            'onUploadComplete': onComplete
        });
    }

    elemContainer.find('select').change(function () {
        var value = $(this).val();
        if (value === "polyv") {

            upload('http://v.polyv.net/uc/services/rest?method=uploadfile');

            elemContainer.find('.action-upload').unbind("click").click(function () {
                $fileUpload.uploadifive('upload');
            });
        }
        else if(value === "qqcloud"){
            console.log(value);
            //elemContainer.find('.action-upload').unbind("click").click(function () {
                var ErrorCode = qcVideo.get('ErrorCode'),
                    JSON = qcVideo.get('JSON'),
                    Log = qcVideo.get('Log');
                qcVideo.uploader.init(
                    {
                        web_upload_url: 'http://vod.qcloud.com/v2/index.php',
                        upBtnId: 'upBtnId',
                        secretId: "AKIDfVocMTtvumn6qE5UOFAoPGz4rujCv03a", // 云api secretId
                        secretKey: "JnQaORflRzhOozOXylFyNQXIEJmdH9Jt",
                        after_sha_start_upload: true,//sha计算完成后，开始上传 (默认非立即上传)
                        sha1js_path: 'http://video.qcloud.com/calculator_worker_sha1.js', //计算sha1的位置  ，默认为 'http://你的域名/calculator_worker_sha1.js'
                        disable_multi_selection: false, //禁用文件多选 ，默认不禁用
                        transcodeNotifyUrl: 'http://test.domain.com/on_transcode_done.serverfile',//(转码成功后的回调地址)isTranscode==true,时开启； 回调url的返回数据格式参考  http://www.qcloud.com/wiki/v2/MultipartUploadVodFile
                        classId: null //视频分类的ID
                    },
                    //回调函数
                    {

                        onFileUpdate: function (args) {
                            Log.debug(args);
                            if(args.code === 6){
                                $("#qcloud_edit_file_id").val(args.serverFileId);
                            }
                        },

                        onFileStatus: function (info) {
                            Log.debug('各状态总数-->', JSON.stringify(info));
                           // console.log("hello");
                        },

                        onFilterError: function (args) {
                            Log.debug('message:' + args.message + (args.solution ? (';solution==' + args.solution) : ''));
                        }
                    }
                );

            //});


        }
    });


    //elemContainer.find('select').val('polyv');

    elemContainer.find('.action-cancel').click(function () {
        runtime.notify('cancel', {});
    });
    //传递值
    elemContainer.find('.action-save').click(function () {
        var data = {
            'display_name': $('#video_display_name').val(),
            //'domain_url': $('#qiniu_edit_domain_url').val(),
            //'video_name': $('#file_upload').val(),
            'vid':$('#polyv_vid').val(),
            'file_id':$('#qcloud_edit_file_id').val(),
            'width': $('#video_edit_width').val(),
            'height': $('#video_edit_height').val()
        };
        runtime.notify('save', {state: 'start'});//开始调用save
        var handlerUrl = runtime.handlerUrl(element, 'save_qiniu');
        $.post(handlerUrl, JSON.stringify(data)).done(function (response) {
            if (response.result === 'success') {
                runtime.notify('save', {state: 'end'});
            }
            else {
                runtime.notify('error', {msg: response.message});
            }
        });
    });
}