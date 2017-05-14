import {Thread} from '../models/thread.model';

module.exports = (passport, router) => {
    router.get('/showthreads', (req, res, next) => {
        if(req.isAuthenticated()) {
            var query = Thread.find().limit(20);
            query.select('title mainpost maxcount partcount minlvel maxlevel creator postcount');
            query.exec(function(err, threads) {
                if(err) {
                    res.send(err);
                }
                res.status(200).send(threads);
            })
        }
        else {
            res.status(500).send("Nem vagy bejelentkezve!");
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
            res.status(500).send("Jelentkezz be!");
        }
    })

    return router;
}