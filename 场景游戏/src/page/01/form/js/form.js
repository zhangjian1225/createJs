// var domain = 'http://172.16.0.107:9011/pages/10003/';
var domain = '';
var Data = {
    configData: {
        bg:'',
        desc:'',
        tg:[],
        source:{
            title:'',
            text:'',
            words:'',
            mainAudio:'',
            image:'',
            options:[
                {
                    img:'',
                    text:'',
                    audio:""
                },
                {
                    img:'',
                    text:'',
                    audio:""
                }
            ],
            right:'-1'
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
        sourceImgCheck: function(input, data) {
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
                alert("应上传图片大小为：" + size.join("或") + ", 上传图片尺寸为：" + data.width + "*" + data.height);
            }
            return checkSize;
        },
        validate: function() {
            var data = this.configData.source.options
            var right=this.configData.source.right
            var mainImg=this.configData.source.image
            var check = true
            var num = 0
            var mixPic=0
            var mixText=0
             console.log(right,'222222+++++++++++++')
            console.log(data)
            for ( let i=0; i<data.length; i++ ) {
                if (data[i].img==''&&data[i].text=='') {
                    num ++
                }
                if (data[i].img!='') {
                    mixPic ++
                }
                if (data[i].text!='') {
                    mixText ++
                }
            }
            console.log('num: ' + num)
            if(mixText>0&&mixPic>0){
                check = false
                alert("位置4统一上传图片或输入文字,请检查后在上传")
                return
            }
            if (num > 0) {
                check = false
                alert("位置4为必填项，统一上传图片或输入文字")
                return
            }
            if (right==undefined || right==='-1') {
                console.log(right,'111')
                check = false;
                alert("请勾选正确答案");
                return
            }
            if(mainImg==''){
                check = false;
            }
            return check 
        },
        onSend: function() {
            var data = this.configData;
            var _data = JSON.stringify(data);
            console.log(_data);
            var val = this.validate();
            if (val === true) {
                $.ajax({
                    url: domain + 'content?_method=put',
                    type: 'POST',
                    data: {
                        content: _data
                    },
                    success: function(res) {
                        console.log(res);
                        window.parent.postMessage('close', '*');
                    },
                    error: function(err) {
                        console.log(err)
                    }
                });
            } else {
                console.error('提交失败');
                alert("带*的为必填项");
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
                }
            })
        },
        audioUpload: function(e, item, attr,fileSize) {console.log(attr,'dde')
            var file = e.target.files[0],
                type = file.type,
                size = file.size,
                name = file.name,
                path = e.target.value;
            if ((size / 1024).toFixed(2) > fileSize) {
                alert("您上传的声音大小为：" + (size / 1024).toFixed(2) + "KB, 超过"+fileSize+"KB上限，请检查后上传！");
                return;
            }
            this.postData(file, item, attr);
        },
        addScreen: function(items, obj) {
            // items.push({
            //     "id": Date.now(),
            //     "subTitle": "",
            //     "img": "",
            //     "audio": "",
            //     "text": ""
            // })
        },
        delQue: function(item, array) {
            array.remove(item);
        },
        addTg: function(item) {
            this.configData.tg.push({
                title: '',
                content: ''
            });
        },
        deleTg: function(item) {
            this.configData.tg.remove(item);
        },
        play: function(e) {
            e.target.children[0].play();
        },
        addOption: function() {
            this.configData.source.options.push('')
        },
        setAnswer: function(item) {
            this.configData.source.right = item;
        },
        addOptions:function(){
            if ( this.configData.source.options.length >= 4 ) {
                return;
            }
            this.configData.source.options.push({
                img:'',
                text:'',
                audio:''
            })
        },
        delOptions:function(item){
            this.configData.source.options.remove(item)
            this.configData.source.right="-1"
        }
    }
});
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};