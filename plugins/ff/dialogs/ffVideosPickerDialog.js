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
                try{
                    var message = JSON.parse(e.data);
                    if(message && message.action && message.action === "updateFfSelectedList"){
                        ffSelectedVideosList = message.data;
                    }else if(message && message.action && message.action === "doneFfVideoPicker"){
                        ffSelectedVideosList = message.video_picker_selectedList;
                        document.getElementById(self.getButton('ok').domId).click();
                    }
                }
                catch (err) {
                    console.log('Invalid JSON to parse')
                }
            });
            var iframeElem = CKEDITOR.dialog.getCurrent().getContentElement('ffVideosPicker', 'myFFVideoPickerIframe').getElement().$;
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.style.display = "block";
            iframe.style.width = "1000px";
            iframe.style.height = "500px";
            iframeElem.appendChild(iframe);
            //iframeElem.innerHTML = '<ifrmae src="'+src+'" style="width: 1000px;height:600px;border: none;margin: 0;padding: 0;"></ifrmae>';
        },
        onOk : function () {
            var content = '<div style="display: flex;flex-direction: row;">';
            ffSelectedVideosList.forEach(function (video) {
                content += '<div class="ff-video" style="display: flex;flex-direction: column;padding: 4px;justify-content: center;align-items: center;"><img style="width: 150px;" src="'+video.videoImg+'" alt="img" />' +
                    '<h5>'+video.title+'</h5></div>';
            });
            content +='</div>';
            var element = CKEDITOR.dom.element.createFromHtml(content);
            var instance = this.getParentEditor();
            instance.insertElement(element);
        }
    }
});
