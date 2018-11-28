var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var mongodb = require('./ConnectMongodb');

//初始化路由
var route = require('./routes/index');

var app = express();

//socket.io
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.on('message', function (msg) {
        io.emit("message", msg);
    });
});

//ejs
app.set('views', './views/pages'); //设置视图根目录
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//初始化静态资源
app.use(express.static('./static'));

//初始化body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//初始化session和cookie
app.use(cookieParser('wewinvoting'));
app.use(session({
    secret: 'wewinvoting',
    name: 'wewinvoting',
    resave: true,
    cookie: { maxAge: 3600000 },
    saveUninitalized: true,
}));

//连接数据库
mongodb.connect();

server.listen(8061, function (err) {
    if (err) return err;
    console.log("http://localhost:8061");
});

route(app);