import * as express from 'express';
import * as passport from 'passport';
import * as expressSession from 'express-session';
import * as LocalStrategy from 'passport-local';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { User } from './src/models/user.model';

// Mongoose ODM...
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// Connect to MongoDB...
var dbUrl = 'mongodb://teszt:teszt@ds111461.mlab.com:11461/forumrpg';

var app = express();
app.set('dbUrl', dbUrl);
mongoose.connect(dbUrl);

//var user = new User({username: "Larry2", password: "asdasd"});
//user.save();

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(cookieParser());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use('login', new LocalStrategy.Strategy((username, password, done) => {
    User.findOne({ username: username }, function(err, temp_user) {
        if(err) { return done(err); }
        if(!temp_user) { return done(null, false); }
        temp_user.comparePassword(password, function(err, isMatch) {
            if (err) throw err;
            console.log(isMatch);
        });
        return done(null, temp_user);
    });
}));

app.use(expressSession({secret: 'thegreatandsecretshow'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/rest/user', require('./src/routes/user.route')(passport, express.Router()));
app.use('/rest/topic', require('./src/routes/topic.route')(passport, express.Router()));

app.listen(5000, () => {
    console.log('The server is running');
} )