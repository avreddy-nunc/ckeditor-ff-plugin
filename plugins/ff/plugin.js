(function () {
    CKEDITOR.plugins.add('ff', {
        icons : 'ff',
        init : function (editor) {
            CKEDITOR.document.appendStyleSheet(this.path + 'styles/ffPlugin.css');
            editor.ui.addButton('ff', {
                label: 'Insert ff video',
                toolbar: 'insert',
                command: 'insertFfVideo',
                icon: this.path + 'icons/ff.png'
            });
            editor.addCommand('insertFfVideo', new CKEDITOR.dialogCommand('ffDialog', {
                allowedContent: 'div{*}(*); iframe{*}[!width,!height,!src,!frameborder,!allowfullscreen,!allow]; object param[*]; a[*]; img[*]'
            }));
            CKEDITOR.dialog.add('ffDialog', this.path + 'dialogs/ff.js');
        }
    })
}());