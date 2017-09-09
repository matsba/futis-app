var express = require('express')
var app = express()
var path = require("path")

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Etusivu', 
        })
})

app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})