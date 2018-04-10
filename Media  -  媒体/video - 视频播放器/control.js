// 适配video对象
var playerNode = document.getElementById('player');
// 播放和暂停按钮
var doCtrlNode = document.getElementById('doCtrl');
// 控制进度条
var barCtrlNode = document.getElementById('barCtrl');
// 时间显示
var timeNode = document.getElementById('time');
// 音量显示
var volumeNode = document.getElementById('volume');

// 点击控制暂停或者播放
function doCtrl() {
    if (playerNode.paused) {
        playerNode.play();
        doCtrlNode.setAttribute('class', 'pause');
    } else {
        playerNode.pause();
        doCtrlNode.setAttribute('class', 'play');
    }
}

// 秒变成可阅读的时间(60分钟以上的不考虑)
function toTime(sec) {
    var resultData = "";
    var _sec_ = sec % 60;
    _sec_ = _sec_ >= 10 ? _sec_ : "0" + _sec_;
    var _min_ = (sec / 60).toFixed(0);
    _min_ = _min_ >= 10 ? _min_ : "0" + _min_;
    resultData += _min_ + ":" + _sec_;
    return resultData;
}

// 监听视频播放进度
function doTimeupdate() {
    if (playerNode.duration) {
        // 通过 视频长度/播放时间 来计算播放百分比
        barCtrlNode.value = ((playerNode.currentTime / playerNode.duration) * 100).toFixed(0);
        timeNode.innerText = toTime(playerNode.currentTime.toFixed(0)) + "/" + toTime(playerNode.duration.toFixed(0));
    } else {
        per = 0;
    }
}

//拖拽改变进度
function doRange() {
    playerNode.currentTime = playerNode.duration * barCtrlNode.value * 0.01;
    if (playerNode.paused) {
        playerNode.play();
        doCtrlNode.setAttribute('class', 'pause');
    }
}

// 视频结束时
function doEnded() {
    doCtrlNode.setAttribute('class', 'play');
}

// 初始化页面
function doCanplaythrough() {
    timeNode.innerText = "00:00/" + toTime(playerNode.duration.toFixed(0));
}

// 减少音量
function doMinus() {
    var volume = playerNode.volume - 0.1 > 0 ? playerNode.volume - 0.1 : 0;
    playerNode.volume = volume;
    volumeNode.innerText = (volume * 10).toFixed(0);
}

// 增加音量
function doAdd() {
    var volume = playerNode.volume + 0.1 < 1 ? playerNode.volume + 0.1 : 1;
    playerNode.volume = volume;
    volumeNode.innerText = (volume * 10).toFixed(0);
}

/*

 开发时间：2018-04-10
 项目地址：https://github.com/yelloxing/WebCase

 */