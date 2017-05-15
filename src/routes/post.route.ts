import {Post} from '../models/post.model';
import {Thread} from '../models/thread.model';

module.exports = (passport, router) => {
    router.post('/showposts', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = Post.find({thread: req.body.threadid}).limit(20);
            query.exec(function(err, posts) {
                if(err) {
                    res.send(err);
                }
                res.status(200).send(posts);
            })
        }
        else {
            res.status(403).send("Nem vagy bejelentkezve!");
        }
    })
    router.post('/new', (req, res, next) => {
        if(req.isAuthenticated()) {
            var thread = req.body.threadid;
            Thread.findById(thread, function(err, threadd) {
                if(req.user.thread==threadd._id) {
                    var creator = req.user._id;
                    
                    var text = req.body.text;
                    var post = new Post({creator: creator, thread: thread, text: text});
                    post.save();
                    
                    threadd.postcount = threadd.postcount+1;
                    threadd.save();
                    res.status(200).send("elmentve");
                }
                 else {
                    res.status(403).send("Nem tartozol a kalandhoz!");
                }
            });
           
        }
        else {
            res.status(403).send("Jelentkezz be!");
        }
    })
    router.delete('/del', (req, res, next) => {
        if(req.isAuthenticated()) {
            if(req.user.admin) {
                Post.remove({ _id: req.body.postid});
                res.status(200).send("torolve");
            }
            else {
                res.status(500).send("Csak admin torolhet!");
            }
        }
        else {
            res.status(403).send("Jelentkezz be!");
        }
    })
    router.post('/mod', (req, res, next) => {
        if(req.isAuthenticated()) {
            if(req.user.admin) {
                var query = Post.findOne({thread: req.body.threadid});
                query.exec(function (err, post) {
                    post.text = req.body.text;
                    post.save();
                })
                res.status(200).send("modositva");
            }
            else {
                res.status(500).send("Csak admin modosithat!");
            }
        }
        else {
            res.status(403).send("Jelentkezz be!");
        }
    })

    return router;
}