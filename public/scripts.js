function createGames() {
    var title = $('#name_of_tournament').val()
    var games = $('#number_of_games').val()
    var winnerBet = $('#game_winner_bet')[0].checked
    var striker = $('#game_top_striker')[0].checked
    var winnerBetElement = ""
    var strikerElement = ""

    if(winnerBet){
        winnerBetElement = '<div class="column col-4"><input name="game_winner_bet" type="hidden" value="true">Voittajaveto</div>'
    }
    if(striker){   
        strikerElement = '<div class="column col-4"><input name="game_top_striker" type="hidden" value="true">Maalintekijäveto</div>'
    }

    if(title != "" && (games < 50 && games > 0)){

        $('#create_games_form').append('')
        $('#create_games_form').append('<div class="columns pb-1-4"> <div class="column col-4"><b>Turnaus sisältää: </b></div>' + winnerBetElement + strikerElement + '</div>')

        $('#create_games_start').empty()
        $('#step2').addClass('active')
        $('#step1').removeClass('active')

        $('#create_games_title').append(title)
        $('#create_games_form').append('<input name="title" type="hidden" value="' + title + '">')

        for (var i = 1; i <= games ; i++){
            var gameElement =  '<div class="form-group">' +
                                    '<div class="col-2">' +    
                                        '<label class="form-label">' +
                                        'Peli ' + i + '</label>' +
                                    '</div>' +
                                    '<div class="col-4">' +
                                        '<input required class="form-input" type="text" name="game_' + i +'_1">' +
                                    '</div>' +
                                    '<div class="col-2 text-center">vs.</div>' +
                                    '<div class="col-4">' +
                                        '<input required class="form-input" type="text" name="game_' + i +'_2">' +
                                    '</div>'+
                                '</div>'

            $('#create_games_form').append(gameElement)
        }
        $('#create_games_form').append("<input type='submit' value='Valmista' class='btn btn-primary login-button'>")

    }
}
