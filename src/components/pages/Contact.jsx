import React from "react";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 dark:from-gray-800 dark:to-gray-900 px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-3xl text-center space-y-10 transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-pink-700 dark:text-yellow-300 drop-shadow">
          Contact Us
        </h1>

        <form className="space-y-6 text-left">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:ring-2 focus:ring-pink-400 dark:focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:ring-2 focus:ring-pink-400 dark:focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              rows="4"
              placeholder="Type your message here..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:ring-2 focus:ring-pink-400 dark:focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 dark:bg-yellow-400 text-white dark:text-gray-900 py-2 rounded-md hover:bg-pink-700 dark:hover:bg-yellow-500 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
