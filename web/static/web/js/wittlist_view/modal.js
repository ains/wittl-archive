$(function () {
    var renderMap = function (lat, long) {
        var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
        var mapOptions = {
            center: latLng,
            zoom: 8,
            disableDefaultUI: true
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
    };

    var showModal = function (data) {
        var template = Handlebars.Templates['modal_template'];


        var $modal = $('#card-detail');
        $modal.find('.modal-content')
            .empty()
            .append(template(data));

        $modal.on('shown.bs.modal', function (e) {
            renderMap(data.latitude, data.longitude);

        }).modal('show');
    };


    $('.wittlist').on('click', '.card', function (e) {
        var modalData = $(this).data('modal-data');
        showModal(modalData);
    });
});