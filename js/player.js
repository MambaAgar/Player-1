//定義播放物件
var Player = {
	//需要建立的audio物件
	audioObj: null,
	//當前播放歌曲的索引號
	currentId: -1,
	//是否隨機播放
	isRandom: false,
	//播放檔陣列
	playList: [],
	//初始化player物件，建立audio物件，鎖定事件
	init: function(){
		//建立audio對象
		var aObj = $("<audio id='ai'></audio>");
		this.audioObj = aObj[0];
		this.audioObj.volume = 0.1;
	},
	//清空播放清單
	clearList: function(){
		this.playList.length = 0;
		this.currentId = -1;
	},
	//新增音樂
	add: function(name, url){
		this.playList.push({"name":name, "url":url});
	},
	//刪除音樂
	remove: function(name){
		delete this.playList[name];
	},
	//按索引播放音樂
	play: function(index){
		var song = null;
		if((song = this.playList[index]) != null){
			//如果當前音樂可以播放並且和需要播放的一致，則繼續播放，否則重新載入音樂
			if(this.audioObj.readyState == 4 && this.currentId == index){
				this.audioObj.play();
			}else{
				this.currentId = index;
				//先停止音樂
				this.stop();
				//重新載入
				this.audioObj.src = song.url;
				//鎖定載入完資料後播放
				$(this.audioObj).bind("canplaythrough", function(){
					this.play();
				})
			}
		}
		return song;
	},
	//停止音樂
	stop: function(){
		this.audioObj.pause();
	},
	//歌曲列表是否為空
	isEmptyPlayList: function(){
		return this.playList.length == 0;
	},
	//step為1，播放下一首；step為-1，播放上一首
	playStep: function(step){
		if(this.isEmptyPlayList()){
			return null;
		}
		//如果當前播放id為空，則播放第一首
		if(this.currentId == null){
			return this.play(this.playList[0]);
		}else{
			var id = this.currentId;
			//1表示前進一首
			if(step == 1){
				id = (id < this.playList.length - 1) ? (id + 1): 0;
			}else if(step == -1){	//-1表示後退一首
				id = (id > 0) ? (id - 1): (this.playList.length - 1);
			}
			return this.play(id);
		}
	},
	//播放下一首
	playNext: function(){
		return this.playStep(1);
	},
	//播放前一首
	playPri: function(){
		return this.playStep(-1);
	},
	//隨機播放
	playRandom: function(){
		var length = this.playList.length;
		var randomNum = Math.floor(Math.random() * length);
		return this.play(randomNum);
	}
};