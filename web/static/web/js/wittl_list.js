var initializeSorting = function (scoringData) {
    var calculateScore = function (cardID, wittls) {
        return _.reduce(wittls, function (acc, wittl, index) {
            var totalScore = _.reduce(scoringData, function (acc, cardData, index) {
                return acc + cardData[wittl];
            }, 0);
            var score = (wittl in scoringData[cardID]) ? scoringData[cardID][wittl] : 0;
            var normalisedScore = score / totalScore;
            return acc + (normalisedScore * (1 / Math.pow(8, index)));
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

            var wittlIDs = $('.wittl').map(function(i, e) {
               return $(e).data('witt-id');
            });

            //Update cards with their new weights
            $(".card").each(function (i, card) {
                var cardID = $(card).data('list-item-id');
                var newWeight = calculateScore(cardID, wittls) * 100;
                $(card).data('wittl-weight', newWeight);
            });

            //Shuffle the deck!
            $wittlist.isotope('updateSortData')
            $wittlist.isotope({sortBy: 'wittlWeight'});
        }
    });
};

$(function() {
   $('.wittl header').click(function (e) {
        $(this).closest('.wittl').toggleClass('opened');
    });
});