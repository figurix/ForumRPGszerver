"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_model_1 = require("../models/topic.model");
module.exports = (passport, router) => {
    router.get('/showthreads', (req, res, next) => {
        topic_model_1.Topic.find().limit(20).exec(function (err, topics) {
            if (err) {
                res.send(err);
            }
            res.json(topics);
        });
    });
    router.post('/new', (req, res, next) => {
        if (req.isAuthenticated()) {
            var userid = req.user._id;
            var topic = new topic_model_1.Topic({ creator: userid, threads: 0, title: "els" });
            topic.save();
            console.log();
            res.status(200).send(topic.creator + " " + topic.threads + " " + topic.title);
        }
    });
    return router;
};
//# sourceMappingURL=topic.route.js.map