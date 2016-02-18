
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

function addLeg(leg) {
    count++;
    var m = new moment();
    m.add(1, 'month');
    var default_start = new DateOnly(m);
    m.add(4, 'days');
    var default_end = new DateOnly(m);
    console.log(default_start);
    console.log(default_end);
    html =
    "<div class='leg shadow-box'> \
        <h2> Trip Leg #" + count + " </h2> \
        <label class='info'>Date leaving</label> \
        <input class='form-control datepicker date-leaving' type='text' placeholder='Jan 1, 2000', value='" + (leg && leg.start_date ? leg.start_date : default_start.toString()) + "'> \
        <label class='info'>Date returning</label> \
        <input class='form-control datepicker date-returning' type='text' placeholder='Dec 31, 2000', value='" + (leg && leg.end_date ? leg.end_date : default_end.toString()) + "'> \
        <label class='info'>Country</label> \
        <select class='form-control select-country' placeholder='United States'></select> \
        <div class='warnings'></div> \
        <label class='info'>Travel contact</label> \
        <input class='form-control contact' type='text' placeholder='+1 123-456-7890  and/or  johndoe@peacecorps.gov' value='" + (leg && leg.contact ? leg.contact : '') + "'></input> \
        <label class='info'>Hotel/Hostel Information</label> \
        <input class='form-control hotel' type='text' placeholder='San Francisco Hotel: +1 123-456-7890' value='" + (leg && leg.hotel ? leg.hotel : '') + "'></input> \
        <label class='info'>Travel companions</label> \
        <input class='form-control companions' type='text' placeholder='John Doe: +1 123-456-7890' value='" + (leg && leg.companions ? leg.companions : '') + "'></input> \
        <label class='info'>Reason for leave</label> \
        <input class='form-control description' rows='6' type='text' placeholder='Emergency sick leave' value='" + (leg && leg.description ? leg.description : '') + "'></input> \
        <button class='btn btn-danger remove-leg'> Remove Trip Leg </button> \
    </div>";
    insertAtIndex(count, '#request-submit', html);
    handleTripLegChanges();
    initialize(count);
}

function handleTripLegChanges() {
    // Update trip leg numbers to reflect deleted legs
    c = 1;
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
                <span><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><b>US State Department:</b> " + warning.textOverview + " <b><a href='" + warning.link + "'>More Information</a></b></span> \
            </div>"
        )
    );
}

function initialize(n) {
    // Initialize the Pick a Date picker
    $('.leg:nth-child(' + n + ') .datepicker').pickadate({
        format: PICKADATE_DISPLAY_FORMAT,
    });
    $('.leg:nth-child(' + n + ') .datepicker').each(function() {
        if($(this).val()) {
            $(this).pickadate('picker').set('select', new Date($(this).val()))
        }
    });
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

        (function(country_code, $warnings) {
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

                        if (data[i]['Message'] || link) {
                            $warnings.append($(
                                "<div class='warning alert alert-" + (type ? type.toLowerCase() : 'info') + "' role='alert'> \
                                    <span><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><b>Peace Corps:</b> " + (data[i]['Message'] ? data[i]['Message'] : 'No details provided.') + link + "</span> \
                                </div>"
                            ));
                        }
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
        })(country_code, $warnings);



    });
}

function getLeg(n) {
    leg = $('.leg:nth-child(' + n + ')');
    var start = $(leg).find('.date-leaving').val();
    var end = $(leg).find('.date-returning').val();
    data = {
        start_date: (start ? (new DateOnly(start).toString()) : undefined),
        end_date: (end ? (new DateOnly(end).toString()) : undefined),
        country: $(leg).find('.selectized').selectize()[0].selectize.getValue(),
        hotel: $(leg).find('.hotel').val(),
        contact: $(leg).find('.contact').val(),
        companions: $(leg).find('.companions').val(),
        description: $(leg).find('.description').val()
    };
    return data;
}

function isSubmitAsOtherUserShowing() {
    return $('.selectRequestee').length > 0;
}

function submissionDataExists() {
    return !$.isEmptyObject(submissionData);
}

$(function() {
    $select = $('.select-country').selectize();
    $select_requestee = $('.selectRequestee').selectize({
        valueField: 'email',
        labelField: 'name',
        searchField: ['name'],
        sortField: 'name'
    });


    if (isSubmitAsOtherUserShowing()) {
        $.ajax({
            method: "GET",
            url: "/api/users?maxAccess=VOLUNTEER",
            dataType: "json",
            success: function(json, status, request) {
                console.log(json);
                $select_requestee[0].selectize.addOption(json);
                $select_requestee[0].selectize.refreshOptions(false);
                if(submissionDataExists()) {
                    // A failure just occurred during submission: we need to replace the previously submitted data
                    // Set the email, if they are a supervisor
                    if (isSubmitAsOtherUserShowing() && submissionData.email != undefined) {
                        $select_requestee[0].selectize.setValue(submissionData.email);
                    }
                }
            }
        })
    };

    // Load the JSON file of the countries
    $.ajax({
        method: "GET",
        url: "/data/countryList.json",
        datatype: "json",
        success: function(json, status, request) {
            for(var key in json) {
                arrCountries.push({ "country": json[key], "country_code": key });
            }

            var $select = $('.select-country.selectized').selectize();
            $select.each(function(_, $s) {
                $s.selectize.addOption(arrCountries);
                $s.selectize.refreshOptions(false);
            });

            if(submissionDataExists()) {
                // A failure just occurred during submission: we need to replace the previously submitted data
                for(var i = 0; i < $select.length; i++) {
                    console.log($select[i]);
                    $select[i].selectize.setValue(submissionData.legs[i].country);
                }
            }
        }
    });


    if(submissionDataExists()) {
        // A failure just occurred during submission: we need to replace the previously submitted data
        // Create all of the legs, and fill what data can be filled without the above AJAX calls finishing (countries, submit as other user)
        console.log(submissionData);
        for (var i = 0; i < submissionData.legs.length; i++) {
            var leg = submissionData.legs[i];
            addLeg(leg);
        }
    } else {
        // Start the request with a single trip leg
        addLeg();
    }

    // Load the warnings
    getWarnings();

    $('#request-add-leg-btn').click(addLeg);

    $('#request-submit-btn').click(function() {
        legs = [];
        for (var i = 1; i <= count; i++) {
            legs.push(getLeg(i));
        }
        var email = undefined;
        if (isSubmitAsOtherUserShowing()) {
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
