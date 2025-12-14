import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers(token); // already an array
      setUsers(res || []); // fallback to empty array
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
      setUsers([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id, token);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>

      <table className="w-full border">
        <thead>
          <tr className="border bg-gray-200">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id} className="border">
                <td className="p-2">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
