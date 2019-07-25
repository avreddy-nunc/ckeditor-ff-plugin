var ffSelectedVideosList = [];
/*CKEDITOR.dialog.addIframe( 'ffVideosPickerDialog',
    'Videos Picker',
    'http://192.168.1.152:3000/',
    1000,
    500,
    function(){
    const self = this;
    window.addEventListener('message', function (e) {
        try{
            var message = JSON.parse(e.data);
             if(message && message.action && message.action === "updateFfSelectedList"){
                 ffSelectedVideosList = message.data;
             }else if(message && message.action && message.action === "doneFfVideoPicker"){
                 ffSelectedVideosList = message.video_picker_selectedList;
                 document.getElementById(self.getDialog().getButton('ok').domId).click();
             }
        }
        catch (err) {
            console.log('Invalid JSON to parse')
        }
    })
    },
    {
        onOk : function () {
            var content = '<div style="display: flex;flex-direction: row;">';
            ffSelectedVideosList.forEach(function (video) {
                content += '<div style="display: flex;flex-direction: column;padding: 4px;"><img style="width: 150px;" src="'+video.videoImg+'" alt="img" />' +
                    '<h5>'+video.title+'</h5></div>';
            });
            content +='</div>';
            var element = CKEDITOR.dom.element.createFromHtml(content);
            var instance = this.getParentEditor();
            instance.insertElement(element);
            CKEDITOR.widgets.add( 'simplebox', {
                // Code defined before...

                template:
                    '<div class="simplebox">' +
                    '<h2 class="simplebox-title">Title</h2>' +
                    '<div class="simplebox-content"><p>Content...</p></div>' +
                    '</div>'
            } );
        }
    }
);*/
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

var query = getQueryParams(document.location.search);
CKEDITOR.dialog.add( 'ffVideosPickerDialog', function ( editor ) {
    var src = '//admin.flickfusion.net/tp/index.php?ACTION=VIDEO_PICKER&TOKEN='+encodeURIComponent(query.token);
    return {
        title : 'Videos Picker',
        width : 1000,
        height : 500,
        contents : [
            {
                id : 'ffVideosPicker',
                expand : true,
                elements : [
                    {
                        id : "myFFVideoPickerIframe",
                        type : 'html',
                        html : ''
                    }
                ]
            }
        ],
        onLoad  :function () {
            const self = this;
            self.parts.close.$.style.display = 'none';
            self.parts.title.$.style.display = 'none';
            self.parts.contents.$.style.padding = '0';
            self.parts.footer.$.style.display = 'none';
            window.document.addEventListener('keyup', function (e) {
                if (e.keyCode == 8) {
                    var editor = CKEDITOR.instances.editable,
                        sel = editor.getSelection();
                    var ele = sel.getStartElement();
                    if(ele.getAttribute( 'class' ) == 'ff-video'){
                        ele.remove();
                    }
                }
            });
            window.addEventListener('message', function (e) {
                if(e.data && e.data ==='Cancel'){
                    document.getElementById(self.getButton('cancel').domId).click();
                }else {
                    try {
                        var message = JSON.parse(e.data);
                        if (message && message.action && message.action === "updateFfSelectedList") {
                            ffSelectedVideosList = message.data;
                        } else if (message && message.action && message.action === "doneFfVideoPicker") {
                            ffSelectedVideosList = message.video_picker_selectedList;
                            document.getElementById(self.getButton('ok').domId).click();
                        }
                    }
                    catch (err) {
                        console.log('Invalid JSON to parse')
                    }
                }
            });
            this.getParentEditor().on('afterInsertHtml',function (e) {
                console.log(e);
            });
            var iframeElem = CKEDITOR.dialog.getCurrent().getContentElement('ffVideosPicker', 'myFFVideoPickerIframe').getElement().$;
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.id = "myFFVideoPickerIframeElement";
            iframe.style.display = "block";
            iframe.style.width = "1000px";
            iframe.style.height = "500px";
            iframeElem.appendChild(iframe);
            //iframeElem.innerHTML = '<ifrmae src="'+src+'" style="width: 1000px;height:600px;border: none;margin: 0;padding: 0;"></ifrmae>';
        },
        onOk : function () {
            var content = '';
            content +='<div style="width: 100%;">';
            ffSelectedVideosList.forEach(function (video) {
                content += '<div contenteditable="false" style="display: block;margin-top: 15px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;background: #f3f3f3;width:100%;cursor: pointer;border: 1px solid #ddd;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;overflow: hidden;position: relative;" >' +
                    '<div style="width: 25%;float: left;display: inline-block;">' +
                    '<div style="width: 100%;padding: 25% 0;position: relative;">' +
                    '<a href="'+video.videoPlayerUrl+'" target="_blank" >' +
                    '<img style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;object-fit: cover;-o-object-fit: cover;border: none;outline: none;padding: 0;margin: 0;" src="'+video.videoImgPlay+'" alt="img" />' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '<div style="width: 75%;float : left; display: inline-block;">' +
                    '<a href="'+video.videoPlayerUrl+'" target="_blank"><h5 style="font-size: 1rem;font-weight: 700;margin: 0;padding: 0.5rem;">'+video.title+'</h5></a>' +
                    '<p style="padding: 0.5rem;margin: 0;">'+video.videoDesc+'</p></div>' +
                    '</div>';
            });
            content += '</div>';
            var element = CKEDITOR.dom.element.createFromHtml(content);
            var instance = this.getParentEditor();
            instance.insertElement(element);
        },
        onShow : function () {
            var iframe = document.getElementById('myFFVideoPickerIframeElement');
            iframe.src = iframe.src;
        }
    }
});
