$(function () {

    /* Menu */
    $('.sidebar header').sidr({
        name: 'side-menu',
        source: '#side-menu',
        renaming: false
    });

    $('body').click(function (e) {
        if ($(e.target).closest('.sidr').length === 0 && $(e.target).closest('.sidebar').length === 0) {
            $.sidr('close', 'side-menu');
        }
    });

    var resizeInput = function() {
        $(this).attr('size', $(this).val().length);
    };

    $('.wittl-form')
        .on('keyup', 'input.param-field', resizeInput);
        
    setTimeout(function() {
        $('.wittl-form input.param-field').each(resizeInput);
    }, 250);

});