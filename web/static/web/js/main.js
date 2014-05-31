$(function () {

    /* Menu */
    $('#open-menu').sidr({
        name: 'side-menu',
        source: '#side-menu',
        renaming: false
    });

    $('body').click(function (e) {
        if ($(e.target).closest('.sidr').length === 0 && $(e.target).closest('.sidebar').length === 0) {
            $.sidr('close', 'side-menu');
        }
    });

});