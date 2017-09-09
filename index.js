var express = require('express')
var app = express()
var path = require("path")

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})