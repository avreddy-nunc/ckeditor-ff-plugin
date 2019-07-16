CKEDITOR.dialog.add( 'ffDialog', function ( editor ) {
    return {
        title : 'Add ff video',
        minWidth : 510,
        minHeight : 200,
        contents : [{
            id: 'ffplugin',
            expand : true,
            elements : [
                {
                    type : 'html',
                    html : '<div class="ff-checkbox"><img class="thumb" style="width: 150px;" src="http://nfmedia.flickfusion.net/ava/templates/vsp/images/imageNot.jpg" alt="img" /></div>',
                },
                {
                    id : 'checkbox1',
                    type : 'checkbox',
                    label : 'Video1',
                    onClick : function () {
                        handleCheckbox.call(this);
                    }
                },
                {
                    type : 'html',
                    html : '<div class="ff-checkbox"><img class="thumb" style="width: 150px;" src="http://nfmedia.flickfusion.net/ava/templates/vsp/images/imageNot.jpg" alt="img" /></div>',
                },
                {
                    id : 'checkbox2',
                    type : 'checkbox',
                    label : 'Video2',
                    onClick : function () {
                        handleCheckbox.call(this);
                    }
                },
                {
                    type : 'html',
                    html : '<div class="ff-checkbox"><img class="thumb" style="width: 150px;" src="http://nfmedia.flickfusion.net/ava/templates/vsp/images/imageNot.jpg" alt="img" /></div>',
                },
                {
                    id : 'checkbox3',
                    type : 'checkbox',
                    label : 'This is the title of video 3',
                    onClick : function () {
                        handleCheckbox.call(this);
                    }
                }
            ]
        }],
        onOk : function () {
            var content = '<div style="display: flex;flex-direction: row;">';
            if(this.getValueOf('ffplugin', 'checkbox1')){
                content += '<div style="display: flex;flex-direction: column;padding: 4px;"><img style="width: 150px;" src="http://nfmedia.flickfusion.net/ava/templates/vsp/images/imageNot.jpg" alt="img" />' +
                    '<h5>Video1</h5></div>';
            }
            if(this.getValueOf('ffplugin', 'checkbox2')){
                content += '<div style="display: flex;flex-direction: column;padding: 4px;"><img style="width: 150px;" src="http://nfmedia.flickfusion.net/ava/templates/vsp/images/imageNot.jpg" alt="img" />' +
                    '<h5>Video2</h5></div>';
            }
            if(this.getValueOf('ffplugin', 'checkbox3')){
                content += '<div style="display: flex;flex-direction: column;padding: 4px;"><img style="width: 150px;" src="http://nfmedia.flickfusion.net/ava/templates/vsp/images/imageNot.jpg" alt="img" />' +
                    '<h5>This is the title of video 3</h5></div>';
            }
            content +='</div>';
            var element = CKEDITOR.dom.element.createFromHtml(content);
            var instance = this.getParentEditor();
            instance.insertElement(element);
        },
        onLoad : function(){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/data.json', true);
            xhr.onload = function (e) {
                if (this.status == 200) {
                    _rawData = JSON.parse(this.response);
                    videos = _rawData.videos;
                    console.log(videos)
                }
            };
            xhr.send();
        },
        onShow : function () {
            console.log('displayed');
        }
    };
});
function handleCheckbox(){
    console.log(document.getElementById(this.domId));
}