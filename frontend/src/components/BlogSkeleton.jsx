import React from 'react';

const BlogSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 w-full max-w-4xl mx-auto animate-pulse flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10"></div>
            <div className="h-4 w-32 bg-white/10 rounded"></div>
        </div>
        <div className="h-8 w-3/4 bg-white/10 rounded"></div>
        <div className="h-4 w-full bg-white/10 rounded"></div>
        <div className="h-4 w-2/3 bg-white/10 rounded"></div>
      </div>
      <div className="w-full md:w-48 h-32 bg-white/10 rounded-xl"></div>
    </div>
  );
};

export default BlogSkeleton;