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
            editor.addCommand('insertFfVideo', new CKEDITOR.dialogCommand('ffVideosPickerDialog', {
                allowedContent: 'div{*}(*); iframe{*}[!width,!height,!src,!frameborder,!allowfullscreen,!allow]; object param[*]; a[*]; img[*]'
            }));
            //CKEDITOR.dialog.add('ffDialog', this.path + 'dialogs/ff.js');
            CKEDITOR.dialog.add('ffVideosPickerDialog', this.path + 'dialogs/ffVideosPickerDialog.js');
            /*editor.widgets.add( 'simplebox', {
                // Code defined before...
                button : 'widget',
                template:
                    '<div class="simplebox">' +
                    '<h2 class="simplebox-title">Title</h2>' +
                    '<div class="simplebox-content"><p>Content...</p></div>' +
                    '</div>',
                allowedContent:
                    'div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',

                requiredContent: 'div(simplebox)',

                upcast: function( element ) {
                    return element.name == 'div' && element.hasClass( 'simplebox' );
                }
            } );*/
        }
    })
}());