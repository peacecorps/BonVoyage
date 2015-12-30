
var count = 0;
var arrCountries = [];

function insertAtIndex(i, id, data) {
    if(i === 1) {
        return $(id).prepend(data);
    } else {
        return $(id + " > *:nth-child(" + (i - 1) + ")").after(data);
    }
}

function addLeg() {
    count++;
    html = 
    "<div class='leg shadow-box'> \
        <h2> Trip Leg #" + count + " </h2> \
        <input class='form-control datepicker date-leaving' type='text' placeholder='Date leaving'> \
        <input class='form-control datepicker date-returning' type='text' placeholder='Date returning'> \
        <select class='form-control select-country' placeholder='Country'> \
        <textarea class='form-control description' rows='6' placeholder='Reason for leave'></textarea> \
        <button class='btn btn-danger remove-leg'> Remove Trip Leg </button> \
    </div>";
    insertAtIndex(count, '#request-submit', html);
    handleTripLegChanges();
    initialize(count);
}

function handleTripLegChanges() {
    // Update trip leg numbers to reflect deleted legs
    c = 1
    $('.leg').each(function(_, leg) {
        $(leg).removeClass().addClass('leg leg' + c);
        $(leg).find('h2').text("Trip Leg #" + c);
        c++;
    });
    // Disable the remove leg buttons, if necessary
    if (count == 1) {
        $('.remove-leg').addClass('disabled');
    } else {
        $('.remove-leg').removeClass('disabled');
    }
}

function initialize(n) {
    // Initialize the Pick a Date picker
    $('.leg:nth-child(' + n + ') .datepicker').pickadate();
    // Initialize the Selectize country selector
    $select = $('.leg:nth-child(' + n + ') .select-country').selectize({
        valueField: 'country_code',
        labelField: 'country',
        searchField: ['country', 'country_code'],
        sortField: 'country'
    });

    var selectize = $select[0].selectize;
    selectize.addOption(arrCountries);
    selectize.refreshOptions(false);

    // Add remove leg buttons
    $('.remove-leg').off('click');
    $('.remove-leg').on('click', function(e) {
        $(this).closest($('.leg')).remove();
        count--;
        handleTripLegChanges();
    });
}

function getLeg(n) {
    leg = $('.leg:nth-child(' + n + ')');
    data = {
        start_date: $(leg).find('.date-leaving').val(), 
        end_date: $(leg).find('.date-returning').val(),
        country: $(leg).find('.selectized').selectize()[0].selectize.getValue(),
        description: $(leg).find('.description').val()
    };
    return data;
}

$(document).ready(function() {

    //Load the JSON file of the countries
    $.ajax({
        method: "GET",
        url: "/data/countryList.json",
        datatype: "json",
        success: function(json, status, request) {
            for(var key in json) {
                arrCountries.push({ "country": json[key], "country_code": key });
            }

            $select = $('.selectized').selectize();
            $select.each(function(_, $s) {
                $s.selectize.addOption(arrCountries);
                $s.selectize.refreshOptions(false);
            });

        }
    });

    addLeg();

    $('#request-add-leg-btn').click(addLeg);

    $('#request-submit-btn').click(function() {
        legs = [];
        for (var i = 1; i <= count; i++) {
            legs.push(getLeg(i));
        }
        console.log(legs);
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                legs: legs
            },
            dataType: 'json',
            url: '/api/requests',
            success: function(response, textStatus, jqXHR) {
                // if (err) console.log(err);
                // console.log(response);
                if (response.redirect) {
                    // response.redirect contains the string URL to redirect to
                    window.location.href = response.redirect;
                }
            }
        });
    });
});