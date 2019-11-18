### web实现rtmp推流拉流
项目中需要实现web视频通讯功能，同时还要能与手机视频。结合项目实际情况，web端采用 rtmp-streamer推流，腾讯的tcPlayer拉流（rtmp-streamer拉流一是很慢，二是需要设置播放画面的宽高，但是我们又不知道真实的宽高）。
tcPlayer拉流很简单看一下腾讯的api就可以
rtmp-streamer就很多坑。

1.rtmp流是需要用flash播放器的，而使用flash播放器会弹出是否允许开启摄像头的确认框，所以object不能小于 **220X140**,小于这个范围，确认框不会显示

2.视频流推送之前，**一定一定要确认isReady是否为true**,isReady=true说明swf准备好了，如果isReady=false就开始推送流会报错

3.使用固定的embed会导致第二次推送的时候，不知道swf什么时候准备好了导致推送报错。所以**每次推送的时候重新建embed,swf的地址和id要随机**

4.rtmp-streamer.swf 推送流默认是h263的，我们手机上的播放器不支持，播放不了。所以修改rtmp-streamer.as,将推送流改为h264,然后重新编译成swf,就OK了。


