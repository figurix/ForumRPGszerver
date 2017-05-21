import {Thread} from '../models/thread.model';
import {User} from '../models/user.model';

module.exports = (passport, router) => {
    router.get('/showthreads', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = Thread.find();
            query.select('title mainpost maxcount partcount minlevel maxlevel creator postcount created');
            query.populate('creator').sort({created: -1}).exec(function(err, threads) {
                if(err) {
                    res.status(500).send(err);
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
            if(!req.user.occupied) {
                var creator = req.user._id;
                var title = req.body.title;
                var maxcount = req.body.maxcount;
                var minlevel = req.body.minlevel;
                var maxlevel = req.body.maxlevel;
                var mainpost = req.body.mainpost;
                var threadid;
                var thread = new Thread({creator: creator, maxcount: maxcount, maxlevel: maxlevel, minlevel: minlevel, mainpost: mainpost, title: title});
                thread.save(function(err,th) {
                    User.findById(req.user._id, function(err, user) {
                     if(err) {
                            res.send(err);
                     }
                        user.occupied = true;
                        user.thread = thread._id;
                        console.log(threadid);
                        
                        
                        user.save(function(err, th) {
                            if(err) res.send(err);
                            else {
                                req.user.occupied = true;
                                req.user.thread = thread._id;
                                res.status(200).json(thread);
                            }
                        });
                    })
                });
            }
            else {
                res.status(500).send('Mar tagja vagy egy threadnek!');
            }
        }
        else {
            res.status(403).send("Jelentkezz be!");
        }
    })
    router.post('/join', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = Thread.findOne({ _id: req.body.threadid});
            query.select('title mainpost maxcount partcount minlevel maxlevel creator postcount closed started');
            query.exec(function(err, thread) {
                if(err) {
                    res.send(err);
                }
                if(thread.partcount<thread.maxcount) {
                    if(req.user.character.level>=thread.minlevel) {
                        if(req.user.character.level<=thread.maxlevel) {
                            if(!req.user.occupied) {
                                if(!thread.closed) {
                                    thread.partcount = thread.partcount + 1;
                                    if(thread.partcount === thread.maxcount) {
                                        thread.started = true;
                                    }
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
                                    res.status(500).send("a thread le van zarva");
                                }
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
    router.post('/get', (req, res, next) => {
        if(req.isAuthenticated()) {
            var thread = req.body.threadid;
            var query = Thread.findOne({_id: thread});
            query.select('title mainpost maxcount partcount minlevel maxlevel creator postcount');
            query.populate('creator').exec(function(err, threads) {
                if(err) {
                    res.status(500).send(err);
                }
                res.status(200).send(threads);
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
                    var query = User.find({thread: thread});
                    query.exec(function(err, users) {
                        if(err) {
                            res.send(err);
                        }
                        users.forEach(element => {
                            element.occupied = false;
                            element.thread = undefined;
                            if(threadd.creator != element.id) {
                                element.character.level = element.character.level + 1;
                                element.character.attack = element.character.attack + 1;
                                element.character.defense = element.character.defense + 1;
                            }
                            element.save();
                        });
                        req.user.occupied = false;
                        req.user.thread = undefined;
                        threadd.closed = true;
                        threadd.save();
                        res.status(200).send("lezarva");
                    })
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