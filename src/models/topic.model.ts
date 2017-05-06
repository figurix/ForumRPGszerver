import * as mongoose from 'mongoose';


export interface ITopic extends mongoose.Document {
  creator: any;
  threads: any;
  title: string;
  
};

export const TopicSchema = new mongoose.Schema({
    creator: mongoose.Schema.Types.ObjectId,
    threads: [mongoose.Schema.Types.ObjectId],
    title: {type: String, unique: true}
});

export const Topic: mongoose.model<ITopic> = mongoose.model<ITopic>('Topic', TopicSchema);