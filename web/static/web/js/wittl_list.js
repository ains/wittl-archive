var initializeSorting = function (scoringData) {
    var calculateScore = function (cardID, wittls) {
        return _.reduce(wittls, function (acc, wittl, index) {
            var score = (wittl in scoringData[cardID]) ? scoringData[cardID][wittl] : 0;
            return acc + (score * (1 / Math.pow(2, index + 1)));
        }, 0);
    }

    var $wittlist = $('.wittlist');
    $wittlist.isotope({
        itemSelector: '.card-wrapper',
        layoutMode: 'fitRows',
        transitionDuration: '0.65s',
        getSortData: {
            wittlWeight: function (elem) {
                return parseInt($(elem).children('.card').data('wittl-weight'));
            }
        }
    });

    var panelList = $('.wittls');
    panelList.sortable({
        handle: 'header',
        update: function () {
            //Get all wittl names
            var wittls = $('.wittl').map(function (i, e) {
                return $(e).data('wittl-name');
            });

            //Update cards with their new weights
            $(".card").each(function (i, card) {
                var cardID = $(card).data('list-item-id');
                var newWeight = calculateScore(cardID, wittls);
                $(card).data('wittl-weight', newWeight);
            });

            //Shuffle the deck!
            $wittlist.isotope('updateSortData')
            $wittlist.isotope({sortBy: 'wittlWeight'});
        }
    });

    $('.wittl header').click(function (e) {
        $(this).closest('.wittl').toggleClass('opened');
    });
};

$(function () {
    initializeSorting({"1": {"travel_prices_from": 90, "travel_time_from": 420}, "2": {"travel_prices_from": 152, "travel_time_from": 368}});
})
