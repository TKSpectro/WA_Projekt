/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const SocketHandler = require('./core/socket.js');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')();
const favicon = require('serve-favicon');

io.attach(http);


// write global configuration
global.cfg = require('./config/config.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/assets', express.static('assets'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/apidoc', express.static(__dirname + '/docs'));
const database = require('./core/database.js')();

const socket = new SocketHandler(io, database);
app.ioHandler = socket;

const routes = require('./config/routes.js');
const Router = require('./core/router.js');
const router = new Router(app, routes, database);
router.setup();

http.listen(process.env.PORT || 3000, function () {
    console.log('App listening on Port '+(process.env.PORT || 3000));
});