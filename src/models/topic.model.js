"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
;
exports.TopicSchema = new mongoose.Schema({
    creator: mongoose.Schema.Types.ObjectId,
    threads: [mongoose.Schema.Types.ObjectId],
    title: { type: String, unique: true }
});
exports.Topic = mongoose.model('Topic', exports.TopicSchema);
//# sourceMappingURL=topic.model.js.map