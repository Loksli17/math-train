const express       = require('express');
const hbs           = require('hbs');
const bodyParser    = require('body-parser');
const cookie        = require('cookie-parser');
const async         = require('async');
const expressHbs    = require('express-handlebars');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');


//own libs
const config        = require('./config');

let app = express();


//use
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/resources'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie(config.cookie.secret));
app.use(session({secret: config.session.secret}));
app.use(cookieParser());
app.use(require('csurf')());


//handlebars
app.engine('hbs', expressHbs({
    layoutsDir   : 'views/layouts',
    defaultLayout: 'main',
    extname      : 'hbs',
}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


//settings
app.set('port', process.env.PORT || config.app.port);


//routes require
const indexRouter   = require('./routes/indexRouter');
const authRouter    = require('./routes/authRouter');
const taskRouter    = require('./routes/taskRouter');
const postRouter    = require('./routes/postRouter');
const newsRouter    = require('./routes/newsRouter');
const searchRouter  = require('./routes/searchRouter');

//locals
app.use(function(req, res, next){
    if(req.cookies.userUdentity != undefined){
        res.locals.user = req.cookies.userUdentity;
    }
    res.locals._csrfToken = req.csrfToken();
    next();
});


//routes init
app.use('/',     indexRouter);
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use('/posts', postRouter);
app.use('/news', newsRouter);
app.use('/search',searchRouter);

//soft
app.use(function(req, res){
    res.status(404);
    res.render('server/404', {layout: null});
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('server/500', {layout: null});
});


//listen
app.listen(app.get('port'), function(){
    console.log('Application are working on port: ' + config.app.port + '. Press Crtl+C for closing');
});
