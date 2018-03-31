/**
 * Created by Dries Meerman on 26/08/2017.
 */

const express = require('express');
const ejs     = require('ejs');
const path    = require('path');
const app     = express();
var   PORT    = 4040;

// const GoogleStrategy = require('passport-google-oauth20').Strategy;

function init(){
    argumentHandler();
    app.use('/node_modules', express.static(path.resolve()+'/node_modules'));
    app.use('/js', express.static(path.resolve()+'/webapp/js'));
    app.use('/style', express.static(path.resolve()+'/webapp/style'));
    app.use('/images', express.static(path.resolve()+'/webapp/images'));
    app.use('/templates', express.static(path.resolve()+'/webapp/templates'));

    app.set('view engine', 'ejs');
    app.set('views', path.resolve()+ '/webapp/views');
} init();



function argumentHandler(){
    console.log('Started with arguments:');
    process.argv.forEach(function (value, index, array) {
        if (index > 1)
            console.log(index-2 + ': ' + value);
        switch(value){
            case '-p':
                PORT = array[index+1];
                break;
            case '-h':
                printHelpMenu();
                break;
        }
    });
}

function printHelpMenu(){
    console.log('\nHelp');
    console.log('Arguments -p [PORT]');
    console.log('\t Starts the webapp on the specified port');
    process.exit(1);
}

function startListening(app, port){
    console.log('Started on: http://localhost:'+port);
    app.listen(port);
}

function render(page, data){
    return function(req, res){
        if (data){
            res.render(page, data);
        } else {
            res.render(page);
        }
    }
}

function redirect(url){
    return function (req, res) {
        res.writeHead(302, {
            Location: url
        });
        res.end();
    }
}

var DASHBOARDS = [
    makeDash("0", 'Random Number', 'number', 'ic-num'),
    makeDash("1", 'Date Calculations', 'dates', 'fa fa-calendar'),
    makeDash("2", 'Password Generator', 'password', 'fa fa-asterisk'),
    makeDash("3", 'Settings', 'settings', 'fa fa-cog'),
    makeDash("4", 'Coin Flip', 'coinflip', 'fa fa-question-circle-o'),
    //makeDash("5", 'Login', 'login', 'fa fa-sign-in')
    makeDash("6", '')
];

function makeDash(id, name, path, icon){
    return {
        id: id,
        name: name,
        path: path,
        icon: icon,
    }
}

//Middleware
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    if (req.originalUrl.indexOf('/meme') != -1){
        console.log('ayy lmoa roffle sending to 404 now but first printing this message cuz meme url');
        console.log(req.headers.cookie)
        // console.log(JSON.stringify(req.headers.cookie))
        console.log(JSON.stringify(req.headers.cookie.G_AUTHUSER_H));
    }

    next();
})

//Controllers
app.get('/', redirect('/Dashboard'));
app.get('/dashboard', render('pages/dashboard/index.ejs', {dashboards: DASHBOARDS}) );
app.get('/number', render('pages/number/index.ejs'));
app.get('/dates', render('pages/dates/index.ejs'));
app.get('/password', render('pages/password/index.ejs'));
app.get('/settings', render('pages/settings/index.ejs'));
app.get('/coinflip', render('pages/coinflip/index.ejs'));
app.get('/login', redirect('/404'));//render('pages/login/login.ejs'));
app.get('/404', render('pages/404/404.ejs'));
app.get('*', redirect('/404'));

app.get('/oauth_callback', function(req, res){
    console.log('ayy lmao');
    // var a = new GoogleStrategy({
    //     clientID: config.get('OAUTH2_CLIENT_ID'),
    //     clientSecret: config.get('OAUTH2_CLIENT_SECRET'),
    //     callbackURL: config.get('OAUTH2_CALLBACK'),
    //     accessType: 'offline'
    // };
});

startListening(app, PORT);
