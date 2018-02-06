var common = {
	//创建背景
	bg:{},
	setBg: function(obj){
		this.bg[obj.id] = new createjs.Bitmap(obj.image)
		obj.container.addChild(this.bg[obj.id])
		this.bg.img = this.bg[obj.id];
		console.log("背景图绘制完成")
	},
	setPerson: function(obj){//绘制人物
		this.Bitmap = new createjs.Bitmap(obj.image);
		this.Bitmap.x = obj.x;
		this.Bitmap.y = obj.y;
		console.log("人物绘制完成")
		return this.Bitmap;
	},
	setBtn: function(obj){//绘制按钮
		this.Bitmap = new createjs.Bitmap(obj.image);
		this.Bitmap.x = obj.x;
		this.Bitmap.y = obj.y;
		this.Bitmap.name = obj.name;
		this.Bitmap.scaleY=.1;
		this.Bitmap.scaleX=.1;
		console.log("按钮绘制完成")
		return this.Bitmap;
	},
	setCard: function(obj){//绘制关卡
		this.Bitmap = new createjs.Bitmap(obj.image);
		this.Bitmap.x = obj.x;
		this.Bitmap.y = obj.y;
		this.Bitmap.name = obj.name;
		this.Bitmap.state = obj.state;
		this.Bitmap.canClick = obj.canClick;
		console.log(obj.name+"绘制完成")
		return this.Bitmap;
	},
	animate: function(obj){
		var pathStart = 0;
		var time = setInterval(function(){
			obj.ele.x = obj.data[pathStart].x
			obj.ele.y = obj.data[pathStart].y
			console.log(pathStart)
			if(pathStart>=obj.data.length-1){
				clearInterval(time,function(){
					obj.fun;
				})
				// obj.Bitmap.canClick = false
			}else{
				pathStart++;
			}
		},40)
	}
}
window.common_fun = common;