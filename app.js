const express = require ('express')
const mongoose=require('mongoose')
const app = express()

var path = require('path');

mongoose.connect('mongodb://localhost:27017/crud')
var cors = require ('cors')
app.use (cors())

app.use('/autocomplete', require('./routes/autocomplete'));
app.use('/stockdetails', require('./routes/stockdetails'));
app.use('/summary', require('./routes/summary'));

app.use('/news', require('./routes/news'));
app.use('/charts', require('./routes/charts'));

app.use('/history', require('./routes/history'));

app.use('/daily', require('./routes/daily'));

app.use('/latest', require('./routes/latest'));
  
  app.use('' ,express.static(path.join(__dirname, 'public/index.html')));


  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  })




app.listen (8080, () => {
    console.log ('Server is upon port 8080')
})