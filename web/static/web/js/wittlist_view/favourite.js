$(function () {
    $('.wittlist').on('click', '.favourite', function (e) {
        var list_item_id = $(this).parents(".card").data("list-item-id");
        var csrftoken = $.cookie('csrftoken');
        var favourite = $(this).children("i");
        $.post("/api/v1/list-items/" + list_item_id + "/toggle_favourite/", {"csrfmiddlewaretoken": csrftoken}, function () {
            favourite.toggleClass('icon_star_alt icon_star');
        });
        e.stopPropogation();
    });
});