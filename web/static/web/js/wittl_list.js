function WittlSorting(scoreDataURL) {
    var sorter = this;
    var scoringData = null;

    this.fetchScoreData = function (callback) {
        $.getJSON(scoreDataURL, function (data) {
            scoringData = data;
            if (!_.isUndefined(callback)) {
                callback(data);
            }
        });
    };

    this.calculateScore = function (cardID) {
        var wittlOrder = $('.wittl').map(function (i, e) {
            return $(e).data('wittl-id');
        });

        return _.reduce(wittlOrder, function (acc, wittl, index) {
            var totalScore = _.reduce(scoringData, function (acc, cardData, index) {
                return acc + cardData[wittl];
            }, 0);
            var score = (wittl in scoringData[cardID]) ? scoringData[cardID][wittl] : 0;
            var normalisedScore = score / totalScore;
            return acc + (normalisedScore * (1 / Math.pow(8, index)));
        }, 0) * 100;
    };

    this.scoreCard = function (card) {
        var cardID = $(card).data('list-item-id');
        var newWeight = sorter.calculateScore(cardID);
        $(card).data('wittl-weight', newWeight);
    };

    this.fetchScoreData(function () {
        $wittlist = $(".wittlist");
        $wittlist.on("resort", function (event, param1, param2) {
            //Update cards with their new weights
            $(".card").each(function (i, card) {
                sorter.scoreCard(card);
            });

            //Shuffle the deck!
            $wittlist.isotope('updateSortData');
            $wittlist.isotope({sortBy: 'wittlWeight'});
        });
    });
};

$(function () {
    $('.wittl header').click(function (e) {
        $(this).closest('.wittl').toggleClass('opened');
    });

    $('.wittlist').isotope({
        itemSelector: '.card-wrapper',
        layoutMode: 'fitRows',
        transitionDuration: '0.65s',
        getSortData: {
            wittlWeight: function (elem) {
                return parseInt($(elem).children('.card').data('wittl-weight'));
            }
        },
        sortBy: 'wittlWeight'
    });

    $('.wittls').sortable({
        handle: 'header',
        update: function () {
            $('.wittlist').trigger('resort');
        }
    });
});