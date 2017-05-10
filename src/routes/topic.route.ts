import {Topic} from '../models/topic.model';

module.exports = (passport, router) => {
    router.get('/showthreads', (req, res, next) => {
            Topic.find().limit(20).exec(function(err, topics) {
                if(err) {
                    res.send(err);
                }
                res.json(topics);
            })

    })
    router.post('/new', (req, res, next) => {
        if(req.isAuthenticated()) {
            var userid = req.user._id;
            var topic = new Topic({creator: userid, threads: 0, title: "els"});
            topic.save();
            console.log();
            res.status(200).send(topic.creator + " "+ topic.threads+ " "+ topic.title);
        }
    })
    return router;
}