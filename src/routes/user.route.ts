import {User} from '../models/user.model';

module.exports = (passport, router) => {

    router.post('/register', (req, res, next) => {
        var username = req.body.username;
        var password = req.body.password;
        console.log(req.body);
        if(!username || !password) {
            return res.status(500).send('Username and password is required.');
        } else {
            var user = new User({username: username, password: password});
            user.save();
            res.status(200).send('Registration successful');
        }
    })

    router.post('/login', (req, res, next) => {
        passport.authenticate('login', (error, user) => {
            if(error) {
                res.status(500).send('ERROR');
            } else {
                req.logIn(user, (error) => {
                    if(error) {
                        return res.status(500).send('Request login failed');
                    } else {
                        return res.status(200).send('You are free to pass' + user);
                    }
                })
            }
        })(req, res, next);
    })

    router.post('/logout', (req,res,next) => {
        if(req.isAuthenticated()) {
            req.logout();
            res.status(200).send('Logout successful');
        } else {
            res.status(500).send('You have no right');
        }
    })

    router.get('/greeting', (req, res, next) => {
        if(req.isAuthenticated()) {
            return res.status(200).send('hello!');
        } else {
            return res.status(500).send('stop that');
        }
    })

    return router;
}