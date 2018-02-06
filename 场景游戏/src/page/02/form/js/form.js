//var domain = 'http://172.16.0.107:9011/pages/10002/';
var domain = '';
var updata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,"#"];
var Data = {
    configData: {
        bg: "",
        desc: "",
        tg: [{
            title: "",
            content: "",
        }],
        source: {
            title: "",
            img:"",
            seleList:[
                {
                    img:"",
                    audio:"",
                    font:"",
                    pos:"1"
                }
            ]
        }
    }
};

$.ajax({
	type:"get",
	url: domain + "content?_method=put",
	async:false,
	success: function(res){
		if(res.data!=""){
			Data.configData = JSON.parse(res.data);
		}
	},
	error: function(res){
		console.log(res)
	}
});

new Vue({
    el: '#container',
    data: Data,
    methods: {
        
        imageUpload: function(e, item, attr,fileSize) {
            var file = e.target.files[0],
                size = file.size,
                naturalWidth = -1,
                naturalHeight = -1,
                that = this;

            if ((size / 1024).toFixed(2) > fileSize) {
                alert("您上传的图片大小为：" + (size / 1024).toFixed(2) + "KB, 超过"+fileSize+"KB上限，请检查后上传！");
                e.target.value = '';
                return;
            }

            var img = new Image();
            img.onload = function() {
                naturalWidth = img.naturalWidth;
                naturalHeight = img.naturalHeight;
                var check = that.sourceImgCheck(e.target, {
                    height: naturalHeight,
                    width: naturalWidth
                });
                if (check) {
                    item[attr] = "./form/img/loading.jpg";
                    that.postData(file, item, attr);
                    img = null;
                } else {
                    img = null;
                }
            }
            var reader = new FileReader();
            reader.onload = function(evt) {
                img.src = evt.target.result;
            }
            reader.readAsDataURL(file, "UTF-8"); //读取文件
        },
        sourceImgCheck: function(input, data,item,attr) {
            let dom = $(input),
                size = dom.attr("size").split(",");
            if (size == "") return true;
            let checkSize = size.some(function(item, idx) {
                let _size = item.split("*"),
                    width = _size[0],
                    height = _size[1];
                if (width == data.width && height == data.height) {
                    return true;
                }
                return false;
            });
            if (!checkSize) {
                alert("图片尺寸不符合要求！");
                e.target.value = '';
                console.error("应上传图片大小为：" + size.join("或") + ", 但上传图片尺寸为：" + data.width + "*" + data.height);
                item[attr] = "";
            }
            return checkSize;
        },
        validate: function() {
            if(this.configData.source.img==''){
                return false;
            }

            let isPass = this.configData.source.seleList.some(function(item){
                return item.img == '' && item.font == ''
            });
            if(isPass == true){
                return false;
            }
            return true;
            
        },
        onSend: function() {
            var data = this.configData;
            var _data = JSON.stringify(data);
            var val = this.validate();
            var isSend = true;
            //1-18不可重复
            for(var m = 0; m<this.configData.source.seleList.length; m++){
                for(var n = m+1; n<this.configData.source.seleList.length; n++){
                    if(this.configData.source.seleList[m].pos !="#" && this.configData.source.seleList[n].pos !="#"){
                        if(this.configData.source.seleList[m].pos == this.configData.source.seleList[n].pos){
                            isSend = false;
                            alert('1-18位置不可重复')
                            return;
                        }
                    }
                }
            }
            if (val === true && isSend == true) {
                $.ajax({
                    url: domain + 'content?_method=put',
                    type: 'POST',
                    data: {
                        content: _data
                    },
                    success: function(res) {
                        console.log(res);
                        //alert("提交成功");

                        window.parent.postMessage('close', '*');
                    },
                    error: function(err) {
                        console.log(err)
                    }
                });
            } else {
                //console.error('提交失败');
                alert("带有*号的为必填项！");
            }
        },
        postData: function(file, item, attr) {
            var FILE = 'file';
            bg = arguments.length > 2 ? arguments[2] : null;
            var oldImg = item[attr];
            var data = new FormData();
            data.append('file', file);
            if (oldImg != "") {
                data.append('key', oldImg);
            };
            $.ajax({
                url: domain + FILE,
                type: 'post',
                data: data,
                async: false,
                processData: false,
                contentType: false,
                success: function(res) {
                    item[attr] = domain + res.data.key;
                },
                error: function(err) {
                    console.log(err)
                    item[attr] = '';
                }
            })
        },
        audioUpload: function(e, item, attr) {
            //校验规则
            //var _type = this.rules.audio.sources.type;

            //获取到的内容数据
            var file = e.target.files[0],
                type = file.type,
                size = file.size,
                name = file.name,
                path = e.target.value;
            if ((size / 1024).toFixed(2) > 500) {
                console.warn("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            } else {
                console.log("您上传的音频文件大小：", (size / 1024).toFixed(2) + "K");
            }
            if ( (!isNaN(parseInt($(e.target).attr('volume'))) ) && (size / 1024).toFixed(2) > parseInt($(e.target).attr('volume'))) {
                console.error("您上传的音频大小为：" + (size / 1024).toFixed(2) + "KB");
                alert("您上传的音频大小为" + (size / 1024).toFixed(2) + "KB, 超过"+$(e.target).attr('volume')+"K上限，请检查后上传！");
                return;
            }
            item[attr] = "./form/img/loading.jpg";
            this.postData(file, item, attr);
        },
        addSele: function() {
            var thisPos = this.configData.source.seleList.length+1;
            if(thisPos>18){
                thisPos = '#'
            }
            this.configData.source.seleList.push({
                img:"",
                audio:"",
                font:"",
                pos:thisPos
            });
        },
        delSele: function(item) {
            this.configData.source.seleList.remove(item);
        },
        radioClick:function(item){
            Data.configData.source.isImg = item;
            if(item){
                $.each(Data.configData.source.seleList,function(i,val){
                    val.font=""
                })
            }else{
                $.each(Data.configData.source.seleList,function(i,val){
                    val.img=""
                })
            }
        },
		addTg:function(item){
           this.configData.tg.push({title:'',content:''});
    	},
    	deleTg:function(item){
	        this.configData.tg.remove(item);
    	},
        play: function(e){
            e.target.children[0].play();
        }

    }
});
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
