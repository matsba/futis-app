exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw("delete from games; delete from tournaments; delete from users where username != 'admin'")

    .then(() => {
      return knex('tournaments').insert([
        {id: 'MM2018', name: 'MM 2018 turnaus'}
      ])
    })

    .then(() => {
      return knex('games').insert([
        {id: '1',  team_1: 'Islanti',  team_2: 'Suomi', result_1: '1', result_2: '0', final_result: '1', tournament_id: 'MM2018'},
        {id: '2',  team_1: 'Ranska',  team_2: 'Saksa', result_1: '2', result_2: '2', final_result: 'x', tournament_id: 'MM2018'},
      ])
    })

    .then(() => {
      return knex('users').insert([
          //TODO: add users
          {username: 'masa', password:'$2a$10$cI2X9KwFxiUd.c06MNCNLOAQnGJIwbRfGP1Zvymrilktb1MeLxGee', email:'masa@seedaus.fi', approved: 'true'}
      ])
    })
};