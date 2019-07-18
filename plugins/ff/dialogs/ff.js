CKEDITOR.dialog.add( 'ffDialog', function ( editor ) {
    var videosListElement,videos,selectedVideos=[];
    function handleSearch(){
        var query = CKEDITOR.dialog.getCurrent().getContentElement( 'ffplugin', 'searchText' ).getInputElement().getValue();
        if(query) {
            generateVideosList(videos.filter(function (video) {
                return video.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            }));
        }else{
            generateVideosList([]);
        }
    }
    function generateVideosList(videos) {
        var list = document.createElement('ul');
        list.classList.add('ff-videos-list');
        videos.forEach(function (video) {
            var listElememt = document.createElement('li');
            listElememt.classList.add('ff-videos-list-item');
            listElememt.setAttribute('data-id',video.id);
            if(selectedVideos.filter(function (item) {
                return item.id == video.id;
            })[0]){
                listElememt.classList.add('selected');
            }
            listElememt.innerHTML = '<div class="ff-checkbox">\n' +
                '    <svg viewBox="0,0,50,50">\n' +
                '      <path d="M5 30 L 20 45 L 45 5"></path>\n' +
                '    </svg>\n' +
                '  </div>' +
                '<img src="'+video.img+'" alt="'+video.title+'"/>' +
                '<span class="ff-video-title" >'+video.title+'</span>';
            list.appendChild(listElememt);
            listElememt.addEventListener('click',function () {
                handleClick.call(this);
            })
        });
        while (videosListElement.firstChild) {
            videosListElement.removeChild(videosListElement.firstChild);
        }
        videosListElement.append(list);
    }
    function handleClick() {
        var id= this.getAttribute('data-id');
        if(this.classList.contains('selected')){
            selectedVideos.splice(selectedVideos.indexOf(videos.filter(function (video) {
                return video.id == id;
            })[0]),1);
        }else {
            selectedVideos.push(videos.filter(function (video) {
                return video.id == id;
            })[0]);
        }
        this.classList.toggle('selected');
        console.log(selectedVideos);
    }
    return {
        title : 'Add ff video',
        minWidth : 510,
        minHeight : 200,
        contents : [{
            id: 'ffplugin',
            expand : true,
            elements : [
                {
                    type : 'text',
                    label : 'Search',
                    id : 'searchText',
                    placeholder : 'Try searching video',
                    onChange : function () {
                        handleSearch.call(this);
                    },
                    onKeyUp : function () {
                        handleSearch.call(this)
                    }
                },
                {
                    type : 'html',
                    id : 'videoList',
                    html : ''
                }
            ]
        }],
        onOk : function () {
            var content = '<div style="display: flex;flex-direction: row;">';
            selectedVideos.forEach(function (video) {
                content += '<div style="display: flex;flex-direction: column;padding: 4px;"><img style="width: 150px;" src="'+video.img+'" alt="img" />' +
                    '<h5>'+video.title+'</h5></div>';
            });
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
                    console.log(videos);
                    //generateVideosList(videos);
                }
            };
            xhr.send();
            videosListElement = CKEDITOR.dialog.getCurrent().getContentElement('ffplugin', 'videoList').getElement().$;
        },
        onShow : function () {
            console.log(this);
        },

    };
});
