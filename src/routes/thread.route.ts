import {Thread} from '../models/thread.model';
import {User} from '../models/user.model';

module.exports = (passport, router) => {
    router.get('/showthreads', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = Thread.find().limit(20);
            query.select('title mainpost maxcount partcount minlevel maxlevel creator postcount');
            query.exec(function(err, threads) {
                if(err) {
                    res.send(err);
                }
                res.status(200).send(threads);
            })
        }
        else {
            res.status(403).send("Nem vagy bejelentkezve!");
        }
    })
    router.post('/new', (req, res, next) => {
        if(req.isAuthenticated()) {
                var creator = req.user._id;
                var title = req.body.title;
                var maxcount = req.body.maxcount;
                var minlevel = req.body.minlevel;
                var maxlevel = req.body.maxlevel;
                var mainpost = req.body.mainpost;
                var thread = new Thread({creator: creator, maxcount: maxcount, maxlevel: maxlevel, minlevel: minlevel, mainpost: mainpost, title: title});
                thread.save();
                res.json(thread);
        }
        else {
            res.status(403).send("Jelentkezz be!");
        }
    })
    router.post('/join', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = Thread.findOne({ _id: req.body.threadid});
            query.select('title mainpost maxcount partcount minlevel maxlevel creator postcount');
            query.exec(function(err, thread) {
                if(err) {
                    res.send(err);
                }
                if(thread.partcount<thread.maxcount) {
                    if(req.user.character.level>=thread.minlevel) {
                        if(req.user.character.level<=thread.maxlevel) {
                            if(!req.user.occupied) {
                                thread.partcount = thread.partcount + 1;
                                thread.save();
                                User.findById(req.user._id, function(err, user) {
                                    user.occupied = true;
                                    user.thread = req.body.threadid;
                                    user.save();
                                })
                                req.user.occupied = true;
                                req.user.thread = req.body.threadid;
                                res.status(200).send("Siker");
                            }
                            else {
                                res.status(500).send("Mar reszt veszel egy kalandban");
                            }
                        }
                        else {
                            res.status(500).send("A szinted tul magas");
                        }
                    }
                    else {
                        res.status(500).send("A szinted tul alacsony");
                    }
                }
                else {
                    res.status(500).send("A kaland betelt");
                }
            })
        }
        else {
            res.status(403).send("Nem vagy bejelentkezve!");
        }
    })

    router.post('/finish', (req, res, next) => {
        if(req.isAuthenticated()) {
            var thread = req.body.threadid;
            Thread.findById(thread, function(err, threadd) {
                if(req.user._id==threadd.creator) {
                    
                    res.status(200).send("elmentve");
                }
                else {
                    res.status(403).send("Nincs jogod!");
                }
            });
        }
        else {
            res.status(403).send("Jelentkezz be!");
        }
    })

    return router;
}