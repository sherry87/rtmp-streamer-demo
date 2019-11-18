
require.config({
    paths: {
        "rtmp-streamer": "rtmp-streamer"
    }
});


var streamerW = 240;
var streamerH = 180;
var streamer = null;
require(["rtmp-streamer"], function (RtmpStreamer) {
	//推流
	document.getElementById("publish").addEventListener("click", function () {
		//使用固定的embed会导致第二次推送的时候，不知道swf什么时候准备好了导致推送报错
		//每次推送的时候重新建embed,swf的地址和id要随机
		createNewEmbed();
		// isReady是全局的，重新new RtmpStreamer 应该设为false
    	isReady = false;
		var id = getEmbedId();
		streamer = new RtmpStreamer(document.getElementById(id));
		startPublish();
    });
	
	$("#play").click(function(){
		playByTcPlayer();
	});
	//关闭
	$("#close").click(function(){
		console.log("关闭视频流");
		 try{
			 streamer.disconnect();
		}catch(err){
			console.log(err)
		}
		//关闭的时候一定要移除embed
		createNewEmbed();
		$("#otherSide").html("");
	});

});

function getUrl(){
	return $("#url").val();
}

function getName(){
	return $("#name").val();
}

/**
 * 移除原有的embed，创建新的embed
 * @param id
 * @returns
 */
function createNewEmbed(){
	$(".pusher-wrap embed").remove();
	var id = "rtmp_"+Math.floor(Math.random()*100000000);
	var src = "./js/RtmpStreamer.swf?r="+Math.random();
	$(".pusher-wrap").html('<object><embed id="'+id+'" src="'+src+'" bgcolor="#5483c1"	'
					+' quality="high" allowScriptAccess="sameDomain" width="240" height="180" type="application/x-shockwave-flash">'
					+' </embed></object>');
}

/**
 * 获取embed的ID
 * @returns
 */
function getEmbedId(){
	return $(".pusher-wrap embed").attr("id");
}

/**
 * 开始推送
 * @returns
 */
function startPublish(){
	console.log(isReady);
	if(isReady){
		publishStreamer();
	}else{
		setTimeout(function(){
			startPublish();
		},1000)
	}
}
/**
 * 推送视频流
 * @returns
 */
function publishStreamer(){
	console.log("开始推送视频流");
	streamer.setScreenSize(streamerW*2.3,streamerH*2.3)
    streamer.publish(getUrl(), getName());
}

function playByTcPlayer(){
	var url = getUrl()+getName();
	var options = {
            rtmp: url,
            autoplay: true,
            live: true,
            systemFullscreen: true,
            width: $("#otherSide").width(),
            height: $("#otherSide").height(),
            volume: 0.5,
            listener: function (msg) {
                //if (msg.type != 'timeupdate') {
                //    console.log(msg);
                //}
            }
        }
        player = new TcPlayer('otherSide', options);
}