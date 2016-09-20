//定義播放物件
var Player = {
    //audio物件
    audioObj: null,
    //當前播放歌曲的索引號
    currentId: -1,
    //是否隨機播放
    isShuffle: false,
    //播放檔陣列
    playList: [],
    //初始化player物件，建立audio物件
    init: function() {
        //建立audio對象
        this.audioObj = document.createElement("audio");
        this.audioObj.volume = 0.1;
    },
    //新增音樂
    add: function(name, url) {
        this.playList.push({"name":name, "url":url});
    },
    //清空播放清單
    clear: function() {
        this.playList.length = 0;
        this.currentId = -1;
    },
    //播放音樂
    play: function(index) {
        
        if (this.audioObj.readyState === 4 && this.currentId === index) {
            this.audioObj.play();
        } else {
            var currIndex = (index === -1) ? 0 : index;
            var name = this.playList[currIndex]["name"];
            var url = this.playList[currIndex]["url"];
            
            this.stop();
            this.currentId = currIndex;
            this.audioObj.src = url;
            setSongStyle();
            setScroll();
            
            this.audioObj.oncanplaythrough = function() {
                gVar.header.text(name);
                gVar.totalTime.text(formatTime(this.duration));
                this.play();
            };
            
            this.audioObj.ontimeupdate = function() {
                gVar.currTime.text(formatTime(this.currentTime));
            };
            
            this.audioObj.onended = function() {
                if (Player.isShuffle) {
                    Player.playShuffle();
                } else {
                    Player.playNext();
                }
            };
        }
    },
    //停止音樂
    stop: function() {
        this.audioObj.pause();
    },
    //step為1，播放下一首；step為-1，播放上一首
    playStep: function(step) {
        var length = this.playList.length;
        var currIndex;
        
        if (this.currentId === -1) {
            currIndex = 0;
        } else if (step === 1) {
            currIndex = this.currentId + 1;
            currIndex = (currIndex === length) ? 0 : currIndex; 
        } else if (step === -1) {
            currIndex = this.currentId - 1;
            currIndex = (currIndex === -1) ? (length - 1) : currIndex; 
        }
        this.play(currIndex);
    },
    //播放下一首
    playNext: function() {
        this.playStep(1);
    },
    //播放前一首
    playPrev: function() {
        this.playStep(-1);
    },
    //隨機播放
    playShuffle: function() {
        var length = this.playList.length;
        var randomNum = Math.floor(Math.random() * length);
        this.play(randomNum);
    }
};
