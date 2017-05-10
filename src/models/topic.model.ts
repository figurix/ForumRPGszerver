import * as mongoose from 'mongoose';

export interface ITopic extends mongoose.Document {
  creator: any;
  threads: number;
  title: string;
  
};

export const TopicSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    threads: {type: Number, ref: 'Thread'},
    title: {type: String, unique: true}
});

export const Topic: mongoose.model<ITopic> = mongoose.model<ITopic>('Topic', TopicSchema);