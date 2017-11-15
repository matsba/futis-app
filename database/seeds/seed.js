exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('delete from participant; delete from pools; delete from game; delete from tournament; delete from "user"')

    .then(() => {
      return knex('tournament').insert([
        {id: '402af448-c275-491e-9f79-511bfe80545b', name: 'Jalkapallon MM 2018', datePlayingStarts: '1.12.2017', dateStarts: '3.12.2017', dateEnds: '30.1.2018', active: true}
      ])
    })

    .then(() => {
      return knex('game').insert([
        {id: 1,  team_1: 'Islanti',  team_2: 'Suomi', team_1_score: '1', team_2_score: '0', result: '1', tournament_id: '402af448-c275-491e-9f79-511bfe80545b', game_start_datetime: '1.12.2017 15:00' },
        {id: 2,  team_1: 'Ranska',  team_2: 'Saksa', team_1_score: '2', team_2_score: '2', result: 'x', tournament_id: '402af448-c275-491e-9f79-511bfe80545b', game_start_datetime: '1.12.2017 17:00'},
        {id: 3,  team_1: 'Ruotsi',  team_2: 'Norja', team_1_score: '10', team_2_score: '2', result: '1', tournament_id: '402af448-c275-491e-9f79-511bfe80545b', game_start_datetime: '2.12.2017 15:00'},
        {id: 4,  team_1: 'Brasilia',  team_2: 'Saksa', team_1_score: '2', team_2_score: '4', result: '2', tournament_id: '402af448-c275-491e-9f79-511bfe80545b', game_start_datetime: '2.12.2017 17:00'},
        {id: 5,  team_1: 'Nigeria',  team_2: 'Suomi', team_1_score: '4', team_2_score: '0', result: '1', tournament_id: '402af448-c275-491e-9f79-511bfe80545b', game_start_datetime: '2.12.2017 19:00'},
        {id: 6,  team_1: 'Italia',  team_2: 'Espanja', team_1_score: '0', team_2_score: '0', result: 'x', tournament_id: '402af448-c275-491e-9f79-511bfe80545b', game_start_datetime: '2.12.2017 21:00'},
      ])
    })

    .then(() => {
      return knex('user').insert([
          //TODO: add user
          {id: 0, username: 'admin', password:'$2y$10$3c0PdD1pwn3k9XOe.UMXyubKhoY1wpfY/pZagJlPRIay0DaO/i43e', email:'admin@admin.fi', approved: 'true'},
          {id: 100, username: 'masa', password:'$2y$10$156ZiaDCBLJw.zD45IPYou5FgV7Q4KlvAk0io1o/i18IZJm4ZQQUi', email:'masa@seedaus.fi', approved: 'true'},
          {id: 101, username: 'mikko', password: '$2y$10$UmVwvUtKep/6ZZP/88a6curk/dvYO41Cs0fcg9UoqRZ/rVkWiqmSO', email: 'mikkotest@seedaus.fi', approved: 'true'},
          {id: 102, username: 'kalle', password: '$2y$10$vxcj.tprMjIt9JEouRyQkeEvJqAMBnzdrjXlCb7ZTdH4d0Ru4nomq', email: 'mrnopool@seedaus.fi', approved: 'true'},
          {id: 10123, username: 'eihyväksytty', password: '$2y$10$BOq0m5jN.tfpwqU8T5nzU.QycKICGcADOnMkiCLb7yjxZ2VK2O//6', email: 'eihyvaksytty@seedaus.fi', approved: 'false'},
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
          //kalle bets
          {game_id: 1, user_id: 102, pool: '1'}
          
      ])
    })

    .then(() => {
      return knex('participant').insert([
          {user_id: 100, tournament_id: '402af448-c275-491e-9f79-511bfe80545b'},
          {user_id: 101, tournament_id: '402af448-c275-491e-9f79-511bfe80545b'},
          {user_id: 102, tournament_id: '402af448-c275-491e-9f79-511bfe80545b'}
      ])
    })
};