import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  category: {
    type: String,
    default: "General",
  },

  tags:{
    type: [String],
    default: []
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  likes: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],

  comments: [
    {
    text: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAt: { type: Date, default: Date.now },
    },
  ],

  isPublished: { 
    type: Boolean,
    default: true
  },

  views: {                
    type: Number,
    default: 0
  },

  viewers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  ],
},
  {timestamps: true}
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;