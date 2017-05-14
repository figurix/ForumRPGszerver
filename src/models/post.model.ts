import * as mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  creator: any;
  created: Date;
  text: string;
  thread: any;
};

export const PostSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    thread: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread'},
    created: {type: Date, default: Date.now},
    text: String
});

export const Post: mongoose.model<IPost> = mongoose.model<IPost>('Post', PostSchema);