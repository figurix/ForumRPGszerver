"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
;
exports.TopicSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    threads: { type: [mongoose.Schema.Types.ObjectId], ref: 'Thread' },
    title: { type: String, unique: true }
});
exports.Topic = mongoose.model('Topic', exports.TopicSchema);
//# sourceMappingURL=topic.model.js.map