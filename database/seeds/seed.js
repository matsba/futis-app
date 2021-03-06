exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex.raw('delete from content; delete from user_auth;delete from extra_pools;delete from pools; delete from participant; delete from game; delete from tournament; delete from "user"')

		.then(() => {
			return knex('tournament').insert([
				{
					id: '66b46cb2-d59c-43e2-9723-3a9833bfa2c3',
					name: 'Testi turnaus',
					dateplayingstarts: '2018-01-07T22:00:00.000Z',
					datestarts: '2018-01-14T22:00:00.000Z',
					dateends: '2018-01-21T22:00:00.000Z',
					active: true,
					winnerbet: true,
					topstriker: null },
				{ 'datestarts': '2018-06-14T00:00:00+03:00',
					'dateends': '2018-07-15T00:00:00+03:00',
					'winnerbet': true,
					'name': 'Jalkapallon MM-kisat 2018 - Venäjä',
					'topstriker': true,
					'active': true,
					'dateplayingstarts': '2018-04-01T00:00:00+03:00',
					'id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'}
			])
		})

		.then(() => {
			return knex('game').insert([
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Venäjä',
					'team_2': 'saudi',
					'game_start_datetime': '2018-06-14T18:00:00+03:00',
					'result': null,
					'id': 34,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Marokko',
					'team_2': 'Iran',
					'game_start_datetime': '2018-06-15T18:00:00+03:00',
					'result': null,
					'id': 40,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Portugali',
					'team_2': 'Espanja',
					'game_start_datetime': '2018-06-15T21:00:00+03:00',
					'result': null,
					'id': 41,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Ranska',
					'team_2': 'Australia',
					'game_start_datetime': '2018-06-16T13:00:00+03:00',
					'result': null,
					'id': 46,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Argentiina',
					'team_2': 'Islanti',
					'game_start_datetime': '2018-06-16T16:00:00+03:00',
					'result': null,
					'id': 52,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Egypti',
					'team_2': 'Uruguay',
					'game_start_datetime': '2018-06-16T17:00:00+03:00',
					'result': null,
					'id': 35,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Peru',
					'team_2': 'Tanska',
					'game_start_datetime': '2018-06-16T19:00:00+03:00',
					'result': null,
					'id': 47,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Kroatia',
					'team_2': 'Nigeria',
					'game_start_datetime': '2018-06-16T21:00:00+03:00',
					'result': null,
					'id': 53,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Costa Rica',
					'team_2': 'Serbia',
					'game_start_datetime': '2018-06-17T16:00:00+03:00',
					'result': null,
					'id': 58,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Saksa',
					'team_2': 'Meksiko',
					'game_start_datetime': '2018-06-17T18:00:00+03:00',
					'result': null,
					'id': 64,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Brasilia',
					'team_2': 'Sveitsi',
					'game_start_datetime': '2018-06-17T21:00:00+03:00',
					'result': null,
					'id': 59,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Ruotsi',
					'team_2': 'Etelä-Korea',
					'game_start_datetime': '2018-06-18T15:00:00+03:00',
					'result': null,
					'id': 65,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Belgia',
					'team_2': 'Panama',
					'game_start_datetime': '2018-06-18T18:00:00+03:00',
					'result': null,
					'id': 70,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Tunisia',
					'team_2': 'Englanti',
					'game_start_datetime': '2018-06-18T21:00:00+03:00',
					'result': null,
					'id': 71,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Puola',
					'team_2': 'Senegal',
					'game_start_datetime': '2018-06-19T15:00:00+03:00',
					'result': null,
					'id': 76,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Kolumbia',
					'team_2': 'Japani',
					'game_start_datetime': '2018-06-19T18:00:00+03:00',
					'result': null,
					'id': 77,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Venäjä',
					'team_2': 'Egypti',
					'game_start_datetime': '2018-06-19T21:00:00+03:00',
					'result': null,
					'id': 36,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Portugali',
					'team_2': 'Marokko',
					'game_start_datetime': '2018-06-20T15:00:00+03:00',
					'result': null,
					'id': 42,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Uruguay',
					'team_2': 'Saudi-Arabia',
					'game_start_datetime': '2018-06-20T18:00:00+03:00',
					'result': null,
					'id': 37,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Iran',
					'team_2': 'Espanja',
					'game_start_datetime': '2018-06-20T21:00:00+03:00',
					'result': null,
					'id': 43,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Ranska',
					'team_2': 'Peru',
					'game_start_datetime': '2018-06-21T17:00:00+03:00',
					'result': null,
					'id': 48,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Tanska',
					'team_2': 'Australia',
					'game_start_datetime': '2018-06-21T19:00:00+03:00',
					'result': null,
					'id': 49,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Argentiina',
					'team_2': 'Kroatia',
					'game_start_datetime': '2018-06-21T21:00:00+03:00',
					'result': null,
					'id': 54,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Brasilia',
					'team_2': 'Costa Rica',
					'game_start_datetime': '2018-06-22T15:00:00+03:00',
					'result': null,
					'id': 60,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Nigeria',
					'team_2': 'Islanti',
					'game_start_datetime': '2018-06-22T18:00:00+03:00',
					'result': null,
					'id': 55,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Serbia',
					'team_2': 'Sveitsi',
					'game_start_datetime': '2018-06-22T20:00:00+03:00',
					'result': null,
					'id': 61,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Belgia',
					'team_2': 'Tunisia',
					'game_start_datetime': '2018-06-23T15:00:00+03:00',
					'result': null,
					'id': 72,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Saksa',
					'team_2': 'Ruotsi',
					'game_start_datetime': '2018-06-23T18:00:00+03:00',
					'result': null,
					'id': 66,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Etelä-Korea',
					'team_2': 'Meksiko',
					'game_start_datetime': '2018-06-23T21:00:00+03:00',
					'result': null,
					'id': 67,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Englanti',
					'team_2': 'Panama',
					'game_start_datetime': '2018-06-24T14:00:00+03:00',
					'result': null,
					'id': 73,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Puola',
					'team_2': 'Kolumbia',
					'game_start_datetime': '2018-06-24T18:00:00+03:00',
					'result': null,
					'id': 79,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Japani',
					'team_2': 'Senegal',
					'game_start_datetime': '2018-06-24T20:00:00+03:00',
					'result': null,
					'id': 78,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Saudi-Arabia',
					'team_2': 'Egypti',
					'game_start_datetime': '2018-06-25T17:00:00+03:00',
					'result': null,
					'id': 39,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Uruguay',
					'team_2': 'Venäjä',
					'game_start_datetime': '2018-06-25T18:00:00+03:00',
					'result': null,
					'id': 38,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Espanja',
					'team_2': 'Marokko',
					'game_start_datetime': '2018-06-25T20:00:00+03:00',
					'result': null,
					'id': 45,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Iran',
					'team_2': 'Portugali',
					'game_start_datetime': '2018-06-25T21:00:00+03:00',
					'result': null,
					'id': 44,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Australia',
					'team_2': 'Peru',
					'game_start_datetime': '2018-06-26T17:00:00+03:00',
					'result': null,
					'id': 51,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Tanska',
					'team_2': 'Ranska',
					'game_start_datetime': '2018-06-26T17:00:00+03:00',
					'result': null,
					'id': 50,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Islanti',
					'team_2': 'Kroatia',
					'game_start_datetime': '2018-06-26T21:00:00+03:00',
					'result': null,
					'id': 57,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Nigeria',
					'team_2': 'Argentiina',
					'game_start_datetime': '2018-06-26T21:00:00+03:00',
					'result': null,
					'id': 56,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Etelä-Korea',
					'team_2': 'Saksa',
					'game_start_datetime': '2018-06-27T17:00:00+03:00',
					'result': null,
					'id': 68,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Meksiko',
					'team_2': 'Ruotsi',
					'game_start_datetime': '2018-06-27T19:00:00+03:00',
					'result': null,
					'id': 69,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Serbia',
					'team_2': 'Brasilia',
					'game_start_datetime': '2018-06-27T21:00:00+03:00',
					'result': null,
					'id': 62,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Sveitsi',
					'team_2': 'Costa Rica',
					'game_start_datetime': '2018-06-27T21:00:00+03:00',
					'result': null,
					'id': 63,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Japani',
					'team_2': 'Puola',
					'game_start_datetime': '2018-06-28T17:00:00+03:00',
					'result': null,
					'id': 80,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Senegal',
					'team_2': 'Kolumbia',
					'game_start_datetime': '2018-06-28T18:00:00+03:00',
					'result': null,
					'id': 81,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Englanti',
					'team_2': 'Belgia',
					'game_start_datetime': '2018-06-28T20:00:00+03:00',
					'result': null,
					'id': 74,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				},
				{
					'team_2_score': null,
					'team_1_score': null,
					'team_1': 'Panama',
					'team_2': 'Tunisia',
					'game_start_datetime': '2018-06-28T21:00:00+03:00',
					'result': null,
					'id': 75,
					'tournament_id': 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
				}
    
			])
		})

		.then(() => {
			return knex('user').insert([
				//TODO: add user
				{id: 0, username: 'admin', password:'$2y$10$HjN1eBk8ziiCT.ArOxsahez.yw788yqPsoHIa4oiFZUWAhuc7Ac1a', email:'admin@admin.fi', approved: 'true'},
				{id: 100, username: 'masa', password:'$2y$10$HjN1eBk8ziiCT.ArOxsahez.yw788yqPsoHIa4oiFZUWAhuc7Ac1a', email:'masa@seedaus.fi', approved: 'true'},
				{id: 101, username: 'mikko', password: '$2y$10$HjN1eBk8ziiCT.ArOxsahez.yw788yqPsoHIa4oiFZUWAhuc7Ac1a', email: 'mikkotest@seedaus.fi', approved: 'true'},
				{id: 102, username: 'kalle', password: '$2y$10$HjN1eBk8ziiCT.ArOxsahez.yw788yqPsoHIa4oiFZUWAhuc7Ac1a', email: 'mrnopool@seedaus.fi', approved: 'true'},
				{id: 10123, username: 'eihyväksytty', password: '$2y$10$HjN1eBk8ziiCT.ArOxsahez.yw788yqPsoHIa4oiFZUWAhuc7Ac1a', email: 'eihyvaksytty@seedaus.fi', approved: 'false'},
          
			])
		})

/*     .then(() => {
      return knex('pools').insert([
          
      ])
    })

    .then(() => {
      return knex('participant').insert([

      ])
    }) */
}