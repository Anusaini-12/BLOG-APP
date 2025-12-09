import expressAsyncHandler from 'express-async-handler';
import Blog from '../models/blog.js';
import cloudinary from '../config/cloudinary.js';


/* ------------------ CREATE A BLOG ------------------ */
export const createBlog = expressAsyncHandler( async(req, res) => {
   const { title, content, category, tags, publish } = req.body;
   
   if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
   }

    let parsedTags = [];
    if (tags) {
    try {
      // If tags came as '["play","walk"]'
      parsedTags = JSON.parse(tags);
    } catch (err) {
      // If tags came as "play,walk"
      parsedTags = tags.split(",").map((t) => t.trim());
    }
    }

   let imageURL = null;

  if (req.file) {
    imageURL = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "blogs" },
        (error, result) => {
          if (error) {
            console.log("Cloudinary Upload Error:", error);
            reject(new Error("Image upload failed"));
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(req.file.buffer);
    });
  }

   const blog  = await Blog.create({
      title,
      content,
      image: imageURL,
      category,
      tags: parsedTags,
      isPublished: publish ?? true,
      author: req.user._id,
   });

   res.status(201).json({
     success: true,
     message: "Blog created successfully!",
     blog,
   });
});

/* ------------------ GET ALL BLOGS ------------------ */
export const getBlogs = expressAsyncHandler( async(req, res) => {
    const blogs = await Blog.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        blogs,
    });
});

/* ------------------ GET A SINGLE BLOG ------------------ */
export const getBlog = expressAsyncHandler( async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    .populate("author", "name email")
    .populate("comments.user", "name email");

    if(!blog) {
      res.status(404);
      throw new Error("Blog not found!");
    }

    res.status(200).json({
        success: true,
        blog,
    });
});

export const updateBlog = expressAsyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { title, content, category, tags, publish, imageUrl } = req.body;

  blog.title = title ?? blog.title;
  blog.content = content ?? blog.content;
  blog.category = category ?? blog.category;
  blog.tags = tags ?? blog.tags;
  blog.isPublished = publish ?? blog.isPublished;
  if (imageUrl) blog.image = imageUrl;  // <-- update image here

  const updatedBlog = await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully!",
    blog: updatedBlog,
  });
});


/* ------------------ DELETE A BLOG ------------------ */
export const deleteBlog = expressAsyncHandler( async(req, res) => {
    const blog = await Blog.findById(req.params.id);

    if(!blog){
        res.status(404);
        throw new Error("Blog not found!");
    }

    if(blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this blog");
    }

    await blog.deleteOne();

    res.status(200).json({
        success: true,
        message: "Blog deleted successfully!",
    });
});

/* ------------------ LIKE / UNLIKE BLOG ------------------ */
export const toggleLike = expressAsyncHandler( async(req, res) => {
   const blog = await Blog.findById(req.params.id);

   if(!blog){
      res.status(404);
      throw new Error("Blog not found!");
   }

   const userId = req.user._id.toString();
   //unlike
   if(blog.likes.includes(userId)) {
     blog.likes = blog.likes.filter((id) => id.toString() !== userId);
     await blog.save();

     return res.json({
        success: true,
        message: "Blog unliked!",
        likes: blog.likes.map(id => id.toString()),    
        likesCount: blog.likes.length,
     });
   }
   
   //like
   blog.likes.push(userId);
   await blog.save();

   return res.json({
    success: true,
    message: "Blog liked!",
    likes: blog.likes,      
    likesCount: blog.likes.length,
   });
});

/* ------------------ GET ALL COMMENTS OF A BLOG ------------------ */
export const getComments = expressAsyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate("comments.user", "name email");

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found!");
    }

    res.status(200).json({
        success: true,
        comments: blog.comments,
        count: blog.comments.length,
    });
});

/* ------------------ ADD COMMENT ------------------ */
export const addComment = expressAsyncHandler( async(req, res) => {
        console.log("BLOG ID:", req.params.id);  // <-- ADD HERE
    console.log("COMMENT BODY:", req.body); 
    const { text } = req.body;

    if(!text){
        res.status(400);
        throw new Error("Comment text is required");
    }

    const blog = await Blog.findById(req.params.id);
    if(!blog){
        res.status(404);
        throw new Error("Blog not found!");
    }

    const comment = {
        text,
        user: req.user._id,
        createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({
        success: true,
        message: "Comment added!",
        comments: blog.comments,
    });
});

/* ------------------ UPDATE COMMENT ------------------ */
export const updateComment = expressAsyncHandler(async (req, res) => {
    const { id, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error("Updated comment text is required");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found!");
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found!");
    }

    // Only comment creator can edit comment
    if (comment.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this comment");
    }

    comment.text = text; // update text
    await blog.save();

    res.status(200).json({
        success: true,
        message: "Comment updated successfully!",
        comment,
    });
});

/* ------------------ DELETE COMMENT ------------------ */
export const deleteComment = expressAsyncHandler( async(req, res) => {
    const { id, commentId } = req.params;

    const blog = await Blog.findById(id);

    if(!blog){
        res.status(404);
        throw new Error("Blog not found!");
    }

    const comment = blog.comments.id(commentId);

    if(!comment){
        res.status(404);
        throw new Error("Comment not found!");
    }

    if(comment.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this comment");
    }

    comment.deleteOne();
    await blog.save();

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully!",
    });
});



