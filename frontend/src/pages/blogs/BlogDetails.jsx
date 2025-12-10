import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getBlog,
  toggleLike,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  deleteBlog,
} from "../../api/blogApi";
import { useAuth } from "../../context/AuthContext";
import { ConfirmDelete } from "../../components/ConfirmDelete";
import { useToast } from "../../context/ToastContext";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const toast = useToast();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id, user]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBlog(), fetchComments()]);
    setLoading(false);
  };

  const fetchBlog = async () => {
    try {
      const res = await getBlog(id);
      const blogData = res?.blog ?? res;
      const likesArr = blogData?.likes ?? [];

      setBlog({
        ...blogData,
        likeCount: likesArr.length,
        isLiked: user ? likesArr.some((u) => String(u) === String(user._id)) : false,
      });
    } catch (err) {
      console.error("fetchBlog error:", err);
      toast.error("Failed to load blog", { id: "blog-fail" });
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(id);
      const commentsData = res?.comments ?? [];
      setComments(commentsData);
    } catch (err) {
      console.error("fetchComments error:", err);
      toast.error("Failed to load comments", { id: "comment-fail" });
    }
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const past = new Date(timestamp);
    const diff = (now - past) / 1000;

    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return "Yesterday";
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;

    return `${Math.floor(diff / 31536000)} years ago`;
  };

  /* ------------------ DELETE BLOG ------------------ */
  const handleDeleteBlog = async () => {
    if (!user) {
      toast.error("Login first", { id: "login" });
      return;
    }

    try {
      await deleteBlog(blog?._id || id, token);
      setOpenConfirm(false);
      toast.success("Blog deleted!", { id: "blog-delete" });
      navigate("/blogs");
    } catch (err) {
      console.error("deleteBlog error:", err);
      toast.error("Failed to delete blog", { id: "blog-delete-fail" });
    }
  };

  /* ------------------ LIKE BLOG ------------------ */
  const handleLike = async () => {
    if (!user) {
      toast.error("Login to like blogs", { id: "login" });
      return;
    }

    if (!blog) return;

    // Optimistic update
    const currentlyLiked = blog.isLiked;
    setBlog((prev) => ({
      ...prev,
      isLiked: !currentlyLiked,
      likeCount: currentlyLiked ? Math.max(0, prev.likeCount - 1) : (prev.likeCount || 0) + 1,
    }));

    setIsLiking(true);
    try {
      const res = await toggleLike(id, token);
      // res.likes is authoritative
      const likesArr = res?.likes ?? [];
      setBlog((prev) => ({
        ...prev,
        likeCount: likesArr.length,
        isLiked: likesArr.includes(user._id),
      }));
    } catch (err) {
      // revert on error
      setBlog((prev) => ({
        ...prev,
        isLiked: currentlyLiked,
        likeCount: currentlyLiked ? (prev.likeCount + 1) : Math.max(0, prev.likeCount - 1),
      }));
      console.error("toggleLike error:", err);
      toast.error("Error while liking", { id: "like-error" });
    } finally {
      setIsLiking(false);
    }
  };

  /* ------------------ ADD COMMENT ------------------ */
  const handleAddComment = async () => {
    if (!user) return toast.error("Login to comment", { id: "login" });
    if (!newComment.trim()) return toast.error("Comment cannot be empty", { id: "comment-err" });

    try {
      await addComment(id, { text: newComment }, token);
      toast.success("Comment added!", { id: "comment-success" });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("addComment error:", err);
      toast.error("Failed to add comment", { id: "add-comment-fail" });
    }
  };

  /* ------------------ UPDATE COMMENT ------------------ */
  const handleUpdateComment = async () => {
    if (!editingText.trim()) return toast.error("Cannot be empty", { id: "comment-err" });
    if (!editingId) return;

    try {
      await updateComment(id, editingId, { text: editingText }, token);
      toast.success("Comment updated!", { id: "comment-success" });
      setEditingId(null);
      setEditingText("");
      fetchComments();
    } catch (err) {
      console.error("updateComment error:", err);
      toast.error("Failed to update comment", { id: "comment-fail" });
    }
  };

  /* ------------------ DELETE COMMENT ------------------ */
  const handleDeleteComment = async (commentId) => {
    if (!user) return toast.error("Login first", { id: "login" });

    try {
      await deleteComment(id, commentId, token);
      toast.success("Comment deleted", { id: "delete-success" });
      fetchComments();
    } catch (err) {
      console.error("deleteComment error:", err);
      toast.error("Failed to delete comment", { id: "delete-fail" });
    }
  };

  /* ------------------ LOADING ------------------ */
  if (loading || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-pink-950 via-sky-800 to-slate-900 bg-fixed py-4 px-1 md:p-6 text-white">
      {/* BACK */}
      <div className="relative z-10 max-w-3xl mx-auto px-2 py-8 md:px-4 md:py-12">
      <div className="flex items-center justify-between mb-3 md:mb-6">
        
        <Link to="/blogs" className="group flex items-center gap-2 hover:text-slate-400 text-white transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-pink-700 to-sky-800 flex items-center justify-center transition-all shadow-lg">
            <i className="fa-solid fa-arrow-left text-sm" />
          </div>
          <span className="font-medium hidden sm:block">Back to Blogs</span>
        </Link>
          
        {/* EDIT & DELETE BUTTONS */}
        {user && String(blog.author?._id) === String(user._id) && (
          <div className="flex justify-end gap-3 md:gap-4 px-4">
            <Link
              to={`/blogs/edit/${blog._id}`}
              className="text-sky-500 font-bold md:hover:bg-sky-400 hover:text-white md:py-1.5 md:px-2 rounded-sm md:border border-sky-600 transition text-xs md:text-sm flex items-center gap-1"
              title="Edit"
            >
              <i className="fa-solid fa-pen text-sm md:text-xs"></i>
              <span className="hidden md:inline">
                Edit
              </span>
              
            </Link>

            <button
              onClick={() => setOpenConfirm(true)}
              className="text-red-400 font-bold md:hover:bg-red-400 hover:text-white md:py-1.5 md:px-2 rounded-sm md:border border-red-500 transition text-xs md:text-sm flex items-center gap-1"
              title="Delete"
            >
              <span className="hidden md:inline">
                Delete
              </span>
              <i className="fa-solid fa-trash-can text-sm md:text-xs"></i>              
            </button>

            <ConfirmDelete open={openConfirm} onClose={() => setOpenConfirm(false)} onConfirm={handleDeleteBlog} />
          </div>
        )}
      </div>

      <article className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

          {/* Hero Image */}
          {blog.image && (
            <div className="w-full h-64 md:h-96 relative group overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
            </div>
          )}

          <div className="px-4 py-10 md:px-14 md:py-12 -mt-20 relative">

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-pink-800/30 text-gray-300 border border-pink-900/60 rounded-full text-[10px] md:text-xs font-semibold uppercase">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-10 mb-6">
              {blog.title}
            </h1>

            {/* Author */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${blog.author.name}&background=random`}
                  alt={blog.author?.name}
                  className="w-12 h-12 rounded-full ring-3 ring-pink-600/20 object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{blog.author?.name}</p>
                  <p className="text-slate-300 text-sm">{timeAgo(blog.createdAt)}</p>
                </div>
              </div>

              {/* Like Button */}
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-full border transition-all ${
                  blog.isLiked 
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700"
                }`}
              >
                <i className={`${blog.isLiked ? "fa-solid" : "fa-regular"} fa-heart text-lg`}></i>
                <span>{blog.likeCount}</span>
              </button>
            </div>

            {/* Content */}
            <div className="max-w-full break-words text-slate-300 text-sm md:text-base">
              {blog.content.split("\n").map((para, i) => (
                <p key={i} className="mb-1">{para}</p>
              ))}
            </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

          {/* ------------------ COMMENTS SECTION ------------------ */}
          <div id="comments">
           <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-white">Discussion</h2>
            <span className="bg-pink-700/20 text-slate-300 px-2 py-0.5 rounded-lg text-xs md:text-sm font-semibold border border-white/10">
              {comments.length}
            </span>
          </div>

          {/* ADD COMMENT */}
          {user ? (
            <div className="flex gap-4 mb-6 group">
              <img src={user.profilePic || `https://ui-avatars.com/api/?name=${blog.author.name}&background=random`} alt="My Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-pink-500/20" />
              <div className="flex-1 relative">
                <textarea
                  className="w-full bg-pink-700/20 text-slate-200 rounded-2xl border border-white/10 p-4 pr-12 focus:ring-1 focus:ring-pink-500/50 outline-none resize-none min-h-[80px]"
                  placeholder="What are your thoughts?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment} disabled={!newComment.trim()} className="absolute right-3 bottom-3 p-2 rounded-xl text-white hover:bg-purple-500/10 disabled:opacity-50">
                  <i className="fa-solid fa-paper-plane text-xl" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-800/30 rounded-2xl border border-white/5 text-center mb-8">
              <p className="text-slate-400">Please <button className="text-purple-400 font-semibold hover:underline">login</button> to join the discussion.</p>
            </div>
          )}

          {/* Comment List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-slate-500 text-center italic py-8">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4 animate-fadeIn">
                  <img src={comment.user?.profilePic || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=random`} alt={comment.user?.name || "User"} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-1 ring-white/10 mt-1" />

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm md:text-base">{comment.user?.name || "Unknown"}</span>
                        <span className="text-xs text-slate-400">• {timeAgo(comment.createdAt)}</span>
                      </div>

                      {/* Edit/Delete Icons */}
                      {user && String(user._id) === String(comment.user?._id) && !editingId && (
                        <div className="flex md:gap-1">
                          <button onClick={() => { setEditingId(comment._id); setEditingText(comment.text); }} className="px-2 py-1 text-slate-200 hover:text-purple-400 rounded-full hover:bg-white/5">
                            <i className="fa-solid fa-pen text-xs" />
                          </button>

                          <button onClick={() => handleDeleteComment(comment._id)} className="px-2 py-1 text-slate-200 hover:text-red-400 rounded-full hover:bg-white/5">
                            <i className="fa-solid fa-trash text-xs" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    {editingId === comment._id ? (
                      <div className="mt-2 bg-pink-700/20 p-3 rounded-xl border border-white/10">
                        <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full bg-transparent text-slate-200 text-sm outline-none resize-none mb-2" rows={3} />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingId(null); setEditingText(""); }} className="text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5">Cancel</button>
                          <button onClick={handleUpdateComment} className="text-xs px-3 py-1.5 rounded-lg bg-pink-600/60 text-white hover:bg-pink-500 shadow-lg">Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{comment.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;
