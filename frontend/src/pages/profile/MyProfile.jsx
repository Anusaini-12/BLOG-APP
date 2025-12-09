import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getBlogs } from "../../api/blogApi.js";
import { updateProfile } from "../../api/profileApi.js";
import Navbar from "../../components/Navbar.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const MyProfile = () => {
  const { user, token, updateUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [uploading, setUploading] = useState(false);

  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Load user data
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || "");
    }
  }, [user]);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await getBlogs(); 
      const blogs = res.blogs || []; 
      setUserPosts(blogs.filter(b => String(b.author._id) === String(user._id)));
      setSavedPosts(blogs.filter(b => user.savedBlogs?.includes(b._id)));
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  if (user) fetchPosts();
}, [user]);


const handleSaveProfile = async () => {
  try {
    const res = await updateProfile(
      { name: editName, bio: editBio },
      token
    );

    updateUser(res.user);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  } catch (err) {
    toast.error("Update failed");
  }
};

const handleProfilePicChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    toast.error("File is too large!");
    return; 
  }

  setUploading(true);
  try {
    const res = await updateProfile({ profilePic: file }, token);
    updateUser(res.user);
    toast.success("Profile picture updated!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile picture");
  } finally {
    setUploading(false);
  }
};

const handleDeleteProfilePic = async () => {
  try {
    const res = await updateProfile(
      { deletePic: "true" },
      token
    );

    updateUser(res.user);
    toast.success("Profile picture removed");
  } catch (err) {
    toast.error("Delete failed");
  }
};

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[#0f172a] pb-20 relative z-50">
      <div className="bg-gradient-to-r from-pink-900/80 via-purple-900/80 to-blue-900/80">
      <Navbar className="sticky top-0 z-30" />
      </div>
      {/* Header / Cover */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-purple-900/80 to-blue-900/80" />
        <img
          src="https://picsum.photos/seed/cover/1600/400"
          alt="Cover"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500">

              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${editName}&background=random`}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-[#0f172a]"
              />

                  {uploading && (
      <div className="absolute inset-0 flex items-center justify-center rounded-full z-10 pointer-events-none">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}
 

              <input
               id="profilePicInput"
               type="file"
               accept="image/*" 
               className="hidden"
               onChange={handleProfilePicChange}
              />
                {/* Action Icons */}
              
              {isEditing && (
              <div className="flex gap-5 mt-2 ml-6 md:ml-11">
                {/* Edit / upload icon */}
                <button
                 onClick={() => document.getElementById("profilePicInput").click()}
                 className="text-white hover:text-slate-300 rounded-full"
                 title="Change Profile Picture"
                >
                 <i className="fa-solid fa-pen text-xs" />
                 <p className="text-xs">Edit</p>
                </button>

                {/* Delete icon */}
                {user.profilePic && (
                <button
                 onClick={handleDeleteProfilePic}
                 className="text-white  hover:text-slate-300  rounded-full"
                 title="Delete Profile Picture"
                >
                <i className="fa-solid fa-trash text-xs" />
                <p className="text-xs">Delete</p>
                </button>
                )}
              </div>
              )}
          </div>
         </div>

          {/* User Info */}
          <div className="w-full text-center md:text-left">
            {!isEditing ? (
              <>
                <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
                <p className="text-pink-400 font-medium mb-2">{user.email}</p>
                <p className="text-gray-300 text-xs md:text-sm font-thin break-words whitespace-normal w-full md:max-w-[300px]">{user.bio || "No bio yet."}</p>
              </>
            ) : (
              <div className="bg-gradient-to-bl to-pink-900/70 from-indigo-900/70 p-5 mt-10 shadow-xl rounded-lg flex flex-col gap-2 w-full md:max-w-[400px]">
                <input
                  className="w-full bg-white/10 border border-white/10 rounded-md px-3 py-2 text-white mb-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <textarea
                  maxLength={100}
                  className="w-full bg-white/10 border border-white/10 rounded-md px-3 py-2 resize-none no-scrollbar overflow-auto text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-4 mt-4 ml-4">
                 <button
                  onClick={handleSaveProfile}
                  className="text-pink-400 hover:text-pink-600 font-bold cursor-pointer"
                 >
                  Save
                 </button>

                 <button
                  onClick={() => {
                  setIsEditing(false);
                  setEditName(user.name);
                  setEditBio(user.bio || "");
                }}
                  className="text-slate-300 hover:text-slate-400 font-medium cursor-pointer"
                 >
                 Cancel
                </button>
              </div>
            </div>
            )}

           {/* Edit Button */}
           {!isEditing && (
           <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-3 py-2 border-1 md:border-2 border-pink-400 text-pink-400 text-xs md:text-sm 
                 md:font-bold rounded-md hover:bg-pink-500 hover:text-white"
           >
            Edit Profile
           </button>
          )}
         </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-8 border-b border-white/10 pb-8">
          <div>
            <span className="block text-xl font-bold text-white">{user.followers?.length || 0}</span>
            <span className="text-sm text-gray-500">Followers</span>
          </div>
          <div>
            <span className="block text-xl font-bold text-white">{user.following?.length || 0}</span>
            <span className="text-sm text-gray-500">Following</span>
          </div>
          <div>
            <span className="block text-xl font-bold text-white">{userPosts.length}</span>
            <span className="text-sm text-gray-500">Posts</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-8 border-b border-white/10 mb-8">
            <button
              className={`pb-4 px-2 font-medium transition ${activeTab === "posts" ? "text-pink-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("posts")}
            >
              My Posts
            </button>
            <button
              className={`pb-4 px-2 font-medium transition ${activeTab === "saved" ? "text-pink-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingPosts ? (
              <p className="text-gray-400 col-span-full">Loading posts...</p>
            ) : activeTab === "posts" ? (
              userPosts.map((post) => (
                <div key={post._id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden p-2">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-2" />
                  <h3 className="text-white font-bold">{post.title}</h3>
                  <p className="text-gray-400 text-sm">{post.content}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : savedPosts.length ? (
              savedPosts.map((post) => (
                <div key={post._id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden p-2">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-2" />
                  <h3 className="text-white font-bold">{post.title}</h3>
                  <p className="text-gray-400 text-sm">{post.content}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div> 
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">No saved posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;
