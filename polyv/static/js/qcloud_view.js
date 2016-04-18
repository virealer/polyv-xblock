function qcloudXBlockInitView(runtime, element) {
	get_params(runtime, element);
}

function get_params(runtime, element){
	$.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_params'),
            data: JSON.stringify({a: 'a'}),
            success: function(result) {
                console.log(result);
                file_id = result.file_id;
                app_id = result.app_id;
                width = result.width;
                height = result.height;
                show_player(file_id,app_id,width,height);
                //watched_status.text(result.watched);
            }
        });

}

function show_player(file_id,app_id,width,height){
     var player = new qcVideo.Player("qcloudplayer",{
     		"file_id": file_id,
            "app_id": app_id,
            "auto_play": "1",
            "width": width,
            "height": height,
     },{});
}
