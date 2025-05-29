import mongoose, { Document, Schema } from "mongoose";

export interface IImage {
  url: string;
  caption?: string;
}

export interface IGallery extends Document {
  title: string;
  description?: string;
  eventDate?: Date;
  images: IImage[];
  thumbnailUrl?: string;
}

const ImageSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    eventDate: { type: Date },
    images: { type: [ImageSchema], default: [] },
    thumbnailUrl: { type: String },
  },
  { timestamps: true }
);

const Gallery = mongoose.model<IGallery>("Gallery", GallerySchema);
export default Gallery;
