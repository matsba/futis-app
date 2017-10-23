function createGames() {
    var title = $('#name_of_tournament').val()
    var games = $('#number_of_games').val()
    var winnerBet = $('#game_winner_bet')[0].checked
    var striker = $('#game_top_striker')[0].checked

    if(title != "" && (games < 50 && games > 0)){
        
        $('#create_games_start').empty()
        $('#step2').addClass('active')
        $('#step1').removeClass('active')

        $('#create_games_title').append(title)

        for (var i = 1; i <= games ; i++){
            var gameElement =  '<div class="form-group">' +
                                    '<div class="col-2">' +    
                                        '<label class="form-label">' +
                                        'Peli ' + i + '</label>' +
                                    '</div>' +
                                    '<div class="col-4">' +
                                        '<input required class="form-input" type="text" name="game_' + i +'.1">' +
                                    '</div>' +
                                    '<div class="col-2 text-center">vs.</div>' +
                                    '<div class="col-4">' +
                                        '<input required class="form-input" type="text" name="game_' + i +'.2">' +
                                    '</div>'+
                                '</div>'

            $('#create_games_form').append(gameElement)
        }
        $('#create_games_form').append('<h2>Sisältää</h2>')
        if(winnerBet){
            var winnerBetElement = '<div class="form-group"><input hidden name="game_winner_bet" type="checkbox" value="on"><div class="bg-success text-light p-1 rounded">Voittajaveto </div></div>'
            $('#create_games_form').append(winnerBetElement)
        }

        if(striker){
            var strikerElement = '<div class="form-group"<input hidden name="game_top_striker" type="checkbox" value="on"><div class="bg-success text-light p-1 rounded">Maalintekijä </div></div>'
            $('#create_games_form').append(strikerElement)
        }
    }
}
