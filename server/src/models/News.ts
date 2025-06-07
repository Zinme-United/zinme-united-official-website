import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  imagePublicId?: string;
  publishedAt: Date;
  tags?: string[];
  isFeatured: boolean;
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    publishedAt: { type: Date, default: Date.now },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const News = mongoose.model<INews>("News", NewsSchema);
export default News;
