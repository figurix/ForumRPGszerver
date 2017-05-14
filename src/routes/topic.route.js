"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_model_1 = require("../models/topic.model");
module.exports = (passport, router) => {
    router.get('/showtopics', (req, res, next) => {
        if (req.isAuthenticated()) {
            topic_model_1.Topic.find().limit(20).exec(function (err, topics) {
                if (err) {
                    res.send(err);
                }
                res.json(topics);
            });
        }
    });
    router.post('/new', (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.admin) {
                var userid = req.user._id;
                var title = req.body.title;
                var topic = new topic_model_1.Topic({ creator: userid, threads: 0, title: title });
                topic.save();
                res.status(200).send(topic.creator + " " + topic.threads + " " + topic.title);
            }
            else {
                res.status(201).send("Nincs jogosultsagod!");
            }
        }
        else {
            res.status(500).send("Jelentkezz be!");
        }
    });
    return router;
};
//# sourceMappingURL=topic.route.js.map