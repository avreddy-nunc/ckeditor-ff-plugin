CKEDITOR.dialog.add( 'ffDialog', function ( editor ) {
    var videosListElement,
        videos,
        selectedVideos=[],
        searchElement ,
        currentPage = 0,
        totalPages = 0,
        filters = {
            videoType : {},
            listingType : {},
            sort : {},
            make : {}
        },
        appliedFilters = [{videoType:"INV_ALL"}];
    function loadVideos() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://192.168.1.152/ava/apps/video_picker_json.php?RUN_TYPE=VIDEOS_JSON&clientFK=0CDDE61B-E251-EB1E-137D-426388FB1D03&USERNAME=diAdmin&page=1&limit=10&TYPE=admin&q=a', true);
        xhr.onload = function (e) {
            if (this.status == 200) {
                _rawData = JSON.parse(this.response);
                videos = _rawData.videos;
                currentPage = _rawData.currentPage;
                totalPages = _rawData.total_pages;
                console.log(videos);
                generateVideosList(videos);
            }
        };
        xhr.send();
        videosListElement = CKEDITOR.dialog.getCurrent().getContentElement('ffplugin', 'videoList').getElement().$;
    }
    function loadFilters() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost/ava/apps/video_picker_json.php?RUN_TYPE=VIDEOS_FILTERS_JSON&clientFK=0CDDE61B-E251-EB1E-137D-426388FB1D03&USERNAME=diAdmin&TYPE=admin', true);
        xhr.onload = function (e) {
            if (this.status == 200) {
                _rawData = JSON.parse(this.response);
                filters.videoType = _rawData.videoType;
                filters.listingType = _rawData.listingType;
                filters.make = _rawData.make;
                filters.sort = _rawData.sort;
                renderFilters();
            }
        };
        xhr.send();
        searchElement = CKEDITOR.dialog.getCurrent().getContentElement('ffplugin', 'searchElement').getElement().$;
    }
    function renderFilters() {
        var chipsElement = document.createElement('div');
        chipsElement.classList.add('ff-filter-chips');
        appliedFilters.forEach(function (filter) {
            for(var key in filter){
                if(filter.hasOwnProperty(key)) {
                    var chipItem = document.createElement('div');
                    chipItem.classList.add('ff-chip-item');
                    chipItem.innerHTML = '<span class="key">' + key + ' : </span>' +
                        '<span class="value">' + filter[key] + '</span>';
                    chipsElement.appendChild(chipItem);
                }
            }
        });
        var queryElement = document.createElement('input');
        queryElement.setAttribute('list','ff-filters-list');
        queryElement.oninput = handleSearch;
        var dataList = document.createElement('datalist');
        dataList.id = 'ff-filters-list';
        var options = '';
        if(appliedFilters.length && !isKey()){
            for (let key in appliedFilters[appliedFilters.length - 1]) {
                if (appliedFilters[appliedFilters.length - 1].hasOwnProperty(key)) {
                    for(let keyItem in filters[key]){
                        if(filters[key].hasOwnProperty(keyItem)) {
                            options += '<option value="' + keyItem + '"></option>';
                        }
                    }
                }
            }
        }else {
            for (let key in filters) {
                if (filters.hasOwnProperty(key)) {
                    options += '<option value="' + key + '"></option>';
                }
            }
        }
        dataList.innerHTML = options;
        chipsElement.appendChild(queryElement);
        chipsElement.appendChild(dataList);
        while (searchElement.firstChild) {
            searchElement.removeChild(searchElement.firstChild);
        }
        searchElement.appendChild(chipsElement);
    }
    function generateVideosList(videos) {
        var list = document.createElement('table');
        list.classList.add('ff-videos-list');
        list.innerHTML = '<thead><tr><th>Action</th>' +
            '<th>Title</th>' +
            '<th>Stock</th>' +
            '<th>VIN</th>' +
            '<th>Make</th>' +
            '<th>Model</th></tr></thead>';
        videos.forEach(function (video) {
            var listElememt = document.createElement('tr');
            listElememt.classList.add('ff-videos-list-item');
            listElememt.setAttribute('data-id',video.id);
            if(selectedVideos.filter(function (item) {
                return item.id == video.id;
            })[0]){
                listElememt.classList.add('selected');
            }
            listElememt.innerHTML = '<td><div class="ff-checkbox">\n' +
                '    <svg viewBox="0,0,50,50">\n' +
                '      <path d="M5 30 L 20 45 L 45 5"></path>\n' +
                '    </svg></div>\n' +
                '  </td>' +
                '<td class="ff-video-title" >'+video.title+'</td>' +
                '<td>'+video.stock+'</td>' +
                '<td>'+video.vin+'</td>' +
                '<td>'+video.make+'</td>' +
                '<td>'+video.model+'</td>';
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
    function handleSearch(e){
        var value = e.target.value;
        if(isKey()){
            if (filters.hasOwnProperty(value)) {
                var obj = {};
                obj[value] = '';
                appliedFilters.push(obj);
            }
        }else {
            for (let key in appliedFilters[appliedFilters.length - 1]) {
                if (appliedFilters[appliedFilters.length - 1].hasOwnProperty(key)) {
                    appliedFilters[appliedFilters.length - 1][key] = value;
                }
            }
        }
        e.target.value = '';
        renderFilters();
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
    function isKey() {
        for(var key in appliedFilters[appliedFilters.length - 1]){
            if(appliedFilters[appliedFilters.length - 1].hasOwnProperty(key)){
                return appliedFilters[appliedFilters.length - 1][key]
            }
        }
    }
    return {
        title : 'Add ff video',
        minWidth : 1000,
        minHeight : 600,
        contents : [{
            id: 'ffplugin',
            expand : true,
            elements : [
                {
                    type : 'html',
                    id : 'searchElement',
                    html : ''
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
            loadVideos();
            loadFilters();
        },
        onShow : function () {
            loadVideos();
            loadFilters();
        },

    };
});
