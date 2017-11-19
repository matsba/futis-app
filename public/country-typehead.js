$('input.countries-complete').each(function() {
    var id = $(this).attr('id')
    $("#"+id).easyAutocomplete(
        {
            url: "/public/data/countryCodes.json",
            
            getValue: "name",
        
            list: {
                onSelectItemEvent: function() {      
                    var value = $("#"+id).getSelectedItemData().code;

                    var source = '/public/img/flags/' + value +  '.png'
                    var flag_id = $("#"+id).parent().parent().next().children().attr('id')
                    $('#' + flag_id).attr( "src", source)               
                },
                match: {
                    enabled: true
                }
            }
        }
    );
})

