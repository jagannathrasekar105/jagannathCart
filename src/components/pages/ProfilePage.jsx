import React from "react";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <section className="max-w-xl mx-auto p-6 rounded-xl mt-10 shadow-lg bg-pink-400 dark:bg-gray-900 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-white dark:text-yellow-400">
          Profile Page
        </h2>
        <div className="text-center text-gray-800 dark:text-gray-200">
          <p>User is not logged in.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto p-6 rounded-xl mt-10 shadow-lg bg-pink-400 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-center text-white dark:text-yellow-400">
        Profile Page
      </h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {user.profilePic ? (
            <img
              src={`data:image/jpeg;base64,${user.profilePic}`}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-5xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          className="bg-pink-500 dark:bg-yellow-400 hover:bg-pink-600 dark:hover:bg-yellow-500 text-white dark:text-black px-4 py-2 rounded transition"
          onClick={() => alert("Upload functionality not working yet")}
        >
          Upload Picture
        </button>

        {/* User Info */}
        <div className="text-center space-y-1 text-gray-800 dark:text-gray-200">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Account Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit Button */}
        <button
          className="mt-4 bg-pink-500 dark:bg-yellow-400 hover:bg-pink-600 dark:hover:bg-yellow-500 text-white dark:text-black px-4 py-2 rounded transition"
          onClick={() => alert("Edit functionality not working yet")}
        >
          Edit Profile
        </button>
      </div>
    </section>
  );
};

export default ProfilePage;
