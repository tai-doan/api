const express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    bodyParse = require('body-parser'),
    jsonwebtoken = require('jsonwebtoken'),
    cors = require('cors'),
    config = require('./config/database');

mongoose.Promise = global.Promise;

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
autoIncrement.Promise = global.Promise;
app.use(cors({ origin: '*' })).use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json({ limit: '50mb' }));

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization) {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.secret, function (err, result) {
            req.user = (err || !result) ? null : result._id;
            next();
        });
    } else {
        req.user = null;
        next();
    }
});

const routes = require('./routes/index');
routes(app);

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl +  ' not_found' });
});

app.listen(port);
console.log('API Server started on: ' + port);
module.exports = app;
