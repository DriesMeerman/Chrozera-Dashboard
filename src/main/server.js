/**
 * Created by Dries Meerman on 26/08/2017.
 */

const express = require('express');
const ejs     = require('ejs');
// const fs      = require('fs');
const path    = require('path');
const app     = express();
var   PORT    = 4040;

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

function render(page){
    return function(req, res){
        res.render(page);
    }
}

//Controllers
app.get('/dashboard', render('pages/index/index.ejs'));
app.get('/number', render('pages/number/index.ejs'));
app.get('/dates', render('pages/dates/index.ejs'));
app.get('/password', render('pages/password/index.ejs'));
app.get('/settings', render('pages/settings/index.ejs'));
app.get('/coinflip', render('pages/coinflip/index.ejs'));

startListening(app, PORT);
