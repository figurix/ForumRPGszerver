import * as mongoose from 'mongoose';

export interface IThread extends mongoose.Document {
  title: string;
  mainpost: string;
  participants: any;
  creator: any;
  partcount: number;
  minlevel: number;
  maxlevel: number;
  maxcount: number;
  postcount: number;
  started: boolean;
  closed: boolean;
  created: Date;
};

export const ThreadSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    mainpost: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    participants: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
    partcount: {type: Number, default: 0},
    minlevel: {type: Number, default: 0},
    maxlevel: {type: Number, default: 0},
    maxcount: {type: Number, default: 0},
    postcount: {type: Number, default: 0},
    closed: {type: Boolean, default: false},
    started: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

export const Thread: mongoose.model<IThread> = mongoose.model<IThread>('Thread', ThreadSchema);