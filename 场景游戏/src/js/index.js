$(function(){
	var isMobile = '';
	browserRedirect()
    function browserRedirect() {  
        var sUserAgent = navigator.userAgent.toLowerCase();  
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";  
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";  
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";  
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";  
        var bIsAndroid = sUserAgent.match(/android/i) == "android";  
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";  
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";   
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {  
            isMobile = true;  
        } else {  
            isMobile = false;   
        }  
    }  

	var pageUrl = ["./src/page/01/index.html", "./src/page/02/index.html"]
	//创建一个舞台
	var stage = new createjs.Stage("cas");
	var BgContainer = new createjs.Container();
	var btnContainer = new createjs.Container();
	stage.addChild(BgContainer)
	stage.addChild(btnContainer)
	createjs.Ticker.addEventListener('tick',handleTick)//间隔刷新舞台
	createjs.Ticker.setFPS(60)//设置刷新频率
	//刷新舞台
	function handleTick(){
		stage.update()
	}
    //资源预加载
    var images = {};//放加载好的图片
    var loader = new createjs.LoadQueue(false);//true 为使用 XHRLoader(文本类型)，false 将使用 TagLoader
    	loader.loadManifest(configData.img);//加载图片的列表
	    loader.addEventListener("fileload",handFileLoad);//单个加载完成
	    function handFileLoad(evt){
	    	if(evt.item.type = "image"){
	    		images[evt.item.id] = evt.result;//为<img src="" />
	    	}
	    };
	    loader.addEventListener("complete", completeHandler);
	    function completeHandler(evt){
	    	//调用创建背景方法
	    	window.common_fun.setBg({
	    		stage:stage,
	    		container:BgContainer,
	    		id:"mapBg",
	    		image:images["mapBg"]
	    	})
	    	//设置关卡
	    	window.pathMessageJson.forEach(function(value,i){
	    		var card = new window.common_fun.setCard({
	    			image: images[value.id],
	    			x: value.position.x,
	    			y: value.position.y,
	    			name:value.name,
	    			state:value.state,
	    			canClick: i=='0'? true:false
	    		})
	    		//绑定点击事件
	    		card.addEventListener('click', function(e){
	    			e.stopPropagation();
	    			if(card.canClick){
	    				if(card.state == "one"){
	    					//出现弹窗
	    					intoPage(BgContainer.getChildByName('two'))
	    				}else{
	    					//动画
	    					window.common_fun.animate({
		    					data:window.path[card.state],
		    					ele:person,
		    					thisEle:card,
		    					fun:intoPage(BgContainer.getChildByName('two'))//进入房间方法
		    				})
	    				}
	    				console.log("点击了"+card.name)
	    			}else{
	    				alert("上一关未完成")
	    			}
	    		})
	    		BgContainer.addChild(card)
	    	})
	    	//创建人物
	    	var person = new window.common_fun.setPerson({
	    			image: images["end"],
	    			x: 80,
					y: 10
	    		})
	    	BgContainer.addChildAt(person, BgContainer.numChildren)//第二个参数为z-index  numChildren 获取容器内的个数  
	    	//创建左右点击按钮
	    	var bgPos = 0;
	    	var clickCount = 10;//点击多少次背景可到最右面
	    	var moveLen = document.getElementById("cas").width-window.common_fun.bg["img"].getBounds().width;
	    	var oneMove = moveLen / clickCount;//每次移动距离
	    	if(!isMobile){
	    		window.btnArr.forEach(function(value,i){
		    		var btn = new window.common_fun.setBtn({
		    			image: images[value.id],
		    			name:value.name,
		    			x: value.position.x,
		    			y: value.position.y
		    		})
		    		btn.addEventListener('click', function(e){
		    			if(btn.name == "right"){
		    				if(moveLen< BgContainer.x){
		    					bgPos = bgPos+oneMove;
		    					BgContainer.x = bgPos
		    				}
		    			}else{
		    				if(BgContainer.x <0){
		    					bgPos = bgPos-oneMove;
		    					BgContainer.x = bgPos
		    				}
		    			}
		    		})
		    		btnContainer.addChild(btn)
		    	})
	    	}else{
	    		moveFn({
	    			event:BgContainer,
	    			len:moveLen
	    		})
	    	}
	    }
	    //进入模板页
	    function intoPage(obj){
	    	obj.canClick = true;
	    	$('.mask').fadeIn(1000);
	    	var nowPage = 1;
	    	//加载教材
	    	$('iframe').attr('src',pageUrl[nowPage-1])
	    	//退出按钮
	    	$('.back').on("click touchStart", function(e){
	    		if(e.type == "touchstart"){
					e.preventDefault()
				}
				e.stopPropagation();
				$('.mask').fadeOut(1000);
				nowPage = 1;
				$(".before").css({
					'background':'url("../src/images/noPre.png") no-repeat',
					'background-size':'contain'
				})
				$(".after").css({
					'background':'url("../src/images/next.png") no-repeat',
					'background-size':'contain'
				})
	    	})
	    	//点击翻页按钮
	    	$('.after').on('click touchStart', function(e){
	    		if(e.type == "touchstart"){
					e.preventDefault()
				}
				e.stopPropagation();
				$(".before").css({
					'background':'url("../src/images/pre.png") no-repeat',
					'background-size':'contain'
				})
				if(nowPage<pageUrl.length){
					nowPage++;
					$('iframe').attr('src',pageUrl[nowPage-1])
				}
				if(nowPage>pageUrl.length-1){
					$(".after").css({
						'background':'url("../src/images/noNext.png") no-repeat',
						'background-size':'contain'
					})
				}
	    	})

	    	$('.before').on('click touchStart', function(e){
	    		if(e.type == "touchstart"){
					e.preventDefault()
				}
				e.stopPropagation();
				$(".after").css({
					'background':'url("../src/images/next.png") no-repeat',
					'background-size':'contain'
				})
				if(nowPage!="1"){
					nowPage--;
					$('iframe').attr('src',pageUrl[nowPage-1])
				}
				if(nowPage<'2'){
					$(".before").css({
						'background':'url("../src/images/noPre.png") no-repeat',
						'background-size':'contain'
					})
				}
	    	})
	    }
	    function moveFn(obj){
	    	var touch = '';
	    	var initLen = 0;
		    $("body").get(0).ontouchstart = function(event){
		    	touch = event.targetTouches[0];//获取第一个touch坐标
		    }
		    $("body").get(0).ontouchmove = function(event){
		    	var thisTouch = event.targetTouches[0];//获取第一个touch坐标
		    	if(thisTouch.pageX - touch.pageX < 0){
		    		var x = thisTouch.pageX - touch.pageX;
		    		if(initLen>obj.len){
		    			initLen = initLen + Math.floor(x/10)
		    			obj.event.x = initLen;
		    			console.log('向右移动')
		    		}else{
		    			obj.event.x = initLen = obj.len;
		    		}
		    	}else{
		    		var x = thisTouch.pageX - touch.pageX;
		    		if(initLen<0){
		    			initLen = initLen + Math.floor(x/10);
		    			obj.event.x = initLen;
		    			console.log('向左移动')
		    		}else{
		    			obj.event.x = initLen = 0;
		    		}
		    	}
		    }
	    }
	 //    var arr = []
	 //    stage.addEventListener('click', function(e){
	 //    	arr.push({
	 //    		x:stage.mouseX,
	 //    		y:stage.mouseY
	 //    	})
	 //    	console.log(arr)
		// })

})