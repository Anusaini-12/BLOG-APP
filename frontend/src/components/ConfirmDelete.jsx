export const ConfirmDelete = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      
      <div className="bg-gradient-to-bl from-pink-900/70 to-indigo-900/70 text-white p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-white/10 animate-scaleIn">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <i className="fa-solid fa-triangle-exclamation text-red-400 text-4xl"></i>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center">Are you sure?</h2>
        
        {/* MESSAGE */}
        <p className="text-gray-300 text-sm text-center mt-2">
         Do you want to delete this blog?
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 font-bold py-2.5 bg-slate-500 hover:bg-slate-600 transition rounded-full text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 font-bold py-2.5 bg-red-400 hover:bg-red-500 transition rounded-full text-white shadow-md shadow-red-900/30 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
