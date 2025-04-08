import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to JagannathMart
      </h1>
      <p className="text-lg mb-4 text-center">
        Your one-stop shop for amazing products!
      </p>

      <div className="flex gap-6">
        <Link
          to="/register"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition dark:bg-yellow-300 dark:text-black dark:hover:bg-yellow-400"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition dark:bg-gray-200 dark:text-blue-700 dark:hover:bg-gray-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
