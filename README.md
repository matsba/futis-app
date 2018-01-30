# Futis-app

![Picture of futis-app homepage](futis-app-homepage.png)

Futis-app is fantasy football game. Challenge your friends and see who has the best knowledge in football or other sports! Participate in ready-made tournaments, guess which teams win games and earn points.

If you want to test a live version, you can do it by visiting this [link](https://futis-app-test.herokuapp.com/). Note however that if you create new account, admin has to accept your registeration.
You can use test account with username: "testuser", and password: "testpass".

**Please note:** this project is not ready and is under construction.

## Technologies

This app is developed with Node and Express in the backend, paired with Knex handling database queries and Pug for generating views. Used database is PostgreSQL and styling is done with Spectre.css.

## Installation

1. Clone the repository.
2. Run ```'npm install'.```
3. Set up your database and setup '.env' file with your configuration (see the template file in root directory).
4. Set up the database by running ```'npm heroku-postbuild'```. **Note:** You might want to modify ./database/seeds/seed.js admin password
5. Start application ```'npm start'```

## Contributors

This project is maintained and created by:
[@matsba](https://github.com/matsba)
[@okkimus](https://github.com/okkimus)

