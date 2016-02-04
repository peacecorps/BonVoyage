
var count = 0;
var arrCountries = [];
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1eQgsc94okiGh40EPfH6uwyq4a0aK45OwF5cFYkTlRlA/pubhtml';

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
        <label class='info'>Date leaving</label> \
        <input class='form-control datepicker date-leaving' type='text' placeholder='1 January, 2000'> \
        <label class='info'>Date returning</label> \
        <input class='form-control datepicker date-returning' type='text' placeholder='31 December, 2000'> \
        <label class='info'>Country</label> \
        <select class='form-control select-country' placeholder='United States'></select> \
        <div class='warnings'></div> \
        <label class='info'>Travel contact</label> \
        <input class='form-control contact' type='text' placeholder='+1 123-456-7890  and/or  johndoe@peacecorps.org'></input> \
        <label class='info'>Hotel/Hostel Information</label> \
        <input class='form-control hotel' type='text' placeholder='San Francisco Hotel: +1 123-456-7890'></input> \
        <label class='info'>Travel companions</label> \
        <input class='form-control companions' type='text' placeholder='John Doe: +1 123-456-7890'></input> \
        <label class='info'>Reason for leave</label> \
        <input class='form-control description' rows='6' type='text' placeholder='Emergency sick leave'></input> \
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
        $(leg).removeClass().addClass('leg shadow-box leg' + c);
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

function clearWarnings($warnings) {
    $($warnings).empty();
}

function addWarning(warning, $warnings) {
    var map = {
        warning: "danger",
        alert: "warning"
    }

    $($warnings).append(
        $(
            "<div class='warning alert alert-" + map[warning.type.toLowerCase()] + "' role='alert'> \
                <span><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><b>US State Department:</b> " + warning.text_overview + " <b><a href='" + warning.link + "'>More Information</a></b></span> \
            </div>"
        )
    );
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

    // Show a warning if one exists when the select is clicked
    selectize.on('item_add', function(country_code, $item) {        
        // Get a selector for the warnings div, specific to the leg where the country was selected
        $warnings = $($item).closest($('.leg')).find('.warnings');
        clearWarnings($warnings);

        Tabletop.init({
            key: public_spreadsheet_url,
            callback: function(data, tabletop) {
                for (var i = 0; i < data.length; i++) {
                    var type = data[i]['Type'];
                    var msg = data[i]['Message'];
                    var link = data[i]['Link'];

                    if (link) {
                        link = " <b><a href='" + data[i]['Link'] + "'>More Information</a></b>"
                    } else {
                        link = "";
                    }

                    $('.warnings').append($(
                        "<div class='warning alert alert-" + type.toLowerCase() + "' role='alert'> \
                            <span><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><b>Peace Corps:</b> " + data[i]['Message'] + link + "</span> \
                        </div>"
                    )
                    );
                }
                
                getWarnings(function(warnings) {
                    // Clear all warnings
                    // Get the warnings for the selected country
                    country_warnings = warnings[country_code];
                    if (country_warnings) {
                        for(var i = 0; i < country_warnings.length; i++) {
                            // Add a warning for each country
                            addWarning(country_warnings[i], $warnings);
                        }
                    }
                });
            },
            simpleSheet: true,
            query: "country = " + country_code
        });


        
    });
}

function getLeg(n) {
    leg = $('.leg:nth-child(' + n + ')');
    data = {
        start_date: $(leg).find('.date-leaving').val(), 
        end_date: $(leg).find('.date-returning').val(),
        country: $(leg).find('.selectized').selectize()[0].selectize.getValue(),
        hotel: $(leg).find('.hotel').val(),
        contact: $(leg).find('.contact').val(),
        companions: $(leg).find('.companions').val(),
        description: $(leg).find('.description').val()
    };
    return data;
}

$(function() {
    $select = $('.select-country').selectize();
    $select_requestee = $('.selectRequestee').selectize({
        valueField: 'email',
        labelField: 'name',
        searchField: ['name'],
        sortField: 'name'
    });

    $.ajax({
        method: "GET",
        url: "/api/users?maxAccess=VOLUNTEER",
        dataType: "json",
        success: function(json, status, request) {
            console.log(json);
            $select_requestee[0].selectize.addOption(json);
            $select_requestee[0].selectize.refreshOptions(false);
        }
    });

    // Load the JSON file of the countries
    $.ajax({
        method: "GET",
        url: "/data/countryList.json",
        datatype: "json",
        success: function(json, status, request) {
            for(var key in json) {
                arrCountries.push({ "country": json[key], "country_code": key });
            }

            $select.each(function(_, $s) {
                $s.selectize.addOption(arrCountries);
                $s.selectize.refreshOptions(false);
            });

        }
    });

    // Load the warnings
    getWarnings();

    // Start the request with a single trip leg
    addLeg();

    $('#request-add-leg-btn').click(addLeg);

    $('#request-submit-btn').click(function() {
        legs = [];
        for (var i = 1; i <= count; i++) {
            legs.push(getLeg(i));
        }
        var email = undefined;
        if ($('.selectRequestee').length > 0) {
            email = $select_requestee[0].selectize.getValue();
        }
        $.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                email: email,
                legs: legs
            },
            dataType: 'json',
            url: '/api/requests',
            success: function(response, textStatus, jqXHR) {
                // if (err) console.log(err);
                // console.log(response);
                if (response && response.redirect) {
                    // response.redirect contains the string URL to redirect to
                    window.location.href = response.redirect;
                }
            }
        });
    });
});