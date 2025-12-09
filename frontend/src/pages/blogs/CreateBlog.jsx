import Navbar from "../../components/Navbar";
import { categories } from "../../data/categories";
import { ChevronDown, Hash, Image, Sparkles, X } from "lucide-react";
import "../../index.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createBlog } from "../../api/blogApi";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {

  const { token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    category: "",
    tags: [],
    publish: false,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: file }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!formData.title) {
      toast.error("Enter a title for this blog.", { id: "title-error" });
      setLoading(false);
      return;
    }
    if (!formData.content) {
      toast.error("Write a blog in the content.", { id: "content-error" });
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    form.append("category", formData.category);
    form.append("image", formData.image);

    const tagArray = formData.tags
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    form.append("tags", JSON.stringify(tagArray));
    form.append("publish", formData.publish ? "true" : "false");

    try {
      await createBlog(form, token);
      toast.success("Blog created successfully!", { id: "blog-success" });

      setFormData({
        title: "",
        content: "",
        image: null,
        category: "",
        tags: [],
        publish: false,
      });
      setPreview(null);
      document.getElementById("imageUpload").value = "";

      setTimeout(() => {
        navigate("/blogs");
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", { id: "blog-fail" });
    } finally {
      setLoading(false);
    }
  };

  // TAG LOGIC
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = currentTag.trim();

      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
        setCurrentTag("");
      }
    } else if (e.key === "Backspace" && !currentTag && formData.tags.length > 0) {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.slice(0, -1),
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-pink-950 via-sky-800 to-slate-900 text-white">
      <Navbar />
     
     <div className="flex flex-col justify-center items-center mt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-pink-300 text-sm font-medium mb-6 backdrop-blur-md">
          <Sparkles size={20} />
            <span>Unleash Your Creativity</span>
        </div>
       
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">
        Create a{" "} <br></br>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400">
        Beautiful Blog
        </span>
      </h1>
      </div>

      <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="max-w-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-12 md:p-10 shadow-2xl space-y-8">
          {/* Top Section: Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Title Input */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-base md:text-lg font-semibold">
                Title <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className="w-full p-4 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none text-base md:text-lg md:text-xl font-medium placeholder-gray-500"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-2">
              <label className="text-base md:text-lg font-semibold">
                Category 
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-4 pl-4 pr-10 rounded-xl bg-indigo-500/10 border border-white/10 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none appearance-none text-base md:text-lg text-gray-200 cursor-pointer hover:bg-indigo-500/20"
                >
                  <option value="" disabled className="bg-slate-800 text-gray-400">
                    Select Topic
                  </option>
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-800">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>


        {/* CONTENT */}
        <div className="flex flex-col gap-2">
          <label className="text-base md:text-lg font-semibold">
            Content <span className="text-red-400">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Start writing your blog content here..."
            className="p-3 md:p-4 rounded-xl bg-white/5 text-white placeholder-gray-400 
              border border-white/10 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 outline-none h-60 resize-none no-scrollbar text-base md:text-lg"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-3">
          <label className="text-base md:text-lg font-semibold">Upload Image</label>
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center h-60 w-full border-2 border-dashed border-white/20 hover:border-pink-500/50 
              rounded-xl cursor-pointer transition-all bg-white/5 relative"
          >
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="hidden"
            />

            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <>
                <Image size={48} className="text-gray-400 mb-2" />
                <span className="text-gray-300 text-sm">Click to upload image</span>
              </>
            )}
          </label>
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-3">
          <label className="text-base md:text-lg font-semibold">
            Tags
          </label>

          <div className="min-h-[56px] p-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-pink-500/50 focus-within:ring-4 focus-within:ring-pink-500/10 transition-all flex flex-wrap gap-2 items-center">
            <Hash size={18} className="text-gray-500 ml-2" />

            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/60 text-indigo-200 text-sm animate-fadeIn"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}

            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={
                formData.tags.length === 0
                  ? "Type a tag and hit Enter..."
                  : "Add more..."
              }
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 flex-1 min-w-[120px] p-1"
            />
          </div>

          <p className="text-xs text-gray-500 ml-1">Press Enter or Comma to add tags</p>
        </div>

        {/* PUBLISH */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="publish"
            checked={formData.publish}
            onChange={handleChange}
            className="w-4 h-5 md:w-5 md:h-5  bg-pink-500/20"
          />
          <span className="text-sm md:text-base font-medium">
            Publish Immediately
          </span>
        </label>

        {/* SUBMIT */}
        <button
          className={`w-full mt-4 py-4 min-h-[56px] bg-gradient-to-r from-pink-900 to-sky-500 hover:scale-[1.01] 
          rounded-xl font-bold text-base md:text-lg transition-all shadow-xl flex justify-center items-center`}
        >
         {loading ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
          ) : (
         <span>Create Blog</span>
         )}
        </button>
      </form>
      </div>
    </div>
  );
};

export default CreateBlog;