exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw("delete from participant; delete from pools; delete from game; delete from tournament")

    .then(() => {
      return knex('tournament').insert([
        {id: '402af448-c275-491e-9f79-511bfe80545b', name: 'Jalkapallon MM 2018', datePlayingStarts: '1.12.2017', dateStarts: '3.12.2017', dateEnds: '30.1.2018', active: false}
      ])
    })

    .then(() => {
      return knex('game').insert([
        {id: 1,  team_1: 'Islanti',  team_2: 'Suomi', team_1_score: '1', team_2_score: '0', result: '1', tournament_id: '402af448-c275-491e-9f79-511bfe80545b'},
        {id: 2,  team_1: 'Ranska',  team_2: 'Saksa', team_1_score: '2', team_2_score: '2', result: 'x', tournament_id: '402af448-c275-491e-9f79-511bfe80545b'},
      ])
    })

    .then(() => {
      return knex('user').insert([
          //TODO: add user
          {id: 0, username: 'admin', password:'$2y$10$3c0PdD1pwn3k9XOe.UMXyubKhoY1wpfY/pZagJlPRIay0DaO/i43e', email:'admin@admin.fi', approved: 'true'},
          {id: 100, username: 'masa', password:'$2y$10$156ZiaDCBLJw.zD45IPYou5FgV7Q4KlvAk0io1o/i18IZJm4ZQQUi', email:'masa@seedaus.fi', approved: 'true'},
          {id: 101, username: 'mikko', password: '$2y$10$UmVwvUtKep/6ZZP/88a6curk/dvYO41Cs0fcg9UoqRZ/rVkWiqmSO', email: 'mikkotest@seedaus.fi', approved: 'true'},
          {username: 'eihyväksytty', password: '$2y$10$BOq0m5jN.tfpwqU8T5nzU.QycKICGcADOnMkiCLb7yjxZ2VK2O//6', email: 'eihyvaksytty@seedaus.fi', approved: 'false'},
      ])
    })

    .then(() => {
      return knex('pools').insert([
          //masa bets
          {game_id: 1, user_id: 100, pool: '1'},
          {game_id: 2, user_id: 100, pool: '2'},
          //mikko bets
          {game_id: 1, user_id: 101, pool: '1'},
          {game_id: 2, user_id: 101, pool: 'x'},
      ])
    })

    .then(() => {
      return knex('participant').insert([
          {user_id: 100, tournament_id: '402af448-c275-491e-9f79-511bfe80545b'},
          {user_id: 101, tournament_id: '402af448-c275-491e-9f79-511bfe80545b'},
      ])
    })
};