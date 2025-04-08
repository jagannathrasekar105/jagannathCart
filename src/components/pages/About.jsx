import React from "react";

function About() {
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 px-6 py-16 flex items-center justify-center">
        <div className="max-w-4xl w-full text-center space-y-6 transition-all duration-300">
          <h1 className="text-5xl font-extrabold text-purple-700 dark:text-yellow-300 drop-shadow">
            About JagannathMart
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to{" "}
            <span className="text-purple-600 dark:text-yellow-400 font-semibold">
              JagannathMart
            </span>
            , your one-stop online destination for stylish fashion, top-notch
            gadgets, and everything in between! 💫
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-400">
            We are passionate about delivering high-quality products with fast
            shipping and 100% customer satisfaction. Our mission is to make
            online shopping easy, secure, and joyful for everyone. 🌟
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-400">
            Whether you're shopping for yourself or gifting a loved one, we've
            got something for every occasion. 🎁
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
