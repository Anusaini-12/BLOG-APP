import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserById, followUser, unfollowUser } from "../../api/profileApi.js";
import { getBlogs } from "../../api/blogApi.js";
import Navbar from "../../components/Navbar";
import { useToast } from "../../context/ToastContext.jsx";

const UserProfile = () => {
  const { id } = useParams();
  const { user, token, updateUser } = useAuth();
  const toast = useToast();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

useEffect(() => {
  const loadData = async () => {
    if (!id) return;
    setLoadingProfile(true);

    try {
      const userRes = await getUserById(id);

      if (!userRes.success || !userRes.user) {
        setProfileUser(null);
        setLoadingProfile(false);
        return;
      }

      setProfileUser(userRes.user);
      const blogRes = await getBlogs();
      const blogs = blogRes.blogs || [];

      const filteredPosts = blogs.filter(
        (b) => String(b.author._id) === String(userRes.user._id)
      );
      setUserPosts(filteredPosts);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setLoadingProfile(false);
  };
  loadData();
}, [id]);


  const handleFollow = async () => {

  if (!user) {
    toast.error("Login first to follow users", { id: "login" });
    return;
  }
    if (loading || !profileUser) return;
    setLoading(true);

    try {
      const isFollowing = user?.following?.includes(profileUser._id);

      const res = isFollowing
        ? await unfollowUser(profileUser._id, token)
        : await followUser(profileUser._id, token);

      updateUser(res.currentUser);

      setProfileUser((prev) => {
        if (!prev) return null;

        const currFollowers = prev.followers || [];

        return isFollowing
          ? { ...prev, followers: currFollowers.filter((fid) => fid !== user?._id) }
          : { ...prev, followers: [...currFollowers, user?._id] };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p>User not found.</p>
      </div>
    );
  }

  const isOwnProfile = user?._id === profileUser._id;
  const isFollowing = user?.following?.includes(profileUser._id);

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20">
      <div className="bg-gradient-to-r from-pink-900/80 via-purple-900/80 to-blue-900/80">
      <Navbar className="sticky top-0 z-30" />
      </div>

      {/* Cover */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-purple-900/80 to-blue-900/80 backdrop-blur-sm z-0" />
        <img
          src={`https://picsum.photos/seed/${profileUser._id}/1600/400`}
          alt="Cover"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-blue-500 to-teal-500 shadow-xl shadow-blue-500/20">
              <img
                src={
                  profileUser.profilePic ||
                  `https://ui-avatars.com/api/?name=${profileUser.name}&background=random`
                }
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-[#0f172a]"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full md:w-auto text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {profileUser.name}
            </h1>
            <p className="text-indigo-400 font-medium mb-2">{profileUser.email}</p>
            <p className="text-gray-300 max-w-2xl">{profileUser.bio || "No bio yet."}</p>
          </div>

          {/* Follow button */}
          <div className="flex flex-col sm:flex-row gap-3 min-w-[140px]">
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`px-6 py-2 font-bold rounded-lg transition-all shadow-lg ${
                  isFollowing
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/30"
                }`}
              >
                {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 md:gap-8 mt-8 border-b border-white/10 pb-8">
          <div>
            <span className="block text-lg md:text-xl font-bold text-white">
              {profileUser.followers?.length || 0}
            </span>
            <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wide font-semibold">
              Followers
            </span>
          </div>

          <div>
            <span className="block text-lg md:text-xl font-bold text-white">
              {profileUser.following?.length || 0}
            </span>
            <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wide font-semibold">
              Following
            </span>
          </div>

          <div>
            <span className="block text-lg md:text-xl font-bold text-white">
              {userPosts.length}
            </span>
            <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wide font-semibold">
              Posts
            </span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-6">All Blogs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="group bg-[#1e293b]/50 border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden p-3 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-10">
                This user hasn't posted anything yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
