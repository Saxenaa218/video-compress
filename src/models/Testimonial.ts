import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITestimonial extends Document {
  topicId: Types.ObjectId;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  text: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    reviewerName: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    reviewerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: [true, "Please provide testimonial text"],
      trim: true,
      maxlength: [1000, "Testimonial cannot be more than 1000 characters"],
    },
    videoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
