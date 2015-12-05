$(document).ready(function() {
     $('.datepicker').pickadate();

     var $select = $('#select-country').selectize({
        valueField: 'country_code',
        labelField: 'country',
        searchField: ['country', 'country_code'],
        sortField: 'country',
        onInitialize: function() {
            //Load the JSON file of the countries
            $.ajax({
                method: "GET",
                url: "/data/countryList.json",
                datatype: "json",
                success: function(json, status, request) {
                    console.log(json);

                     var arrCountries = [];
                     for(var key in json) {
                        arrCountries.push({ "country": json[key], "country_code": key });
                    }

                    var selectize = $select[0].selectize;
                    selectize.addOption(arrCountries);
                    selectize.addOption("hi");
                    selectize.refreshOptions(false);

                    console.log(selectize);
                    console.log(arrCountries);
                }

            });



        }
     });
});