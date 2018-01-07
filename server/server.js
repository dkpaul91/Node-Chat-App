const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;
var app = new express();

app.use(express.static(publicPath));

//app.get('/', (req, res) => {
//    res.
//});

app.listen(port, () => {
    console.log('App started at port ', port);
});