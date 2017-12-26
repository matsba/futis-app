function cancelButton(event) {
    event.preventDefault()
    let target = event.target
    let confirmText = "Varmasti?"
    
    if(target.innerText == confirmText){
      return history.back(-1)
    }
    $(target).animate({"opacity": 0}, 1000, function(){
      $(this).text(confirmText)
    }).animate({"opacity": 1}, 1000)
  
  }


function addGames() {
    var nbr = $('#numberOfGames').val()
    var table = $('#addGamesSectionTBody')  
    var x = 0

    //Clear table contents
    table.html("")
    
    //Loop to make input fields based on user input on form
    for (var i = 0; i < nbr; i++){   
      rowToTable(table)
     }
     initAutoComplite()
  }

function rowToTable(table) {
  
  var typeaheadUid = Date.now()
  
  var tr = $('<tr></td>')
  table.append(tr)
                      
  tr.append('<td>'+ table.children().length +'</td>')                            
  tr.append('<td><input class="form-input" name="game-datetime" type="text" placeholder="01.01.2018 12:00" required /></td>')
  tr.append('<td><input class="form-input countries-complete" id=' + typeaheadUid +' name="team-1" type="text" required /></td>')
  tr.append('<td><img class="img-responsive img-flag-small" id=' + typeaheadUid + ' src="/public/img/flags/placeholder.png" /></td>')
  tr.append('<td>vs.</td>')
  
  typeaheadUid = Date.now()
  
  tr.append('<td><input class="form-input countries-complete" id=' + typeaheadUid + ' name="team-2" type="text" required></td>')
  tr.append('<td><img class="img-responsive img-flag-small" id=' + typeaheadUid + ' src="/public/img/flags/placeholder.png"></td>')
  tr.append('<td><a class="text-error" onClick="removeRow(event)"><i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i></a></td>')
}

function initAutoComplite() {
  $('input.countries-complete').each(function () {
    var id = $(this).attr('id')
    $("#" + id).easyAutocomplete(
      {
        url: "/public/data/countryCodes.json",

        getValue: "name",

        list: {
          onSelectItemEvent: function () {
            var value = $("#" + id).getSelectedItemData().code;

            var source = '/public/img/flags/' + value.toLowerCase() + '.png'
            var flag_id = $("#" + id).parent().parent().next().children().attr('id')
            $('#' + flag_id).attr("src", source)
          },
          match: {
            enabled: true
          }
        }
      }
    );
  })
  $('.easy-autocomplete').removeAttr('style');
}

function addRow(event){
  var table = $('#addGamesSectionTBody')
  if(table.children(':first').attr('id') == "exampleRow") {
    table.html("")
  }
  var lastRow = table.children(':last')
  rowToTable(table)
  updateRowCount(table)
}

function removeRow(event) {
  event.preventDefault()
  var target = event.target
  var table = $('#addGamesSectionTBody')
  
  $(target).parentsUntil('tbody')[2].remove()
  updateRowCount(table)

}

function updateRowCount(table) {    
  $(table.children()).each(function(i) {
    $(this).children(':first').text(i + 1)
  })
}
