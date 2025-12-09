const Loader = ({ loading, children }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`mt-6 w-full ${loading ? 'py-4' : 'py-2'}  px-6 border border-gray-300 text-sky-600 bg-white rounded-full font-semibold shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
    >
      {loading && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
      )}

      <span className={`${loading ? "hidden" : ""}`}>
        {children}
      </span>
    </button>
  );
};

export default Loader;
