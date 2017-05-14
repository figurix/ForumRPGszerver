import * as mongoose from 'mongoose';

export interface IThread extends mongoose.Document {
  title: string;
  mainpost: string;
  participants: any;
  creator: any;
  posts: any;
  partcount: number;
  minlevel: number;
  maxlevel: number;
  maxcount: number;
  postcount: number;
};

export const ThreadSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    mainpost: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    participants: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
    posts: {type: [mongoose.Schema.Types.ObjectId], ref: 'Post'},
    partcount: {type: Number, default: 0},
    minlevel: {type: Number, default: 0},
    maxlevel: {type: Number, default: 0},
    maxcount: {type: Number, default: 0},
    postcount: {type: Number, default: 0}
});

export const Thread: mongoose.model<IThread> = mongoose.model<IThread>('Thread', ThreadSchema);