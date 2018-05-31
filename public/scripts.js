function cancelButton(event) {

	const target = event.target
	const isInput = target.tagName == 'INPUT' ? true : false
	const buttonText = isInput ? target.value : target.textContent
	const confirmText = 'Varmasti?'
	if (!isInput && target.innerText == confirmText) {
		return history.back(-1)
	} else if (isInput && target.value == confirmText) {
		return
	} else {
		event.preventDefault()
	}

	target.classList.add('fade-out')
	setTimeout(() => {
		isInput ? target.value = confirmText : target.textContent = confirmText
		target.classList.remove('fade-out')
	}, 750)

	setTimeout(() => {
		target.classList.add('fade-out')
		setTimeout(() => {
			isInput ? target.value = buttonText : target.textContent = buttonText
			target.classList.remove('fade-out')
		}, 750)
	}, 5000)
}

function ToggleValue(event, tournamentId) {
	//gets value in time of checked
	let value = event.target.checked
	event.preventDefault()
	const row = $('#message-row')

	//active or published
	const target = event.target.name

	let data = {
		id: tournamentId
	}
	data[target] = value

	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		url: '/admin/tournament/toggleStatus/',
		success: function (success) {
			event.target.checked = value
			row.text('Päivitys onnistui!').addClass('toast-success').removeClass('toast-error').show().delay(1000).slideUp('fast')

		},
		error: function (error) {
			event.target.checked = !value
			row.text('Tapahtui virhe!').addClass('toast-error').removeClass('toast-success').show().delay(1000).slideUp('fast')

		}
	})
}

function addGames() {
	var nbr = $('#numberOfGames').val()
	var table = $('#addGamesSectionTBody')

	//Clear table contents
	table.html('')

	//Loop to make input fields based on user input on form
	for (var i = 0; i < nbr; i++) {
		rowToTable(table)
	}
	initAutoComplite()
	buttonState()
}

function rowToTable(table) {

	var typeaheadUid = uuidv4()

	var tr = $('<tr></td>')
	table.append(tr)

	tr.append('<td>' + table.children().length + '</td>')
	tr.append('<td><input class="form-input" name="game-datetime" type="text" placeholder="01.01.2018 12:00" required /></td>')
	tr.append('<td><input class="form-input countries-complete" id=' + typeaheadUid + ' name="team-1" type="text" required /></td>')
	tr.append('<td><img class="img-responsive img-flag-small" id=' + 'flag-' + typeaheadUid + ' src="/public/img/flags/placeholder.png" /></td>')
	tr.append('<td>vs.</td>')

	typeaheadUid = uuidv4()

	tr.append('<td><input class="form-input countries-complete" id=' + typeaheadUid + ' name="team-2" type="text" required></td>')
	tr.append('<td><img class="img-responsive img-flag-small" id=' + 'flag-' + typeaheadUid + ' src="/public/img/flags/placeholder.png"></td>')
	tr.append('<td><a class="text-error" onClick="removeRow(event)"><i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i></a></td>')
}

function initAutoComplite() {

	$('input.countries-complete').each(function () {
		var el = $(this)
		el.easyAutocomplete(
			{
				url: '/public/data/countryCodes.json',

				getValue: 'name',

				list: {
					onSelectItemEvent: function () {
						var id = el.attr('id')
						var countyCode = el.getSelectedItemData().code
						var imgSource = '/public/img/flags/' + countyCode.toLowerCase() + '.png'
						var flagEl = $('#flag-' + id)
						flagEl.attr('src', imgSource)
					},
					match: {
						enabled: true
					}
				}
			}
		)
	})
	$('.easy-autocomplete').removeAttr('style')
}

function addRow(event) {
	var table = $('#addGamesSectionTBody')
	if (table.children(':first').attr('id') == 'exampleRow') {
		table.html('')
	}
	var lastRow = table.children(':last')
	rowToTable(table)
	updateRowCount(table)
	initAutoComplite()
	buttonState()
}

function removeRow(event) {
	event.preventDefault()
	var target = event.target
	var table = $('#addGamesSectionTBody')

	$(target).parentsUntil('tbody')[2].remove()
	updateRowCount(table)
	initAutoComplite()
	buttonState()
}

function updateRowCount(table) {
	$(table.children()).each(function (i) {
		$(this).children(':first').text(i + 1)
	})
}

$('document').ready(function () {
	buttonState()
})

function buttonState() {
	if ($('#addGamesSectionTBody').children(':first').attr('id') != 'exampleRow' && $('#addGamesSectionTBody').html() != '') {
		$('#submitButton').attr('disabled', false)
	} else {
		$('#submitButton').attr('disabled', true)
	}
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

function colorRows() {
	$('.pool-table-row').each(function () {
		let pool = $(this).find(".pool-table-row-own-pool").text()
		let result = $(this).find(".pool-table-row-result").text()

		if (pool == result && pool !== "" && result !== "") {
			$(this).addClass("bg-success-important")
		} else if (pool === "") {
			$(this).addClass("bg-error-imporant")
		}
	})
}

function toggleTable(table) {
	const rows = $(table).find('tr')
	const moreLink = $(table).next()
	const moreText = $(moreLink).text()

	$(rows).each(function (index, value) {
		if (index > 4) {
			$(value).toggle()
		}
	})
	
	moreText == 'Näytä vähemmän' || moreText == '' ?
		$(moreLink).text('Näytä lisää') :
		$(moreLink).text('Näytä vähemmän')
}

function mobileFriendlyLists() {
	const tables = $('table')
	tables.each(function (index, value) {
		if($(this).hasClass('needs-scroll')){
			$(this).toggleClass('table-scroll')
		}
		if ($(value).find('tr').length > 4) {

			$(value).after('<a></a>')

			$(value).next().click(function () {
				toggleTable($(value))
			})
			$(value).click(function () {
				toggleTable($(value))
			})
			toggleTable($(value))
		}
	})

}

function validityCheck(formEl){
	if(!formEl.checkValidty) {
	  document.getElementById('validity-check').textContent = "Täytä kaikki kentät!"
	  document.getElementById('validity-check').className = "toast toast-error"
	}
  }


function toggleModal(link){

	if(link.nextSibling.className == "modal modal-sm"){
	  link.nextSibling.className="modal modal-sm active"
	}
	else if(link.offsetParent.className == "modal modal-sm active"){
	  link.offsetParent.className = "modal modal-sm"
	}
  }