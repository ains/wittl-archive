$(function () {
    $("#new-list-item-form").submit(function (e) {
        var form = $(this);

        //Start loading indicator
        var l = $('#new-list-item-submit').ladda();
        l.ladda('start');

        var resetForm = function () {
            form.find("input[name='url']").val("");
            l.ladda('stop');
        };

        var submitURL = form.attr("action");
        $.post(submitURL, form.serialize())
            .done(function (data) {
                wittlSorting.fetchScoreData(function () {
                    addItem(data);
                    resetForm();
                });
            }).fail(function () {
                resetForm();
            });

        e.preventDefault();
    });
})