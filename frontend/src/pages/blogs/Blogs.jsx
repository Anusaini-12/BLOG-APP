import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, MessageSquareMore, Camera, Sparkles, Bookmark, Share2, ThumbsUp, Clock, EyeIcon } from 'lucide-react';
import { countBlogView, getBlogs, getBlogViewers, toggleLike } from "../../api/blogApi";
import BlogSkeleton from "../../components/BlogSkeleton";
import { categories, categoryColors } from "../../data/categories";
import Navbar from "../../components/Navbar";
import "../../index.css";
import { useAuth } from "../../context/AuthContext";
import { toggleSaveBlog } from "../../api/profileApi";
import { useToast } from "../../context/ToastContext";


const Blogs = () => {

  const { user, token, updateUser} = useAuth();
  const toast = useToast();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [showFilter, setShowFilter] = useState(false);
  const [isFilterClosing, setIsFilterClosing] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
    try {
      const data = await getBlogs();

      const initialize = data?.blogs?.map(blog => ({
        ...blog,
        likeCount: blog.likes?.length || 0,
        isLiked: blog.likes?.includes(user?._id) || false,
        isSaved: user?.savedBlogs?.includes(blog._id) || false,
      }));

      setBlogs(initialize || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
    };
    fetchBlogs();
  }, [user]);

  //toggle category
  const toggleCategory = (category) => {
    if (category === "All") {
    setSelectedCategories(["All"]);
    return;
  }

  let updated = selectedCategories.filter(c => c !== "All");

    if (updated.includes(category)) {
      updated = updated.filter(c => c !== category);
      if (updated.length === 0) updated = ["All"];
    } else {
      updated.push(category);
    }

    setSelectedCategories(updated);
  };

  //filter blogs
  const filteredBlogs = selectedCategories.includes("All")
    ? blogs
    : blogs.filter(blog => selectedCategories.includes(blog.category));

  const closeFilter = () => {
    setIsFilterClosing(true);
    setTimeout(() => {
      setShowFilter(false);
      setIsFilterClosing(false);
    }, 300);
  };
  
  //handle like
  const handleLike = async (id, e) => {
    e.preventDefault(); 

    if (!user) {
     toast.error("Login to like posts", {id: "needs-login"});
    return;
  }
  
  setBlogs((prev) =>
    prev.map((blog) =>
      blog._id === id
        ? {
            ...blog,
            isLiked: !blog.isLiked,
            likeCount: blog.isLiked
              ? Math.max(blog.likeCount - 1, 0)
              : blog.likeCount + 1,
          }
        : blog
    )
  );
  try {
    const res = await toggleLike(id, token);

    setBlogs((prev) =>
      prev.map((blog) =>
        blog._id === id
          ? {
              ...blog,
              likeCount: res.likes?.length || 0,
              isLiked: res.likes?.includes(user._id) || false,
            }
          : blog
      )
    );
  } catch (error) {
    toast.error("Something went wrong", {id: "like-fail"});
    setBlogs((prev) =>
      prev.map((blog) =>
        blog._id === id
          ? {
              ...blog,
              isLiked: !blog.isLiked,
              likeCount: blog.isLiked
                ? blog.likeCount - 1
                : blog.likeCount + 1,
            }
          : blog
      )
    );
  }
  };

  //handle saved blog
  const handleSave = async (id, e) => {
    e.preventDefault();

    if (!user) {
    return toast.error("Please login to save blogs.");
  }
  setBlogs(prev =>
    prev.map(blog =>
      blog._id === id ? { ...blog, isSaved: !blog.isSaved } : blog
    )
  );

  try {
    const res = await toggleSaveBlog(id, token);

    const savedList =
      res?.savedBlogs ||
      res?.user?.savedBlogs ||
      res?.data?.savedBlogs ||
      null;

    const savedFlag =
      res?.saved === true ||
      res?.data?.saved === true;

    updateUser({
      ...user,
      savedBlogs:
        savedList ??
        (savedFlag
          ? [...user.savedBlogs, id]
          : user.savedBlogs.filter(b => b !== id))
    });

    setBlogs(prev =>
      prev.map(blog =>
        blog._id === id
          ? {
              ...blog,
              isSaved:
                savedList
                  ? savedList.includes(id)
                  : savedFlag ?? blog.isSaved,
            }
          : blog
      )
    );
    toast.success(
      res?.message || (savedFlag ? "Saved!" : "Removed from saved")
    );
  } catch (err) {
    setBlogs(prev =>
      prev.map(b =>
        b._id === id ? { ...b, isSaved: !b.isSaved } : b
      )
    );
    toast.error(err.response?.data?.message || "Could not save blog");
  }
  };
  
  //handle share icon
  const handleShare = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {id: "copied"});
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-bl from-pink-950 via-sky-800 to-slate-900 bg-fixed text-white">
      <Navbar className="sticky relative z-20" />

      {blogs.length > 0 && (
      <>    
      <div className="flex flex-col justify-center items-center mt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-white/20 text-pink-300 text-xs font-medium mb-6 backdrop-blur-md">
          <Sparkles size={16} className="text-pink-400"/>
            <span>DIVE INTO FRESH BLOGS</span>
        </div>

       <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-10 text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
        Our Latest Blogs
        </span>
       </h1>
      </div>

      {/* Mobile Filter Button - show only if blogs exist */}
      <div className="md:hidden flex justify-end mb-2 px-6">
        <button
         onClick={() => setShowFilter(!showFilter)}
         className="inline-flex items-center gap-2 px-3 py-1 mt-8 cursor-pointer rounded-full bg-white/10 border border-white/20 text-pink-300 text-sm font-medium mb-6 backdrop-blur-md hover:bg-black/10 active:scale-95 transition"
        >
         <SlidersHorizontal size={14} />
         <span className="text-sm font-semibold">Filters</span>
        </button>
      </div>
      </>
      )}

      {showFilter && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end z-50"
          onClick={closeFilter}
        >
          <div
            className={`w-full bg-black/30 backdrop-blur-lg rounded-t-3xl p-6 shadow-xl ${
              isFilterClosing ? "animate-slideDown" : "animate-slideUp"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div
              className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"
              onClick={closeFilter}
            ></div>

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-pink-600">
                Select Categories
              </h3>
              <button
                onClick={closeFilter}
                className="text-pink-600 hover:text-pink-500 text-xl"
              >
                <i className="fa-solid fa-xmark cursor-pointer transition"></i>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-pink-900 text-white border-pink-900"
                      : "bg-gray-400 backdrop-blur-sm text-black border-gray-300 font-semibold"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Close */}
            <div className="flex items-center justify-between gap-3 pt-6 border-t">
              <button
                onClick={() => setSelectedCategories(["All"])}
                className="px-3 py-2 text-gray-700 font-medium bg-gray-200 rounded-xl flex-1"
              >
                Clear All
              </button>

              <button
                onClick={closeFilter}
                className="px-3 py-2 bg-pink-900 text-white rounded-xl font-medium flex-1"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Categories */}
      {blogs.length > 0 && (
      <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8 mt-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm border border-slate-500 cursor-pointer transition-all duration-300 ${
              selectedCategories.includes(cat)
                ? "bg-white text-slate-900 shadow-md"
                : "bg-black/30 text-slate-300 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      )}

     {/* Blog list */}{/* Main Content */}  
     <div className="container mx-auto px-4 md:px-6 pb-24 max-w-5xl">
     {loading && (
      <div className="space-y-6 mt-40">
        {[...Array(3)].map((_, i) => <BlogSkeleton key={i} />)}
      </div>
     )}

     {!loading && filteredBlogs.length === 0 && (
     <div className="flex flex-col justify-center items-center py-32 text-center animate-fadeIn">
      <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-white/5 flex justify-center items-center mb-6">
        <Camera size={32} className="text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-white">No stories found</h3>
      <button 
        onClick={() => setSelectedCategories(["All"])}
        className="mt-6 text-pink-400 font-medium hover:text-pink-300 transition-colors"
      >
        Clear filters
      </button>
     </div>
     )}

     <div className="grid grid-cols-1 gap-8">
     {!loading && filteredBlogs.map((blog) => (
      <div
        key={blog._id}
        className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-900/10 flex flex-col md:flex-row"
      >
        {/* Image Section */}
        {blog.image && (
          <div className="w-full md:w-2/5 h-60 md:h-72 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 md:hidden" />
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Category Badge - Mobile */}
            <div className="absolute top-4 left-4 z-20 md:hidden">
              {blog.category ? (
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${categoryColors[blog.category]}`}>
                {blog.category}
              </span>
              ): null}
            </div>
        </div>
      )}

      {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col relative">

          {/* Meta Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${blog.author._id}`} className="relative group/avatar">
                <img 
                  src={blog.author.avatar || `https://ui-avatars.com/api/?name=${blog.author.name}&background=random`} 
                  alt={blog.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover/avatar:border-pink-500 transition-colors cursor-pointer"
                />
              </Link>
              
              <div className="flex flex-col">
                <Link to={`/profile/${blog.author._id}`} className="text-sm font-semibold text-slate-200 hover:text-pink-400 transition-colors">
                  {blog.author.name}
                </Link>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  {/* VIEW COUNT TOP-RIGHT */}
                  <p>
                    <i className="fa-solid fa-eye text-[10px]"></i> {blog.views}
                  </p>
                </div>
              </div>
            </div>
           
            {blog.category ? (
            <span className={`hidden md:block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[blog.category] || categoryColors.Default}`}>
              {blog.category}
            </span>
            ) : null}
          </div>

          {/* Body */}
          <Link to={`/blogs/${blog._id}`} className="group/title block mb-4">
            <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover/title:text-pink-400 transition-colors leading-tight">
              {blog.title}
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3">
              {blog.content}
            </p>          
          </Link>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => handleLike(blog._id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  blog.isLiked 
                    ? "bg-pink-500/10 text-pink-500" 
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-pink-500"
                }`}
              >
                <ThumbsUp size={16} className={blog.isLiked ? "fill-current" : ""} />
                <span>{blog.likeCount}</span>
              </button>

              <Link
                to={`/blogs/${blog._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-blue-500 transition-all"
              >
                <MessageSquareMore size={16} />
                <span>{blog.comments?.length || 0}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                title="Share"
              >
                <Share2 size={18} />
              </button>

              <button 
                onClick={(e) => handleSave(blog._id, e)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  blog.isSaved 
                    ? "text-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400/20" 
                    : "text-slate-500 hover:text-white hover:bg-white/10"
                }`}
                title={blog.isSaved ? "Saved" : "Save for later"}
              >
                 <Bookmark size={18} variant={blog.isSaved ? "Bold" : "Linear"} />
              </button>
            </div>
          </div>
         </div>
        </div>
        ))}
      </div>
    </div>
   </div>
  );
};

export default Blogs;
