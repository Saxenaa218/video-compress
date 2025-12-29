import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  originalName: string;
  originalPath: string;
  originalSize: number;
  compressedPath?: string;
  compressedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  compressionRatio?: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    originalName: {
      type: String,
      required: true,
    },
    originalPath: {
      type: String,
      required: true,
    },
    originalSize: {
      type: Number,
      required: true,
    },
    compressedPath: {
      type: String,
    },
    compressedSize: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    compressionRatio: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
