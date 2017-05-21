import {User} from '../models/user.model';
import {Thread} from '../models/thread.model';

module.exports = (passport, router) => {

    router.post('/register', (req, res, next) => {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        console.log(req.body);
        if(!username || !password || !email) {
            return res.status(500).send('Username, email and password is required.');
        } else {
            var user = new User({username: username, password: password, email: email});
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
                        return res.status(200).send('You are free to pass');
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

    router.get('/characters', (req, res, next) => {
        if(req.isAuthenticated()) {
            return res.status(200).send(req.user.character);
        } else {
            return res.status(500).send('stop that');
        }
    })
    router.get('/isadmin', (req, res, next) => {
        if(req.isAuthenticated()) {
            if(req.user.admin) {
                res.status(200).send("admin");
            }
            else {
                res.status(500).send("nem az");
            }
        } else {
            res.status(500).send('be se vagy jelentkezve :(');
        }
    })
    router.get('/profile', (req, res, next) => {
        if(req.isAuthenticated()) {
            res.status(200).json(req.user);
        }
        else {
            res.status(500).send("nem vagy bejelentkezve");
        }
    })
    router.post('/getuser', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = User.findOne({_id: req.body.userid});
            query.exec(function(err, user) {
                if(err) {
                    res.status(500).send(err);
                }
                res.status(200).send(user);
            })
        }
        else {
            res.status(500).send("nem vagy bejelentkezve");
        }
    })
    router.post('/del', (req, res, next) => {
        if(req.isAuthenticated()) {
            if(req.user.admin) {
                User.remove({ _id: req.body.userid}, function (err) {
                    if (err) res.status(500).send(err);
                    else res.status(200).send("torolve");
                }); 
            }
        }
    })
    return router;
}