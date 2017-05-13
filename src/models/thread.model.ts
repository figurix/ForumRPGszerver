import * as mongoose from 'mongoose';
//import {Topic} from '../models/topic.model';

export interface IThread extends mongoose.Document {
  title: string;
  topic: any;
  participants: any;
  creator: any;
  posts: any;
  partcount: number;
};

export const ThreadSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    topic: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'},
    participants: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
    posts: {type: [mongoose.Schema.Types.ObjectId], ref: 'Post'},
    partcount: Number
});

export const Thread: mongoose.model<IThread> = mongoose.model<IThread>('Thread', ThreadSchema);