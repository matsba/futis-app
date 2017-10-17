function createGames() {
  $('#create_games_form').empty()
  var games = $('#number_of_games').val()
  for (var i = 1; i <= games ; i++){
      $('#create_games_form').append('<label>Peli ' + i + '</label><input class="form-input" name="game_' + i +'">')
  }
}
