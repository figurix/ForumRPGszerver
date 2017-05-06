import {Topic} from '../models/topic.model';

module.exports = (passport, router) => {
    router.get('/showthreads', (req, res, next) => {
            Topic.find(function(err, topics) {
                if(err) {
                    res.send(err);
                }
                res.json(topics);
            })

    })
}