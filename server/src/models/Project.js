import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: String,
    projectUrl: String,
    tags: [String],
    category: {
      type: String,
      enum: ['MERN', 'APIs', 'Frontend', 'Experiments'],
      default: 'Frontend',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for category filtering with featured sorting
projectSchema.index({ category: 1, featured: -1 });

// Index for featured projects queries
projectSchema.index({ featured: -1 });

// Index for sorting by creation date
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
